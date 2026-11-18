// Render a built deck to one PNG per slide, to look at the slides before publishing.
// Works from dist/NN-*.pptx, so nothing in Dropbox is opened or changed.
//
//   npm run render -- 03     → dist/render/03-…/*.png (960×540, Keynote's export size)

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { runKeynote } = require("./lib/keynote");
const SERIES = require("./series");

const DIST = path.join(__dirname, "dist");

function main() {
	const filter = process.argv.slice(2).find((a) => !a.startsWith("--"));
	const plans = SERIES.filter((s) => !filter || s.file.includes(filter));
	if (!filter || plans.length !== 1) {
		console.error("Name one sermon, e.g. npm run render -- 03");
		process.exit(2);
	}
	const [plan] = plans;
	// build the source fresh so the pictures are never of a stale dist/
	execFileSync("node", [path.join(__dirname, "build.js"), plan.file, "--no-publish"], { stdio: "pipe" });
	const out = path.join(DIST, "render", plan.file);
	fs.rmSync(out, { recursive: true, force: true });
	fs.mkdirSync(out, { recursive: true });
	runKeynote(`
		tell application "Keynote"
			set d to open (POSIX file "${path.join(DIST, `${plan.file}.pptx`)}")
			export d to (POSIX file "${out}") as slide images with properties {image format:PNG}
			close d saving no
		end tell`);
	const count = fs.readdirSync(out).filter((f) => f.endsWith(".png")).length;
	console.log(`rendered ${count} slides to ${path.relative(__dirname, out)}/`);
}

main();
