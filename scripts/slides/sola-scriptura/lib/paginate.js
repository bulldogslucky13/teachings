// Splitting text across slides so it can stay large instead of shrinking.
// Text is never cut or reordered: it breaks at the most natural point near an even
// split (a sentence end, then ; : —, then a comma, then any space), and never inside
// a `[footnoted phrase]^n` or `*emphasis*` marker.

const { parseFootnotes } = require("./footnotes");

const MARKER = /\[[^\]]+\]\^\d+|\*[^*]+\*/g;

const plainLength = (text) =>
	parseFootnotes(text)
		.map((p) => p.text)
		.join("").length;

// Candidate break points: index i splits text into text.slice(0, i) and text.slice(i).
function breakPoints(text) {
	const guarded = [...text.matchAll(MARKER)].map((m) => [m.index, m.index + m[0].length]);
	const inside = (i) => guarded.some(([a, b]) => i > a && i < b);
	const points = [];
	for (let i = 1; i < text.length; i++) {
		if (inside(i)) continue;
		const prev = text[i - 1];
		let rank = -1;
		if (text[i] === " ") {
			const end = /[.!?]/.test(prev) || (/[”’")]/.test(prev) && /[.!?]/.test(text[i - 2] || ""));
			rank = end ? 3 : /[;:—]/.test(prev) ? 2 : prev === "," ? 1 : 0;
		} else if (prev === "—") {
			rank = 2;
		}
		if (rank >= 0) points.push({ i, rank });
	}
	return points;
}

// Pages of at most `max` visible characters, as even as natural breaks allow.
function paginate(text, max) {
	const pages = [];
	let rest = text.trim();
	while (plainLength(rest) > max) {
		const total = plainLength(rest);
		const target = total / Math.ceil(total / max);
		let best = null;
		let fallback = null;
		for (const { i, rank } of breakPoints(rest)) {
			const len = plainLength(rest.slice(0, i).trim());
			if (len > max) break;
			fallback = i;
			if (len < target * 0.5) continue;
			const score = rank - (6 * Math.abs(len - target)) / target;
			if (!best || score > best.score) best = { i, score };
		}
		const cut = best ? best.i : fallback || breakPoints(rest)[0]?.i;
		if (!cut) break; // a single unbreakable run longer than a page
		pages.push(rest.slice(0, cut).trim());
		rest = rest.slice(cut).trim();
	}
	if (rest) pages.push(rest);
	return pages;
}

// Pack items, in order, into groups whose summed size stays under `max`.
function groupByLength(items, max, size) {
	const groups = [];
	let current = [];
	let used = 0;
	for (const item of items) {
		const n = size(item);
		if (current.length && used + n > max) {
			groups.push(current);
			current = [];
			used = 0;
		}
		current.push(item);
		used += n;
	}
	if (current.length) groups.push(current);
	return groups;
}

module.exports = { paginate, plainLength, groupByLength };
