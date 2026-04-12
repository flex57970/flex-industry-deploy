/**
 * Custom Next.js server for Hostinger
 *
 * Solves: LiteSpeed/Passenger intercepts .css and .js requests and looks
 * for them in public_html/ instead of passing to Node.js.
 *
 * Fix: At startup, copy .next/static/ → ../public_html/_next/static/
 * so LiteSpeed can serve them directly.
 */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = false;
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

// ─── Copy static files to public_html at startup ───
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      count += copyRecursive(s, d);
    } else {
      fs.copyFileSync(s, d);
      count++;
    }
  }
  return count;
}

function copyStaticToPublicHtml() {
  const staticSrc = path.join(__dirname, '.next', 'static');
  if (!fs.existsSync(staticSrc)) {
    console.log('[server] WARNING: .next/static does not exist');
    return;
  }

  // Hostinger structure: nodejs/ and public_html/ are siblings
  const publicHtml = path.join(__dirname, '..', 'public_html');
  if (!fs.existsSync(publicHtml)) {
    console.log('[server] WARNING: ../public_html does not exist');
    return;
  }

  const dest = path.join(publicHtml, '_next', 'static');

  try {
    // Remove old static files to prevent stale hashes
    if (fs.existsSync(dest)) {
      fs.rmSync(dest, { recursive: true, force: true });
      console.log('[server] Cleaned old _next/static from public_html');
    }

    const count = copyRecursive(staticSrc, dest);
    console.log(`[server] Copied ${count} static files to public_html/_next/static/`);

    // Verify CSS specifically
    const cssDir = path.join(dest, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir);
      console.log(`[server] CSS files in public_html: ${cssFiles.join(', ')}`);
    }
  } catch (err) {
    console.error('[server] Failed to copy static files:', err.message);
  }
}

// Also copy public/ files (SVGs, favicon, etc.) to public_html
function copyPublicToPublicHtml() {
  const publicSrc = path.join(__dirname, 'public');
  const publicHtml = path.join(__dirname, '..', 'public_html');

  if (!fs.existsSync(publicSrc) || !fs.existsSync(publicHtml)) return;

  try {
    const entries = fs.readdirSync(publicSrc, { withFileTypes: true });
    let count = 0;
    for (const entry of entries) {
      // Skip _next (already handled) and hidden files
      if (entry.name.startsWith('.') || entry.name === '_next') continue;
      const s = path.join(publicSrc, entry.name);
      const d = path.join(publicHtml, entry.name);
      if (entry.isFile()) {
        fs.copyFileSync(s, d);
        count++;
      }
    }
    if (count > 0) console.log(`[server] Copied ${count} public files to public_html/`);
  } catch (err) {
    console.error('[server] Public copy error:', err.message);
  }
}

// ─── MIME types for fallback serving ───
const MIME_TYPES = {
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

// Run copy at startup
console.log('[server] Starting...');
console.log(`[server] __dirname: ${__dirname}`);
console.log(`[server] cwd: ${process.cwd()}`);
copyStaticToPublicHtml();
copyPublicToPublicHtml();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const pathname = parsedUrl.pathname;

      // Fallback: serve /_next/static/ from disk if LiteSpeed didn't
      if (pathname.startsWith('/_next/static/')) {
        const relativePath = pathname.replace('/_next/static/', '');
        const filePath = path.join(__dirname, '.next', 'static', relativePath);

        try {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const stat = fs.statSync(filePath);
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': stat.size,
              'Cache-Control': 'public, max-age=31536000, immutable',
            });
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        } catch (e) {
          // Fall through to Next.js handler
        }
      }

      // All other requests handled by Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('[server] Error:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, '0.0.0.0', () => {
    console.log(`[server] Ready on http://0.0.0.0:${port}`);
  });
});
