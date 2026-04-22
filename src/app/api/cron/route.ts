import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Automation from '@/lib/models/Automation';
import { runBackup } from '@/lib/agents/backup-agent';
import { sendWeeklyReport } from '@/lib/agents/report-agent';
import { sendFollowUps } from '@/lib/agents/lead-agent';
import { checkFailedLogins } from '@/lib/agents/security-agent';

export const maxDuration = 120;

interface TaskResult {
  key: string;
  status: 'success' | 'error' | 'skipped';
  message: string;
}

/**
 * Protected cron endpoint. Expects header `x-cron-secret` or `?secret=` matching env.CRON_SECRET.
 *
 * Usage — set a cron job in Hostinger hPanel to hit:
 *   curl -H "x-cron-secret: YOUR_SECRET" https://flex-industry.fr/api/cron?task=all
 *
 * Available tasks:
 *   - task=all           → run all scheduled tasks (decides based on time/day)
 *   - task=daily_backup  → force run backup
 *   - task=weekly_report → force run report
 *   - task=lead_followup → force run follow-ups
 *   - task=check_failed_logins → force check
 */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret');
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return Response.json({ message: 'Non autorisé' }, { status: 401 });
  }

  await connectDB();

  const taskParam = req.nextUrl.searchParams.get('task') || 'all';
  const results: TaskResult[] = [];
  const now = new Date();

  const run = async (key: string, fn: () => Promise<string>) => {
    try {
      // Check if automation is enabled
      const auto = await Automation.findOne({ key });
      if (auto && !auto.enabled) {
        results.push({ key, status: 'skipped', message: 'Désactivé' });
        return;
      }
      const message = await fn();
      await Automation.findOneAndUpdate(
        { key },
        { lastRunAt: now, lastRunStatus: 'success', lastRunMessage: message },
        { upsert: true }
      );
      results.push({ key, status: 'success', message });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      await Automation.findOneAndUpdate(
        { key },
        { lastRunAt: now, lastRunStatus: 'error', lastRunMessage: message },
        { upsert: true }
      );
      results.push({ key, status: 'error', message });
    }
  };

  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon
  const hour = now.getUTCHours();

  if (taskParam === 'all') {
    // Daily backup (every run)
    await run('daily_backup', async () => {
      const r = await runBackup();
      if (!r.success) throw new Error(r.error || 'Backup failed');
      return `${r.sizeKb} KB`;
    });

    // Daily follow-ups
    await run('lead_followup', async () => {
      const r = await sendFollowUps();
      return `${r.sent3} J+3, ${r.sent7} J+7`;
    });

    // Failed login check (every run, fast)
    await run('check_failed_logins', async () => {
      const r = await checkFailedLogins();
      return `${r.alertsSent} alerte(s)`;
    });

    // Weekly report: only on Monday morning (UTC hour 6-9)
    if (dayOfWeek === 1 && hour >= 6 && hour <= 9) {
      await run('weekly_report', async () => {
        const r = await sendWeeklyReport();
        if (!r.success) throw new Error(r.error || 'Report failed');
        return 'Rapport envoyé';
      });
    } else {
      results.push({ key: 'weekly_report', status: 'skipped', message: 'Pas lundi matin' });
    }
  } else if (taskParam === 'daily_backup') {
    await run('daily_backup', async () => {
      const r = await runBackup();
      if (!r.success) throw new Error(r.error || 'Backup failed');
      return `${r.sizeKb} KB`;
    });
  } else if (taskParam === 'weekly_report') {
    await run('weekly_report', async () => {
      const r = await sendWeeklyReport();
      if (!r.success) throw new Error(r.error || 'Report failed');
      return 'Rapport envoyé';
    });
  } else if (taskParam === 'lead_followup') {
    await run('lead_followup', async () => {
      const r = await sendFollowUps();
      return `${r.sent3} J+3, ${r.sent7} J+7`;
    });
  } else if (taskParam === 'check_failed_logins') {
    await run('check_failed_logins', async () => {
      const r = await checkFailedLogins();
      return `${r.alertsSent} alerte(s)`;
    });
  } else {
    return Response.json({ message: 'Task inconnue' }, { status: 400 });
  }

  return Response.json({ ranAt: now.toISOString(), results });
}
