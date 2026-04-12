import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import PortfolioCategory from '@/lib/models/PortfolioCategory';
import PortfolioGrid from '@/lib/models/PortfolioGrid';
import { requireAdmin } from '@/lib/auth-utils';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const data = await req.json();
    const category = await PortfolioCategory.findByIdAndUpdate(id, data, { new: true });
    if (!category) return Response.json({ message: 'Catégorie introuvable' }, { status: 404 });
    return Response.json(category);
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
    const deleted = await PortfolioCategory.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: 'Catégorie introuvable' }, { status: 404 });
    // Also delete all grids belonging to this category
    await PortfolioGrid.deleteMany({ categoryId: id });
    return Response.json({ message: 'Catégorie et grilles supprimées' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
