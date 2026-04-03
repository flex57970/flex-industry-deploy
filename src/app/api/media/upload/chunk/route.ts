import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { getUploadDir, ensureUploadDir, getFilePath } from '@/lib/uploads';
import connectDB from '@/lib/db';
import Media from '@/lib/models/Media';
import { requireAdmin } from '@/lib/auth-utils';

const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime', 'video/webm'];
const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.webm'];
const allowedCategories = ['general', 'immobilier', 'automobile', 'parfumerie'];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_CHUNKS = 200; // ~800MB max with 4MB chunks

// Only allow alphanumeric + dash in uploadId to prevent path traversal
function isSafeUploadId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{5,60}$/.test(id);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const formData = await req.formData();
    const chunk = formData.get('chunk') as File | null;
    const uploadId = formData.get('uploadId') as string;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string, 10);
    const totalChunks = parseInt(formData.get('totalChunks') as string, 10);
    const originalName = formData.get('originalName') as string;
    const mimeType = formData.get('mimeType') as string;
    const totalSize = parseInt(formData.get('totalSize') as string, 10);
    const category = formData.get('category') as string;

    if (!chunk || !uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || !originalName || !mimeType) {
      return Response.json({ message: 'Paramètres manquants' }, { status: 400 });
    }

    // Security validations
    if (!isSafeUploadId(uploadId)) {
      return Response.json({ message: 'uploadId invalide' }, { status: 400 });
    }
    if (chunkIndex < 0 || chunkIndex >= totalChunks || totalChunks > MAX_CHUNKS) {
      return Response.json({ message: 'Index de chunk invalide' }, { status: 400 });
    }
    if (totalSize > MAX_SIZE) {
      return Response.json({ message: 'Fichier trop volumineux (max 100MB)' }, { status: 400 });
    }

    const ext = path.extname(originalName).toLowerCase();
    if (!allowedMimes.includes(mimeType) || !allowedExts.includes(ext)) {
      return Response.json({ message: 'Format de fichier non supporté' }, { status: 400 });
    }

    await ensureUploadDir();

    // Create temp directory for this upload
    const tempDir = path.join(getUploadDir(), 'temp', uploadId);
    await fs.mkdir(tempDir, { recursive: true });

    // Save this chunk
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());
    await fs.writeFile(path.join(tempDir, `chunk-${chunkIndex}`), chunkBuffer);

    // If this is the last chunk, assemble the file
    if (chunkIndex === totalChunks - 1) {
      const randHex = crypto.randomBytes(8).toString('hex');
      const filename = `${Date.now()}-${randHex}${ext}`;
      const finalPath = getFilePath(filename);

      // Assemble chunks in order
      const chunks: Buffer[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(tempDir, `chunk-${i}`);
        try {
          chunks.push(await fs.readFile(chunkPath));
        } catch {
          // Missing chunk — clean up and fail
          await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
          return Response.json({ message: `Chunk ${i} manquant, re-uploadez le fichier` }, { status: 400 });
        }
      }
      await fs.writeFile(finalPath, Buffer.concat(chunks));

      // Clean up temp directory
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});

      // Save metadata to MongoDB
      await connectDB();
      const cat = allowedCategories.includes(category) ? category : 'general';
      const media = await Media.create({
        filename,
        originalName,
        mimeType,
        size: totalSize,
        url: `/api/media/file/${filename}`,
        category: cat,
        uploadedBy: auth.user._id,
      });

      return Response.json({ done: true, media: media.toJSON() }, { status: 201 });
    }

    return Response.json({ done: false, chunkIndex });
  } catch (err) {
    console.error('Chunk upload error:', err);
    return Response.json({ message: "Erreur lors de l'upload" }, { status: 500 });
  }
}
