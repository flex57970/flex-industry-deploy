import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Content from '@/lib/models/Content';
import { requireAdmin } from '@/lib/auth-utils';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const { section, page, title, subtitle, description, mediaUrl, mediaType, order, isActive } = await req.json();
    const content = await Content.findByIdAndUpdate(id, { section, page, title, subtitle, description, mediaUrl, mediaType, order, isActive }, { new: true });
    if (!content) return Response.json({ message: 'Contenu introuvable' }, { status: 404 });
    return Response.json(content);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(_req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const deleted = await Content.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: 'Contenu introuvable' }, { status: 404 });
    return Response.json({ message: 'Contenu supprimé' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
