import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import PortfolioGrid from '@/lib/models/PortfolioGrid';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const categoryId = req.nextUrl.searchParams.get('categoryId');
    const filter = categoryId && mongoose.Types.ObjectId.isValid(categoryId)
      ? { categoryId }
      : {};
    const grids = await PortfolioGrid.find(filter).sort({ order: 1 });
    return Response.json(grids);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { categoryId, name, slug, order, isActive } = await req.json();
    if (!categoryId || !name || !slug) {
      return Response.json({ message: 'categoryId, nom et slug requis' }, { status: 400 });
    }
    const grid = await PortfolioGrid.create({ categoryId, name, slug, order, isActive, items: [] });
    return Response.json(grid, { status: 201 });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
