#!/usr/bin/env node
/**
 * Renders intro.html / outro.html to 1920x1080 MP4.
 *
 *   node brand/video/render.js            # both scenes
 *   node brand/video/render.js intro      # one scene
 *   node brand/video/render.js outro 60   # one scene at 60fps
 *
 * Every CSS animation is paused and seeked frame by frame, so the output is
 * deterministic — no real-time screen recording, no dropped frames.
 * Needs: playwright (already in the plugin's node_modules) and ffmpeg on PATH.
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const ROOT = __dirname;
const { chromium } = require(path.join(ROOT, '../../node_modules/playwright'));

const SCENES = {
  intro: 'intro.html',
  'intro-analytics': 'intro-analytics.html',
  outro: 'outro.html',
};

async function render(scene, fps) {
  const file = path.join(ROOT, SCENES[scene]);
  const out = path.join(ROOT, `pdf-poster-${scene}.mp4`);
  const poster = path.join(ROOT, `pdf-poster-${scene}-still.png`);

  // prefer Playwright's own Chromium; fall back to the installed Google Chrome
  let browser;
  try { browser = await chromium.launch(); }
  catch (e) { browser = await chromium.launch({ channel: 'chrome' }); }
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  await page.goto('file://' + file + '?capture=1', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.sceneReady);
  await page.waitForTimeout(400); // let webfonts paint

  const duration = await page.evaluate(() => window.SCENE_DURATION);
  const frames = Math.round(duration * fps);

  const ff = spawn('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    '-r', String(fps), out,
  ]);
  ff.stderr.on('data', d => process.stderr.write(d));
  const done = new Promise((res, rej) => {
    ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c))));
  });

  process.stdout.write(`${scene}: ${frames} frames @ ${fps}fps `);
  for (let i = 0; i < frames; i++) {
    await page.evaluate(t => window.seek(t), i / fps);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 30 === 0) process.stdout.write('.');
  }
  ff.stdin.end();
  await done;

  // hold frame — thumbnail / freeze-frame extension in the editor
  await page.evaluate(t => window.seek(t), scene.startsWith('intro') ? 7.0 : 6.0);
  await page.screenshot({ path: poster, type: 'png' });

  await browser.close();
  const mb = (fs.statSync(out).size / 1048576).toFixed(1);
  console.log(` -> ${path.basename(out)} (${mb} MB) + ${path.basename(poster)}`);
}

(async () => {
  const arg = process.argv[2];
  const fps = Number(process.argv[3]) || 30;
  const list = arg && SCENES[arg] ? [arg] : Object.keys(SCENES);
  for (const s of list) await render(s, fps);
})().catch(e => { console.error(e); process.exit(1); });
