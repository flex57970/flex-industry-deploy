import { NextRequest } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Media from '@/lib/models/Media';
import { saveFile } from '@/lib/uploads';
import { requireAdmin } from '@/lib/auth-utils';

const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm'];
const allowedCategories = ['general', 'immobilier', 'automobile', 'parfumerie'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return Response.json({ message: 'Aucun fichier fourni' }, { status: 400 });

    const ext = path.extname(file.name).toLowerCase();
    if (!allowedMimes.includes(file.type) || !allowedExts.includes(ext)) {
      return Response.json({ message: 'Format de fichier non supporté' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ message: 'Fichier trop volumineux (max 100MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const randHex = crypto.randomBytes(8).toString('hex');
    const filename = `${Date.now()}-${randHex}${ext}`;

    // Save to filesystem
    await saveFile(filename, buffer);

    await connectDB();
    const cat = formData.get('category') as string;
    const category = allowedCategories.includes(cat) ? cat : 'general';

    const media = await Media.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/api/media/file/${filename}`,
      category,
      uploadedBy: auth.user._id,
    });

    return Response.json(media.toJSON(), { status: 201 });
  } catch {
    return Response.json({ message: "Erreur lors de l'upload" }, { status: 500 });
  }
}
