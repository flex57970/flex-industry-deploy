/**
 * Agents orchestration layer.
 * Each agent is a pure async function that performs a specific task.
 * They can be triggered:
 *  - directly on events (e.g. contact form submission → lead agent)
 *  - on a schedule via the /api/cron endpoint
 */

export { handleNewLead, sendFollowUps } from './lead-agent';
export { subscribe, unsubscribe, broadcastNewPortfolio } from './newsletter-agent';
export { logActivity, alertSecurity, checkFailedLogins } from './security-agent';
export { runBackup } from './backup-agent';
export { sendWeeklyReport } from './report-agent';
export { generateSeoDescription, generateSeoSuggestions, draftLeadReply } from './ai-agent';
export { syncLeadToNotion } from './notion-agent';
