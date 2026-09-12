#!/usr/bin/env node
/*
 * Rebuilds the full, standard favicon set from the approved blue-background
 * brand mark.
 *
 * Why a whole set instead of one file: browsers, phones and OS icon caches all
 * reach for different sizes and formats. A single 100x100 PNG (the old setup)
 * forced every surface to rescale one oddly-sized image, which reads blurry in
 * a 16px browser tab. The standard package below gives each surface a
 * purpose-built file:
 *
 *   favicon.ico            multi-frame 16/32/48/64 — legacy + browser tab
 *   favicon-16x16.png      crisp browser tab
 *   favicon-32x32.png      crisp browser tab / bookmark bar
 *   favicon-192x192.png    Android home screen (via site.webmanifest)
 *   favicon-512x512.png    PWA splash / high-density (via site.webmanifest)
 *   apple-touch-icon.png   iOS home screen (kept as-is, 180x180)
 *   site.webmanifest       ties the PNG icons together for installable use
 *
 * Every frame is exported with `sips` (bundled on macOS) from the highest-
 * resolution brand raster we keep, assets/img/brand/apple-touch-icon.png
 * (180x180). PNG-in-ICO has been valid since Windows Vista and every current
 * browser understands it.
 *
 * Run after changing the brand mark:  node tools/build-favicon.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const repoRoot = path.join(__dirname, '..');
const brandDir = path.join(repoRoot, 'assets/img/brand');
// Highest-resolution brand raster we keep — the single source of truth so the
// tab icon, the ICO frames and the manifest icons all match exactly.
const source = path.join(brandDir, 'apple-touch-icon.png');
const icoTarget = path.join(repoRoot, 'favicon.ico');
const manifestTarget = path.join(repoRoot, 'site.webmanifest');

const icoSizes = [16, 32, 48, 64];
const pngSizes = [16, 32, 192, 512];

function exportPng(size, outPath) {
  execFileSync('sips', ['-Z', String(size), '-s', 'format', 'png', source, '--out', outPath],
    { stdio: 'ignore' });
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eb-favicon-'));
try {
  // 1) favicon.ico — one file, several square PNG frames.
  const frames = icoSizes.map(size => {
    const out = path.join(workDir, `icon-${size}.png`);
    exportPng(size, out);
    return { size, data: fs.readFileSync(out) };
  });

  const entrySize = 16;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);           // reserved
  header.writeUInt16LE(1, 2);           // image type: 1 = icon
  header.writeUInt16LE(frames.length, 4);

  let offset = 6 + frames.length * entrySize;
  const entries = frames.map(frame => {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(frame.size >= 256 ? 0 : frame.size, 0); // width  (0 => 256)
    entry.writeUInt8(frame.size >= 256 ? 0 : frame.size, 1); // height (0 => 256)
    entry.writeUInt8(0, 2);             // palette colours
    entry.writeUInt8(0, 3);             // reserved
    entry.writeUInt16LE(1, 4);          // colour planes
    entry.writeUInt16LE(32, 6);         // bits per pixel
    entry.writeUInt32LE(frame.data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += frame.data.length;
    return entry;
  });

  const ico = Buffer.concat([header, ...entries, ...frames.map(frame => frame.data)]);
  fs.writeFileSync(icoTarget, ico);
  console.log(`favicon.ico rebuilt: ${ico.length} bytes, frames ${icoSizes.join('/')}`);

  // 2) Standalone PNG favicons + manifest icons.
  pngSizes.forEach(size => {
    const out = path.join(brandDir, `favicon-${size}x${size}.png`);
    exportPng(size, out);
    console.log(`favicon-${size}x${size}.png rebuilt`);
  });

  // 3) site.webmanifest — ties the installable icons together. Colours are the
  // two ends of the brand gradient (blue -> near-black).
  const manifest = {
    name: 'Élever Badminton',
    short_name: 'Élever',
    icons: [
      { src: '/assets/img/brand/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/assets/img/brand/favicon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    theme_color: '#2151d1',
    background_color: '#05070d',
    display: 'standalone'
  };
  fs.writeFileSync(manifestTarget, JSON.stringify(manifest, null, 2) + '\n');
  console.log('site.webmanifest rebuilt');
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}
