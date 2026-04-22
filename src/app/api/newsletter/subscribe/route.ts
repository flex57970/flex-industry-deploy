import { NextRequest } from 'next/server';
import { subscribe } from '@/lib/agents/newsletter-agent';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email, name, source } = await req.json();
    if (!email || !isValidEmail(email) || email.length > 200) {
      return Response.json({ message: 'Email invalide' }, { status: 400 });
    }
    if (name && (typeof name !== 'string' || name.length > 200)) {
      return Response.json({ message: 'Nom invalide' }, { status: 400 });
    }

    const result = await subscribe(email, source || 'website', name);
    if (result.alreadySubscribed) {
      return Response.json({ message: 'Vous êtes déjà inscrit.' });
    }
    return Response.json({ message: 'Inscription réussie. Vérifiez votre boîte mail !' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
