import { NextRequest } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import { Readable } from 'stream';

const mimeTypes: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
};

function getContentType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Try multiple possible directories where the file might live.
 * Covers both UPLOAD_DIR and the project-relative media-uploads folder.
 */
async function findFile(filename: string): Promise<string | null> {
  const candidates: string[] = [];

  // 1. UPLOAD_DIR (if set explicitly)
  if (process.env.UPLOAD_DIR) {
    candidates.push(path.join(process.env.UPLOAD_DIR, filename));
  }

  // 2. Project-relative media-uploads (default fallback)
  candidates.push(path.join(process.cwd(), 'media-uploads', filename));

  // 3. Home-based media-uploads (common Hostinger path)
  const home = process.env.HOME || '/home';
  candidates.push(path.join(home, 'media-uploads', filename));

  // 4. /tmp fallback
  candidates.push(path.join('/tmp', 'media-uploads', filename));

  // Deduplicate
  const seen = new Set<string>();
  for (const p of candidates) {
    if (seen.has(p)) continue;
    seen.add(p);
    try {
      await fs.access(p);
      return p;
    } catch {
      // Not found here, try next
    }
  }

  return null;
}

/**
 * Convert Node.js readable stream to a ReadableStream (Web API)
 */
function nodeStreamToWebStream(nodeStream: Readable): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      nodeStream.on('data', (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on('end', () => {
        controller.close();
      });
      nodeStream.on('error', (err) => {
        controller.error(err);
      });
    },
    cancel() {
      nodeStream.destroy();
    },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  try {
    const { filename } = await params;

    // Prevent path traversal
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new Response('Bad Request', { status: 400 });
    }

    // Only allow safe basename
    const safe = path.basename(filename);
    if (safe !== filename) {
      return new Response('Bad Request', { status: 400 });
    }

    const filePath = await findFile(filename);
    if (!filePath) {
      return new Response('Not Found', { status: 404 });
    }

    const stat = await fs.stat(filePath);
    const contentType = getContentType(filename);
    const fileSize = stat.size;

    // Handle Range requests (crucial for video seeking)
    const rangeHeader = req.headers.get('range');

    if (rangeHeader) {
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;

        if (start >= fileSize || end >= fileSize || start > end) {
          return new Response('Range Not Satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${fileSize}` },
          });
        }

        const chunkSize = end - start + 1;
        const stream = createReadStream(filePath, { start, end });
        const webStream = nodeStreamToWebStream(stream);

        return new Response(webStream, {
          status: 206,
          headers: {
            'Content-Type': contentType,
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': String(chunkSize),
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    // Full file — stream it instead of loading into memory
    const stream = createReadStream(filePath);
    const webStream = nodeStreamToWebStream(stream);

    return new Response(webStream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileSize),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new Response('Server Error', { status: 500 });
  }
}
