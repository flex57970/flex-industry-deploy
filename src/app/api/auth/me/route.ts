import { NextRequest } from 'next/server';
import { getAuthUser } from '@/lib/auth-utils';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return Response.json({ message: 'Non autorisé' }, { status: 401 });
    return Response.json({ user });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
