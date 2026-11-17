// Slide builders for the series. Every sermon follows the same rhythm:
//   I. the theological question → II. the biblical evidence → III. the doctrinal conclusion
//
// Colour carries the argument: red always means Scripture. Scripture slides get a
// full-height red block, large upright heading type and ink-black text. Historical
// quotations and creeds sit on a framed card in smaller italic umber, with the
// Scripture that norms them called out in red underneath (norma normata under
// norma normans).

const path = require("path");
const pptxgen = require("pptxgenjs");
const { THEME, W, H, px, ASSETS, SERIES } = require("./theme");
const { parseFootnotes, checkFootnotes } = require("./footnotes");
const { paginate, plainLength, groupByLength } = require("./paginate");

// Simple mode keeps type readable from the back of the room: below these sizes,
// text runs onto another slide instead of shrinking. Page sizes are visible
// characters that fit each layout at its minimum size.
const SIMPLE = {
	quote: { size: 32, roomy: 36, page: 340 },
	scripture: { size: 40, page: 240 },
	// one slide per discussion, at the largest size that fits (estimated from
	// measured Keynote renders: chars per line ≈ charsPerInchPt × width ÷ size)
	discussion: { maxSize: 34, minSize: 18, charsPerInchPt: 168, paraSpace: 8, box: { x: 1.1, y: 1.15, w: 11.75, h: 5.95 } },
	// creed line beside its Scripture: chars per line in each column, inches of room per slide
	proofs: { size: 26, refSize: 22, textChars: 44, refChars: 33, lineH: 0.44, rowPad: 0.24, room: 5.0, minSize: 14, compactRoom: 5.55 },
};
const ellipsize = (pages) =>
	pages.map((t, i) => `${i > 0 && !/[.!?]["”’)]?$/.test(pages[i - 1]) ? "… " : ""}${t}${i < pages.length - 1 && !/[.!?]["”’)]?$/.test(t) ? " …" : ""}`);

const ROOT = path.resolve(__dirname, "..");
const asset = (key) => path.join(ROOT, ASSETS[key].path);
const HEAD = "+mj-lt"; // theme heading font
const MARGIN = 0.75;

const LAYOUT = {
	cover: "SS_COVER",
	content: "SS_CONTENT",
	plain: "SS_PLAIN",
	dark: "SS_DARK",
};

// The default rhythm. A sermon can pass its own outline instead (see Deck's `movements`).
const MOVEMENTS = [
	{ numeral: "I", label: "THE QUESTION", divider: "THE THEOLOGICAL QUESTION" },
	{ numeral: "II", label: "THE EVIDENCE", divider: "THE BIBLICAL EVIDENCE" },
	{ numeral: "III", label: "THE CONCLUSION", divider: "THE DOCTRINAL CONCLUSION" },
];

const TRANSLATION_NOTE =
	"Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.";

// "by *grace* you have" → runs with the starred phrases in `emph` styling
function emphasize(text, base, emph) {
	return text
		.split(/(\*[^*]+\*)/)
		.filter(Boolean)
		.map((part) =>
			part.startsWith("*") ? { text: part.slice(1, -1), options: { ...base, ...emph } } : { text: part, options: { ...base } },
		);
}

class Deck {
	// `simple`: drop the peripheral text — movement tracker, sermon tag, footer and
	// slide number, kickers, translation tag, sources and footnote lines (those move
	// to the speaker notes) — so each slide is just the verse, the quote, or the heading.
	constructor({ title, tag, movements = MOVEMENTS, simple = false }) {
		this.pres = new pptxgen();
		this.pres.layout = "LAYOUT_WIDE";
		this.pres.title = title;
		this.pres.author = "Sola Scriptura: Case Studies";
		this.pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
		this.C = this.pres.SchemeColor;
		this.tag = tag; // e.g. "CASE STUDY 01 · EPHESIANS 2:8–10", shown top-right on content slides
		this.sectionTitle = null;
		this.movements = movements;
		this.simple = simple;
		this.todos = []; // unfinished slides, reported by the build
		this.defineLayouts();
	}

	// ── frame ──────────────────────────────────────────────────────────────

	defineLayouts() {
		const { pres, C } = this;
		const parchment = { path: asset("parchment") };
		const footer = (color) => ({
			text: this.simple ? { text: "", options: { x: 0, y: 0, w: 0.1, h: 0.1 } } : {
				text: SERIES,
				options: { x: 6.9, y: 6.98, w: 5.2, h: 0.3, align: "right", valign: "middle", fontSize: 9, charSpacing: 3, color, margin: 0 },
			},
		});
		const slideNumber = (color) => (this.simple ? undefined : { x: 12.18, y: 6.98, w: 0.4, h: 0.3, align: "right", fontSize: 9, color, margin: 0 });

		pres.defineSlideMaster({ title: LAYOUT.cover, background: parchment, objects: [] });
		pres.defineSlideMaster({
			title: LAYOUT.content,
			background: parchment,
			objects: [
				footer(C.accent2),
				{
					placeholder: {
						options: {
							name: "title",
							type: "title",
							x: MARGIN,
							y: 0.85,
							w: W - 2 * MARGIN,
							h: 0.85,
							fontSize: 36,
							color: C.text1,
							align: "left",
							valign: "top",
							margin: 0,
						},
						text: "",
					},
				},
			],
			slideNumber: slideNumber(THEME.colors.accent1),
		});
		pres.defineSlideMaster({
			title: LAYOUT.plain,
			background: parchment,
			objects: [footer(C.accent2)],
			slideNumber: slideNumber(THEME.colors.accent1),
		});
		pres.defineSlideMaster({
			title: LAYOUT.dark,
			background: { color: THEME.colors.accent4 },
			objects: [footer(C.accent5)],
			slideNumber: slideNumber(THEME.colors.accent5),
		});
	}

	section(title) {
		this.pres.addSection({ title });
		this.sectionTitle = title;
	}

	slide(layout) {
		return this.pres.addSlide({ masterName: layout, sectionTitle: this.sectionTitle });
	}

	// ── shared pieces ──────────────────────────────────────────────────────

	// A window onto one of the P46 ink crops. `scale` is inches per image pixel;
	// `offX`/`offY` (image pixels) pick which part of the leaf shows through.
	// `light: true` uses the pale ink, for manuscript sitting on a red block.
	manuscript(slide, key, { x, y, w, h, scale, offX = 0, offY = 0, transparency = 15, light = false, name }) {
		if (light) key = `${key}Light`;
		const a = ASSETS[key];
		slide.addImage({
			path: asset(key),
			x,
			y,
			w: a.w * scale,
			h: a.h * scale,
			sizing: { type: "crop", x: offX * scale, y: offY * scale, w, h },
			transparency,
			altText: "",
			objectName: name || `Manuscript (P46, ${key})`,
		});
	}

	// A red block: a native shape (so its colour follows the theme) with a worn,
	// mottled texture laid over it.
	block(slide, x, y, w, h, name) {
		slide.addShape("rect", { x, y, w, h, fill: { color: this.C.accent1 }, line: { type: "none" }, objectName: name });
		this.texture(slide, "redGrunge", { x, y, w, h, scale: 0.0125, name: `${name}, texture` });
	}

	// A window onto a texture image, offset by slide position so neighbouring
	// windows don't repeat the same blotches.
	texture(slide, key, { x, y, w, h, scale, name }) {
		const a = ASSETS[key];
		const offX = Math.max(0, Math.min((x * 37) % a.w, a.w - w / scale));
		const offY = Math.max(0, Math.min((y * 53) % a.h, a.h - h / scale));
		slide.addImage({
			path: asset(key),
			x,
			y,
			w: a.w * scale,
			h: a.h * scale,
			sizing: { type: "crop", x: offX * scale, y: offY * scale, w, h },
			altText: "",
			objectName: name,
		});
	}

	// Older paper behind a manuscript window. Stretched to fit, so its faded edges land on the window's edges.
	agedPaper(slide, key, { x, y, w, h, transparency = 0, name = "Aged paper" }) {
		slide.addImage({ path: asset(key), x, y, w, h, transparency, altText: "", objectName: name });
	}

	// Wayfinding row at the top of content slides: where we are in the sermon's rhythm.
	tracker(slide, current, { x = MARGIN, dark = false, tag = true } = {}) {
		if (this.simple) return;
		const { C } = this;
		const on = dark ? C.background1 : C.text1;
		const off = dark ? C.accent5 : C.accent2;
		const runs = [];
		this.movements.forEach((m, i) => {
			const active = i + 1 === current;
			runs.push({ text: `${m.numeral}  ${m.label}`, options: { color: active ? on : off, bold: active } });
			if (i < this.movements.length - 1) runs.push({ text: "      ", options: {} });
		});
		const opts = { y: 0.4, h: 0.3, fontSize: 10, charSpacing: 2.5, margin: 0, valign: "middle", isTextBox: true };
		slide.addText(runs, { ...opts, x, w: 6, objectName: "Movement tracker" });
		if (tag && this.tag) {
			slide.addText(this.tag, { ...opts, x: W - MARGIN - 5, w: 5, align: "right", color: off, objectName: "Sermon tag" });
		}
	}

	kicker(slide, text, { x, y, w, color }) {
		slide.addText(text, {
			x,
			y,
			w,
			h: this.simple ? 0.36 : 0.3,
			fontSize: this.simple ? 14 : 11,
			charSpacing: this.simple ? 4 : 5,
			color,
			bold: true,
			margin: 0,
			valign: "middle",
			isTextBox: true,
			objectName: "Kicker",
		});
	}

	// ── slide types ────────────────────────────────────────────────────────

	// Series cover: the original artwork rebuilt as native shapes and text.
	// `badge` (e.g. "AUDIO ONLY") replaces the red rule with a red label block.
	cover({ badge } = {}) {
		const { C } = this;
		const s = this.slide(LAYOUT.cover);

		// older paper behind the manuscript, fading into the parchment
		this.agedPaper(s, "agedPatch", { x: px(730), y: 0, w: px(500), h: px(450), name: "Aged paper, top" });
		this.agedPaper(s, "agedStrip", { x: 0, y: px(235), w: px(150), h: H - px(235), name: "Aged paper, left" });

		// red blocks
		this.block(s, 0, 0, px(85), px(250), "Red block, top left");
		this.block(s, px(990), 0, px(552), px(313), "Red block, top right");
		this.block(s, px(1176), px(313) - 0.02, px(230), px(84) + 0.02, "Red block, step");

		// manuscript: one leaf running across the parchment and the red block (sepia ink on
		// paper, pale ink on red, lines kept continuous), and a strip down the left edge
		const ms = { scale: 0.0059, offX: 10 };
		const across = (dx) => ms.offX + dx / ms.scale;
		this.manuscript(s, "philippians", { ...ms, x: px(772), y: 0, w: px(218), h: px(420), name: "Manuscript, top" });
		this.manuscript(s, "philippians", { ...ms, x: px(990), y: 0, w: px(212), h: px(313), offX: across(px(218)), light: true, transparency: 35, name: "Manuscript, top, on red" });
		this.manuscript(s, "philippians", { ...ms, x: px(990), y: px(313), w: px(186), h: px(107), offX: across(px(218)), offY: px(313) / ms.scale, name: "Manuscript, top, below red" });
		this.manuscript(s, "romans", { x: 0, y: px(262), w: px(100), h: H - px(262), scale: 0.0068, offX: 505, offY: 30, name: "Manuscript, left" });

		// cathedral photo cut out of the original art
		const c = ASSETS.cathedral;
		s.addImage({
			path: asset("cathedral"),
			x: px(c.x),
			y: px(c.y),
			w: px(c.w),
			h: px(c.h),
			altText: "Gothic cathedral spires",
			objectName: "Cathedral",
		});

		// small aged-paper card, bottom right
		this.agedPaper(s, "agedCard", { x: px(1550), y: px(648), w: W - px(1550), h: H - px(648), name: "Card" });
		this.block(s, px(1550), px(668), W - px(1550), px(51), "Card, red band");
		const card = { x: px(1550), w: W - px(1550), scale: 0.0045, offX: 30 };
		const cardTop = 280; // image px: start partway down the leaf
		this.manuscript(s, "philippians", { ...card, y: px(668), h: px(51), offY: cardTop, light: true, transparency: 35, name: "Card manuscript, on red" });
		this.manuscript(s, "philippians", { ...card, y: px(719), h: H - px(719), offY: cardTop + px(51) / card.scale, name: "Card manuscript" });

		// title
		const left = px(150);
		s.addText("SOLA", {
			x: left,
			y: 1.07,
			w: 6,
			h: 2.0,
			fontFace: HEAD,
			fontSize: 140,
			charSpacing: -9,
			color: C.text1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Title, SOLA",
		});
		s.addText("SCRIPTURA", {
			x: left,
			y: 2.72,
			w: 9.6,
			h: 1.8,
			fontFace: HEAD,
			fontSize: 120,
			charSpacing: -9,
			color: C.accent3,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Title, SCRIPTURA",
		});
		s.addText("CASE STUDIES", {
			x: left,
			y: 4.41,
			w: 8,
			h: 0.6,
			fontFace: HEAD,
			fontSize: 35,
			charSpacing: 21,
			color: C.text1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Subtitle",
		});
		if (badge) {
			const b = { x: px(155), y: 5.2, w: 2.85, h: 0.46 };
			this.block(s, b.x, b.y, b.w, b.h, "Badge");
			s.addText(badge, { ...b, fontFace: HEAD, fontSize: 16, charSpacing: 9, color: C.background1, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: "Badge text" });
		} else {
			s.addShape("rect", {
				x: px(155),
				y: px(675),
				w: px(142),
				h: px(5),
				fill: { color: C.accent1 },
				line: { type: "none" },
				objectName: "Rule",
			});
		}
		s.addText(["ESTABLISHING THE PROPER", "RELATIONSHIP BETWEEN", "SCRIPTURE & TRADITION"].join("\n"), {
			x: left,
			y: 5.86,
			w: 6,
			h: 1.1,
			fontFace: HEAD,
			fontSize: 17,
			charSpacing: 6,
			lineSpacing: 24,
			color: C.text1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Tagline",
		});
		return s;
	}

	// Opening slide for one sermon: same two-tone title as the cover.
	sermonTitle({ number, line1, line2, subtitle, passage }) {
		const { C } = this;
		const s = this.slide(LAYOUT.cover);

		this.agedPaper(s, "agedPatch", { x: 9.35, y: 0, w: 2.2, h: 6.1, name: "Aged paper" });
		this.block(s, 11.0, 0, W - 11.0, 4.95, "Red block");
		this.block(s, 10.3, 0, 0.72, 1.55, "Red block, step");
		const ms = { scale: 0.0068, offX: 90 };
		const across = (dx) => ms.offX + dx / ms.scale;
		this.manuscript(s, "romans", { ...ms, x: 9.75, y: 0, w: 1.25, h: 5.6, name: "Manuscript" });
		this.manuscript(s, "romans", { ...ms, x: 11.0, y: 0, w: W - 11.0, h: 4.95, offX: across(1.25), light: true, transparency: 50, name: "Manuscript, on red" });
		this.manuscript(s, "romans", { ...ms, x: 11.0, y: 4.95, w: W - 11.0, h: 0.65, offX: across(1.25), offY: 4.95 / ms.scale, name: "Manuscript, below red" });

		this.kicker(s, `CASE STUDY ${number}`, { x: 1.25, y: 1.45, w: 6, color: C.accent2 });
		const title = { x: 1.25, w: 9, h: 1.25, fontFace: HEAD, fontSize: 72, charSpacing: -3, margin: 0, valign: "top", isTextBox: true };
		s.addText(line1, { ...title, y: 1.85, color: C.text1, objectName: "Title, line 1" });
		s.addText(line2, { ...title, y: 3.0, color: C.accent3, objectName: "Title, line 2" });
		s.addText(subtitle, {
			x: 1.25,
			y: 4.42,
			w: 8.5,
			h: 0.45,
			fontFace: HEAD,
			fontSize: 18,
			charSpacing: 7,
			color: C.text1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Subtitle",
		});
		s.addShape("rect", { x: 1.27, y: 5.3, w: 1.13, h: 0.04, fill: { color: C.accent1 }, line: { type: "none" }, objectName: "Rule" });
		s.addText(passage.split(/\s+·\s+/).join("\n"), {
			x: 1.25,
			y: 5.62,
			w: 6,
			h: 0.8,
			fontFace: HEAD,
			fontSize: 18,
			charSpacing: 6,
			color: C.accent1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Passage",
		});
		return s;
	}

	// Divider between movements (the sermon's main parts).
	movement(n, question) {
		const { C } = this;
		const m = this.movements[n - 1];
		const s = this.slide(LAYOUT.dark);

		this.block(s, 10.75, 0, W - 10.75, 3.6, "Red block");
		this.block(s, 11.75, 3.58, W - 11.75, 0.87, "Red block, step");
		const ms = { scale: 0.0062, offX: 300, light: true, transparency: 60 };
		this.manuscript(s, "philippians", { ...ms, x: 10.75, y: 0, w: W - 10.75, h: 3.6, name: "Manuscript, on red" });
		this.manuscript(s, "philippians", { ...ms, x: 11.75, y: 3.6, w: W - 11.75, h: 0.85, offX: ms.offX + 1 / ms.scale, offY: 3.6 / ms.scale, name: "Manuscript, on red step" });

		if (!this.simple) this.kicker(s, m.divider, { x: MARGIN, y: 0.9, w: 8, color: C.accent5 });
		s.addText(m.numeral, {
			x: MARGIN - 0.05,
			y: 1.15,
			w: 6,
			h: 2.6,
			fontFace: HEAD,
			fontSize: 180,
			color: C.background1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Numeral",
		});
		s.addText(question, {
			x: MARGIN,
			y: 4.2,
			w: 9.3,
			h: 2.3,
			fontFace: HEAD,
			fontSize: 38,
			color: C.background1,
			margin: 0,
			valign: "top",
			lineSpacingMultiple: 1.05,
			isTextBox: true,
			objectName: "Question",
		});
		return s;
	}

	// Scripture: the norming norm. Strongest visual weight in the deck.
	scripture(opts) {
		if (!this.simple) return this.scripturePage(opts);
		const pages = ellipsize(paginate(opts.text, SIMPLE.scripture.page));
		return pages.map((text) => this.scripturePage({ ...opts, text }));
	}

	scripturePage({ movement, book, verses, text, kicker = "THE WORD OF GOD  ·  NORMA NORMANS", translation = "ESV" }) {
		const { C } = this;
		const s = this.slide(LAYOUT.plain);
		const blockW = this.simple ? 3.1 : 3.6;

		this.block(s, 0, 0, blockW, H, "Scripture block");
		this.block(s, blockW, 6.6, 0.55, 0.9, "Scripture block, step");
		this.manuscript(s, "romans", { x: 0, y: 0, w: blockW, h: H, scale: 0.0092, offX: 60, offY: 0, light: true, transparency: 72 });

		const ref = { x: 0.55, w: blockW - 0.8, margin: 0, valign: "top", isTextBox: true };
		s.addText(book.toUpperCase(), { ...ref, y: 2.45, h: 0.35, fontFace: HEAD, fontSize: 16, charSpacing: 6, color: C.background1, objectName: "Book" });
		s.addText(verses, { ...ref, y: 2.8, h: 1.2, fontFace: HEAD, fontSize: verses.length > 5 ? (this.simple ? 44 : 50) : this.simple ? 60 : 66, color: C.background1, objectName: "Verses" });
		if (!this.simple) s.addText(translation, { ...ref, y: 4.05, h: 0.3, fontSize: 11, charSpacing: 4, color: C.accent5, objectName: "Translation" });

		const x = blockW + 0.75;
		const w = W - x - MARGIN;
		if (movement) this.tracker(s, movement, { x, tag: false });
		if (!this.simple) this.kicker(s, kicker, { x, y: 1.5, w, color: C.accent1 });
		const plain = text.replace(/\*/g, "");
		const fontSize = this.simple
			? plain.length > 170 ? SIMPLE.scripture.size : plain.length > 100 ? 44 : 48
			: plain.length > 200 ? 28 : plain.length > 130 ? 32 : plain.length > 90 ? 36 : 42;
		s.addText(emphasize(text, { color: C.text1 }, { color: C.accent1 }), {
			x,
			// simple: centred on the reference block instead of hanging under a kicker
			...(this.simple ? { y: 1.0, h: 4.6, valign: "middle" } : { y: 2.0, h: 4.4, valign: "top" }),
			w,
			fontFace: HEAD,
			fontSize,
			lineSpacingMultiple: 1.12,
			margin: 0,
			isTextBox: true,
			objectName: "Scripture text",
		});
		s.addNotes(TRANSLATION_NOTE);
		return s;
	}

	// Historical quotation or creed: a normed norm. Readable and respected, but quieter
	// than Scripture — smaller italic umber on a framed card, never red except for the
	// Scripture that norms it. Mark phrases as `[phrase]^n` and pass `normedBy` as a
	// list of references: each phrase gets a red dotted underline and superscript n,
	// keyed to reference n in the "Normed by Scripture" row.
	quote(opts) {
		const parts = parseFootnotes(opts.text);
		if (Array.isArray(opts.normedBy)) checkFootnotes(parts, opts.normedBy);
		if (!this.simple) return this.quotePage(opts);
		const pages = paginate(opts.text, SIMPLE.quote.page);
		const shown = ellipsize(pages);
		// one size for every page of a quotation
		const size = Math.max(...pages.map(plainLength)) > 220 ? SIMPLE.quote.size : SIMPLE.quote.roomy;
		return shown.map((text, i) => this.quotePage({ ...opts, text, size, notes: i === 0 ? opts.notes : undefined, first: i === 0 }));
	}

	quotePage({ movement, kicker = "WITNESS OF THE CHURCH  ·  NORMA NORMATA", text, attribution, source, normedBy, contradictedBy, footnote, notes, first = true, size }) {
		const { C } = this;
		const simple = this.simple;
		const s = this.slide(LAYOUT.plain);
		if (movement) this.tracker(s, movement);

		const card = simple ? { x: 0.75, y: 0.5, w: W - 1.5, h: 6.5 } : { x: 1.25, y: 1.15, w: W - 2.5, h: 5.45 };
		s.addShape("rect", { ...card, fill: { color: C.background1, transparency: 25 }, line: { color: C.accent2, width: 0.75 }, objectName: "Quote card" });
		s.addShape("rect", {
			x: card.x + 0.12,
			y: card.y + 0.12,
			w: card.w - 0.24,
			h: card.h - 0.24,
			fill: { type: "none" },
			line: { color: C.accent2, width: 0.5, transparency: 45 },
			objectName: "Quote card, inner frame",
		});
		s.addText("“", {
			x: card.x + (simple ? 0.3 : 0.35),
			y: card.y + 0.2,
			w: 0.9,
			h: 1.0,
			fontFace: HEAD,
			fontSize: 80,
			color: C.accent2,
			transparency: 40,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Quotation mark",
		});

		const x = card.x + (simple ? 1.15 : 1.3);
		const w = card.w - (simple ? 1.15 + 0.6 : 1.3 + 0.75);
		if (!simple) this.kicker(s, kicker, { x, y: card.y + 0.5, w, color: C.accent2 });
		const parts = parseFootnotes(text);
		const plain = parts.map((p) => p.text).join("");
		// quotations are shown whole, never excerpted: in simple mode they run onto
		// more slides; otherwise long ones step down in size
		const fontSize = simple
			? size || (plainLength(text) > 220 ? SIMPLE.quote.size : SIMPLE.quote.roomy)
			: plain.length > 550 ? 18 : plain.length > 450 ? 19 : plain.length > 330 ? 20 : plain.length > 220 ? 22 : plain.length > 130 ? 26 : 30;
		const quoteRuns = parts.flatMap((p) =>
			p.note
				? [
						{ text: p.text, options: { underline: { style: "dotted", color: C.accent1 } } },
						{ text: String(p.note), options: { superscript: true, bold: true, italic: false, color: C.accent1 } },
					]
				: [{ text: p.text, options: p.emphasis ? { bold: true, color: C.text1 } : {} }],
		);
		s.addText(quoteRuns, {
			x,
			y: card.y + (simple ? 0.5 : 0.9),
			w,
			h: simple ? card.h - 0.5 - 1.6 : 3.0,
			fontSize,
			italic: true,
			color: C.text2,
			lineSpacingMultiple: 1.15,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Quotation",
		});
		s.addText(
			[
				{ text: `— ${attribution.toUpperCase()}`, options: { color: C.text1, charSpacing: 3, bold: true } },
				{ text: source && !this.simple ? `    ${source}` : "", options: { color: C.accent2, italic: true } },
			],
			{ x, y: simple ? card.y + card.h - 1.55 : card.y + 3.95, w, h: simple ? 0.45 : 0.35, fontSize: simple ? 16 : 12, margin: 0, valign: "middle", isTextBox: true, objectName: "Attribution" },
		);

		const rowY = simple ? card.y + card.h - 1.05 : card.y + 4.4;
		// in simple mode a continued quote lists only the references its own phrases use
		const onPage = new Set(parts.filter((p) => p.note).map((p) => p.note));
		const refSize = simple ? 20 : 16;
		const refsHere = !simple || !Array.isArray(normedBy) || normedBy.some((_, i) => onPage.has(i + 1));
		if (!simple || (normedBy && refsHere) || contradictedBy) {
			s.addShape("line", { x, y: rowY, w, h: 0, line: { color: C.accent2, width: 0.5, transparency: 40 }, objectName: "Divider" });
		}
		if (normedBy && refsHere) {
			s.addText(
				[
					{ text: "NORMED BY SCRIPTURE", options: { fontSize: simple ? 12 : 10, charSpacing: 4, bold: true, color: C.accent2, breakLine: true } },
					...(Array.isArray(normedBy)
						? normedBy
								.map((ref, i) => ({ ref, n: i + 1 }))
								.filter(({ n }) => !simple || onPage.has(n))
								.flatMap(({ ref, n }, i, shown) => [
									{ text: String(n), options: { fontSize: refSize, superscript: true, bold: true, color: C.accent1 } },
									{ text: ` ${ref}${i < shown.length - 1 ? "      " : ""}`, options: { fontFace: HEAD, fontSize: refSize, color: C.accent1 } },
								])
						: [{ text: normedBy, options: { fontFace: HEAD, fontSize: refSize, color: C.accent1 } }]),
				],
				{ x, y: rowY + 0.1, w, h: simple ? 0.8 : 0.62, paraSpaceBefore: 3, margin: 0, valign: "middle", isTextBox: true, objectName: "Normed by" },
			);
		} else if (normedBy) {
			// a continued page whose phrases carry no footnotes: no references row
		} else if (contradictedBy) {
			s.addText(
				[
					{ text: "CONTRADICTED BY SCRIPTURE", options: { fontSize: simple ? 12 : 10, charSpacing: 4, bold: true, color: C.accent2, breakLine: true } },
					{ text: contradictedBy.join("   ·   "), options: { fontFace: HEAD, fontSize: refSize, color: C.accent1 } },
				],
				{ x, y: rowY + 0.12, w, h: simple ? 0.85 : 0.62, paraSpaceBefore: 3, margin: 0, valign: "middle", isTextBox: true, objectName: "Contradicted by" },
			);
		} else if (footnote && !this.simple) {
			s.addText(footnote, {
				x,
				y: rowY + 0.1,
				w,
				h: 0.4,
				fontSize: 13,
				italic: true,
				color: C.accent2,
				margin: 0,
				valign: "middle",
				isTextBox: true,
				objectName: "Footnote",
			});
		}
		const moved = simple && first ? [source && `Source: ${attribution}, ${source}.`, footnote] : [];
		const allNotes = [notes, ...moved].filter(Boolean).join("\n\n");
		if (allNotes) s.addNotes(allNotes);
		return s;
	}

	// Short definition with three supporting marks.
	// Short definition with three supporting marks. The slide shows only the
	// definition and each mark's label and reference; the clarification and the
	// marks' explanations go to the speaker notes.
	definition({ movement, title, statement, source, clarification, marks }) {
		const { C } = this;
		const s = this.slide(LAYOUT.content);
		if (movement) this.tracker(s, movement);
		s.addText(title, { placeholder: "title" });

		s.addText(statement, {
			x: MARGIN,
			y: 2.1,
			w: 6.6,
			h: 3.6,
			fontFace: HEAD,
			fontSize: 32,
			color: C.text1,
			lineSpacingMultiple: 1.1,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Definition",
		});
		if (source) {
			s.addText(`— ${source}`, { x: MARGIN, y: 4.5, w: 6.6, h: 0.35, fontSize: 12, italic: true, color: C.accent2, margin: 0, valign: "top", isTextBox: true, objectName: "Definition source" });
		}

		const x = 8.15;
		const w = W - x - MARGIN;
		const rowH = 1.1;
		marks.forEach((m, i) => {
			const y = 2.15 + i * rowH;
			if (i > 0) s.addShape("line", { x, y: y - 0.3, w, h: 0, line: { color: C.accent2, width: 0.5, transparency: 40 }, objectName: `Mark ${i + 1} divider` });
			s.addText(m.label, { x, y, w: 2.4, h: 0.5, fontFace: HEAD, fontSize: 28, color: C.text1, margin: 0, valign: "bottom", isTextBox: true, objectName: `Mark ${i + 1}` });
			s.addText(m.ref, { x: x + 2.4, y, w: w - 2.4, h: 0.5, fontFace: HEAD, fontSize: 17, color: C.accent1, align: "right", margin: 0, valign: "bottom", isTextBox: true, objectName: `Mark ${i + 1} reference` });
		});
		s.addNotes([clarification, "", ...marks.map((m) => `${m.label} (${m.ref}): ${m.body}`)].filter((l) => l !== undefined).join("\n"));
		return s;
	}

	// Three observations drawn from a passage.
	cards({ movement, title, items }) {
		const { C } = this;
		const s = this.slide(LAYOUT.content);
		if (movement) this.tracker(s, movement);
		s.addText(title, { placeholder: "title" });

		const gap = 0.4;
		const w = (W - 2 * MARGIN - gap * (items.length - 1)) / items.length;
		const y = 2.1;
		const h = 4.35;
		items.forEach((it, i) => {
			const x = MARGIN + i * (w + gap);
			const pad = 0.35;
			s.addShape("rect", { x, y, w, h, fill: { color: C.background1, transparency: 25 }, line: { color: C.accent2, width: 0.5 }, objectName: `Card ${i + 1}` });
			s.addText(["I", "II", "III", "IV"][i], { x: x + w - 1.1, y: y + h - 0.85, w: 0.8, h: 0.6, fontFace: HEAD, fontSize: 28, color: C.accent2, transparency: 35, align: "right", margin: 0, valign: "top", isTextBox: true, objectName: `Card ${i + 1} numeral` });
			s.addText(it.label, { x: x + pad, y: y + 0.45, w: w - 2 * pad, h: 0.3, fontSize: this.simple ? 13 : 11, charSpacing: 5, bold: true, color: C.accent2, margin: 0, valign: "top", isTextBox: true, objectName: `Card ${i + 1} label` });
			s.addText(it.head, { x: x + pad, y: y + 0.8, w: w - 2 * pad, h: 0.7, fontFace: HEAD, fontSize: 36, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: `Card ${i + 1} heading` });
			s.addText(it.body, { x: x + pad, y: y + 1.7, w: w - 2 * pad, h: 1.9, fontSize: this.simple ? 22 : 18, color: C.text2, lineSpacingMultiple: 1.1, margin: 0, valign: "top", isTextBox: true, objectName: `Card ${i + 1} text` });
			s.addText(it.ref, { x: x + pad, y: y + h - 0.7, w: w - 2 * pad, h: 0.4, fontFace: HEAD, fontSize: this.simple ? 20 : 17, color: C.accent1, margin: 0, valign: "top", isTextBox: true, objectName: `Card ${i + 1} reference` });
		});
		return s;
	}

	// Side-by-side positions. `highlight` marks the column the sermon argues for.
	compare({ movement, title, columns, footnote }) {
		const { C } = this;
		const s = this.slide(LAYOUT.content);
		if (movement) this.tracker(s, movement);
		s.addText(title, { placeholder: "title" });

		const gap = 0.4;
		const w = (W - 2 * MARGIN - gap * (columns.length - 1)) / columns.length;
		const y = 2.05;
		const showFootnote = footnote && !this.simple;
		const h = showFootnote ? 4.1 : 4.4;
		const pad = 0.35;
		columns.forEach((col, i) => {
			const x = MARGIN + i * (w + gap);
			s.addShape("rect", {
				x,
				y,
				w,
				h,
				fill: col.highlight ? { color: C.background1, transparency: 10 } : { type: "none" },
				line: { color: col.highlight ? C.text1 : C.accent2, width: col.highlight ? 1.25 : 0.5 },
				objectName: `Column ${i + 1}`,
			});
			s.addText(col.label, { x: x + pad, y: y + 0.35, w: w - 2 * pad, h: 0.3, fontSize: this.simple ? 13 : 11, charSpacing: 4, bold: true, color: col.highlight ? C.text1 : C.accent2, margin: 0, valign: "top", isTextBox: true, objectName: `Column ${i + 1} label` });
			s.addText(col.head, { x: x + pad, y: y + 0.7, w: w - 2 * pad, h: 0.95, fontFace: HEAD, fontSize: (columns.length > 2 ? 24 : 28) + (this.simple ? 2 : 0), color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: `Column ${i + 1} heading` });
			const body = Array.isArray(col.body)
				? col.body.map((t, j) => ({ text: t, options: { bullet: { indent: 16 }, paraSpaceAfter: 8, breakLine: j < col.body.length - 1 } }))
				: col.body;
			s.addText(body, { x: x + pad, y: y + 1.7, w: w - 2 * pad, h: h - 2.6, fontSize: this.simple ? (columns.length > 2 ? 21 : 24) : columns.length > 2 ? 17 : 19, color: C.text2, lineSpacingMultiple: 1.05, margin: 0, valign: "top", isTextBox: true, objectName: `Column ${i + 1} text` });
			if (col.foot) {
				s.addText(col.foot, { x: x + pad, y: y + h - 0.75, w: w - 2 * pad, h: 0.45, fontSize: this.simple ? 16 : 12, italic: true, color: col.highlight ? C.text1 : C.accent2, margin: 0, valign: "bottom", isTextBox: true, objectName: `Column ${i + 1} note` });
			}
		});
		if (footnote && this.simple) s.addNotes(footnote);
		if (showFootnote) {
			s.addText(footnote, { x: MARGIN, y: y + h + 0.2, w: 9, h: 0.3, fontSize: 10, italic: true, color: C.accent2, margin: 0, valign: "top", isTextBox: true, objectName: "Footnote" });
		}
		return s;
	}

	// Stacked authorities, widest (Scripture) on top.
	hierarchy({ movement, title, tiers, notes }) {
		const { C } = this;
		const s = this.slide(LAYOUT.content);
		if (movement) this.tracker(s, movement);
		s.addText(title, { placeholder: "title" });

		const h = this.simple ? 1.25 : 1.05;
		const step = this.simple ? 1.7 : 1.45;
		const styles = [
			{ fill: { color: C.accent1 }, line: { type: "none" }, head: C.background1, body: C.background2 },
			{ fill: { color: C.background1, transparency: 15 }, line: { color: C.accent2, width: 0.75 }, head: C.text1, body: C.text2 },
			{ fill: { type: "none" }, line: { color: C.accent2, width: 0.5, dashType: "dash" }, head: C.text2, body: C.accent2 },
		];
		tiers.forEach((t, i) => {
			const w = 11.6 - i * 1.6;
			const x = (W - w) / 2;
			const y = 2.0 + i * step;
			const st = styles[i];
			s.addShape("rect", { x, y, w, h, fill: st.fill, line: st.line, objectName: `Tier ${i + 1}` });
			s.addText(t.head, { x: x + 0.4, y, w: 4.5, h, fontFace: HEAD, fontSize: this.simple ? 22 : 20, charSpacing: this.simple ? 1 : 2, color: st.head, margin: 0, valign: "middle", isTextBox: true, objectName: `Tier ${i + 1} heading` });
			const runs = this.simple || !t.latin
				? [{ text: t.body, options: { color: st.body } }]
				: [
						{ text: t.latin, options: { italic: true, bold: true, color: st.head, breakLine: true } },
						{ text: t.body, options: { color: st.body } },
					];
			s.addText(runs, { x: x + 4.9, y, w: w - 5.3, h, fontSize: this.simple ? 21 : 14, margin: 0, valign: "middle", isTextBox: true, objectName: `Tier ${i + 1} text` });
			if (i < tiers.length - 1) {
				s.addShape("triangle", { x: W / 2 - 0.13, y: y + h + 0.12, w: 0.26, h: 0.16, rotate: 180, fill: { color: C.accent2 }, line: { type: "none" }, objectName: `Tier ${i + 1} arrow` });
				if (!this.simple) s.addText("norms", { x: W / 2 + 0.25, y: y + h + 0.06, w: 1.2, h: 0.28, fontSize: 11, italic: true, color: C.accent2, margin: 0, valign: "middle", isTextBox: true, objectName: `Tier ${i + 1} arrow label` });
			}
		});
		if (notes) s.addNotes(notes);
		return s;
	}

	// The doctrinal conclusion, standing on the red Scripture block it rests on.
	// `*phrase*` in the statement takes `emphasis` (bold by default).
	conclusion({ statement, groundedIn, method, movement = 3, kicker = "THE DOCTRINAL CONCLUSION", methodLabel = "SOLA SCRIPTURA, APPLIED", emphasis = { bold: true } }) {
		const { C } = this;
		const s = this.slide(LAYOUT.plain);
		this.tracker(s, movement, { tag: false });

		const bx = 9.85;
		this.block(s, bx, 0, W - bx, 6.7, "Scripture block");
		this.block(s, bx - 0.55, 0, 0.55, 0.9, "Scripture block, step");
		this.manuscript(s, "philippians", { x: bx, y: 0, w: W - bx, h: 6.7, scale: 0.0085, offX: 200, offY: 0, light: true, transparency: 72 });
		this.kicker(s, "GROUNDED IN", { x: bx + 0.45, y: 2.0, w: W - bx - 0.8, color: C.background1 });
		s.addText(
			groundedIn.map((r, i) => ({ text: r, options: { breakLine: i < groundedIn.length - 1 } })),
			{ x: bx + 0.45, y: 2.45, w: W - bx - 0.8, h: 3.0, fontFace: HEAD, fontSize: 24, color: C.background1, paraSpaceAfter: 6, margin: 0, valign: "top", isTextBox: true, objectName: "References" },
		);

		if (!this.simple) this.kicker(s, kicker, { x: MARGIN, y: 1.5, w: 8, color: C.text1 });
		s.addText(emphasize(statement, {}, emphasis), {
			x: MARGIN,
			y: 2.0,
			w: bx - MARGIN - 0.9,
			h: 3.3,
			fontFace: HEAD,
			fontSize: 36,
			color: C.text1,
			lineSpacingMultiple: 1.08,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Conclusion",
		});
		if (method && this.simple) s.addNotes(method);
		if (method && !this.simple) {
			s.addShape("line", { x: MARGIN, y: 5.55, w: 1.1, h: 0, line: { color: C.accent2, width: 0.75 }, objectName: "Method divider" });
			s.addText(
				[
					{ text: methodLabel, options: { fontSize: 10, charSpacing: 4, bold: true, color: C.accent2, breakLine: true } },
					{ text: method, options: { fontSize: 15, italic: true, color: C.text2 } },
				],
				{ x: MARGIN, y: 5.7, w: bx - MARGIN - 0.9, h: 0.95, paraSpaceBefore: 2, margin: 0, valign: "top", isTextBox: true, objectName: "Method" },
			);
		}
		return s;
	}

	// A dashed "to finish" box for content still being written. The build lists
	// every one, so a placeholder never reaches the screen unnoticed.
	todo(slide, text, { x, y, w, h, dark = false }) {
		const { C } = this;
		const color = dark ? C.accent5 : C.accent2;
		slide.addShape("rect", { x, y, w, h, fill: { type: "none" }, line: { color, width: 1, dashType: "dash" }, objectName: "To finish" });
		slide.addText(
			[
				{ text: "TO FINISH", options: { fontSize: 10, charSpacing: 4, bold: true, breakLine: true } },
				{ text, options: { fontSize: 15, italic: true } },
			],
			{ x: x + 0.3, y, w: w - 0.6, h, color, paraSpaceBefore: 3, margin: 0, valign: "middle", isTextBox: true, objectName: "To finish, note" },
		);
		this.todos.push(`slide ${this.pres.slides.length}: ${text}`);
	}

	// The sermon's main parts side by side, opening the talk.
	outline({ title = "Outline", parts }) {
		const { C } = this;
		const s = this.slide(LAYOUT.content);
		s.addText(title, { placeholder: "title" });
		const gap = 0.5;
		const w = (W - 2 * MARGIN - gap * (parts.length - 1)) / parts.length;
		const y = 2.0;
		const h = 4.3;
		parts.forEach((p, i) => {
			const x = MARGIN + i * (w + gap);
			const pad = 0.45;
			s.addShape("rect", { x, y, w, h, fill: { color: C.background1, transparency: 25 }, line: { color: C.accent2, width: 0.5 }, objectName: `Part ${i + 1}` });
			s.addText(this.movements[i] ? this.movements[i].numeral : String(i + 1), { x: x + w - 1.6, y: y + 0.25, w: 1.25, h: 1.1, fontFace: HEAD, fontSize: 60, color: C.accent2, transparency: 45, align: "right", margin: 0, valign: "top", isTextBox: true, objectName: `Part ${i + 1} numeral` });
			s.addText(p.label, { x: x + pad, y: y + 0.5, w: w - 2 * pad, h: 0.3, fontSize: 11, charSpacing: 5, bold: true, color: C.accent2, margin: 0, valign: "top", isTextBox: true, objectName: `Part ${i + 1} label` });
			s.addText(p.head, { x: x + pad, y: y + 0.9, w: w - 2 * pad, h: 0.95, fontFace: HEAD, fontSize: this.simple ? 42 : 48, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: `Part ${i + 1} heading` });
			s.addText(p.body, { x: x + pad, y: y + 2.0, w: w - 2 * pad, h: 1.4, fontSize: this.simple ? 24 : 19, color: C.text2, lineSpacingMultiple: 1.1, margin: 0, valign: "top", isTextBox: true, objectName: `Part ${i + 1} text` });
			s.addText(p.ref, { x: x + pad, y: y + h - 0.8, w: w - 2 * pad, h: 0.45, fontFace: HEAD, fontSize: 20, color: C.accent1, margin: 0, valign: "top", isTextBox: true, objectName: `Part ${i + 1} reference` });
		});
		return s;
	}

	// One phrase of a passage, studied on its own: the phrase large in red (it is
	// Scripture), what it means, and the verse beside it with the phrase picked out.
	// `todo` replaces the explanation with a "to finish" box.
	phrase({ movement, ref, phrase, gloss, glossLabel = "THE WORD MEANS", body = [], verse, verseRef, todo, notes }) {
		const { C } = this;
		const s = this.slide(LAYOUT.plain);
		if (movement) this.tracker(s, movement);
		const x = MARGIN;
		const w = 6.9;
		this.kicker(s, ref.toUpperCase(), { x, y: 1.3, w, color: C.accent1 });
		s.addText(`\u201C${phrase}\u201D`, { x: x - 0.05, y: 1.7, w: w + 0.3, h: 1.35, fontFace: HEAD, fontSize: phrase.length > 20 ? 44 : phrase.length > 12 ? 52 : 66, italic: true, color: C.accent3, margin: 0, valign: "top", isTextBox: true, objectName: "Phrase" });
		s.addText(glossLabel, { x, y: 3.25, w, h: 0.3, fontSize: 10, charSpacing: 4, bold: true, color: C.accent2, margin: 0, valign: "middle", isTextBox: true, objectName: "Gloss label" });
		s.addText(gloss, { x, y: 3.6, w, h: 0.95, fontFace: HEAD, fontSize: 30, color: C.text1, margin: 0, valign: "top", isTextBox: true, objectName: "Gloss" });
		if (todo) {
			this.todo(s, todo, { x, y: 4.75, w, h: 1.35 });
		} else if (body.length) {
			s.addText(
				body.map((t, i) => ({ text: t, options: { breakLine: i < body.length - 1 } })),
				{ x, y: 4.75, w, h: 1.75, fontSize: this.simple ? 22 : 19, color: C.text2, paraSpaceAfter: 8, lineSpacingMultiple: 1.05, margin: 0, valign: "top", isTextBox: true, objectName: "Explanation" },
			);
		}

		// the verse, with this phrase picked out
		const card = { x: 8.3, y: 1.3, w: W - 8.3 - MARGIN, h: 5.0 };
		s.addShape("rect", { ...card, fill: { color: C.background1, transparency: 25 }, line: { color: C.accent2, width: 0.5 }, objectName: "Verse card" });
		const pad = 0.35;
		s.addText(emphasize(verse, { color: C.accent2 }, { color: C.accent1, bold: true }), {
			x: card.x + pad,
			y: card.y + pad,
			w: card.w - 2 * pad,
			h: card.h - 2 * pad - 0.5,
			fontFace: HEAD,
			fontSize: verse.length > 200 ? 16 : 18,
			lineSpacingMultiple: 1.12,
			margin: 0,
			valign: "top",
			isTextBox: true,
			objectName: "Verse",
		});
		s.addText(`${verseRef}  ·  ESV`, { x: card.x + pad, y: card.y + card.h - pad - 0.35, w: card.w - 2 * pad, h: 0.35, fontFace: HEAD, fontSize: 15, color: C.accent1, margin: 0, valign: "bottom", isTextBox: true, objectName: "Verse reference" });
		s.addNotes([notes, TRANSLATION_NOTE].filter(Boolean).join("\n\n"));
		return s;
	}

	// A single claim or question set large: logic steps, pastoral asides.
	// `*phrase*` is set bold; `ref` (Scripture) appears in red beneath.
	statement({ movement, kicker, text, support, ref, notes, emphasis = { bold: true } }) {
		const { C } = this;
		const s = this.slide(LAYOUT.plain);
		if (movement) this.tracker(s, movement);
		const x = MARGIN + 0.5;
		const w = W - 2 * x;
		if (kicker) this.kicker(s, kicker, { x, y: 1.75, w, color: C.accent2 });
		s.addText(emphasize(text, { color: C.text1 }, emphasis), { x, y: 2.2, w, h: 2.4, fontFace: HEAD, fontSize: text.length > 110 ? 36 : 44, lineSpacingMultiple: 1.08, margin: 0, valign: "top", isTextBox: true, objectName: "Statement" });
		s.addShape("line", { x, y: 4.85, w: 1.1, h: 0, line: { color: C.accent2, width: 0.75 }, objectName: "Statement divider" });
		if (support) {
			s.addText(support, { x, y: 5.05, w: this.simple ? w : 9.5, h: this.simple ? 1.4 : 1.1, fontSize: this.simple ? 24 : 19, italic: true, color: C.text2, lineSpacingMultiple: 1.1, margin: 0, valign: "top", isTextBox: true, objectName: "Support" });
		}
		if (ref) {
			s.addText(ref, { x, y: 6.15, w: 9.5, h: 0.4, fontFace: HEAD, fontSize: 18, color: C.accent1, margin: 0, valign: "top", isTextBox: true, objectName: "Reference" });
		}
		if (notes) s.addNotes(notes);
		return s;
	}

	// A turn within a movement — dark, like a divider, but without the numeral —
	// previewing the witnesses that follow. items: [{ label, head, detail }].
	interlude({ movement, kicker, title, items = [], notes }) {
		const { C } = this;
		const s = this.slide(LAYOUT.dark);
		if (movement) this.tracker(s, movement, { dark: true });
		this.block(s, 0, 1.6, 0.32, 1.9, "Red block, left edge");
		this.kicker(s, kicker, { x: MARGIN, y: 1.6, w: 10, color: C.accent5 });
		s.addText(title, { x: MARGIN, y: 2.0, w: 11, h: 1.4, fontFace: HEAD, fontSize: 60, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: "Interlude title" });
		s.addShape("line", { x: MARGIN, y: 3.85, w: 1.1, h: 0, line: { color: C.accent5, width: 0.75 }, objectName: "Interlude divider" });
		const gap = 0.6;
		const w = (W - 2 * MARGIN - gap * (items.length - 1)) / Math.max(items.length, 1);
		items.forEach((it, i) => {
			const x = MARGIN + i * (w + gap);
			s.addText(it.label, { x, y: 4.3, w, h: 0.3, fontSize: this.simple ? 14 : 11, charSpacing: 5, bold: true, color: C.accent5, margin: 0, valign: "top", isTextBox: true, objectName: `Item ${i + 1} label` });
			s.addText(it.head, { x, y: 4.7, w, h: 0.7, fontFace: HEAD, fontSize: this.simple ? 36 : 30, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: `Item ${i + 1} heading` });
			if (it.detail) s.addText(it.detail, { x, y: 5.45, w, h: 0.4, fontSize: 16, italic: true, color: C.accent5, margin: 0, valign: "top", isTextBox: true, objectName: `Item ${i + 1} detail` });
		});
		if (notes) s.addNotes(notes);
		return s;
	}

	// A creed set line by line, each line beside the Scripture it draws on (red, as
	// Scripture always is). Rows run onto further slides rather than shrinking.
	// rows: [{ text, refs }]
	proofs({ title, rows, notes, pages }) {
		const P = SIMPLE.proofs;
		// short reference lists (all under ~34 characters) leave the creed a wider column
		const tw = Math.max(...rows.map((r) => (r.refs || "").length)) <= 34 ? 8.1 : 7.1;
		// sizes scale from the 26pt / 22pt measurements in SIMPLE.proofs
		const metrics = (size) => {
			// short references (wide creed column) are set nearly as large as the creed
			const refSize = Math.round(size * (tw > 7.1 ? 0.92 : P.refSize / P.size));
			const k = size / P.size;
			const textChars = (P.textChars * (tw / 7.1)) / k;
			const refW = W - 2 * MARGIN - tw - 0.4;
			const refChars = (P.refChars * (refW / 4.98)) / (refSize / P.refSize);
			const lineH = P.lineH * k;
			const rowPad = Math.max(0.14, P.rowPad * k);
			// a row is as tall as its taller column; reference lines are set smaller than creed lines
			const height = (r) => Math.max(Math.ceil(r.text.length / textChars) * lineH, Math.ceil((r.refs || "").length / refChars) * lineH * (refSize / size), lineH) + rowPad;
			return { size, refSize, rowPad, height };
		};
		// split rows into at most n slides, as evenly as the rows allow
		const split = (height, n, room) => {
			const total = rows.reduce((t, r) => t + height(r), 0);
			const tallest = Math.max(...rows.map(height));
			const even = Math.min(room, Math.max(tallest, (total / n) * 1.12));
			let groups = groupByLength(rows, even, height);
			if (groups.length > n) groups = groupByLength(rows, room, height);
			return groups;
		};
		let m;
		let groups;
		if (pages) {
			// a fixed number of slides: the largest type that fits in them
			for (let size = P.size; size >= P.minSize; size--) {
				m = metrics(size);
				groups = split(m.height, pages, P.compactRoom);
				if (groups.length <= pages && groups.every((g) => g.reduce((t, r) => t + m.height(r), 0) <= P.compactRoom)) break;
			}
		} else {
			// otherwise as few slides as fit at full size
			m = metrics(P.size);
			const total = rows.reduce((t, r) => t + m.height(r), 0);
			groups = split(m.height, Math.ceil(total / P.room), P.room);
		}
		const top = pages ? 1.75 : 1.95;
		return groups.map((group, i) => {
			const { C } = this;
			const s = this.slide(LAYOUT.content);
			s.addText(title, { placeholder: "title" });
			const x = MARGIN;
			const rx = x + tw + 0.4;
			const rw = W - MARGIN - rx;
			let y = top;
			group.forEach((r, j) => {
				const h = m.height(r);
				s.addText(r.text, { x, y, w: tw, h, fontSize: m.size, italic: true, color: C.text2, lineSpacingMultiple: 1.05, margin: 0, valign: "top", isTextBox: true, objectName: `Line ${j + 1}` });
				if (r.refs) s.addText(r.refs, { x: rx, y: y + 0.03, w: rw, h, fontFace: HEAD, fontSize: m.refSize, color: C.accent1, lineSpacingMultiple: 1.05, margin: 0, valign: "top", isTextBox: true, objectName: `Line ${j + 1} Scripture` });
				y += h;
				if (j < group.length - 1) s.addShape("line", { x, y: y - m.rowPad / 2, w: W - 2 * MARGIN, h: 0, line: { color: C.accent2, width: 0.5, transparency: 50 }, objectName: `Line ${j + 1} divider` });
			});
			if (notes && i === 0) s.addNotes(notes);
			return s;
		});
	}


	// Table discussion. With no questions yet, shows a "to finish" box.
	// A question is a string, or { text, sub: [...] } for lettered follow-ups.
	discussion(opts) {
		return this.discussionPage(opts);
	}

	discussionPage({ label = "DISCUSSION", title = "Talk it over", questions = [], start = 1 }) {
		const { C } = this;
		const s = this.slide(LAYOUT.dark);
		this.block(s, 0, 0, px(85), px(250), "Red block, top left");
		// simple mode with questions: the label alone heads the slide, so the questions get the room
		const roomy = this.simple && questions.length;
		this.kicker(s, label, { x: roomy ? 1.1 : 1.25, y: roomy ? 0.6 : 1.0, w: 8, color: C.accent5 });
		if (!roomy) s.addText(title, { x: 1.25, y: 1.4, w: 10, h: 1.0, fontFace: HEAD, fontSize: 54, color: C.background1, margin: 0, valign: "top", isTextBox: true, objectName: "Discussion title" });
		if (questions.length) {
			const items = questions.flatMap((q) =>
				typeof q === "string"
					? [{ text: q, bullet: { type: "number", numberStartAt: start } }]
					: [{ text: q.text, bullet: { type: "number", numberStartAt: start } }, ...(q.sub || []).map((t) => ({ text: t, bullet: { type: "number", style: "alphaLcPeriod" }, indentLevel: 1 }))],
			);
			const length = items.map((q) => q.text).join("").length;
			const D = SIMPLE.discussion;
			const box = this.simple ? D.box : { x: 1.25, y: 2.8, w: 10.6, h: 3.7 };
			// estimated height of the list at a given size: number hangs ~0.35", a sub-question indents ~0.5" more
			const height = (size) =>
				items.reduce((h, it) => {
					const width = box.w - 0.35 - (it.indentLevel ? 0.5 : 0);
					const lines = Math.ceil((it.text.length * size) / (D.charsPerInchPt * width));
					return h + (lines * size * 1.1 * 1.2) / 72;
				}, 0) + ((items.length - 1) * D.paraSpace) / 72;
			let fontSize = length > 420 ? 19 : length > 350 ? 21 : 24;
			if (this.simple) {
				fontSize = D.minSize;
				for (let size = D.maxSize; size >= D.minSize; size--) {
					if (height(size) <= box.h) {
						fontSize = size;
						break;
					}
				}
			}
			s.addText(
				items.map(({ text, ...options }, i) => ({ text, options: { ...options, breakLine: i < items.length - 1 } })),
				{ ...box, fontSize, color: C.background1, paraSpaceAfter: this.simple ? D.paraSpace : fontSize < 21 ? 10 : 14, lineSpacingMultiple: 1.1, margin: 0, valign: "top", isTextBox: true, objectName: "Questions" },
			);
		} else {
			this.todo(s, "Discussion questions", { x: 1.25, y: 2.9, w: 10.6, h: 1.4, dark: true });
		}
		return s;
	}

	// Final slide: next week's sermon, with Scripture to read ahead on the red block
	// and the series so far along the bottom. Skipped when there is no next sermon yet.
	nextWeek(series, current) {
		const { C } = this;
		const i = series.findIndex((x) => x.number === current);
		const next = series[i + 1];
		if (!next) return null;
		const s = this.slide(LAYOUT.plain);

		// red block with the read-ahead passages
		const bx = 9.6;
		this.agedPaper(s, "agedPatch", { x: bx - 1.15, y: 0, w: 1.6, h: 6.5, name: "Aged paper" });
		this.block(s, bx, 0, W - bx, 5.9, "Red block");
		this.block(s, bx - 0.65, 0, 0.67, 1.2, "Red block, step");
		const ms = { scale: 0.0075, offX: 40 };
		this.manuscript(s, "romans", { ...ms, x: bx - 1.05, y: 1.2, w: 1.05, h: 5.0, offY: 1.2 / ms.scale, name: "Manuscript" });
		this.manuscript(s, "romans", { ...ms, x: bx, y: 0, w: W - bx, h: 5.9, offX: ms.offX + 1.05 / ms.scale, light: true, transparency: 68, name: "Manuscript, on red" });
		const rx = bx + 0.5;
		const rw = W - rx - 0.45;
		this.kicker(s, "READ AHEAD", { x: rx, y: 1.55, w: rw, color: C.background1 });
		s.addText(
			next.readAhead.map((r, j) => ({ text: r, options: { breakLine: j < next.readAhead.length - 1 } })),
			{ x: rx, y: 2.0, w: rw, h: 2.4, fontFace: HEAD, fontSize: 26, color: C.background1, paraSpaceAfter: 8, margin: 0, valign: "top", isTextBox: true, objectName: "Read ahead" },
		);

		// next sermon, set like its title slide
		const x = 1.25;
		this.kicker(s, `NEXT WEEK  ·  CASE STUDY ${next.number}`, { x, y: 1.2, w: 7, color: C.accent2 });
		const title = { x, w: 8, h: 1.2, fontFace: HEAD, fontSize: 72, charSpacing: -3, margin: 0, valign: "top", isTextBox: true };
		s.addText(next.line1, { ...title, y: 1.6, color: C.text1, objectName: "Next title, line 1" });
		s.addText(next.line2, { ...title, y: 2.75, color: C.accent3, objectName: "Next title, line 2" });
		s.addText(next.passage, { x, y: 4.0, w: 7, h: 0.4, fontFace: HEAD, fontSize: 18, charSpacing: 6, color: C.accent1, margin: 0, valign: "top", isTextBox: true, objectName: "Next passage" });
		s.addText(next.question, { x, y: 4.5, w: 6.8, h: 0.95, fontSize: 20, italic: true, color: C.text2, lineSpacingMultiple: 1.1, margin: 0, valign: "top", isTextBox: true, objectName: "Next question" });

		// the series so far
		const itemW = 3.4;
		series.forEach((x2, j) => {
			if (j > i + 1) return;
			const status = j === i ? "THIS WEEK" : j === i + 1 ? "NEXT WEEK" : "";
			const isNext = j === i + 1;
			const ix = x + j * itemW;
			if (ix + itemW > bx) return;
			s.addText(
				[
					{ text: status || " ", options: { fontSize: 9, charSpacing: 4, bold: true, color: isNext ? C.text1 : C.accent2, breakLine: true } },
					{ text: `${x2.number}  `, options: { fontFace: HEAD, fontSize: 18, color: isNext ? C.accent3 : C.accent2 } },
					{ text: x2.title, options: { fontFace: HEAD, fontSize: 18, color: isNext ? C.text1 : C.accent2 } },
				],
				{ x: ix, y: 6.0, w: itemW - 0.2, h: 0.65, paraSpaceBefore: 2, margin: 0, valign: "top", isTextBox: true, objectName: `Series ${x2.number}` },
			);
		});
		return s;
	}
}

module.exports = { Deck };
