/**
 * Post-build script: Copy .next/static → public_html/_next/static
 *
 * Hostinger uses LiteSpeed which intercepts .css and .js requests
 * and tries to serve them from public_html/ instead of proxying to Node.js.
 * This script copies the built static files so LiteSpeed can find them.
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const staticSrc = path.join(projectRoot, '.next', 'static');

// Destinations to try (in order of preference)
// Hostinger structure: /home/user/domains/domain.com/nodejs/ (app) and /home/user/domains/domain.com/public_html/ (web root)
const destinations = [
  // Hostinger standard: ../public_html relative to nodejs app directory
  path.join(projectRoot, '..', 'public_html', '_next', 'static'),
  // Hostinger alternative: some setups use different nesting
  path.join(projectRoot, '..', '..', 'public_html', '_next', 'static'),
  // Fallback: copy to public/_next/static within the project
  path.join(projectRoot, 'public', '_next', 'static'),
];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`[copy-static] Source not found: ${src}`);
    return false;
  }

  // Clean destination first to avoid stale files
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }

  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      count++;
    }
  }

  return true;
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

// Check source exists
if (!fs.existsSync(staticSrc)) {
  console.error('[copy-static] .next/static not found. Build may have failed.');
  process.exit(1);
}

const srcFileCount = countFiles(staticSrc);
console.log(`[copy-static] Found ${srcFileCount} files in .next/static`);

// Copy to each destination
for (const dest of destinations) {
  try {
    console.log(`[copy-static] Copying to ${dest}...`);
    copyRecursive(staticSrc, dest);
    const destCount = countFiles(dest);
    console.log(`[copy-static] ✓ Copied ${destCount} files to ${dest}`);
  } catch (err) {
    console.log(`[copy-static] → Skipped ${dest}: ${err.message}`);
  }
}

// Restore Hostinger's default .htaccess if we previously overwrote it
// Hostinger auto-generates this file; we should NOT override it
const publicHtmlDir = path.join(projectRoot, '..', 'public_html');
try {
  const htaccessPath = path.join(publicHtmlDir, '.htaccess');
  if (fs.existsSync(htaccessPath)) {
    const content = fs.readFileSync(htaccessPath, 'utf8');
    // If our custom .htaccess is there, remove it so Hostinger regenerates the default
    if (content.includes('copy-static') || content.includes('DirectoryIndex disabled')) {
      fs.unlinkSync(htaccessPath);
      console.log('[copy-static] ✓ Removed custom .htaccess (Hostinger will regenerate default)');
    }
  }
} catch (err) {
  // Ignore - might not have access
}

console.log('[copy-static] Done!');
