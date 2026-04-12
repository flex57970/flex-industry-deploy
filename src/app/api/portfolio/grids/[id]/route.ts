import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import PortfolioGrid from '@/lib/models/PortfolioGrid';
import { requireAdmin } from '@/lib/auth-utils';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const data = await req.json();
    const grid = await PortfolioGrid.findByIdAndUpdate(id, data, { new: true });
    if (!grid) return Response.json({ message: 'Grille introuvable' }, { status: 404 });
    return Response.json(grid);
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
    const deleted = await PortfolioGrid.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: 'Grille introuvable' }, { status: 404 });
    return Response.json({ message: 'Grille supprimée' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
