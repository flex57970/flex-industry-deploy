import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const user = await User.findById(id).select('-password');
    if (!user) return Response.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    return Response.json(user);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    // Prevent self-deletion
    if (String(auth.user._id) === id) {
      return Response.json({ message: 'Impossible de supprimer votre propre compte' }, { status: 400 });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return Response.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    return Response.json({ message: 'Utilisateur supprimé' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
