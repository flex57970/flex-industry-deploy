import { NextRequest } from 'next/server';
import Automation from '@/lib/models/Automation';
import { requireAdmin } from '@/lib/auth-utils';
import { runBackup } from '@/lib/agents/backup-agent';
import { sendWeeklyReport } from '@/lib/agents/report-agent';
import { sendFollowUps } from '@/lib/agents/lead-agent';
import { checkFailedLogins } from '@/lib/agents/security-agent';

export const maxDuration = 60;

export async function POST(req: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  const { key } = await params;

  try {
    let status: 'success' | 'error' = 'success';
    let message = '';

    switch (key) {
      case 'daily_backup': {
        const result = await runBackup();
        status = result.success ? 'success' : 'error';
        message = result.success ? `Backup envoyé (${result.sizeKb} KB)` : result.error || 'Erreur';
        break;
      }
      case 'weekly_report': {
        const result = await sendWeeklyReport();
        status = result.success ? 'success' : 'error';
        message = result.success ? 'Rapport envoyé' : result.error || 'Erreur';
        break;
      }
      case 'lead_followup': {
        const result = await sendFollowUps();
        message = `${result.sent3} relances J+3, ${result.sent7} relances J+7`;
        break;
      }
      case 'check_failed_logins': {
        const result = await checkFailedLogins();
        message = `${result.alertsSent} alerte(s) envoyée(s)`;
        break;
      }
      default:
        return Response.json({ message: 'Automation non exécutable manuellement' }, { status: 400 });
    }

    await Automation.findOneAndUpdate({ key }, {
      lastRunAt: new Date(),
      lastRunStatus: status,
      lastRunMessage: message,
    });

    return Response.json({ status, message });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    await Automation.findOneAndUpdate({ key }, {
      lastRunAt: new Date(),
      lastRunStatus: 'error',
      lastRunMessage: errorMessage,
    });
    return Response.json({ message: errorMessage }, { status: 500 });
  }
}
