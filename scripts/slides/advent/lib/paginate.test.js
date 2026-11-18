const test = require("node:test");
const assert = require("node:assert/strict");
const { paginate, paginateLines, plainLength, groupByLength } = require("./paginate");

const words = (n) => Array.from({ length: n }, (_, i) => `word${i}`).join(" ");

test("plainLength counts the visible text, not footnote or emphasis markers", () => {
	assert.equal(plainLength("a [bc]^1 *d*"), "a bc d".length);
});

test("paginate leaves text that fits as one page", () => {
	assert.deepEqual(paginate("Short text.", 100), ["Short text."]);
});

test("paginate never drops or reorders text", () => {
	const text = `${words(60)}. ${words(40)}; ${words(50)}, ${words(30)}.`;
	const pages = paginate(text, 200);
	assert.ok(pages.length > 1);
	assert.equal(pages.join(" "), text);
});

test("paginate keeps every page within the limit", () => {
	const text = `${words(80)}. ${words(80)}. ${words(80)}.`;
	for (const p of paginate(text, 300)) assert.ok(plainLength(p) <= 300, `${plainLength(p)} > 300`);
});

test("paginate prefers a sentence end over a comma near the middle", () => {
	const text = "One two three four five six. Seven eight, nine ten eleven twelve thirteen fourteen.";
	assert.deepEqual(paginate(text, 60), ["One two three four five six.", "Seven eight, nine ten eleven twelve thirteen fourteen."]);
});

test("paginate balances pages instead of filling the first one", () => {
	const text = `${words(30)}. ${words(30)}. ${words(30)}. ${words(30)}.`;
	const [a, b] = paginate(text, plainLength(text) - 10);
	assert.ok(Math.abs(plainLength(a) - plainLength(b)) < plainLength(text) / 10);
});

test("paginate never breaks inside a footnote or emphasis marker", () => {
	const text = `Alpha beta. [gamma, delta. epsilon zeta eta]^1 theta, *iota. kappa lambda* mu.`;
	for (const p of paginate(text, 30)) {
		assert.equal((p.match(/\[/g) || []).length, (p.match(/\]\^\d/g) || []).length, p);
		assert.equal((p.match(/\*/g) || []).length % 2, 0, p);
	}
});

test("paginate can break after an em dash with no following space", () => {
	const text = `${words(20)},—${words(20)}`;
	const pages = paginate(text, 150);
	assert.equal(pages.length, 2);
	assert.ok(pages[0].endsWith(",—"));
});

test("groupByLength keeps items in order and packs them under the limit", () => {
	assert.deepEqual(groupByLength([40, 40, 40, 40, 40], 100, (n) => n), [[40, 40], [40, 40], [40]]);
});

test("groupByLength gives an oversized item a page of its own", () => {
	assert.deepEqual(groupByLength([30, 200, 30], 100, (n) => n), [[30], [200], [30]]);
});

// Poetry: one string per line, "|" marks an indented line.
const poem = [
	"[2] The people who walked in darkness",
	"|have seen a great light;",
	"those who dwelt in a land of deep darkness,",
	"|on them has light shone.",
	"[3] You have multiplied the nation;",
	"|you have increased its joy;",
	"they rejoice before you",
	"|as with joy at the harvest,",
];
const oneRowEach = () => 1;

test("paginateLines leaves lines that fit as one page", () => {
	assert.deepEqual(paginateLines(poem, 20, oneRowEach), [poem]);
});

test("paginateLines never drops or reorders lines", () => {
	const pages = paginateLines(poem, 3, oneRowEach);
	assert.deepEqual(pages.flat(), poem);
});

test("paginateLines never starts a page on an indented line", () => {
	for (const page of paginateLines(poem, 3, oneRowEach)) assert.ok(!page[0].startsWith("|"), page[0]);
});

test("paginateLines keeps every page within the limit when couplets allow", () => {
	for (const page of paginateLines(poem, 4, oneRowEach)) assert.ok(page.length <= 4, page.join(" / "));
});

test("paginateLines prefers to start a page at a verse number", () => {
	// 8 rows into pages of 6: the even split is 4 + 4, which also starts verse 3
	assert.deepEqual(paginateLines(poem, 6, oneRowEach).map((p) => p[0]), ["[2] The people who walked in darkness", "[3] You have multiplied the nation;"]);
});

test("paginateLines counts rows with the given measure", () => {
	const rows = (line) => (line.length > 30 ? 2 : 1);
	for (const page of paginateLines(poem, 5, rows)) assert.ok(page.reduce((t, l) => t + rows(l), 0) <= 5);
});

test("paginateLines breaks inside a couplet only when the couplet is taller than a page", () => {
	const long = ["[1] a", "|b", "|c", "|d", "[2] e"];
	const pages = paginateLines(long, 2, oneRowEach);
	assert.deepEqual(pages.flat(), long);
	for (const page of pages) assert.ok(page.length <= 2);
});

test("paginateLines does not leave a short orphan page when an even split exists", () => {
	// 9 rows into pages of 6 → 2 pages; a greedy 6 + 3 split is worse than 4 + 5
	const nine = [...poem, "|as they are glad when they divide the spoil."];
	const sizes = paginateLines(nine, 6, oneRowEach).map((p) => p.length);
	assert.deepEqual(sizes, [4, 5]);
});
