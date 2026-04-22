import { NextRequest } from 'next/server';
import Lead from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const status = req.nextUrl.searchParams.get('status');
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const leads = await Lead.find(filter).sort({ createdAt: -1 }).limit(500);
    return Response.json(leads);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
