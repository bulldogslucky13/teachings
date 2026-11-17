const test = require("node:test");
const assert = require("node:assert/strict");
const { paginate, plainLength, groupByLength } = require("./paginate");

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
