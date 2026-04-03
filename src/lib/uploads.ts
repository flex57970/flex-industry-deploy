import path from 'path';
import fs from 'fs/promises';

// Persistent upload directory — set UPLOAD_DIR env var on Hostinger
// to a path that survives redeploys (e.g. /home/user/media-uploads)
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'media-uploads');

export function getUploadDir() {
  return UPLOAD_DIR;
}

export async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function getFilePath(filename: string) {
  // Prevent path traversal attacks — only allow the basename
  const safe = path.basename(filename);
  if (!safe || safe !== filename || safe.includes('..')) {
    throw new Error('Invalid filename');
  }
  return path.join(UPLOAD_DIR, safe);
}

export async function saveFile(filename: string, buffer: Buffer) {
  await ensureUploadDir();
  await fs.writeFile(getFilePath(filename), buffer);
}

export async function readFile(filename: string): Promise<Buffer> {
  return fs.readFile(getFilePath(filename));
}

export async function deleteFile(filename: string) {
  try {
    await fs.unlink(getFilePath(filename));
  } catch {
    // File may not exist — not critical
  }
}

export async function fileExists(filename: string): Promise<boolean> {
  try {
    await fs.access(getFilePath(filename));
    return true;
  } catch {
    return false;
  }
}
