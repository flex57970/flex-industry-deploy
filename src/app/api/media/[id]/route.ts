import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Media from '@/lib/models/Media';
import { deleteFile } from '@/lib/uploads';
import { requireAdmin } from '@/lib/auth-utils';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const media = await Media.findByIdAndDelete(id);
    if (!media) return Response.json({ message: 'Média introuvable' }, { status: 404 });

    // Clean up file from disk
    await deleteFile(media.filename);

    return Response.json({ message: 'Média supprimé' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
