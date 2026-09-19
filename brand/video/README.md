# PDF Poster — tutorial intro & outro

Reusable opening and closing sequences for every PDF Poster tutorial video.
Built from the bPlugins brand (`#146EF5` blue, `#FF7A00` orange, `#070127` ink),
the plugin's WordPress.org icon, and the bPlugins logo.

## Files

| File | What it is |
|---|---|
| `intro.html` | Intro, 1920×1080, **17.8 s** — brand sting + topic card + prerequisites |
| `outro.html` | Outro / end card, 1920×1080, **12.0 s** |
| `pdf-poster-intro.mp4` | Rendered intro, H.264, 30 fps |
| `pdf-poster-outro.mp4` | Rendered outro, H.264, 30 fps |
| `pdf-poster-intro-still.png` | Intro hold frame (thumbnails, freeze-frame) |
| `pdf-poster-outro-still.png` | Outro hold frame (thumbnails, freeze-frame) |
| `render.js` | Frame-accurate HTML → MP4 renderer |
| `pdf-poster-icon.svg` | Product icon, straight from WordPress.org |
| `bplugins-logo-light.svg` | bPlugins logo, light version for dark grounds |

Drop the two MP4s on the timeline — intro at the head, outro at the tail. Nothing else needed.

## Beat sheet

**Intro (17.8 s)** — three scenes. Only scene 2 changes between videos.

| Time | Scene | Beat |
|---|---|---|
| 0.0–1.1 s | 1 · brand sting | Light sweep; ruled-page texture fades up |
| 0.3–1.3 s | | Product icon lands |
| 1.0–2.3 s | | Page turns inside the icon — the product's own motion |
| 1.1–1.9 s | | "PDF Poster" wipes in, orange rule draws |
| 2.0–3.0 s | | Tagline and bPlugins lockup |
| 3.2–3.65 s | | Scene lifts away |
| 3.5–4.5 s | 2 · topic | Headline, rule and subline stagger in |
| 4.05–4.9 s | | Document page settles in from the right |
| 5.15–6.25 s | | **The CONFIDENTIAL wash fades over the page** — the tutorial's subject, shown not stated |
| 6.1 s | | Watermark settings chip appears |
| 10.95–11.4 s | | Scene lifts away |
| 11.25–12.4 s | 3 · prerequisites | Headline, then the three checks tick in |
| 11.85 s | | Mock WordPress plugin row rises — Active, up to date |
| 12.4–17.1 s | | Hold |
| 17.1–17.8 s | | Fade to ink — clean cut point |

Scenes 2 and 3 carry a persistent bottom bar (product lockup left, bPlugins right) so
branding never leaves frame.

**Outro (12.0 s)** — fully settled by 3.0 s, then holds. Start it at least 20 s before
the video ends if you want YouTube end-screen elements on it.

| Time | Beat |
|---|---|
| 0.2–1.1 s | "Thanks for watching" / "Now go embed that PDF." |
| 1.2–1.6 s | The three links stagger in |
| 1.6–2.3 s | End-screen slots and brand bar |
| 3.0–12.0 s | Static hold, ambient glow only |

### YouTube end-screen slots

The outro reserves three zones for real end-screen elements, so they land on
designed panels instead of on top of the artwork:

- **Two 16:9 panels**, right side — video / playlist elements
- **One circle**, left of them — the subscribe element

Place them in YouTube Studio → Editor → End screen, snapped to those panels. If you
skip them, the panels still read as intentional framing.

## Editing the scenes

Everything is one self-contained HTML file — no build step, no dependencies.
Open `intro.html` in a browser to preview it (click or press **R** to replay).

Common edits, all near the top of each file:

- **Copy** — the `.tagline`, `.chip`, `h1` and `.row .v` text in the markup.
- **Colour** — the `:root` block. Brand tokens are named (`--blue`, `--orange`, `--ink`).
- **Timing** — each animation's `delay` value in its CSS rule; keep the order of beats.
- **Duration** — `window.SCENE_DURATION` at the bottom of the file, so the renderer
  knows how long to record.

## Retitling for another tutorial

Scene 2 is the only part that changes between videos. In `intro.html`, find the block
marked `SCENE 2 · what this tutorial covers` and edit four things:

- the **eyebrow** (`In this tutorial`)
- the **headline** — keep it to two lines at 84px, roughly 30 characters a line, and wrap
  the emphasised words in `<em>` for the orange gradient
- the **subline**
- the **badge** on the document (`Watermark: text · diagonal · 50%`)

Swap the document artwork for whatever the new topic shows. The current page is the
plugin's own `assets/admin/img/watermark/confidential.svg` preset, scaled up, with the
watermark pattern on its own `.wm` layer so it can fade in separately.

Then update the intro's two lines in `narration.json`, run `voiceover.js --dry` to confirm
they still fit, and re-render both the video and the voiceover.

Scenes 1 and 3 are reusable as they are — the prerequisites card says "latest version"
rather than naming one, so it does not go stale on a plugin release.

## Re-rendering the MP4s

Needs `ffmpeg` on PATH and the plugin's `node_modules` (Playwright) installed.

```bash
node brand/video/render.js            # both scenes at 30 fps
node brand/video/render.js intro      # one scene
node brand/video/render.js outro 60   # one scene at 60 fps
```

The renderer pauses every CSS animation and seeks frame by frame, so output is
deterministic — no screen recording, no dropped frames, identical every run.

### Other formats

```bash
# ProRes 4444 for Final Cut / Premiere
ffmpeg -i pdf-poster-intro.mp4 -c:v prores_ks -profile:v 4 pdf-poster-intro.mov

# Silent stereo track, if your editor insists on one
ffmpeg -i pdf-poster-intro.mp4 -f lavfi -i anullsrc=r=48000:cl=stereo \
       -shortest -c:v copy -c:a aac pdf-poster-intro-audio.mp4
```

## Note

`brand/` is excluded from the release ZIP via `.distignore` — these are brand
assets, not plugin code, and never ship to WordPress.org.

## Voiceover

Narration is scripted in [`narration.json`](narration.json) — one entry per line, with the
on-screen window it has to fit inside — and generated by [`voiceover.js`](voiceover.js)
using the ElevenLabs **Chris** voice.

```bash
export ELEVENLABS_API_KEY=sk_…          # a real key, not the key ID
node brand/video/voiceover.js           # both scenes
node brand/video/voiceover.js outro     # one scene
node brand/video/voiceover.js --dry     # no API: local `say` timing check
```

Output lands in `voiceover/`:

| File | |
|---|---|
| `<scene>/<scene>-<start>.mp3` | One MP3 per segment, named by its start time |
| `<scene>-narration.mp3` | Full length, pre-aligned to the video timeline |
| `pdf-poster-<scene>-vo.mp4` | Muxed — video stream copied, never re-encoded |
| `NARRATION_SCRIPT.md` | Timestamps, text, fit report, measured speech regions |

The originals are never touched; narrated versions get a `-vo` suffix.

**How timing is checked.** Every line is measured against its window and reported as
fitting or overrunning. Then `silencedetect` reads the speech back off the rendered
audio and compares each detected onset to where it was scheduled — so the report
describes the actual file, not the intent. `--dry` does the same with Apple's `say`
at 150 wpm as a stand-in, which is slower than Chris, so anything that fits the dry
run has headroom in the real thing. Proxy audio is written to `voiceover/_proxy/`
and never mixed in with the real deliverables.

Two lines in the outro sit closer together than the 0.25 s silence threshold, so the
report marks them as running on from the previous line. That is accurate, not a fault.

### Editing narration

Change wording or timing in `narration.json`, run `--dry` to confirm the lines still
fit, then re-run for real. `NARRATION_SCRIPT.md` is generated, so don't hand-edit it.

The brand sting is deliberately silent — it is a visual identity beat, and narrating it
would push the topic line past the card that illustrates it. One line per card after that.

## Thumbnails

[`thumbnail.html`](thumbnail.html) holds three 1280×720 variants; [`thumbs.js`](thumbs.js)
renders each one.

```bash
node brand/video/thumbs.js
```

Output in `thumbnails/`:

| File | |
|---|---|
| `thumb-<v>.png` | 2560×1440 master (2×), so YouTube downscales from a sharp source |
| `thumb-<v>.jpg` | 1280×720 q92 — the file to upload (YouTube caps at 2 MB) |
| `feed-<v>.png` | 210×118 — the legibility check |
| `feed-comparison.png` | All three side by side at sidebar size |

**Variant A is the one to use.** "WATERMARK YOUR PDF" in two lines plus the stamped page,
which is the only variant whose subject still reads at 210px wide.

The page carries the plugin's own `confidential.svg` tile at 30% for texture *and* a single
large diagonal mark styled like the `draft.svg` preset — `#AF4A3D`, white outline, 62%
opacity. The first pass used only the fine tile and the page turned into a white blob in
the feed; the big mark is what makes the thumbnail legible small. Check `feed-comparison.png`
before shipping any edit.

Variant B (before/after) and C (stamped frame) are there for A/B testing. B is the weakest —
two pages at feed size lose their labels.

### Editing

Text lives in the markup, one block per variant. Keep the headline to two words a line at
127px: three words a line drops below the size that survives the feed. Nothing meaningful
should go in the bottom-right corner — YouTube stamps the duration badge there, which is
why the brand lockup sits bottom-left.

## Per-topic intros

`intro.html` is the watermark tutorial's intro. Each new topic gets its own copy, because
only scene 2 differs:

| File | Topic | Scene 2 artwork |
|---|---|---|
| `intro.html` | Display a PDF with a watermark | The `confidential.svg` preset page, watermark washing in |
| `intro-analytics.html` | Track PDF views and downloads | An Analytics card whose two chart series draw themselves in |

To add another, copy the closest existing intro, edit the block marked
`SCENE 2 · what this tutorial covers`, then register the new scene in two places:

- `render.js` → the `SCENES` map
- `narration.json` → a new entry under `scenes`, with its two lines

Then `node brand/video/render.js <scene> 60` and `node brand/video/voiceover.js <scene> --dry`.

**Watch the class names.** Scene 1 already uses `.tile` for the 276×276 product icon, so a
new card must not reuse it — the analytics dashboard's stat boxes are `.stat` for exactly
that reason. Everything lives in one stylesheet, so a repeated class silently inherits.

## Assembling the finished video

```bash
node brand/video/assemble.js ~/Downloads/analytics-video.mp4 --intro intro-analytics
```

Joins intro + recording + outro into `<recording>-final.mp4` beside the source. It:

- matches the **recording's** resolution and frame rate, so screen-recorded text is never
  resampled — render the cards to match first (`render.js <scene> 60` for a 60 fps recording)
- keeps the recording's own audio, and lays `voiceover/<scene>-narration.mp3` under each card
  when it exists, silence when it doesn't
- never touches the source file, and refuses to overwrite it
- prints the cut points and checks the output duration against the sum of the parts

Add `--out <file>` to choose the destination.
