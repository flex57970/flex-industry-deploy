import { NextRequest } from 'next/server';
import Content from '@/lib/models/Content';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const content = await Content.find().sort({ page: 1, order: 1 });
    return Response.json(content);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { section, page, title, subtitle, description, mediaUrl, mediaType, order, isActive } = await req.json();
    const content = await Content.create({ section, page, title, subtitle, description, mediaUrl, mediaType, order, isActive });
    return Response.json(content, { status: 201 });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
