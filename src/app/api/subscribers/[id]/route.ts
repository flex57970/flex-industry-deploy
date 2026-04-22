import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Subscriber from '@/lib/models/Subscriber';
import { requireAdmin } from '@/lib/auth-utils';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: 'Abonné introuvable' }, { status: 404 });
    return Response.json({ message: 'Abonné supprimé' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
