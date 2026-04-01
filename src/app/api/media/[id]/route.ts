import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { unlink } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/db';
import Media from '@/lib/models/Media';
import { requireAdmin } from '@/lib/auth-utils';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const media = await Media.findById(id);
    if (!media) return Response.json({ message: 'Média introuvable' }, { status: 404 });

    try {
      await unlink(path.join(process.cwd(), 'uploads', media.filename));
    } catch { /* file may not exist */ }

    await Media.findByIdAndDelete(id);
    return Response.json({ message: 'Média supprimé' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
