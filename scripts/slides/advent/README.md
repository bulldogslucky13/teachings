# Advent (College Hour, FA26): slides

Programmatic Keynote decks for the Advent series, styled on the Advent template in
Dropbox (`College Hour/FA26/Advent/advent20-template.pptx`): the cover art full-bleed,
then white MORVA type on the coral paper background, with the ADVENT wordmark in the
bottom-right corner kept clear of text. The build machinery (publish, Keynote diff,
render, audio cover) is the same as `../sola-scriptura`; only the look and the slide
types differ.

MORVA must be installed (it is in `~/Library/Fonts`) for Keynote to show it.

```bash
npm install
npm run sample                 # sample deck of every slide type → dist/, never published
npm run build -- 01            # one week → Keynote file in its Dropbox folder
npm run build -- 01 --no-publish   # dist/*.pptx only, touches nothing in Dropbox
npm run build -- 01 --force    # also overwrite a deck edited in Keynote since the last build
npm run render -- 01           # one PNG per slide in dist/render/, to check before publishing
npm run keynote-diff -- 01     # what was changed in Keynote since the source was built
npm run audio-cover            # the "AUDIO ONLY" still for audio uploads
npm test                       # unit tests for build helpers
```

## Layout

- `lib/theme.js` — colours, MORVA, the two template images, and where the wordmark sits.
- `lib/slides.js` — the slide types: `cover`, `sermonTitle`, `statement`, `scripture`, `quote`, `discussion`, `nextWeek`, `todo`.
- `series.js` — the weeks: Hope (11/29) and Peace (12/6), each with its Dropbox folder. Fill in `passage` and `readAhead` from the transcript.
- `sermons/NN-*.js` — one file per week, content only. Each is ready for its transcript: a "to finish" slide marks where the teaching goes.
- `sample.js` — the sample deck, using the Peace week from the 2020 template.
- `lib/publish.js` — saves each deck as `<file>.key` in `<folder>` under `College Hour/FA26/Advent`. Set `SLIDES_OUTPUT_ROOT` to publish somewhere else.

## Slide types

- `statement({ text, ref })` — one sentence large and centred (60pt short, down to 42pt). `*phrase*` is gold.
- `scripture({ book, verses, text })` — ESV. Prose with verse numbers as `[n]`, set 48–40pt and running onto more slides past ~300 characters. Poetry: one line per `\n`, `|` at the start of an indented line; set at 40pt, split between couplets (preferably at a verse number) as evenly as the slides allow (`paginateLines` in `lib/paginate.js`). The reference heads each slide; the ESV notice is in the speaker notes.
- `quote({ text, attribution, source })` — 36/32pt, centred; the source goes to the speaker notes.
- `discussion({ label, questions })` — always one slide, questions fitted 34pt down to 18pt. The build flags a section that only fits near the bottom of that range.
- `nextWeek(series, number)` — next week's theme and read-ahead passages from `series.js`.

The standing slide rules (one thing to read per slide, sizes for the back row, never
cut text to fit, one slide per discussion) are in the `sermon-slides` skill and built in
here as they are in `../sola-scriptura`.
