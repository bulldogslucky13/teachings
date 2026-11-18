// Slide types for the Advent series, built on the Advent template: the cover art
// full-bleed, and every other slide on the coral paper background with white MORVA
// type. The standing rules from the sermon-slides skill are built in: each slide
// carries one thing the room reads, Scripture is set at 40pt or more and quotations
// at 32pt or more, long text runs onto further slides instead of shrinking or being
// cut, and each discussion section is exactly one slide.
//
// The background carries the ADVENT wordmark bottom-right (theme.WORDMARK); text is
// kept clear of it.

const path = require("path");
const pptxgen = require("pptxgenjs");
const { THEME, W, H, ASSETS, WORDMARK } = require("./theme");
const { paginate, paginateLines, plainLength } = require("./paginate");

const SIZES = {
	scripture: { max: 48, mid: 44, min: 40, page: 300 },
	quote: { roomy: 36, min: 32, page: 340 },
	// one slide per discussion, at the largest size that fits (chars per line ≈ charsPerInchPt × width ÷ size)
	discussion: { maxSize: 34, minSize: 18, charsPerInchPt: 150, paraSpace: 8 },
	// poetry: one row ≈ size × lineSpacing; chars per row from the same estimate
	poetry: { size: 40, lineSpacing: 1.08, indent: 0.6 },
};
// measured on Keynote renders of MORVA (all caps): ~150 chars per inch at 1pt
const CHARS_PER_INCH_PT = 150;

const ROOT = path.resolve(__dirname, "..");
const asset = (key) => path.join(ROOT, ASSETS[key].path);
const HEAD = "+mj-lt";
const MARGIN = 0.85;
// the text area every content slide shares: full width, stopping above the wordmark
const BODY = { x: MARGIN, y: 0.6, w: W - 2 * MARGIN, h: WORDMARK.y - 0.15 - 0.6 };

const LAYOUT = { cover: "ADV_COVER", content: "ADV_CONTENT" };

const TRANSLATION_NOTE =
	"Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.";

// "by *grace* you have" → runs with the starred phrases in the emphasis colour
function emphasize(text, base, emph) {
	return text
		.split(/(\*[^*]+\*)/)
		.filter(Boolean)
		.map((part) => (part.startsWith("*") ? { text: part.slice(1, -1), options: { ...base, ...emph } } : { text: part, options: { ...base } }));
}

// "… " / " …" on pages that continue mid-sentence
const ellipsize = (pages) =>
	pages.map((t, i) => `${i > 0 && !/[.!?]["”’)]?$/.test(pages[i - 1]) ? "… " : ""}${t}${i < pages.length - 1 && !/[.!?]["”’)]?$/.test(t) ? " …" : ""}`);

class Deck {
	constructor({ title }) {
		this.pres = new pptxgen();
		this.pres.layout = "LAYOUT_WIDE";
		this.pres.title = title;
		this.pres.author = "College Hour · Advent";
		this.pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
		this.C = this.pres.SchemeColor;
		this.sectionTitle = null;
		this.todos = []; // unfinished slides, reported by the build
		this.pres.defineSlideMaster({ title: LAYOUT.cover, background: { path: asset("cover") }, objects: [] });
		this.pres.defineSlideMaster({ title: LAYOUT.content, background: { path: asset("background") }, objects: [] });
	}

	section(title) {
		this.pres.addSection({ title });
		this.sectionTitle = title;
	}

	slide(layout = LAYOUT.content) {
		return this.pres.addSlide({ masterName: layout, sectionTitle: this.sectionTitle });
	}

	text(s, text, opts) {
		s.addText(text, { fontFace: HEAD, color: this.C.background1, margin: 0, isTextBox: true, ...opts });
	}

	// ── slide types ────────────────────────────────────────────────────────

	// The series art, full-bleed. `badge` (e.g. "AUDIO ONLY") sets a label under the wordmark.
	cover({ badge } = {}) {
		const s = this.slide(LAYOUT.cover);
		if (badge) this.text(s, badge, { x: 0, y: 5.35, w: W, h: 0.6, fontSize: 28, charSpacing: 12, align: "center", valign: "middle", objectName: "Badge" });
		return s;
	}

	// Opening slide for one week: its theme word, large, and the passage.
	sermonTitle({ title, passage }) {
		const s = this.slide();
		this.text(s, title.toUpperCase(), { x: BODY.x, y: 1.7, w: BODY.w, h: 2.3, fontSize: 138, charSpacing: 6, align: "center", valign: "bottom", objectName: "Title" });
		if (passage) this.text(s, passage, { x: BODY.x, y: 4.25, w: BODY.w, h: 0.7, fontSize: 30, charSpacing: 6, color: this.C.accent1, align: "center", valign: "top", objectName: "Passage" });
		return s;
	}

	// One sentence set large and centred: a main point, a definition, a question.
	// `*phrase*` is set in gold. `ref` (Scripture) sits beneath it.
	statement({ text, ref, notes }) {
		const s = this.slide();
		const n = plainLength(text);
		const fontSize = n <= 70 ? 60 : n <= 130 ? 50 : 42;
		this.text(s, emphasize(text, {}, { color: this.C.accent1 }), {
			x: BODY.x + 0.4,
			y: BODY.y,
			w: BODY.w - 0.8,
			h: ref ? BODY.h - 0.9 : BODY.h,
			fontSize,
			lineSpacingMultiple: 1.05,
			align: "center",
			valign: "middle",
			objectName: "Statement",
		});
		if (ref) this.text(s, ref, { x: BODY.x, y: BODY.y + BODY.h - 0.8, w: BODY.w, h: 0.6, fontSize: 28, color: this.C.accent2, align: "center", valign: "top", objectName: "Reference" });
		if (notes) s.addNotes(notes);
		return s;
	}

	// Scripture (ESV). `text` is prose with verse numbers as [n], or poetry with one
	// line per "\n" and a leading "|" on indented lines. Runs onto further slides at
	// 40pt rather than shrinking; the reference heads each slide.
	scripture({ book, verses, text, notes }) {
		const ref = `${book} ${verses}`;
		if (text.includes("\n")) return this.poetry({ ref, lines: text.split("\n"), notes });
		const S = SIZES.scripture;
		const pages = ellipsize(paginate(text, S.page));
		const longest = Math.max(...pages.map(plainLength));
		const fontSize = longest > 200 ? S.min : longest > 120 ? S.mid : S.max;
		return pages.map((page) => {
			const s = this.scriptureFrame(ref);
			this.text(s, this.verseRuns(page), { ...this.scriptureBox(), fontSize, lineSpacingMultiple: 1.1, valign: "middle", objectName: "Scripture text" });
			s.addNotes([notes, TRANSLATION_NOTE].filter(Boolean).join("\n\n"));
			return s;
		});
	}

	poetry({ ref, lines, notes }) {
		const P = SIZES.poetry;
		const box = this.scriptureBox();
		const rowH = (P.size * P.lineSpacing * 1.2) / 72;
		const perRow = (indented) => (CHARS_PER_INCH_PT * (box.w - (indented ? P.indent : 0))) / P.size;
		const rows = (line) => Math.max(1, Math.ceil(plainLength(line.replace(/^\|/, "")) / perRow(line.startsWith("|"))));
		const maxRows = Math.floor(box.h / rowH);
		return paginateLines(lines, maxRows, rows).map((page) => {
			const s = this.scriptureFrame(ref);
			const runs = page.flatMap((line, i) => {
				const indented = line.startsWith("|");
				const parts = this.verseRuns(line.replace(/^\|/, ""));
				// the indent of the ESV's poetry lines, as two em spaces
				if (indented) parts.unshift({ text: "  ", options: {} });
				parts[parts.length - 1].options.breakLine = i < page.length - 1;
				return parts;
			});
			this.text(s, runs, { ...box, fontSize: P.size, lineSpacingMultiple: P.lineSpacing, valign: "middle", objectName: "Scripture text" });
			s.addNotes([notes, TRANSLATION_NOTE].filter(Boolean).join("\n\n"));
			return s;
		});
	}

	scriptureFrame(ref) {
		const s = this.slide();
		this.text(s, ref.toUpperCase(), { x: BODY.x, y: BODY.y, w: BODY.w, h: 0.55, fontSize: 24, charSpacing: 6, color: this.C.accent1, valign: "top", objectName: "Reference" });
		return s;
	}

	scriptureBox() {
		return { x: BODY.x, y: BODY.y + 0.8, w: BODY.w, h: BODY.h - 0.8 };
	}

	// "[6] For to us *a child* is born" → verse numbers small and raised, *emphasis* in gold
	verseRuns(text) {
		return text
			.split(/(\[\d+\]\s?)/)
			.filter(Boolean)
			.flatMap((part) => {
				const n = part.match(/^\[(\d+)\]\s?$/);
				return n ? [{ text: `${n[1]} `, options: { superscript: true, color: this.C.accent2 } }] : emphasize(part, {}, { color: this.C.accent1 });
			});
	}

	// A quotation, centred, with its speaker beneath. Sources go to the speaker notes.
	quote({ text, attribution, source, notes }) {
		const Q = SIZES.quote;
		const pages = paginate(text, Q.page);
		const fontSize = Math.max(...pages.map(plainLength)) > 220 ? Q.min : Q.roomy;
		return ellipsize(pages).map((page, i) => {
			const s = this.slide();
			this.text(s, `“${page.replace(/\*/g, "")}${i === pages.length - 1 ? "”" : ""}`, {
				x: BODY.x + 0.4,
				y: BODY.y,
				w: BODY.w - 0.8,
				h: BODY.h - 0.9,
				fontSize,
				lineSpacingMultiple: 1.1,
				align: "center",
				valign: "middle",
				objectName: "Quotation",
			});
			if (attribution) this.text(s, `— ${attribution}`, { x: BODY.x, y: BODY.y + BODY.h - 0.75, w: BODY.w, h: 0.55, fontSize: 26, color: this.C.accent2, align: "center", valign: "top", objectName: "Attribution" });
			const moved = i === 0 ? [notes, source && `Source: ${attribution}, ${source}.`] : [];
			if (moved.some(Boolean)) s.addNotes(moved.filter(Boolean).join("\n\n"));
			return s;
		});
	}

	// A dashed "to finish" box for content still to come. The build lists every one,
	// so a placeholder never reaches the screen unnoticed.
	todo(text, s = this.slide(), box = { x: BODY.x + 1, y: 2.4, w: BODY.w - 2, h: 1.8 }) {
		s.addShape("rect", { ...box, fill: { type: "none" }, line: { color: this.C.background1, width: 1.25, dashType: "dash" }, objectName: "To finish" });
		this.text(
			s,
			[
				{ text: "TO FINISH", options: { fontSize: 16, charSpacing: 6, breakLine: true } },
				{ text, options: { fontSize: 26 } },
			],
			{ x: box.x + 0.4, y: box.y, w: box.w - 0.8, h: box.h, align: "center", valign: "middle", paraSpaceBefore: 4, objectName: "To finish, note" },
		);
		this.todos.push(`slide ${this.pres.slides.length}: ${text}`);
		return s;
	}

	// Table discussion: exactly one slide, questions as large as the slide allows.
	// A question is a string, or { text, sub: [...] } for lettered follow-ups.
	// `label` heads the slide (the template used the week's definition here).
	discussion({ label = "Discussion", questions = [], start = 1 }) {
		const D = SIZES.discussion;
		const s = this.slide();
		this.text(s, label, { x: BODY.x, y: BODY.y, w: BODY.w, h: 0.7, fontSize: 32, color: this.C.accent1, valign: "top", objectName: "Discussion label" });
		const box = { x: BODY.x, y: BODY.y + 1.0, w: BODY.w, h: BODY.h - 1.0 };
		if (!questions.length) return this.todo("Discussion questions", s, { ...box, x: box.x + 1, w: box.w - 2, h: 1.8, y: 2.4 });
		const items = questions.flatMap((q) =>
			typeof q === "string"
				? [{ text: q, bullet: { type: "number", numberStartAt: start } }]
				: [{ text: q.text, bullet: { type: "number", numberStartAt: start } }, ...(q.sub || []).map((t) => ({ text: t, bullet: { type: "number", style: "alphaLcPeriod" }, indentLevel: 1 }))],
		);
		const height = (size) =>
			items.reduce((h, it) => {
				const width = box.w - 0.45 - (it.indentLevel ? 0.5 : 0);
				const lines = Math.ceil((it.text.length * size) / (D.charsPerInchPt * width));
				return h + (lines * size * 1.1 * 1.2) / 72;
			}, 0) + ((items.length - 1) * D.paraSpace) / 72;
		let fontSize = D.minSize;
		for (let size = D.maxSize; size >= D.minSize; size--) {
			if (height(size) <= box.h) {
				fontSize = size;
				break;
			}
		}
		if (fontSize <= D.minSize + 2) this.todos.push(`slide ${this.pres.slides.length}: discussion is crowded (${fontSize}pt) — Cameron's call whether to shorten`);
		this.text(
			s,
			items.map(({ text, ...options }, i) => ({ text, options: { ...options, breakLine: i < items.length - 1 } })),
			{ ...box, fontSize, paraSpaceAfter: D.paraSpace, lineSpacingMultiple: 1.1, valign: "top", objectName: "Questions" },
		);
		return s;
	}

	// Closing slide: next week's theme and passage, and Scripture to read ahead.
	// Skipped when there is no next week in series.js.
	nextWeek(series, current) {
		const i = series.findIndex((x) => x.number === current);
		const next = series[i + 1];
		if (!next) return null;
		const s = this.slide();
		this.text(s, "NEXT WEEK", { x: BODY.x, y: 1.1, w: BODY.w, h: 0.5, fontSize: 24, charSpacing: 10, color: this.C.accent2, align: "center", valign: "top", objectName: "Next week label" });
		this.text(s, next.title.toUpperCase(), { x: BODY.x, y: 1.7, w: BODY.w, h: 1.7, fontSize: 96, charSpacing: 6, align: "center", valign: "middle", objectName: "Next title" });
		const read = next.readAhead && next.readAhead.length ? next.readAhead : next.passage ? [next.passage] : [];
		if (read.length) {
			this.text(s, "READ AHEAD", { x: BODY.x, y: 3.85, w: BODY.w, h: 0.45, fontSize: 20, charSpacing: 8, color: this.C.accent2, align: "center", valign: "top", objectName: "Read ahead label" });
			this.text(s, read.join("   ·   "), { x: BODY.x, y: 4.35, w: BODY.w, h: 0.8, fontSize: 32, color: this.C.accent1, align: "center", valign: "top", objectName: "Read ahead" });
		}
		return s;
	}
}

module.exports = { Deck, LAYOUT };
