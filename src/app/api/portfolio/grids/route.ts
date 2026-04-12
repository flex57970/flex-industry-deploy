import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import PortfolioGrid from '@/lib/models/PortfolioGrid';
import PortfolioCategory from '@/lib/models/PortfolioCategory';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const categoryId = req.nextUrl.searchParams.get('categoryId');
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return Response.json({ message: 'categoryId invalide' }, { status: 400 });
    }
    const filter = categoryId ? { categoryId: new mongoose.Types.ObjectId(categoryId) } : {};
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
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      return Response.json({ message: 'categoryId invalide' }, { status: 400 });
    }
    if (!name || typeof name !== 'string' || name.length > 200) {
      return Response.json({ message: 'Nom invalide (max 200 caractères)' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string' || slug.length > 200 || !/^[a-z0-9-]+$/.test(slug)) {
      return Response.json({ message: 'Slug invalide' }, { status: 400 });
    }
    // Verify category exists
    const category = await PortfolioCategory.findById(categoryId);
    if (!category) {
      return Response.json({ message: 'Catégorie introuvable' }, { status: 404 });
    }
    const grid = await PortfolioGrid.create({ categoryId, name, slug, order, isActive, items: [] });
    return Response.json(grid, { status: 201 });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
