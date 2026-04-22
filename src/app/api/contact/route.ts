import { NextRequest } from 'next/server';
import { handleNewLead } from '@/lib/agents/lead-agent';

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
    // Input size guards
    if (name.length > 200 || service.length > 100 || message.length > 5000) {
      return Response.json({ message: 'Message trop long.' }, { status: 400 });
    }

    const result = await handleNewLead({ name, email, phone, company, service, message });
    if (!result.success) {
      return Response.json({ message: "Erreur lors de l'envoi. Veuillez réessayer." }, { status: 500 });
    }

    return Response.json({ message: 'Message envoyé avec succès !' });
  } catch {
    return Response.json({ message: "Erreur lors de l'envoi. Veuillez réessayer." }, { status: 500 });
  }
}
