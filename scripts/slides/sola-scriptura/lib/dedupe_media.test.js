const test = require("node:test");
const assert = require("node:assert/strict");
const { findDuplicates, retarget } = require("./dedupe_media");

test("findDuplicates maps identical files onto the first path in sorted order", () => {
	const a = Buffer.from("texture");
	const files = {
		"ppt/media/image-2-1.png": a,
		"ppt/media/image-1-1.png": Buffer.from("texture"),
		"ppt/media/image-1-2.png": Buffer.from("other"),
	};
	assert.deepEqual(findDuplicates(files), { "ppt/media/image-2-1.png": "ppt/media/image-1-1.png" });
});

test("findDuplicates returns nothing when every file differs", () => {
	assert.deepEqual(findDuplicates({ "ppt/media/a.png": Buffer.from("1"), "ppt/media/b.png": Buffer.from("2") }), {});
});

test("retarget points relationships at the canonical copy", () => {
	const xml = '<Relationship Id="rId1" Target="../media/image-2-1.png"/><Relationship Id="rId2" Target="../media/image-2-3.png"/>';
	const out = retarget(xml, { "ppt/media/image-2-1.png": "ppt/media/image-1-1.png" });
	assert.equal(out, '<Relationship Id="rId1" Target="../media/image-1-1.png"/><Relationship Id="rId2" Target="../media/image-2-3.png"/>');
});

test("retarget leaves non-media targets alone", () => {
	const xml = '<Relationship Id="rId4" Target="../slideLayouts/slideLayout4.xml"/>';
	assert.equal(retarget(xml, { "ppt/media/x.png": "ppt/media/y.png" }), xml);
});
