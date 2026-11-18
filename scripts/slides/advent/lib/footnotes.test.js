const test = require("node:test");
const assert = require("node:assert/strict");
const { parseFootnotes, checkFootnotes } = require("./footnotes");

test("parseFootnotes splits marked phrases from plain text", () => {
	assert.deepEqual(parseFootnotes("We believe in [the only Son of God]^1, eternally begotten"), [
		{ text: "We believe in " },
		{ text: "the only Son of God", note: 1 },
		{ text: ", eternally begotten" },
	]);
});

test("parseFootnotes handles several notes, including a reused number", () => {
	const parts = parseFootnotes("[a]^1 and [b]^2 and [c]^1");
	assert.deepEqual(
		parts.filter((p) => p.note).map((p) => [p.text, p.note]),
		[
			["a", 1],
			["b", 2],
			["c", 1],
		],
	);
});

test("parseFootnotes leaves text without markers as one segment", () => {
	assert.deepEqual(parseFootnotes("plain text … with an ellipsis"), [{ text: "plain text … with an ellipsis" }]);
});

test("parseFootnotes reads multi-digit note numbers", () => {
	assert.deepEqual(parseFootnotes("[x]^12"), [{ text: "x", note: 12 }]);
});

test("checkFootnotes passes when every note has a reference and every reference is used", () => {
	assert.doesNotThrow(() => checkFootnotes(parseFootnotes("[a]^1 [b]^2 [c]^1"), ["John 1:14", "Heb 1:3"]));
});

test("checkFootnotes throws on a note with no reference", () => {
	assert.throws(() => checkFootnotes(parseFootnotes("[a]^1 [b]^3"), ["John 1:14", "Heb 1:3", "Col 2:9"]), /note 2/);
	assert.throws(() => checkFootnotes(parseFootnotes("[a]^1 [b]^2"), ["John 1:14"]), /note 2/);
});

test("parseFootnotes marks *emphasis* outside footnotes", () => {
	assert.deepEqual(parseFootnotes("Scripture is *our only ultimate authority* for faith"), [
		{ text: "Scripture is " },
		{ text: "our only ultimate authority", emphasis: true },
		{ text: " for faith" },
	]);
});

test("parseFootnotes allows emphasis and footnotes in the same text", () => {
	assert.deepEqual(parseFootnotes("*sole* source, [faith alone]^1"), [
		{ text: "sole", emphasis: true },
		{ text: " source, " },
		{ text: "faith alone", note: 1 },
	]);
});
