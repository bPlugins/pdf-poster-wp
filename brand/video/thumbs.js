#!/usr/bin/env node
/**
 * Renders each thumbnail variant in thumbnail.html to PNG + JPEG.
 *
 *   node brand/video/thumbs.js
 *
 * Per variant it writes into brand/video/thumbnails/:
 *   thumb-<id>.png   2560x1440 (2x) — the master
 *   thumb-<id>.jpg   1280x720 q92   — what you upload; YouTube caps at 2 MB
 *   feed-<id>.png    210x118        — how it reads in the sidebar, for a legibility check
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const SRC = process.argv[2] && process.argv[2].endsWith('.html') ? process.argv[2] : 'thumbnail.html';
const SUFFIX = SRC.replace(/^thumbnail-?/, '').replace(/.html$/, '');
const OUT = path.join(ROOT, 'thumbnails');
const { chromium } = require(path.join(ROOT, '../../node_modules/playwright'));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  let browser;
  try { browser = await chromium.launch(); }
  catch (e) { browser = await chromium.launch({ channel: 'chrome' }); }

  const page = await browser.newPage({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2,           // 2x master, so YouTube downscales from sharp source
  });
  await page.goto('file://' + path.join(ROOT, SRC), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const ids = await page.$$eval('.thumb', els => els.map(e => e.id));

  for (const id of ids) {
    const png = path.join(OUT, `thumb-${SUFFIX ? SUFFIX + '-' : ''}${id}.png`);
    const jpg = path.join(OUT, `thumb-${SUFFIX ? SUFFIX + '-' : ''}${id}.jpg`);
    const feed = path.join(OUT, `feed-${SUFFIX ? SUFFIX + '-' : ''}${id}.png`);

    await page.locator('#' + id).screenshot({ path: png });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png,
      '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '2', jpg]);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', png,
      '-vf', 'scale=210:118:flags=lanczos', feed]);

    const kb = n => (fs.statSync(n).size / 1024).toFixed(0);
    console.log(`${id}: thumb-${id}.png ${kb(png)} KB (2560x1440) · thumb-${id}.jpg ${kb(jpg)} KB (1280x720)`);
  }

  /* one sheet of all three at feed size, side by side, to compare legibility */
  const sheet = path.join(OUT, `feed-${SUFFIX ? SUFFIX + '-' : ''}comparison.png`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error',
    ...ids.flatMap(id => ['-i', path.join(OUT, `feed-${SUFFIX ? SUFFIX + '-' : ''}${id}.png`)]),
    '-filter_complex', `${ids.map((_, i) => `[${i}]pad=230:138:10:10:0x1A1A22[p${i}]`).join(';')};` +
      `${ids.map((_, i) => `[p${i}]`).join('')}hstack=inputs=${ids.length}`,
    sheet]);
  console.log(`feed-comparison.png — all ${ids.length} at sidebar size`);

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
