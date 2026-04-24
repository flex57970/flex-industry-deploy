type Shell = { title: string; preheader?: string; body: string; cta?: { label: string; url: string } };

function render({ title, preheader = "", body, cta }: Shell): string {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#0D0D0D;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#F5F5F0;">
  <span style="display:none;opacity:0;max-height:0;overflow:hidden;">${preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0D0D0D;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#121212;border:1px solid #222;border-radius:12px;">
        <tr><td style="padding:32px 40px;border-bottom:1px solid #1E1E1E;">
          <div style="font-size:20px;font-weight:700;letter-spacing:0.5px;">
            <span style="color:#F5F5F0;">FLEX</span>
            <span style="color:#D4AF37;">Launch</span>
          </div>
        </td></tr>
        <tr><td style="padding:32px 40px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:#F5F5F0;">${title}</h1>
          <div style="font-size:15px;line-height:1.6;color:#C8C8BE;">${body}</div>
          ${
            cta
              ? `<div style="margin-top:28px;">
            <a href="${cta.url}" style="display:inline-block;background:#D4AF37;color:#0D0D0D;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">${cta.label}</a>
          </div>`
              : ""
          }
        </td></tr>
        <tr><td style="padding:24px 40px;border-top:1px solid #1E1E1E;font-size:12px;color:#7A7A72;">
          Tu reçois cet email car tu as un compte FLEX Launch.<br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#7A7A72;text-decoration:underline;">flex-launch.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeEmail(name?: string): { subject: string; html: string } {
  return {
    subject: "Bienvenue sur FLEX Launch ⚡",
    html: render({
      title: `Bienvenue${name ? `, ${name}` : ""} 👋`,
      preheader: "Ton compte FLEX Launch est prêt.",
      body: `
        <p>Ton compte est prêt. Tu peux dès maintenant générer ta première landing page en moins de 60 secondes.</p>
        <p>Décris ton produit, l'IA s'occupe du reste : hero, features, pricing, FAQ, CTA.</p>
      `,
      cta: { label: "Créer ma première page", url: `${process.env.NEXT_PUBLIC_APP_URL}/projects/new` },
    }),
  };
}

export function resetPasswordEmail(resetUrl: string): { subject: string; html: string } {
  return {
    subject: "Réinitialise ton mot de passe",
    html: render({
      title: "Réinitialisation du mot de passe",
      preheader: "Clique pour définir un nouveau mot de passe.",
      body: `<p>Tu as demandé à réinitialiser ton mot de passe. Ce lien expire dans 1 heure.</p>
        <p style="color:#7A7A72;font-size:13px;">Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>`,
      cta: { label: "Réinitialiser le mot de passe", url: resetUrl },
    }),
  };
}

export function receiptEmail(plan: string, amount: string): { subject: string; html: string } {
  return {
    subject: `Reçu FLEX Launch — Plan ${plan}`,
    html: render({
      title: "Merci pour ton abonnement 🎉",
      preheader: `Abonnement ${plan} actif.`,
      body: `
        <p>Ton paiement a bien été reçu. Ton plan <strong>${plan}</strong> est actif immédiatement.</p>
        <p>Montant : <strong>${amount}</strong></p>
        <p>Tu peux accéder à ta facture détaillée depuis ton espace de facturation.</p>
      `,
      cta: { label: "Voir mes factures", url: `${process.env.NEXT_PUBLIC_APP_URL}/billing` },
    }),
  };
}

export function trialEndingEmail(daysLeft: number): { subject: string; html: string } {
  return {
    subject: `Ton essai se termine dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}`,
    html: render({
      title: `Plus que ${daysLeft} jour${daysLeft > 1 ? "s" : ""} d'essai`,
      preheader: "Ne perds pas tes landing pages.",
      body: `
        <p>Ton essai gratuit se termine bientôt. Passe au plan payant pour garder toutes tes landing pages actives et continuer à générer avec l'IA.</p>
      `,
      cta: { label: "Continuer avec FLEX Launch", url: `${process.env.NEXT_PUBLIC_APP_URL}/billing` },
    }),
  };
}

export function cancelConfirmationEmail(periodEnd: string): { subject: string; html: string } {
  return {
    subject: "Annulation confirmée",
    html: render({
      title: "Ton abonnement est annulé",
      preheader: `Accès jusqu'au ${periodEnd}.`,
      body: `
        <p>Ton abonnement a bien été annulé. Tu garderas l'accès complet jusqu'au <strong>${periodEnd}</strong>.</p>
        <p>On espère te revoir bientôt 💛</p>
      `,
      cta: { label: "Reprendre mon abonnement", url: `${process.env.NEXT_PUBLIC_APP_URL}/billing` },
    }),
  };
}
