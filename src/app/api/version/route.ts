/**
 * Public diagnostic endpoint.
 * Returns the deployed version and which env vars are present (values hidden).
 * Useful to verify a deployment has gone through on Hostinger.
 */
export async function GET() {
  return Response.json({
    version: 'V18',
    deployedAt: '2026-04-23',
    features: {
      cronEndpoint: true,
      cronFallbackSecret: true,
      leadAgent: true,
      newsletterAgent: true,
      backupAgent: true,
      reportAgent: true,
      aiAgent: true,
    },
    envVars: {
      CRON_SECRET: Boolean(process.env.CRON_SECRET),
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '(not set)',
      RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
      ANTHROPIC_API_KEY: Boolean(process.env.ANTHROPIC_API_KEY),
      NOTION_API_KEY: Boolean(process.env.NOTION_API_KEY),
    },
  });
}
