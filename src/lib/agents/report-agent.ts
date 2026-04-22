import { Resend } from 'resend';
import connectDB from '@/lib/db';
import Lead from '@/lib/models/Lead';
import Subscriber from '@/lib/models/Subscriber';
import Media from '@/lib/models/Media';
import ActivityLog from '@/lib/models/ActivityLog';
import { weeklyReportTemplate } from '@/lib/email-templates';
import { logActivity } from './security-agent';
import { generateSeoSuggestions } from './ai-agent';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function sendWeeklyReport(): Promise<{ success: boolean; error?: string }> {
  try {
    await connectDB();

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [leads, allLeadsByStatus, subscribers, media, securityAlerts] = await Promise.all([
      Lead.find({ createdAt: { $gte: weekAgo } }).lean<{ name: string; email: string; service: string; status: string }[]>(),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Subscriber.countDocuments({ createdAt: { $gte: weekAgo }, isActive: true }),
      Media.countDocuments({ createdAt: { $gte: weekAgo } }),
      ActivityLog.countDocuments({
        createdAt: { $gte: weekAgo },
        severity: { $in: ['warning', 'critical'] },
      }),
    ]);

    const leadsByStatus: Record<string, number> = {};
    for (const row of allLeadsByStatus as { _id: string; count: number }[]) {
      leadsByStatus[row._id] = row.count;
    }

    const topLead = leads[0] ? { name: leads[0].name, email: leads[0].email, service: leads[0].service } : undefined;

    // AI suggestions (optional, degrades gracefully)
    let aiSuggestions: string[] | undefined;
    try {
      aiSuggestions = await generateSeoSuggestions();
    } catch {
      aiSuggestions = undefined;
    }

    const tpl = weeklyReportTemplate({
      newLeads: leads.length,
      leadsByStatus,
      newSubscribers: subscribers,
      mediaUploaded: media,
      securityAlerts,
      topLead,
      aiSuggestions,
    });

    const resend = getResend();
    if (!resend) return { success: false, error: 'Resend non configuré' };

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@flex-industry.fr';

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: tpl.subject,
      html: tpl.html,
    });

    await logActivity({
      type: 'report_sent',
      severity: 'info',
      description: `Rapport hebdo envoyé (${leads.length} nouveaux leads)`,
      metadata: { leads: leads.length, subscribers, media, securityAlerts },
    });

    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[report-agent] error:', message);
    return { success: false, error: message };
  }
}
