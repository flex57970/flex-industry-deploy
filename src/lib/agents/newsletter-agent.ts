import crypto from 'crypto';
import { Resend } from 'resend';
import connectDB from '@/lib/db';
import Subscriber from '@/lib/models/Subscriber';
import { newsletterWelcomeTemplate, portfolioBroadcastTemplate } from '@/lib/email-templates';

const SITE_URL = 'https://flex-industry.fr';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function generateToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export async function subscribe(
  email: string,
  source: string = 'website',
  name?: string,
): Promise<{ success: boolean; alreadySubscribed?: boolean; error?: string }> {
  await connectDB();

  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (existing.isActive) return { success: true, alreadySubscribed: true };
    existing.isActive = true;
    await existing.save();
    return { success: true };
  }

  const token = generateToken();
  await Subscriber.create({
    email: email.toLowerCase(),
    name,
    isActive: true,
    unsubscribeToken: token,
    source,
  });

  const resend = getResend();
  if (!resend) return { success: true };

  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${token}`;
  const tpl = newsletterWelcomeTemplate(unsubscribeUrl);

  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    to: email,
    subject: tpl.subject,
    html: tpl.html,
  }).catch((err) => console.error('[newsletter-agent] welcome failed:', err));

  return { success: true };
}

export async function unsubscribe(token: string): Promise<boolean> {
  await connectDB();
  const sub = await Subscriber.findOne({ unsubscribeToken: token });
  if (!sub) return false;
  sub.isActive = false;
  await sub.save();
  return true;
}

export async function broadcastNewPortfolio(category: {
  name: string;
  slug: string;
  description?: string;
  coverUrl?: string;
}): Promise<{ sent: number }> {
  await connectDB();
  const resend = getResend();
  if (!resend) return { sent: 0 };

  const subscribers = await Subscriber.find({ isActive: true }).select('email unsubscribeToken').lean<{ email: string; unsubscribeToken: string }[]>();

  let sent = 0;
  for (const sub of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${sub.unsubscribeToken}`;
    const tpl = portfolioBroadcastTemplate(
      category.name,
      category.slug,
      category.description || '',
      category.coverUrl || '',
      unsubscribeUrl,
    );

    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
      to: sub.email,
      subject: tpl.subject,
      html: tpl.html,
    });
    if (!error) sent++;
  }

  return { sent };
}
