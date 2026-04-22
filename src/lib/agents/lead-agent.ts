import { Resend } from 'resend';
import connectDB from '@/lib/db';
import Lead from '@/lib/models/Lead';
import { leadAutoReplyTemplate, leadAdminNotifTemplate, followUp3Template, followUp7Template } from '@/lib/email-templates';
import { logActivity } from './security-agent';
import { syncLeadToNotion } from './notion-agent';

interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
}

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Called when a new lead comes in via the contact form.
 * 1. Save to DB as Lead (status: nouveau)
 * 2. Send auto-reply to the sender
 * 3. Send notification to admin
 * 4. Optionally sync to Notion
 * 5. Log activity
 */
export async function handleNewLead(payload: ContactPayload): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    await connectDB();

    // 1. Create lead in DB
    const lead = await Lead.create({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      company: payload.company,
      service: payload.service,
      message: payload.message,
      status: 'nouveau',
      source: 'contact-form',
    });

    // 2. Log activity
    await logActivity({
      type: 'lead_received',
      severity: 'info',
      userEmail: payload.email,
      description: `Nouveau lead : ${payload.name} — ${payload.service}`,
      metadata: { leadId: String(lead._id) },
    });

    const resend = getResend();
    if (!resend) {
      return { success: true, leadId: String(lead._id), error: 'Email désactivé (pas de clé Resend)' };
    }

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@flex-industry.fr';

    // 3. Auto-reply to the sender
    const autoReply = leadAutoReplyTemplate(payload.name, payload.service);
    await resend.emails.send({
      from: fromEmail,
      to: payload.email,
      subject: autoReply.subject,
      html: autoReply.html,
    }).catch((err) => {
      console.error('[lead-agent] Auto-reply failed:', err);
    });

    // 4. Notify admin
    const adminNotif = leadAdminNotifTemplate({ ...payload, _id: String(lead._id) });
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: payload.email,
      subject: adminNotif.subject,
      html: adminNotif.html,
    }).catch((err) => {
      console.error('[lead-agent] Admin notif failed:', err);
    });

    // 5. Sync to Notion (fire and forget)
    syncLeadToNotion(lead).catch((err) => {
      console.error('[lead-agent] Notion sync failed:', err);
    });

    return { success: true, leadId: String(lead._id) };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[lead-agent] handleNewLead error:', message);
    return { success: false, error: message };
  }
}

/**
 * Runs on schedule (daily).
 * Finds leads still in 'nouveau' status after 3 or 7 days and sends reminder emails.
 */
export async function sendFollowUps(): Promise<{ sent3: number; sent7: number }> {
  await connectDB();
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const resend = getResend();
  if (!resend) return { sent3: 0, sent7: 0 };

  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

  // J+3 follow-up
  const candidates3 = await Lead.find({
    status: 'nouveau',
    createdAt: { $lte: threeDaysAgo },
    followUp3SentAt: { $exists: false },
  });

  let sent3 = 0;
  for (const lead of candidates3) {
    const tpl = followUp3Template(lead.name);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: lead.email,
      subject: tpl.subject,
      html: tpl.html,
    });
    if (!error) {
      lead.followUp3SentAt = now;
      await lead.save();
      sent3++;
    }
  }

  // J+7 follow-up (only if J+3 was sent)
  const candidates7 = await Lead.find({
    status: 'nouveau',
    createdAt: { $lte: sevenDaysAgo },
    followUp3SentAt: { $exists: true },
    followUp7SentAt: { $exists: false },
  });

  let sent7 = 0;
  for (const lead of candidates7) {
    const tpl = followUp7Template(lead.name);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: lead.email,
      subject: tpl.subject,
      html: tpl.html,
    });
    if (!error) {
      lead.followUp7SentAt = now;
      await lead.save();
      sent7++;
    }
  }

  return { sent3, sent7 };
}
