import { NextRequest } from 'next/server';
import Subscriber from '@/lib/models/Subscriber';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const subs = await Subscriber.find().sort({ createdAt: -1 }).select('-unsubscribeToken').limit(1000);
    return Response.json(subs);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
