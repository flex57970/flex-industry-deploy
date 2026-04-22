import { NextRequest } from 'next/server';
import ActivityLog from '@/lib/models/ActivityLog';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const severity = req.nextUrl.searchParams.get('severity');
    const type = req.nextUrl.searchParams.get('type');
    const limitParam = req.nextUrl.searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam || '100', 10) || 100, 500);

    const filter: Record<string, unknown> = {};
    if (severity) filter.severity = severity;
    if (type) filter.type = type;

    const logs = await ActivityLog.find(filter).sort({ createdAt: -1 }).limit(limit);
    return Response.json(logs);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
