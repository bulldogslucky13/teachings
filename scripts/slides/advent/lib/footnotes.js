// Footnotes tying a quotation's phrases to the Scripture that norms them.
// In quote text, mark a phrase as `[phrase]^n`; reference n is normedBy[n - 1].
// `*phrase*` marks emphasis (the author's own bold, or the preacher's).

const MARKER = /\[([^\]]+)\]\^(\d+)|\*([^*]+)\*/g;

function parseFootnotes(text) {
	const parts = [];
	let last = 0;
	for (const m of text.matchAll(MARKER)) {
		if (m.index > last) parts.push({ text: text.slice(last, m.index) });
		parts.push(m[3] !== undefined ? { text: m[3], emphasis: true } : { text: m[1], note: Number(m[2]) });
		last = m.index + m[0].length;
	}
	if (last < text.length) parts.push({ text: text.slice(last) });
	return parts;
}

// Every note number needs a reference, and every reference needs a note.
function checkFootnotes(parts, refs) {
	const used = new Set(parts.filter((p) => p.note).map((p) => p.note));
	for (let n = 1; n <= Math.max(refs.length, ...used); n++) {
		if (!used.has(n) || n > refs.length) throw new Error(`footnote note ${n} has no ${used.has(n) ? "reference" : "marked phrase"}`);
	}
}

module.exports = { parseFootnotes, checkFootnotes };
