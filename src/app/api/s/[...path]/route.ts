import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.map': 'application/json',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const relativePath = pathSegments.join('/');

  // Security: reject path traversal attempts
  if (relativePath.includes('..') || relativePath.includes('//') || relativePath.includes('\\')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const baseDir = path.resolve(process.cwd(), '.next', 'static');
  const filePath = path.resolve(baseDir, relativePath);

  // Verify resolved path stays within .next/static/
  if (!filePath.startsWith(baseDir + path.sep)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Reject symlinks that could escape the directory
    const realPath = fs.realpathSync(filePath);
    if (!realPath.startsWith(baseDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(stat.size),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
