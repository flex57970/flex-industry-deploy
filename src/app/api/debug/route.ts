import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function listDir(dir: string, depth = 0): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir) || depth > 3) return results;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(`[DIR] ${fullPath}`);
        results.push(...listDir(fullPath, depth + 1));
      } else {
        const stat = fs.statSync(fullPath);
        results.push(`[FILE] ${fullPath} (${stat.size}b)`);
      }
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    results.push(`[ERROR] ${dir}: ${msg}`);
  }
  return results;
}

export async function GET() {
  const cwd = process.cwd();
  const dirname = __dirname;

  const info: Record<string, unknown> = {
    cwd,
    dirname,
    env_PORT: process.env.PORT,
    env_NODE_ENV: process.env.NODE_ENV,
    nodeVersion: process.version,
  };

  // Check .next/static
  const nextStatic = path.join(cwd, '.next', 'static');
  info.nextStaticExists = fs.existsSync(nextStatic);
  if (fs.existsSync(nextStatic)) {
    info.nextStaticCss = listDir(path.join(nextStatic, 'css'));
    info.nextStaticChunksCount = fs.existsSync(path.join(nextStatic, 'chunks'))
      ? fs.readdirSync(path.join(nextStatic, 'chunks')).length
      : 0;
    info.nextStaticMedia = listDir(path.join(nextStatic, 'media'));
  }

  // Check public_html paths
  const publicHtmlPaths = [
    path.join(cwd, '..', 'public_html'),
    path.join(cwd, '..', '..', 'public_html'),
    path.join(cwd, 'public_html'),
  ];

  info.publicHtmlChecks = {};
  for (const p of publicHtmlPaths) {
    const exists = fs.existsSync(p);
    (info.publicHtmlChecks as Record<string, unknown>)[p] = {
      exists,
      contents: exists ? listDir(p, 0).slice(0, 30) : [],
    };
  }

  // Check if _next exists in public_html
  for (const p of publicHtmlPaths) {
    const nextInPublic = path.join(p, '_next');
    if (fs.existsSync(nextInPublic)) {
      (info.publicHtmlChecks as Record<string, unknown>)[`${p}/_next`] = listDir(nextInPublic);
    }
  }

  // Check public/ directory
  const publicDir = path.join(cwd, 'public');
  info.publicDirExists = fs.existsSync(publicDir);
  if (fs.existsSync(publicDir)) {
    info.publicDirContents = listDir(publicDir);
  }

  // Check parent directory structure
  try {
    const parentDir = path.join(cwd, '..');
    info.parentDirContents = fs.readdirSync(parentDir);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    info.parentDirError = msg;
  }

  // Check .htaccess
  for (const p of publicHtmlPaths) {
    const htaccess = path.join(p, '.htaccess');
    if (fs.existsSync(htaccess)) {
      try {
        (info as Record<string, unknown>)[`htaccess_${p}`] = fs.readFileSync(htaccess, 'utf8');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        (info as Record<string, unknown>)[`htaccess_${p}_error`] = msg;
      }
    }
  }

  return NextResponse.json(info, { status: 200 });
}
