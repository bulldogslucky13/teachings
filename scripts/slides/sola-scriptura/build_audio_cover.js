// The series cover with an "AUDIO ONLY" label: the still image laid over sermon
// audio for the website / YouTube upload. Writes dist/audio-only-cover.pptx and a
// 1920×1080 PNG, and copies the PNG into the series folder in the ministry Dropbox.
//
//   npm run audio-cover                 build and copy to Dropbox
//   npm run audio-cover -- --no-publish build dist/ only

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { Deck } = require("./lib/slides");
const { runKeynote } = require("./lib/keynote");
const { THEME } = require("./lib/theme");
const { applyTheme } = require("./lib/apply_theme");
const { dedupeMedia } = require("./lib/dedupe_media");
const { OUTPUT_ROOT } = require("./lib/publish");

const DIST = path.join(__dirname, "dist");
const NAME = "Sola Scriptura - Audio Only";

// Keynote's slide-image export is fixed at the slide's point size (960×540), so
// export a PDF and rasterize it at full HD.
function exportPng(pptxPath, pngPath, width = 1920) {
	const pdf = pngPath.replace(/\.png$/, ".pdf");
	const script = `
		tell application "Keynote"
			set d to open (POSIX file "${pptxPath}")
			export d to (POSIX file "${pdf}") as PDF with properties {PDF image quality:Best}
			close d saving no
		end tell`;
	runKeynote(script);
	execFileSync("swift", [path.join(__dirname, "scripts", "pdf_to_png.swift"), pdf, pngPath, String(width)], { stdio: "pipe" });
	fs.rmSync(pdf, { force: true });
}

async function main() {
	const noPublish = process.argv.includes("--no-publish");
	fs.mkdirSync(DIST, { recursive: true });
	const deck = new Deck({ title: `Sola Scriptura: Case Studies — Audio Only` });
	deck.cover({ badge: "AUDIO ONLY" });
	const pptx = path.join(DIST, "audio-only-cover.pptx");
	await deck.pres.writeFile({ fileName: pptx });
	await applyTheme(pptx, THEME);
	await dedupeMedia(pptx);

	const png = path.join(DIST, `${NAME}.png`);
	exportPng(pptx, png);
	console.log(`built ${path.relative(__dirname, png)}`);

	if (!noPublish) {
		const dest = path.join(OUTPUT_ROOT, `${NAME}.png`);
		fs.copyFileSync(png, dest);
		console.log(`saved ${dest}`);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
