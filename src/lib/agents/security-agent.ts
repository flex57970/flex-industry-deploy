import { Resend } from 'resend';
import connectDB from '@/lib/db';
import ActivityLog, { ActivityType, Severity } from '@/lib/models/ActivityLog';
import { securityAlertTemplate } from '@/lib/email-templates';

interface LogActivityInput {
  type: ActivityType;
  severity?: Severity;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  description: string;
  metadata?: Record<string, unknown>;
}

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function logActivity(input: LogActivityInput): Promise<void> {
  try {
    await connectDB();
    await ActivityLog.create({
      type: input.type,
      severity: input.severity || 'info',
      userId: input.userId,
      userEmail: input.userEmail,
      ip: input.ip,
      userAgent: input.userAgent,
      description: input.description,
      metadata: input.metadata,
    });

    // Auto-alert on critical events
    if (input.severity === 'critical') {
      await alertSecurity({
        title: input.description,
        details: JSON.stringify(input.metadata || {}, null, 2),
        severity: 'critical',
      });
    }
  } catch (err) {
    console.error('[security-agent] logActivity failed:', err);
  }
}

export async function alertSecurity(data: {
  title: string;
  details: string;
  severity: 'warning' | 'critical';
}): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const tpl = securityAlertTemplate(data);
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@flex-industry.fr';
  await resend.emails.send({
    from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
    to: adminEmail,
    subject: tpl.subject,
    html: tpl.html,
  }).catch((err) => console.error('[security-agent] alert failed:', err));
}

/**
 * Called periodically (e.g. every 15 min) to check for brute-force login attempts.
 * If >= 5 failed logins in last 15 min from same IP or email, trigger alert.
 */
export async function checkFailedLogins(): Promise<{ alertsSent: number }> {
  await connectDB();
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000);

  const recentFails = await ActivityLog.find({
    type: 'login_failed',
    createdAt: { $gte: fifteenMinAgo },
  });

  // Group by IP and by email
  const byIp: Record<string, number> = {};
  const byEmail: Record<string, number> = {};
  for (const log of recentFails) {
    if (log.ip) byIp[log.ip] = (byIp[log.ip] || 0) + 1;
    if (log.userEmail) byEmail[log.userEmail] = (byEmail[log.userEmail] || 0) + 1;
  }

  let alertsSent = 0;
  for (const [ip, count] of Object.entries(byIp)) {
    if (count >= 5) {
      await alertSecurity({
        title: `${count} tentatives de connexion échouées depuis ${ip}`,
        details: `IP: ${ip}\nFenêtre: 15 dernières minutes\nAction recommandée : vérifier et bloquer si suspect.`,
        severity: 'warning',
      });
      alertsSent++;
    }
  }
  for (const [email, count] of Object.entries(byEmail)) {
    if (count >= 5) {
      await alertSecurity({
        title: `${count} tentatives de connexion échouées pour ${email}`,
        details: `Email ciblé: ${email}\nFenêtre: 15 dernières minutes\nAction recommandée : changer le mot de passe si compte réel.`,
        severity: 'warning',
      });
      alertsSent++;
    }
  }

  return { alertsSent };
}
