#!/usr/bin/env node
/**
 * Joins intro + tutorial recording + outro into one upload-ready MP4.
 *
 *   node brand/video/assemble.js <recording.mp4> [--intro <scene>] [--out <file>]
 *
 *   node brand/video/assemble.js ~/Downloads/analytics-video.mp4 --intro intro-analytics
 *
 * Narration is picked up automatically: if voiceover/<scene>-narration.mp3 exists it is
 * laid under that card, otherwise the card runs silent. The recording keeps its own audio
 * either way, and the source file is never modified.
 *
 * Output matches the recording's resolution and frame rate, so screen-recorded text stays
 * pixel-exact instead of being resampled.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = __dirname;
const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf('--' + name);
  return i === -1 ? def : args[i + 1];
};

const recording = (args.find(a => !a.startsWith('--') && !args[args.indexOf(a) - 1]?.startsWith('--')) || '')
  .replace(/^~/, os.homedir());
if (!recording) {
  console.error('usage: node assemble.js <recording.mp4> [--intro <scene>] [--out <file>]');
  process.exit(1);
}
const introScene = flag('intro', 'intro');
const outroScene = 'outro';

const probe = (f, spec) => execFileSync('ffprobe',
  ['-v', 'error', '-select_streams', 'v:0', '-show_entries', spec, '-of', 'csv=p=0', f],
  { encoding: 'utf8' }).trim();
const dur = f => parseFloat(execFileSync('ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f],
  { encoding: 'utf8' }).trim());
const hasAudio = f => execFileSync('ffprobe',
  ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', f],
  { encoding: 'utf8' }).trim().length > 0;

/* segment list: video file + the narration to lay under it, if any */
function segment(scene) {
  const video = path.join(ROOT, `pdf-poster-${scene}.mp4`);
  if (!fs.existsSync(video)) throw new Error(`missing ${path.basename(video)} — run: node brand/video/render.js ${scene} 60`);
  const vo = path.join(ROOT, 'voiceover', `${scene}-narration.mp3`);
  return { video, narration: fs.existsSync(vo) ? vo : null, scene };
}

const segs = [segment(introScene), { video: recording, narration: null, scene: 'recording' }, segment(outroScene)];

const [w, h] = probe(recording, 'stream=width,height').split(',').map(Number);
const fpsRaw = probe(recording, 'stream=r_frame_rate');
const fps = eval(fpsRaw);                                  // e.g. "60/1"
const out = (flag('out') || path.join(path.dirname(recording),
  path.basename(recording).replace(/\.\w+$/, '') + '-final.mp4')).replace(/^~/, os.homedir());
if (path.resolve(out) === path.resolve(recording)) throw new Error('refusing to overwrite the source recording');

console.log(`target: ${w}x${h} @ ${fps}fps`);
for (const s of segs) {
  console.log(`  ${s.scene.padEnd(16)} ${dur(s.video).toFixed(2)}s  ` +
    `${s.narration ? 'narration: ' + path.basename(s.narration)
      : (hasAudio(s.video) ? 'own audio' : 'silent')}`);
}
const total = segs.reduce((t, s) => t + dur(s.video), 0);
console.log(`  ${'total'.padEnd(16)} ${total.toFixed(2)}s`);

/* build the graph: every segment normalised to the same size, fps, pixel format,
   sample rate and channel layout, then concatenated in one pass */
const inputs = [];
const filters = [];
let idx = 0;
const streams = [];

for (const s of segs) {
  const vIdx = idx++;
  inputs.push('-i', s.video);
  filters.push(
    `[${vIdx}:v]scale=${w}:${h}:flags=lanczos,setsar=1,fps=${fps},format=yuv420p[v${vIdx}]`
  );

  let aLabel;
  if (s.narration) {
    const aIdx = idx++;
    inputs.push('-i', s.narration);
    filters.push(`[${aIdx}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,` +
      `apad,atrim=0:${dur(s.video)}[a${vIdx}]`);
    aLabel = `a${vIdx}`;
  } else if (hasAudio(s.video)) {
    filters.push(`[${vIdx}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,` +
      `apad,atrim=0:${dur(s.video)}[a${vIdx}]`);
    aLabel = `a${vIdx}`;
  } else {
    const nIdx = idx++;
    inputs.push('-f', 'lavfi', '-t', String(dur(s.video)), '-i', 'anullsrc=r=48000:cl=stereo');
    filters.push(`[${nIdx}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[a${vIdx}]`);
    aLabel = `a${vIdx}`;
  }
  streams.push(`[v${vIdx}][${aLabel}]`);
}

filters.push(`${streams.join('')}concat=n=${segs.length}:v=1:a=1[vout][aout]`);

console.log('\nencoding…');
const r = spawnSync('ffmpeg', [
  '-y', '-hide_banner', '-loglevel', 'error', '-stats', ...inputs,
  '-filter_complex', filters.join(';'),
  '-map', '[vout]', '-map', '[aout]',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000',
  '-movflags', '+faststart', out,
], { stdio: ['ignore', 'inherit', 'inherit'] });
if (r.status !== 0) process.exit(r.status || 1);

/* verify what came out, and where each cut landed */
const outDur = dur(out);
console.log(`\n${path.basename(out)}  ${outDur.toFixed(2)}s  ` +
  `${probe(out, 'stream=width,height').replace(',', 'x')} @ ${eval(probe(out, 'stream=r_frame_rate'))}fps  ` +
  `${(fs.statSync(out).size / 1048576).toFixed(1)} MB`);
const drift = Math.abs(outDur - total);
console.log(drift <= 0.15 ? `duration matches the sum of the parts` : `DRIFT ${drift.toFixed(2)}s vs expected ${total.toFixed(2)}s`);

let at = 0;
console.log('\ncut points:');
for (const s of segs) {
  const m = n => `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, '0')}`;
  console.log(`  ${m(at)}  ${s.scene}`);
  at += dur(s.video);
}
console.log(`  ${Math.floor(at / 60)}:${String(Math.floor(at % 60)).padStart(2, '0')}  end`);
console.log(`\n${out}`);
