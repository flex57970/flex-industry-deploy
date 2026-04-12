import { NextRequest } from 'next/server';
import PortfolioCategory from '@/lib/models/PortfolioCategory';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const categories = await PortfolioCategory.find().sort({ order: 1 });
    return Response.json(categories);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { name, slug, description, coverUrl, order, isActive } = await req.json();
    if (!name || typeof name !== 'string' || name.length > 200) {
      return Response.json({ message: 'Nom invalide (max 200 caractères)' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string' || slug.length > 200 || !/^[a-z0-9-]+$/.test(slug)) {
      return Response.json({ message: 'Slug invalide (lettres minuscules, chiffres et tirets)' }, { status: 400 });
    }
    if (description && (typeof description !== 'string' || description.length > 1000)) {
      return Response.json({ message: 'Description trop longue (max 1000 caractères)' }, { status: 400 });
    }
    const existing = await PortfolioCategory.findOne({ slug });
    if (existing) {
      return Response.json({ message: 'Ce slug existe déjà' }, { status: 409 });
    }
    const category = await PortfolioCategory.create({ name, slug, description, coverUrl, order, isActive });
    return Response.json(category, { status: 201 });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
