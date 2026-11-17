# Sola Scriptura: Case Studies — slides

Programmatic PowerPoint decks for the sermon series. Every slide is native
PowerPoint shapes and text except three rasters: the parchment texture, the
cathedral photo, the P46 manuscript ink, and the paper/red-block textures. The build
stores each repeated image once (`lib/dedupe_media.js`), keeping decks around 6 MB.

```bash
npm install
npm run build -- 03            # one sermon → Keynote file in its Dropbox folder
npm run build -- 03 --no-publish   # dist/*.pptx only, touches nothing in Dropbox
npm run build -- 03 --force    # also overwrite a deck edited in Keynote since the last build
npm run build                  # every sermon not yet marked taught
npm run render -- 03           # one PNG per slide in dist/render/, to check before publishing
npm run keynote-diff -- 03     # what was changed in Keynote since the source was built
npm run audio-cover            # the "AUDIO ONLY" still for audio uploads
python3 scripts/make_assets.py   # regenerate the rasters (rarely needed)
npm test               # unit tests for build helpers
```

`dist/`, `node_modules/` and `.last-build.json` are not committed, so a fresh checkout
needs `npm install` and has no record of earlier builds: it will refuse to overwrite any
Keynote deck that already exists until you run `keynote-diff`, bring the edits in, and
build with `--force`.

## Layout

- `lib/theme.js` — colours, fonts, asset sizes. Change the look here.
- `lib/slides.js` — the slide types (`cover`, `sermonTitle`, `movement`, `scripture`, `quote`, `definition`, `cards`, `compare`, `hierarchy`, `conclusion`, `outline`, `phrase`, `statement`, `interlude`, `proofs`, `discussion`, `nextWeek`). `proofs` sets a creed line by line beside the Scripture each line draws on, running onto further slides as needed; pass `pages: n` to fit it on exactly n slides at the largest type that fits (short reference lists get a wider creed column). `interlude` is a dark transition slide within a movement that previews the witnesses that follow; `discussion` questions can be strings or `{ text, sub: [...] }` for lettered follow-ups.
- `series.js` — the series plan (titles, passages, opening questions, read-ahead passages). Title slides and the closing "next week" slide read from it; add the next sermon there and the previous deck's closing slide fills itself in.
- `sermons/NN-*.js` — one file per sermon: content only.
- `lib/slide_text.js`, `keynote_diff.js` — read the text of a deck and compare the Keynote copy with the source build.
- `lib/publish.js` — saves each deck as `<file>.key` in `<folder>` (both from `series.js`) under the ministry Dropbox's `College Hour/FA26`. Set `SLIDES_OUTPUT_ROOT` to publish somewhere else.

## Editing in Keynote

The sermon files are the source of truth. The build won't overwrite a Keynote deck that was changed after it last wrote it; it prints `skipped …` instead. Run `npm run keynote-diff -- NN` to see the text that differs (it opens the Keynote deck read-only), bring those edits into the sermon source (or `series.js` / `lib/slides.js`), run it again until it prints `MATCHES KEYNOTE`, then run `npm run build -- NN --force`. The diff compares text and speaker notes only; a change to layout or size in Keynote does not show.

## Taught decks

Once a sermon has been taught, set `taught: true` on it in `series.js`. The build still writes its `.pptx` to `dist/` but leaves the Keynote file alone, so later changes to the slide types or the series plan can't alter a deck that was already used. `--include-taught` (with `--force`) republishes one on purpose.

- `assets/manuscript-*.png` — ink lifted off a real P46 leaf (sepia, plus a pale twin for red blocks) (Romans 11:24–33; Philippians 4:14–Colossians 1:2), so the background Greek is authentic.

## Conventions

- **Rhythm:** each sermon runs I. the theological question → II. the biblical evidence → III. the doctrinal conclusion. `deck.movement(n, question)` opens each movement; a tracker at the top of content slides shows where you are.
- **Red means Scripture.** `scripture()` slides get the red block, large upright type, and red emphasis (`*phrase*`). `quote()` slides — creeds, confessions, councils, theologians — are quieter: framed card, smaller italic umber, and a red "Normed by Scripture" line. The visual hierarchy is the argument: *norma normans* over *norma normata*.
- **Footnotes on quotes:** in `quote()` text, mark a phrase as `[phrase]^n` and pass `normedBy` as a list of references. Each phrase gets a red dotted underline and a red superscript *n*, keyed to reference *n* in the card's "Normed by Scripture" row. A number can be reused for two phrases. The build fails if a number has no reference or a reference has no phrase.
- Scripture text is the ESV. The "ESV" tag on each Scripture slide is the short notice Crossway allows for church slides; the full copyright notice is in each Scripture slide's speaker notes.

## Audio-only cover

`npm run audio-cover` builds the series cover with an "AUDIO ONLY" label (`cover({ badge })`) as a 1920×1080 PNG, the still image for audio uploads to the website and YouTube. It is saved to `dist/` and copied to the series folder in Dropbox (`--no-publish` skips the copy). Keynote's own image export is fixed at 960×540, so the script exports a PDF and rasterizes it with `scripts/pdf_to_png.swift`.

## Simple mode

Decks are simple unless a sermon module exports `simple: false` (only deck 01 does, to stay as it was taught). A simple deck drops the peripheral text: movement tracker, sermon tag, footer and slide number, kickers ("THE WORD OF GOD · NORMA NORMANS" etc.), the ESV tag, quote sources and footnote lines, the conclusion's method line, and the hierarchy's Latin. Sources, footnotes and method lines move to the speaker notes. Each slide is just the verse, the quote, or the heading. Added after feedback on deck 01 that the extra text distracted and that unexplained labels ("Norma normans") read as random text.

In simple mode type is also kept readable from the back of the room: Scripture 40–48pt, quotations 32–36pt (one size per quotation), larger comparison and hierarchy type. Text that would not fit at those sizes runs onto further slides (`lib/paginate.js`) rather than shrinking or being cut: it breaks at a sentence end or clause near an even split, never inside a footnoted phrase, with an ellipsis marking the continuation. A continued quotation lists only the references its own footnoted phrases use. Discussion is the exception: each discussion section stays on one slide, so its type is fitted to the space (34pt down to 18pt) instead of paginating.
