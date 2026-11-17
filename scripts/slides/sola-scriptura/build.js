// Build every sermon deck, then save it as Keynote into its folder in the ministry
// Dropbox (lib/publish.js). The .pptx intermediates stay in dist/.
//
//   npm run build                  all sermons
//   npm run build -- 02            only sermon 02
//   npm run build -- --force       overwrite decks edited in Keynote since the last build
//   npm run build -- --no-publish  build dist/*.pptx only
//   npm run build -- 01 --include-taught --force   republish a deck already taught
//
// Decks are simple by default (lib/slides.js); a sermon opts out with `simple: false`.
// A sermon marked `taught: true` in series.js is still built to dist/ but its Keynote
// file is left as it was taught.

const fs = require("fs");
const path = require("path");
const { Deck } = require("./lib/slides");
const { THEME } = require("./lib/theme");
const { applyTheme } = require("./lib/apply_theme");
const { dedupeMedia } = require("./lib/dedupe_media");
const { publish, shouldPublish } = require("./lib/publish");
const SERIES = require("./series");

const SERMONS = path.join(__dirname, "sermons");
const DIST = path.join(__dirname, "dist");

async function main() {
	const args = process.argv.slice(2);
	const force = args.includes("--force");
	const noPublish = args.includes("--no-publish");
	const includeTaught = args.includes("--include-taught");
	const filter = args.find((a) => !a.startsWith("--"));
	fs.mkdirSync(DIST, { recursive: true });
	const files = fs
		.readdirSync(SERMONS)
		.filter((f) => f.endsWith(".js") && (!filter || f.includes(filter)))
		.sort();

	for (const f of files) {
		const sermon = require(path.join(SERMONS, f));
		const plan = SERIES.find((s) => s.number === sermon.number);
		const deck = new Deck({
			title: `Sola Scriptura: Case Studies — ${plan.number} ${plan.title}`,
			tag: `CASE STUDY ${plan.number}  ·  ${plan.shortPassage || plan.passage}`,
			movements: sermon.movements,
			simple: sermon.simple !== false,
		});
		sermon.build(deck);
		const out = path.join(DIST, `${plan.file}.pptx`);
		await deck.pres.writeFile({ fileName: out });
		await applyTheme(out, THEME);
		await dedupeMedia(out);
		console.log(`built ${path.relative(__dirname, out)}`);
		for (const t of deck.todos) console.warn(`  to finish — ${t}`);
		if (shouldPublish({ noPublish, taught: plan.taught, includeTaught })) {
			const key = publish(out, plan, { force });
			if (key) console.log(`saved ${key}`);
		} else if (plan.taught && !noPublish) {
			console.log(`kept  ${plan.file}.key as taught (--include-taught to republish)`);
		}
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
