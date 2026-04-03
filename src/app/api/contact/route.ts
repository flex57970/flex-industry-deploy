import { NextRequest } from 'next/server';
import { Resend } from 'resend';

// Sanitize user input to prevent HTML injection in emails
function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Basic email format check
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, service, message } = await req.json();
    if (!name || !email || !service || !message) {
      return Response.json({ message: 'Veuillez remplir tous les champs requis.' }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return Response.json({ message: 'Adresse email invalide.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.log('[Email] No RESEND_API_KEY — skipping');
      return Response.json({ message: 'Message envoyé avec succès !' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@flex-industry.fr';

    const sName = esc(name);
    const sEmail = esc(email);
    const sPhone = phone ? esc(phone) : '';
    const sCompany = company ? esc(company) : '';
    const sService = esc(service);
    const sMessage = esc(message);

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      replyTo: email,
      subject: `Nouveau message de ${sName} — ${sService}`,
      html: `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px;">
        <h1 style="font-size:24px;color:#0a0a0b;">Nouveau message</h1>
        <p>Via le formulaire de contact Flex.industry</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;color:#71717a;">Nom</td><td>${sName}</td></tr>
          <tr><td style="padding:10px 0;color:#71717a;">Email</td><td><a href="mailto:${sEmail}">${sEmail}</a></td></tr>
          ${sPhone ? `<tr><td style="padding:10px 0;color:#71717a;">Téléphone</td><td>${sPhone}</td></tr>` : ''}
          ${sCompany ? `<tr><td style="padding:10px 0;color:#71717a;">Entreprise</td><td>${sCompany}</td></tr>` : ''}
          <tr><td style="padding:10px 0;color:#71717a;">Service</td><td>${sService}</td></tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#fafaf9;border-radius:12px;">
          <p style="color:#71717a;margin:0 0 8px;">Message :</p>
          <p style="color:#0a0a0b;white-space:pre-wrap;">${sMessage}</p>
        </div>
      </div>`,
    });

    if (error) throw new Error(error.message);
    return Response.json({ message: 'Message envoyé avec succès !' });
  } catch {
    return Response.json({ message: "Erreur lors de l'envoi. Veuillez réessayer." }, { status: 500 });
  }
}
