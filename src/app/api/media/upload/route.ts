import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectDB from '@/lib/db';
import Media from '@/lib/models/Media';
import { requireAdmin } from '@/lib/auth-utils';

const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm'];
const allowedCategories = ['general', 'immobilier', 'automobile', 'parfumerie'];

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
    if (file.size > 100 * 1024 * 1024) {
      return Response.json({ message: 'Fichier trop volumineux (max 100MB)' }, { status: 400 });
    }

    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const uploadDir = path.join(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    await connectDB();
    const cat = formData.get('category') as string;
    const category = allowedCategories.includes(cat) ? cat : 'general';

    const media = await Media.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url: `/uploads/${filename}`,
      category,
      uploadedBy: auth.user._id,
    });

    return Response.json(media, { status: 201 });
  } catch {
    return Response.json({ message: "Erreur lors de l'upload" }, { status: 500 });
  }
}
