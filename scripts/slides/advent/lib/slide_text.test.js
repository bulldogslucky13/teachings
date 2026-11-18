const test = require("node:test");
const assert = require("node:assert/strict");
const pptxgen = require("pptxgenjs");
const { slideTexts, formatSlideTexts } = require("./slide_text");

async function sample() {
	const pres = new pptxgen();
	const a = pres.addSlide();
	a.addText("Tradition & “the final say”", { x: 1, y: 1, w: 6, h: 1 });
	a.addText([{ text: "First line", options: { breakLine: true } }, { text: "Second " }, { text: "line" }], { x: 1, y: 3, w: 6, h: 1 });
	a.addNotes("Source: Holcomb, 2014");
	const b = pres.addSlide();
	b.addText("Matthew 15:1–6", { x: 1, y: 1, w: 6, h: 1 });
	return pres.write({ outputType: "nodebuffer" });
}

test("slideTexts reads each slide's text in slide order", async () => {
	const slides = await slideTexts(await sample());
	assert.equal(slides.length, 2);
	assert.deepEqual(slides[1].shapes, ["Matthew 15:1–6"]);
});

test("slideTexts joins the runs of a paragraph and decodes XML entities", async () => {
	const [first] = await slideTexts(await sample());
	assert.deepEqual(first.shapes, ["Tradition & “the final say”", "First line / Second line"]);
});

test("slideTexts returns the speaker notes without the slide-number field", async () => {
	const [first, second] = await slideTexts(await sample());
	assert.equal(first.notes, "Source: Holcomb, 2014");
	assert.equal(second.notes, "");
});

test("formatSlideTexts numbers the slides and labels the notes", async () => {
	const out = formatSlideTexts(await slideTexts(await sample()));
	assert.equal(
		out,
		"=== slide 1\nTradition & “the final say”\nFirst line / Second line\nNOTES: Source: Holcomb, 2014\n=== slide 2\nMatthew 15:1–6\n",
	);
});

test("slideTexts leaves out the slide-number field, which Keynote does not export as text", async () => {
	const pres = new pptxgen();
	const slide = pres.addSlide();
	slide.addText("Only this", { x: 1, y: 1, w: 6, h: 1 });
	slide.slideNumber = { x: 12, y: 7 };
	const [first] = await slideTexts(await pres.write({ outputType: "nodebuffer" }));
	assert.deepEqual(first.shapes, ["Only this"]);
});

test("slideTexts drops blank lines inside the notes, which Keynote does not keep", async () => {
	const pres = new pptxgen();
	const slide = pres.addSlide();
	slide.addText("Text", { x: 1, y: 1, w: 6, h: 1 });
	slide.addNotes("First.\n\nSecond.\n");
	const [first] = await slideTexts(await pres.write({ outputType: "nodebuffer" }));
	assert.equal(first.notes, "First.\nSecond.");
});
