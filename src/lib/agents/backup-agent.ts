import { Resend } from 'resend';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import Content from '@/lib/models/Content';
import Media from '@/lib/models/Media';
import Lead from '@/lib/models/Lead';
import Subscriber from '@/lib/models/Subscriber';
import PortfolioCategory from '@/lib/models/PortfolioCategory';
import PortfolioGrid from '@/lib/models/PortfolioGrid';
import ActivityLog from '@/lib/models/ActivityLog';
import { backupTemplate } from '@/lib/email-templates';
import { logActivity } from './security-agent';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function runBackup(): Promise<{ success: boolean; sizeKb: number; error?: string }> {
  try {
    await connectDB();

    // Sanitize users: strip password hashes
    const [users, content, media, leads, subscribers, portfolioCategories, portfolioGrids, activityLogs] = await Promise.all([
      User.find().select('-password').lean(),
      Content.find().lean(),
      Media.find().lean(),
      Lead.find().lean(),
      Subscriber.find().lean(),
      PortfolioCategory.find().lean(),
      PortfolioGrid.find().lean(),
      ActivityLog.find().limit(1000).sort({ createdAt: -1 }).lean(),
    ]);

    const backup = {
      metadata: {
        createdAt: new Date().toISOString(),
        site: 'flex-industry.fr',
        version: '1.0',
      },
      users,
      content,
      media,
      leads,
      subscribers,
      portfolioCategories,
      portfolioGrids,
      activityLogs,
    };

    const json = JSON.stringify(backup, null, 2);
    const sizeKb = Math.round(Buffer.byteLength(json, 'utf8') / 1024);

    const resend = getResend();
    if (!resend) {
      await logActivity({ type: 'backup_run', severity: 'warning', description: 'Backup executed but Resend not configured' });
      return { success: true, sizeKb, error: 'Resend non configuré' };
    }

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL || 'flex.industris@gmail.com';
    const filename = `flex-backup-${new Date().toISOString().split('T')[0]}.json`;

    const tpl = backupTemplate({
      sizeKb,
      collections: {
        Utilisateurs: users.length,
        Contenus: content.length,
        Médias: media.length,
        Leads: leads.length,
        Abonnés: subscribers.length,
        'Catégories portfolio': portfolioCategories.length,
        'Grilles portfolio': portfolioGrids.length,
        'Logs activité': activityLogs.length,
      },
    });

    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: tpl.subject,
      html: tpl.html,
      attachments: [
        {
          filename,
          content: Buffer.from(json, 'utf8').toString('base64'),
        },
      ],
    });

    await logActivity({
      type: 'backup_run',
      severity: 'info',
      description: `Sauvegarde envoyée (${sizeKb} KB)`,
      metadata: { sizeKb, collections: Object.keys(backup).length },
    });

    return { success: true, sizeKb };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[backup-agent] error:', message);
    await logActivity({ type: 'backup_run', severity: 'critical', description: `Backup failed: ${message}` });
    return { success: false, sizeKb: 0, error: message };
  }
}
