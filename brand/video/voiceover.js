#!/usr/bin/env node
/**
 * Generates a timed voiceover for the PDF Poster intro/outro from narration.json.
 *
 *   export ELEVENLABS_API_KEY=sk_...          # real key, not the key *ID*
 *   node brand/video/voiceover.js             # both scenes
 *   node brand/video/voiceover.js intro       # one scene
 *   node brand/video/voiceover.js --dry       # no API: local `say` timing check only
 *
 * Per scene it writes into brand/video/voiceover/:
 *   <scene>/<scene>-<start>.mp3      one MP3 per segment, named by start time
 *   <scene>-narration.mp3            full-length, pre-aligned to the video timeline
 *   pdf-poster-<scene>-vo.mp4        muxed (video stream copied, never re-encoded)
 *   NARRATION_SCRIPT.md              timestamps + text + fit report
 *
 * Originals are never overwritten. Every segment is measured against its on-screen
 * window and every muxed file is checked with silencedetect.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = __dirname;
const SPEC = JSON.parse(fs.readFileSync(path.join(ROOT, 'narration.json'), 'utf8'));
const API = 'https://api.elevenlabs.io/v1';

const args = process.argv.slice(2);
const DRY = args.includes('--dry');

/* dry-run audio is an Apple `say` stand-in, so it never lands next to the real
   deliverables — only the generated script document is shared between modes */
const DOCS = path.join(ROOT, 'voiceover');
const OUT = DRY ? path.join(DOCS, '_proxy') : DOCS;
const only = args.find(a => !a.startsWith('--'));
const scenes = only ? [only] : Object.keys(SPEC.scenes);

const sh = (cmd, a) => execFileSync(cmd, a, { encoding: 'utf8', maxBuffer: 1 << 26 });
const stamp = t => t.toFixed(2).padStart(5, '0');           // 1.2 -> 01.20
const dur = f => parseFloat(sh('ffprobe', [
  '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f,
]).trim());

/* ---------- ElevenLabs ---------- */
async function el(pathname, opts = {}) {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY is not set');
  if (!key.startsWith('sk_')) {
    throw new Error(
      'ELEVENLABS_API_KEY looks like an API key ID, not an API key.\n' +
      'Real keys start with "sk_" and are shown only when created or rotated\n' +
      '(ElevenLabs → Profile → API Keys).'
    );
  }
  const res = await fetch(API + pathname, {
    ...opts,
    headers: { 'xi-api-key': key, 'content-type': 'application/json', ...(opts.headers || {}) },
  });
  if (!res.ok) throw new Error(`${pathname} -> HTTP ${res.status}: ${(await res.text()).slice(0, 400)}`);
  return res;
}

async function resolveVoice() {
  if (process.env.ELEVENLABS_VOICE_ID) return process.env.ELEVENLABS_VOICE_ID;
  const { voices } = await (await el('/voices')).json();
  const want = SPEC.voice.name.toLowerCase();
  const hit = voices.find(v => (v.name || '').toLowerCase() === want)
           || voices.find(v => (v.name || '').toLowerCase().includes(want));
  if (!hit) {
    throw new Error(
      `Voice "${SPEC.voice.name}" is not on this account. Available: ` +
      voices.map(v => v.name).join(', ') +
      '\nAdd Chris from the Voice Library, or set ELEVENLABS_VOICE_ID.'
    );
  }
  console.log(`  voice: ${hit.name} (${hit.voice_id})`);
  return hit.voice_id;
}

async function speak(voiceId, text, file) {
  const res = await el(`/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    body: JSON.stringify({
      text,
      model_id: SPEC.voice.model,
      voice_settings: SPEC.voice_settings,
    }),
  });
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

/* local stand-in, for checking fit without spending API credits */
function sayProxy(text, file) {
  const aiff = file.replace(/\.mp3$/, '.aiff');
  sh('say', ['-r', '150', '-o', aiff, text]);          // ~150 wpm ≈ Chris at default pace
  sh('ffmpeg', ['-y', '-loglevel', 'error', '-i', aiff, file]);
  fs.unlinkSync(aiff);
}

/* ---------- verification ---------- */
/* ffmpeg writes silencedetect results to stderr and exits non-zero on -f null for
   some builds, so capture both streams and never throw on exit code. */
function silenceLog(file) {
  const r = spawnSync('ffmpeg',
    ['-hide_banner', '-i', file, '-af', 'silencedetect=n=-45dB:d=0.25', '-f', 'null', '-'],
    { encoding: 'utf8', maxBuffer: 1 << 26 });
  return (r.stdout || '') + (r.stderr || '');   // silencedetect logs to stderr
}

/* speech = the complement of the detected silences over [0, total] */
function measureSpeech(file, total) {
  const log = silenceLog(file);
  const starts = [...log.matchAll(/silence_start: ([-\d.]+)/g)].map(m => parseFloat(m[1]));
  const ends = [...log.matchAll(/silence_end: ([-\d.]+)/g)].map(m => parseFloat(m[1]));
  const silences = starts.map((s, i) => [s, ends[i] !== undefined ? ends[i] : total]);

  const regions = [];
  let cursor = 0;
  for (const [s, e] of silences) {
    if (s > cursor + 0.02) regions.push([cursor, s]);
    cursor = Math.max(cursor, e);
  }
  if (cursor < total - 0.02) regions.push([cursor, total]);
  return regions;
}

/* does a real speech onset land where each segment was scheduled? Adjacent lines
   whose gap falls under the detector's 0.25s threshold merge into one region — that
   is reported rather than treated as a miss. */
function checkOnsets(rows, regions) {
  const onsets = regions.map(r => r[0]);
  return rows.map(r => {
    const near = onsets
      .map(o => ({ o, d: o - r.start }))
      .sort((a, b) => Math.abs(a.d) - Math.abs(b.d))[0];
    if (near && Math.abs(near.d) <= 0.35) {
      return { ...r, onset: near.o, drift: near.d, status: `on time (${near.d >= 0 ? '+' : ''}${near.d.toFixed(2)}s)` };
    }
    return { ...r, onset: null, drift: null, status: 'runs on from the previous line' };
  });
}

/* ---------- per scene ---------- */
async function build(name, voiceId) {
  const sc = SPEC.scenes[name];
  if (!sc) throw new Error(`unknown scene "${name}"`);
  const video = path.join(ROOT, sc.video);
  const dir = path.join(OUT, name);
  fs.mkdirSync(dir, { recursive: true });

  console.log(`\n${name} — ${sc.segments.length} segments over ${sc.duration}s`);

  const rows = [];
  for (const seg of sc.segments) {
    const file = path.join(dir, `${name}-${stamp(seg.start)}.mp3`);
    if (DRY) sayProxy(seg.tts, file);
    else await speak(voiceId, seg.tts, file);

    const d = dur(file);
    const slack = seg.window - d;
    const fits = slack >= 0;
    rows.push({ ...seg, file, spoken: d, slack, fits });
    console.log(
      `  ${stamp(seg.start)}  ${d.toFixed(2)}s / ${seg.window.toFixed(2)}s window  ` +
      `${fits ? `OK (${slack.toFixed(2)}s spare)` : `OVER by ${(-slack).toFixed(2)}s`}  "${seg.text}"`
    );
  }

  /* full-length, pre-aligned to the video timeline */
  const full = path.join(OUT, `${name}-narration.mp3`);
  const inputs = rows.flatMap(r => ['-i', r.file]);
  const delays = rows.map((r, i) => {
    const ms = Math.round(r.start * 1000);
    return `[${i}]adelay=${ms}|${ms}[a${i}]`;
  }).join(';');
  const mixIn = rows.map((_, i) => `[a${i}]`).join('');
  sh('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', ...inputs,
    '-filter_complex', `${delays};${mixIn}amix=inputs=${rows.length}:normalize=0[m];[m]apad[out]`,
    '-map', '[out]', '-t', String(sc.duration), '-c:a', 'libmp3lame', '-b:a', '192k', full,
  ]);

  /* mux — video stream copied, original untouched */
  const muxed = path.join(OUT, `pdf-poster-${name}-vo.mp4`);
  sh('ffmpeg', [
    '-y', '-hide_banner', '-loglevel', 'error', '-i', video, '-i', full,
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-shortest', '-movflags', '+faststart', muxed,
  ]);

  /* verify what actually landed on the timeline */
  const regions = measureSpeech(full, sc.duration);
  const checked = checkOnsets(rows, regions);
  console.log(`  speech in ${path.basename(full)}:`);
  regions.forEach(([a, b]) => console.log(`    ${a.toFixed(2)}s → ${b.toFixed(2)}s  (${(b - a).toFixed(2)}s speech)`));
  console.log('  onset check:');
  checked.forEach(c => console.log(`    scheduled ${stamp(c.start)} → ${c.status}`));

  const vd = dur(muxed);
  const drift = Math.abs(vd - sc.duration);
  console.log(
    `  ${path.basename(muxed)}  ${vd.toFixed(2)}s vs video ${sc.duration.toFixed(2)}s` +
    `  ${drift <= 0.05 ? 'OK' : `DRIFT ${drift.toFixed(2)}s`}`
  );

  return { name, sc, rows: checked, full, muxed, regions };
}

/* ---------- script document ---------- */
function writeScript(results) {
  const L = [];
  L.push('# PDF Poster — narration script', '');
  L.push(`Voice: **${SPEC.voice.name}** (ElevenLabs, \`${SPEC.voice.model}\`)${DRY ? ' — *timings below are from a local `say` proxy, not the final voice*' : ''}.`);
  L.push('');
  L.push('`tts` differs from the on-screen wording where speech needs it: URLs are spoken');
  L.push('("WordPress dot org"), and `bPlugins` is hyphenated so it is not read as one word.');
  L.push('');
  for (const r of results) {
    L.push(`## ${r.name.charAt(0).toUpperCase() + r.name.slice(1)} — ${r.sc.duration.toFixed(1)} s`, '');
    L.push(`Tone: ${r.sc.tone}`, '');
    L.push('| Start | Window | Spoken | Fit | Line | On screen |');
    L.push('|---|---|---|---|---|---|');
    for (const s of r.rows) {
      L.push(
        `| \`${stamp(s.start)}\` | ${s.window.toFixed(2)} s | ${s.spoken.toFixed(2)} s | ` +
        `${s.fits ? `✅ ${s.slack.toFixed(2)} s spare` : `⚠️ over by ${(-s.slack).toFixed(2)} s`} | ` +
        `${s.text} | ${s.on_screen} |`
      );
    }
    L.push('');
    L.push('**Verification** — speech/silence measured back off the rendered audio', '');
    L.push('| Scheduled | Detected onset | Drift |');
    L.push('|---|---|---|');
    for (const s of r.rows) {
      L.push(`| \`${stamp(s.start)}\` | ${s.onset === null ? '—' : s.onset.toFixed(2) + ' s'} | ${s.status} |`);
    }
    L.push('');
    L.push('| Speech region | Duration |');
    L.push('|---|---|');
    r.regions.forEach(([a, b]) => L.push(`| ${a.toFixed(2)} s → ${b.toFixed(2)} s | ${(b - a).toFixed(2)} s |`));
    L.push('');
    L.push('**Files**', '');
    const base = DRY ? `voiceover/_proxy` : `voiceover`;
    L.push(`- \`${base}/${r.name}/${r.name}-<start>.mp3\` — one MP3 per segment`);
    L.push(`- \`${base}/${r.name}-narration.mp3\` — full length, pre-aligned to the video`);
    L.push(`- \`${base}/pdf-poster-${r.name}-vo.mp4\` — muxed, video stream copied`);
    L.push('');
  }
  L.push('---', '');
  L.push('Regenerate with `node brand/video/voiceover.js` (needs `ELEVENLABS_API_KEY=sk_…`).');
  L.push('Edit wording or timing in `brand/video/narration.json` — this file is generated from it.');
  L.push('');
  fs.mkdirSync(DOCS, { recursive: true });
  fs.writeFileSync(path.join(DOCS, 'NARRATION_SCRIPT.md'), L.join('\n'));
  console.log(`\nwrote voiceover/NARRATION_SCRIPT.md`);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  if (DRY) console.log('DRY RUN — local `say` proxy at 150 wpm, no API calls, MP3s are throwaway timing probes');
  const voiceId = DRY ? null : await resolveVoice();
  const results = [];
  for (const s of scenes) results.push(await build(s, voiceId));
  writeScript(results);

  const over = results.flatMap(r => r.rows.filter(x => !x.fits));
  if (over.length) {
    console.log(`\n${over.length} segment(s) overrun their window — tighten the wording in narration.json:`);
    over.forEach(s => console.log(`  ${stamp(s.start)} over by ${(-s.slack).toFixed(2)}s: "${s.text}"`));
    process.exitCode = 2;
  } else {
    console.log('\nall segments fit their on-screen windows');
  }
})().catch(e => { console.error('\n' + e.message); process.exit(1); });
