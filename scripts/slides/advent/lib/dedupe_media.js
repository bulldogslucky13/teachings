// pptxgenjs writes a separate copy of an image for every slide that uses it, so a
// texture repeated across 17 slides is stored 17 times. This keeps one copy of each
// identical file in ppt/media/ and points every relationship at it.

const crypto = require("crypto");
const fs = require("fs");

const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));

// Given { mediaPath: buffer }, returns { duplicatePath: canonicalPath } — the first
// path (in sorted order) with identical bytes is kept as the canonical copy.
function findDuplicates(files) {
	const canonicalByHash = new Map();
	const duplicates = {};
	for (const name of Object.keys(files).sort()) {
		const hash = crypto.createHash("sha1").update(files[name]).digest("hex");
		const canonical = canonicalByHash.get(hash);
		if (canonical) duplicates[name] = canonical;
		else canonicalByHash.set(hash, name);
	}
	return duplicates;
}

// Rewrites `Target="../media/x"` attributes in a .rels file.
function retarget(relsXml, duplicates) {
	return relsXml.replace(/Target="\.\.\/media\/([^"]+)"/g, (whole, file) => {
		const canonical = duplicates[`ppt/media/${file}`];
		return canonical ? `Target="../media/${canonical.slice("ppt/media/".length)}"` : whole;
	});
}

async function dedupeMedia(pptxPath) {
	const zip = await JSZip.loadAsync(fs.readFileSync(pptxPath));
	const media = {};
	for (const name of Object.keys(zip.files)) {
		if (name.startsWith("ppt/media/") && !zip.files[name].dir) media[name] = await zip.file(name).async("nodebuffer");
	}
	const duplicates = findDuplicates(media);
	for (const name of Object.keys(zip.files).filter((n) => n.endsWith(".rels"))) {
		const xml = await zip.file(name).async("string");
		const next = retarget(xml, duplicates);
		if (next !== xml) zip.file(name, next);
	}
	for (const name of Object.keys(duplicates)) zip.remove(name);
	fs.writeFileSync(pptxPath, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
	return Object.keys(duplicates).length;
}

module.exports = { dedupeMedia, findDuplicates, retarget };
