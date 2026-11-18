// Compare a deck as it now stands in Keynote with the deck the source builds, so
// edits made in Keynote can be brought into the sermon source before a --force build
// overwrites them. Read-only: the Keynote file is opened, exported and closed unsaved.
//
//   npm run keynote-diff -- 03     lines marked "-" are the source, "+" are Keynote
//
// Prints MATCHES KEYNOTE when the text of every slide and its notes is the same.
// Only text is compared: a change to layout, size or colour in Keynote won't show.

const { execFileSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { runKeynote } = require("./lib/keynote");
const { OUTPUT_ROOT } = require("./lib/publish");
const { slideTexts, formatSlideTexts } = require("./lib/slide_text");
const SERIES = require("./series");

const DIST = path.join(__dirname, "dist");
const OUT = path.join(DIST, "keynote-diff");

function exportPptx(keyPath, pptxPath) {
	const script = `
		tell application "Keynote"
			set d to open (POSIX file "${keyPath}")
			export d to (POSIX file "${pptxPath}") as Microsoft PowerPoint
			close d saving no
		end tell`;
	runKeynote(script);
}

async function main() {
	const filter = process.argv.slice(2).find((a) => !a.startsWith("--"));
	const plans = SERIES.filter((s) => !filter || s.file.includes(filter));
	if (!filter || plans.length !== 1) {
		console.error("Name one sermon, e.g. npm run keynote-diff -- 03");
		process.exit(2);
	}
	const [plan] = plans;
	const keyPath = path.join(OUTPUT_ROOT, plan.folder, `${plan.file}.key`);
	if (!fs.existsSync(keyPath)) {
		console.error(`No Keynote deck at ${keyPath}`);
		process.exit(2);
	}

	// build the source fresh so the comparison is never against a stale dist/
	execFileSync("node", [path.join(__dirname, "build.js"), plan.file, "--no-publish"], { stdio: "pipe" });
	fs.mkdirSync(OUT, { recursive: true });
	const exported = path.join(OUT, `${plan.file}.keynote.pptx`);
	fs.rmSync(exported, { force: true });
	exportPptx(keyPath, exported);

	const sourceTxt = path.join(OUT, `${plan.file}.source.txt`);
	const keynoteTxt = path.join(OUT, `${plan.file}.keynote.txt`);
	fs.writeFileSync(sourceTxt, formatSlideTexts(await slideTexts(fs.readFileSync(path.join(DIST, `${plan.file}.pptx`)))));
	fs.writeFileSync(keynoteTxt, formatSlideTexts(await slideTexts(fs.readFileSync(exported))));

	const diff = spawnSync("diff", ["-u", "--label", "source", "--label", "keynote", sourceTxt, keynoteTxt], { encoding: "utf8" });
	if (diff.status === 0) {
		console.log(`MATCHES KEYNOTE — ${plan.file}`);
		return;
	}
	process.stdout.write(diff.stdout);
	console.log(`\nKeynote differs from the source. Full text: ${path.relative(__dirname, OUT)}/`);
	process.exitCode = 1;
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
