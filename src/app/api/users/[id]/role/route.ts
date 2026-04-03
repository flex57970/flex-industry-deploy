import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import User from '@/lib/models/User';
import { requireAdmin } from '@/lib/auth-utils';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    // Prevent self-role change
    if (String(auth.user._id) === id) {
      return Response.json({ message: 'Impossible de modifier votre propre rôle' }, { status: 400 });
    }
    const { role } = await req.json();
    if (!['user', 'admin'].includes(role)) return Response.json({ message: 'Rôle invalide' }, { status: 400 });
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) return Response.json({ message: 'Utilisateur introuvable' }, { status: 404 });
    return Response.json(user);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
