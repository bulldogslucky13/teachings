// Read the text of a .pptx, slide by slide: what each text box says and the speaker
// notes. Used to compare a deck edited in Keynote with the deck the source builds
// (keynote_diff.js), so Keynote edits can be brought into the sermon source.

const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const decode = (s) =>
	s.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (m, e) => {
		if (e[0] !== "#") return ENTITIES[e] ?? m;
		return String.fromCodePoint(e[1].toLowerCase() === "x" ? Number.parseInt(e.slice(2), 16) : Number(e.slice(1)));
	});

// Paragraphs of one text body, each with its runs joined; blank paragraphs dropped.
// Fields (the slide number) are skipped: they are not typed text, and Keynote
// exports them differently.
function paragraphs(xml) {
	return [...xml.replace(/<a:fld\s.*?<\/a:fld>/gs, "").matchAll(/<a:p>.*?<\/a:p>|<a:p\s[^>]*>.*?<\/a:p>/gs)]
		.map(([p]) => [...p.matchAll(/<a:t>(.*?)<\/a:t>/gs)].map((m) => decode(m[1])).join(""))
		.filter((t) => t.trim());
}

const shapes = (xml) => [...xml.matchAll(/<p:sp>.*?<\/p:sp>|<p:sp\s[^>]*>.*?<\/p:sp>/gs)].map((m) => m[0]);

// Relationship targets of a part, keyed by id, resolved to paths inside the zip.
async function rels(zip, partPath) {
	const dir = partPath.slice(0, partPath.lastIndexOf("/"));
	const file = zip.file(`${dir}/_rels/${partPath.slice(dir.length + 1)}.rels`);
	if (!file) return [];
	const xml = await file.async("string");
	return [...xml.matchAll(/<Relationship\s[^>]*>/g)].map(([tag]) => {
		const attr = (name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];
		const parts = `${dir}/${attr("Target")}`.split("/");
		const path = [];
		for (const part of parts) part === ".." ? path.pop() : path.push(part);
		return { id: attr("Id"), type: attr("Type"), path: path.join("/").replace(/^\//, "") };
	});
}

// → [{ shapes: ["paragraph / paragraph", …], notes: "…" }] in slide order
async function slideTexts(pptx) {
	const zip = await JSZip.loadAsync(pptx);
	const presentation = await zip.file("ppt/presentation.xml").async("string");
	const byId = new Map((await rels(zip, "ppt/presentation.xml")).map((r) => [r.id, r.path]));
	const order = [...presentation.matchAll(/<p:sldId\s[^>]*r:id="([^"]+)"/g)].map((m) => byId.get(m[1]));

	const out = [];
	for (const slidePath of order) {
		const xml = await zip.file(slidePath).async("string");
		const texts = shapes(xml)
			.map((sp) => paragraphs(sp).join(" / "))
			.filter(Boolean);
		const notesRel = (await rels(zip, slidePath)).find((r) => r.type.endsWith("/notesSlide"));
		let notes = "";
		if (notesRel) {
			const notesXml = await zip.file(notesRel.path).async("string");
			const body = shapes(notesXml).find((sp) => /<p:ph\s[^>]*type="body"/.test(sp));
			if (body) {
				notes = paragraphs(body)
					.flatMap((p) => p.split("\n"))
					.map((line) => line.trim())
					.filter(Boolean)
					.join("\n");
			}
		}
		out.push({ shapes: texts, notes });
	}
	return out;
}

function formatSlideTexts(slides) {
	return slides
		.map((s, i) => [`=== slide ${i + 1}`, ...s.shapes, ...(s.notes ? [`NOTES: ${s.notes}`] : [])].join("\n"))
		.join("\n")
		.concat("\n");
}

module.exports = { slideTexts, formatSlideTexts };
