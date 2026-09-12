#!/usr/bin/env node
/*
 * Rebuilds favicon.ico from the approved blue-background brand mark.
 *
 * The site's favicon.ico used to be a single 100x100 PNG renamed to .ico,
 * which some browsers and OS icon caches render inconsistently. A real ICO
 * carries several square frames (16/32/48/64) so every surface — browser tab,
 * bookmark bar, Windows taskbar, macOS — picks the crispest size. Each frame is
 * stored as PNG, which the ICO format has allowed since Windows Vista and every
 * current browser understands.
 *
 * Source frames are exported with `sips` (bundled on macOS) from
 *   assets/img/brand/eb-icon-blue.png
 * Run after changing the brand mark:  node tools/build-favicon.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const repoRoot = path.join(__dirname, '..');
const source = path.join(repoRoot, 'assets/img/brand/eb-icon-blue.png');
const target = path.join(repoRoot, 'favicon.ico');
const sizes = [16, 32, 48, 64];

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eb-favicon-'));
try {
  const frames = sizes.map(size => {
    const out = path.join(workDir, `icon-${size}.png`);
    execFileSync('sips', ['-Z', String(size), '-s', 'format', 'png', source, '--out', out],
      { stdio: 'ignore' });
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
  fs.writeFileSync(target, ico);
  console.log(`favicon.ico rebuilt: ${ico.length} bytes, frames ${sizes.join('/')}`);
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}
