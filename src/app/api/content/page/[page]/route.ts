import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import { autoSeed } from '@/lib/seed';
import Content from '@/lib/models/Content';

const allowedPages = ['home', 'immobilier', 'automobile', 'parfumerie'];

export async function GET(_req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  try {
    await connectDB();
    await autoSeed();
    const { page } = await params;
    if (!allowedPages.includes(page)) {
      return Response.json({ message: 'Page invalide' }, { status: 400 });
    }
    const content = await Content.find({ page, isActive: true }).sort('order');
    return Response.json(content);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
