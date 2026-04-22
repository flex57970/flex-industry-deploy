/**
 * Brand email templates - Flex.industry signature
 */

const SITE_URL = 'https://flex-industry.fr';
const BRAND_COLOR = '#c9a870';
const BRAND_DARK = '#0a0a0b';

function esc(str: string | undefined | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function baseTemplate(content: string, preheader: string = ''): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${BRAND_DARK};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fafaf9;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:40px 40px 20px;border-bottom:1px solid #f4f4f3;">
        <p style="margin:0;font-size:22px;letter-spacing:-0.02em;color:${BRAND_DARK};">
          <span style="font-weight:600;">Flex</span><span style="color:${BRAND_COLOR};">.</span><span style="font-weight:300;">industry</span>
        </p>
      </td></tr>
      <tr><td style="padding:36px 40px;line-height:1.6;font-size:15px;color:${BRAND_DARK};">
        ${content}
      </td></tr>
      <tr><td style="padding:28px 40px;background:#fafaf9;border-top:1px solid #f4f4f3;font-size:12px;color:#9ca3af;">
        <p style="margin:0 0 6px;"><strong style="color:#6b7280;">Flex.industry</strong> — Agence de Communication Visuelle Premium</p>
        <p style="margin:0;"><a href="${SITE_URL}" style="color:${BRAND_COLOR};text-decoration:none;">flex-industry.fr</a> · <a href="https://www.instagram.com/studiot2.9" style="color:${BRAND_COLOR};text-decoration:none;">@studiot2.9</a></p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// Auto-reply to lead
export function leadAutoReplyTemplate(name: string, service: string): { subject: string; html: string } {
  const content = `
    <p style="margin:0 0 20px;">Bonjour ${esc(name)},</p>
    <p style="margin:0 0 20px;">Merci pour votre message concernant <strong>${esc(service)}</strong>. Je reviens vers vous au plus vite pour échanger sur votre projet.</p>
    <p style="margin:0 0 20px;">D'ici là, n'hésitez pas à découvrir nos dernières réalisations sur notre <a href="${SITE_URL}/portfolio" style="color:${BRAND_COLOR};text-decoration:none;font-weight:500;">portfolio</a>.</p>
    <p style="margin:0 0 8px;">À très vite,</p>
    <p style="margin:0;"><strong>L'équipe Flex.industry</strong></p>
  `;
  return {
    subject: 'Merci pour votre message — Flex.industry',
    html: baseTemplate(content, 'Merci pour votre message, nous revenons vers vous rapidement.'),
  };
}

// Notif admin - new lead
export function leadAdminNotifTemplate(lead: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  message: string;
  _id?: string;
}): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 8px;font-size:20px;font-weight:600;">Nouveau lead reçu</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:13px;">Via le formulaire de contact</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#fafaf9;border-radius:12px;">
      <tr><td style="padding:16px 20px;border-bottom:1px solid #f4f4f3;"><span style="color:#9ca3af;font-size:12px;">Nom</span><br /><strong>${esc(lead.name)}</strong></td></tr>
      <tr><td style="padding:16px 20px;border-bottom:1px solid #f4f4f3;"><span style="color:#9ca3af;font-size:12px;">Email</span><br /><a href="mailto:${esc(lead.email)}" style="color:${BRAND_COLOR};">${esc(lead.email)}</a></td></tr>
      ${lead.phone ? `<tr><td style="padding:16px 20px;border-bottom:1px solid #f4f4f3;"><span style="color:#9ca3af;font-size:12px;">Téléphone</span><br />${esc(lead.phone)}</td></tr>` : ''}
      ${lead.company ? `<tr><td style="padding:16px 20px;border-bottom:1px solid #f4f4f3;"><span style="color:#9ca3af;font-size:12px;">Entreprise</span><br />${esc(lead.company)}</td></tr>` : ''}
      <tr><td style="padding:16px 20px;"><span style="color:#9ca3af;font-size:12px;">Service</span><br /><strong>${esc(lead.service)}</strong></td></tr>
    </table>
    <div style="margin-top:24px;padding:20px;background:#fafaf9;border-radius:12px;">
      <p style="margin:0 0 8px;color:#9ca3af;font-size:12px;">Message</p>
      <p style="margin:0;white-space:pre-wrap;">${esc(lead.message)}</p>
    </div>
    <div style="margin-top:28px;">
      <a href="${SITE_URL}/admin/leads" style="display:inline-block;padding:12px 24px;background:${BRAND_DARK};color:#fff;border-radius:999px;text-decoration:none;font-size:13px;font-weight:500;">Gérer dans le dashboard →</a>
    </div>
  `;
  return {
    subject: `🔥 Nouveau lead : ${lead.name} — ${lead.service}`,
    html: baseTemplate(content, `Nouveau lead : ${lead.name}`),
  };
}

// Follow-up J+3
export function followUp3Template(name: string): { subject: string; html: string } {
  const content = `
    <p style="margin:0 0 20px;">Bonjour ${esc(name)},</p>
    <p style="margin:0 0 20px;">Je reviens vers vous suite à votre demande il y a quelques jours. Je voulais m'assurer que notre équipe a bien pris en charge votre projet.</p>
    <p style="margin:0 0 20px;">Avez-vous quelques minutes cette semaine pour en discuter ? Je reste disponible par email ou téléphone.</p>
    <p style="margin:0 0 8px;">Bien à vous,</p>
    <p style="margin:0;"><strong>L'équipe Flex.industry</strong></p>
  `;
  return {
    subject: 'Suivi de votre projet — Flex.industry',
    html: baseTemplate(content, 'On prend contact pour suivre votre demande.'),
  };
}

// Follow-up J+7
export function followUp7Template(name: string): { subject: string; html: string } {
  const content = `
    <p style="margin:0 0 20px;">Bonjour ${esc(name)},</p>
    <p style="margin:0 0 20px;">Je vous recontacte une dernière fois concernant votre projet. Si le timing n'est pas bon actuellement, pas de problème, nous restons disponibles quand vous serez prêt.</p>
    <p style="margin:0 0 20px;">Vous pouvez aussi répondre simplement à ce mail avec vos disponibilités ou vos questions.</p>
    <p style="margin:0 0 8px;">Belle journée,</p>
    <p style="margin:0;"><strong>L'équipe Flex.industry</strong></p>
  `;
  return {
    subject: 'Toujours intéressé par votre projet ? — Flex.industry',
    html: baseTemplate(content, 'Dernière relance sur votre projet.'),
  };
}

// Newsletter welcome
export function newsletterWelcomeTemplate(unsubscribeUrl: string): { subject: string; html: string } {
  const content = `
    <h2 style="margin:0 0 16px;font-size:22px;font-weight:600;">Bienvenue dans le cercle Flex.</h2>
    <p style="margin:0 0 20px;">Merci de vous être inscrit. Vous serez désormais parmi les premiers à découvrir nos dernières réalisations cinématographiques — Immobilier, Automobile, Parfumerie.</p>
    <p style="margin:0 0 24px;">En attendant, plongez dans notre <a href="${SITE_URL}/portfolio" style="color:${BRAND_COLOR};font-weight:500;">portfolio</a>.</p>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #f4f4f3;font-size:12px;color:#9ca3af;">
      <p style="margin:0;">Vous ne voulez plus recevoir nos mails ? <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Se désabonner</a></p>
    </div>
  `;
  return {
    subject: 'Bienvenue chez Flex.industry',
    html: baseTemplate(content, 'Vous êtes inscrit à la newsletter Flex.industry.'),
  };
}

// Newsletter broadcast - new portfolio category
export function portfolioBroadcastTemplate(
  categoryName: string,
  categorySlug: string,
  categoryDescription: string,
  coverUrl: string,
  unsubscribeUrl: string,
): { subject: string; html: string } {
  const content = `
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:${BRAND_COLOR};font-weight:600;">Nouvelle réalisation</p>
    <h2 style="margin:0 0 20px;font-size:28px;font-weight:300;letter-spacing:-0.02em;">${esc(categoryName)}</h2>
    ${coverUrl ? `<img src="${esc(coverUrl)}" alt="${esc(categoryName)}" style="width:100%;border-radius:12px;margin:0 0 24px;" />` : ''}
    <p style="margin:0 0 28px;">${esc(categoryDescription) || 'Découvrez notre dernière création.'}</p>
    <a href="${SITE_URL}/portfolio/${esc(categorySlug)}" style="display:inline-block;padding:12px 28px;background:${BRAND_DARK};color:#fff;border-radius:999px;text-decoration:none;font-size:13px;font-weight:500;">Voir la réalisation →</a>
    <div style="margin-top:32px;padding-top:20px;border-top:1px solid #f4f4f3;font-size:12px;color:#9ca3af;">
      <p style="margin:0;"><a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Se désabonner</a></p>
    </div>
  `;
  return {
    subject: `Nouvelle réalisation : ${categoryName}`,
    html: baseTemplate(content, `Découvrez ${categoryName} sur Flex.industry`),
  };
}

// Weekly report
export function weeklyReportTemplate(data: {
  newLeads: number;
  leadsByStatus: Record<string, number>;
  newSubscribers: number;
  mediaUploaded: number;
  securityAlerts: number;
  topLead?: { name: string; email: string; service: string };
  aiSuggestions?: string[];
}): { subject: string; html: string } {
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
  const weekEnd = new Date().toLocaleDateString('fr-FR');

  const statusBadges = Object.entries(data.leadsByStatus)
    .map(([status, count]) => `<span style="display:inline-block;padding:4px 10px;margin:0 4px 4px 0;background:#f4f4f3;border-radius:999px;font-size:11px;color:#6b7280;"><strong>${count}</strong> ${esc(status)}</span>`)
    .join('');

  const suggestionsHtml = data.aiSuggestions && data.aiSuggestions.length > 0
    ? `
      <h3 style="margin:32px 0 12px;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">Suggestions IA de la semaine</h3>
      <ul style="margin:0 0 20px;padding-left:20px;color:#6b7280;">
        ${data.aiSuggestions.map((s) => `<li style="margin:0 0 6px;">${esc(s)}</li>`).join('')}
      </ul>
    `
    : '';

  const content = `
    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;color:${BRAND_COLOR};font-weight:600;">Rapport hebdomadaire</p>
    <h2 style="margin:0 0 6px;font-size:24px;font-weight:600;">Semaine du ${weekStart}</h2>
    <p style="margin:0 0 28px;color:#9ca3af;font-size:13px;">au ${weekEnd}</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;">
      <tr>
        <td width="50%" style="padding:16px;background:#fafaf9;border-radius:12px;vertical-align:top;">
          <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;">Nouveaux leads</p>
          <p style="margin:0;font-size:32px;font-weight:600;">${data.newLeads}</p>
        </td>
        <td width="4"></td>
        <td width="50%" style="padding:16px;background:#fafaf9;border-radius:12px;vertical-align:top;">
          <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;">Nouveaux abonnés</p>
          <p style="margin:0;font-size:32px;font-weight:600;">${data.newSubscribers}</p>
        </td>
      </tr>
      <tr><td colspan="3" height="12"></td></tr>
      <tr>
        <td style="padding:16px;background:#fafaf9;border-radius:12px;vertical-align:top;">
          <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;">Médias uploadés</p>
          <p style="margin:0;font-size:32px;font-weight:600;">${data.mediaUploaded}</p>
        </td>
        <td width="4"></td>
        <td style="padding:16px;background:${data.securityAlerts > 0 ? '#fef2f2' : '#fafaf9'};border-radius:12px;vertical-align:top;">
          <p style="margin:0 0 4px;color:#9ca3af;font-size:12px;">Alertes sécurité</p>
          <p style="margin:0;font-size:32px;font-weight:600;color:${data.securityAlerts > 0 ? '#dc2626' : 'inherit'};">${data.securityAlerts}</p>
        </td>
      </tr>
    </table>

    <h3 style="margin:32px 0 12px;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">Pipeline</h3>
    <div style="margin:0 0 20px;">${statusBadges || '<span style="color:#9ca3af;font-size:13px;">Aucun lead enregistré.</span>'}</div>

    ${data.topLead ? `
      <h3 style="margin:32px 0 12px;font-size:14px;color:#6b7280;text-transform:uppercase;letter-spacing:0.1em;">Lead phare</h3>
      <div style="padding:16px;background:#fafaf9;border-radius:12px;">
        <p style="margin:0;font-weight:600;">${esc(data.topLead.name)}</p>
        <p style="margin:4px 0 0;color:#6b7280;font-size:13px;">${esc(data.topLead.email)} · ${esc(data.topLead.service)}</p>
      </div>
    ` : ''}

    ${suggestionsHtml}

    <div style="margin-top:32px;">
      <a href="${SITE_URL}/admin" style="display:inline-block;padding:12px 24px;background:${BRAND_DARK};color:#fff;border-radius:999px;text-decoration:none;font-size:13px;font-weight:500;">Ouvrir le dashboard →</a>
    </div>
  `;
  return {
    subject: `📊 Rapport hebdo Flex.industry — ${data.newLeads} nouveaux leads`,
    html: baseTemplate(content, `${data.newLeads} nouveaux leads cette semaine`),
  };
}

// Security alert
export function securityAlertTemplate(data: { title: string; details: string; severity: 'warning' | 'critical' }): {
  subject: string;
  html: string;
} {
  const color = data.severity === 'critical' ? '#dc2626' : '#f59e0b';
  const content = `
    <div style="padding:16px;background:${data.severity === 'critical' ? '#fef2f2' : '#fffbeb'};border-radius:12px;border-left:4px solid ${color};margin:0 0 24px;">
      <p style="margin:0 0 4px;color:${color};font-size:12px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">${data.severity === 'critical' ? '🚨 Alerte critique' : '⚠ Alerte sécurité'}</p>
      <p style="margin:0;font-size:17px;font-weight:600;">${esc(data.title)}</p>
    </div>
    <p style="margin:0 0 16px;white-space:pre-wrap;">${esc(data.details)}</p>
    <div style="margin-top:24px;">
      <a href="${SITE_URL}/admin/activite" style="display:inline-block;padding:12px 24px;background:${BRAND_DARK};color:#fff;border-radius:999px;text-decoration:none;font-size:13px;font-weight:500;">Voir le journal d'activité →</a>
    </div>
  `;
  return {
    subject: `${data.severity === 'critical' ? '🚨' : '⚠'} ${data.title}`,
    html: baseTemplate(content, data.title),
  };
}

// Backup confirmation (sent with backup attached)
export function backupTemplate(data: { sizeKb: number; collections: Record<string, number> }): {
  subject: string;
  html: string;
} {
  const collectionsHtml = Object.entries(data.collections)
    .map(([name, count]) => `<tr><td style="padding:8px 0;color:#6b7280;">${esc(name)}</td><td style="text-align:right;font-weight:500;">${count}</td></tr>`)
    .join('');
  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:600;">Sauvegarde quotidienne ✓</h2>
    <p style="margin:0 0 24px;color:#6b7280;">Base de données sauvegardée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:12px;background:#fafaf9;border-radius:12px;">
      <tr><td colspan="2" style="padding:0 0 12px;color:#9ca3af;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;">Contenu</td></tr>
      ${collectionsHtml}
      <tr><td style="padding:12px 0 0;border-top:1px solid #f4f4f3;color:#6b7280;">Taille</td><td style="padding:12px 0 0;text-align:right;font-weight:500;">${data.sizeKb} KB</td></tr>
    </table>
    <p style="margin:24px 0 0;font-size:13px;color:#9ca3af;">Le fichier JSON complet est joint à cet email.</p>
  `;
  return {
    subject: `💾 Backup Flex.industry — ${new Date().toLocaleDateString('fr-FR')}`,
    html: baseTemplate(content, 'Sauvegarde quotidienne réussie'),
  };
}
