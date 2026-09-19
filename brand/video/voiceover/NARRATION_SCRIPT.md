# PDF Poster — narration script

Voice: **Chris** (ElevenLabs, `eleven_multilingual_v2`) — *timings below are from a local `say` proxy, not the final voice*.

`tts` differs from the on-screen wording where speech needs it: URLs are spoken
("WordPress dot org"), and `bPlugins` is hyphenated so it is not read as one word.

## Intro — 17.8 s

Tone: friendly tutorial — warm, unhurried, a touch of lift on the product name

| Start | Window | Spoken | Fit | Line | On screen |
|---|---|---|---|---|---|
| `04.15` | 6.60 s | 6.19 s | ✅ 0.41 s spare | Learn how to display a PDF with a watermark, efficiently, with PDF Poster by bPlugins. | Topic card: "Display a PDF with a watermark, efficiently" beside the document page, with the CONFIDENTIAL wash fading in at 5.15s |
| `11.85` | 5.15 s | 4.89 s | ✅ 0.26 s spare | Make sure you have installed and activated the latest version of the PDF Poster plugin. | Prerequisites card: three green checks and the mock WordPress plugin row showing Active / Up to date |

**Verification** — speech/silence measured back off the rendered audio

| Scheduled | Detected onset | Drift |
|---|---|---|
| `04.15` | 4.15 s | on time (+0.00s) |
| `11.85` | 11.86 s | on time (+0.01s) |

| Speech region | Duration |
|---|---|
| 4.15 s → 7.46 s | 3.30 s |
| 7.75 s → 9.31 s | 1.56 s |
| 9.69 s → 10.29 s | 0.60 s |
| 11.86 s → 16.71 s | 4.85 s |

**Files**

- `voiceover/_proxy/intro/intro-<start>.mp3` — one MP3 per segment
- `voiceover/_proxy/intro-narration.mp3` — full length, pre-aligned to the video
- `voiceover/_proxy/pdf-poster-intro-vo.mp4` — muxed, video stream copied

## Outro — 12.0 s

Tone: friendly tutorial — warm sign-off, clear on the calls to action

| Start | Window | Spoken | Fit | Line | On screen |
|---|---|---|---|---|---|
| `00.80` | 1.30 s | 0.89 s | ✅ 0.41 s spare | Thanks for watching! | "Thanks for watching" eyebrow and headline wiping in |
| `02.10` | 3.00 s | 2.86 s | ✅ 0.14 s spare | PDF Poster is free on WordPress.org. | Download row on screen: wordpress.org/plugins/pdf-poster |
| `05.10` | 3.70 s | 3.42 s | ✅ 0.28 s spare | Docs and support are at bplugins.com. | Docs and support rows both visible |
| `08.80` | 1.90 s | 1.73 s | ✅ 0.17 s spare | Subscribe for more tutorials. | Subscribe slot pulsing, watch-next panels to its right |
| `10.70` | 1.30 s | 1.16 s | ✅ 0.14 s spare | See you in the next one! | Static hold — brand bar and end-screen slots |

**Verification** — speech/silence measured back off the rendered audio

| Scheduled | Detected onset | Drift |
|---|---|---|
| `00.80` | 0.83 s | on time (+0.03s) |
| `02.10` | 2.10 s | on time (+0.00s) |
| `05.10` | — | runs on from the previous line |
| `08.80` | 8.81 s | on time (+0.01s) |
| `10.70` | — | runs on from the previous line |

| Speech region | Duration |
|---|---|
| 0.83 s → 1.64 s | 0.81 s |
| 2.10 s → 6.96 s | 4.86 s |
| 7.40 s → 8.49 s | 1.08 s |
| 8.81 s → 12.00 s | 3.19 s |

**Files**

- `voiceover/_proxy/outro/outro-<start>.mp3` — one MP3 per segment
- `voiceover/_proxy/outro-narration.mp3` — full length, pre-aligned to the video
- `voiceover/_proxy/pdf-poster-outro-vo.mp4` — muxed, video stream copied

---

Regenerate with `node brand/video/voiceover.js` (needs `ELEVENLABS_API_KEY=sk_…`).
Edit wording or timing in `brand/video/narration.json` — this file is generated from it.
