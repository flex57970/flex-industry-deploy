import { NextRequest } from 'next/server';
import User from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    return Response.json(users);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
