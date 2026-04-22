import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { generateSeoDescription } from '@/lib/agents/ai-agent';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { categoryName, context } = await req.json();
    if (!categoryName || typeof categoryName !== 'string') {
      return Response.json({ message: 'categoryName requis' }, { status: 400 });
    }
    const description = await generateSeoDescription(categoryName, context);
    if (!description) {
      return Response.json({ message: 'IA non configurée (ANTHROPIC_API_KEY manquant)' }, { status: 503 });
    }
    return Response.json({ description });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
