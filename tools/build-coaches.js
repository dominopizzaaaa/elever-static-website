#!/usr/bin/env node
/* Coach profiles are popup-only (client, Sep 2026: "Remove coaches pages, just
   keep to pop up"). There are no standalone coaches/<slug>.html pages any more.

   This script now just removes any stale generated coach pages so the build
   pipeline stays self-cleaning. The profile content lives in assets/js/data.js
   and renders in the About-page popup (see initCoachDetail in pages.js).

   Run after editing the coach list:   node tools/build-coaches.js        */
'use strict';
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'coaches');

if (fs.existsSync(outDir)) {
  const stale = fs.readdirSync(outDir).filter(f => f.endsWith('.html'));
  stale.forEach(f => fs.rmSync(path.join(outDir, f)));
  // Drop the directory too if nothing else is left in it.
  if (!fs.readdirSync(outDir).length) fs.rmdirSync(outDir);
  console.log(`Removed ${stale.length} stale coach page(s); coaches are popup-only now.`);
} else {
  console.log('No coach pages to remove; coaches are popup-only.');
}
