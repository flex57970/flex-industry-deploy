import { NextRequest } from 'next/server';
import Media from '@/lib/models/Media';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const allowedCats = ['general', 'immobilier', 'automobile', 'parfumerie'];
    const category = req.nextUrl.searchParams.get('category');
    const filter = category && allowedCats.includes(category) ? { category } : {};
    const media = await Media.find(filter).select('-data').sort('-createdAt').populate('uploadedBy', 'firstName lastName');
    return Response.json(media);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
