import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-utils';
import { generateSeoSuggestions } from '@/lib/agents/ai-agent';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const suggestions = await generateSeoSuggestions();
    return Response.json({ suggestions });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
