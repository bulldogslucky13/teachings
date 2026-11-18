// A short sample deck: every slide type, filled with the Peace week from the 2020
// Advent template (its main point and discussion questions; Scripture in the ESV
// from esv.org). For getting a feel for the look; never published to Dropbox.
//
//   npm run sample        → dist/advent-sample.pptx and one PNG per slide in dist/render/advent-sample/

const fs = require("fs");
const path = require("path");
const { Deck } = require("./lib/slides");
const { THEME } = require("./lib/theme");
const { applyTheme } = require("./lib/apply_theme");
const { dedupeMedia } = require("./lib/dedupe_media");
const { runKeynote } = require("./lib/keynote");

const DIST = path.join(__dirname, "dist");

const ISAIAH_9_2_7 = [
	"[2] The people who walked in darkness",
	"|have seen a great light;",
	"those who dwelt in a land of deep darkness,",
	"|on them has light shone.",
	"[3] You have multiplied the nation;",
	"|you have increased its joy;",
	"they rejoice before you",
	"|as with joy at the harvest,",
	"|as they are glad when they divide the spoil.",
	"[4] For the yoke of his burden,",
	"|and the staff for his shoulder,",
	"|the rod of his oppressor,",
	"|you have broken as on the day of Midian.",
	"[5] For every boot of the tramping warrior in battle tumult",
	"|and every garment rolled in blood",
	"|will be burned as fuel for the fire.",
	"[6] For to us a child is born,",
	"|to us a son is given;",
	"and the government shall be upon his shoulder,",
	"|and his name shall be called",
	"Wonderful Counselor, Mighty God,",
	"|Everlasting Father, *Prince of Peace*.",
	"[7] Of the increase of his government and of peace",
	"|there will be no end,",
	"on the throne of David and over his kingdom,",
	"|to establish it and to uphold it",
	"with justice and with righteousness",
	"|from this time forth and forevermore.",
	"The zeal of the LORD of hosts will do this.",
].join("\n");

const plan = { number: "00", title: "Peace", passage: "Isaiah 9:2–7" };

async function main() {
	fs.mkdirSync(DIST, { recursive: true });
	const deck = new Deck({ title: "Advent — sample" });
	deck.cover();
	deck.sermonTitle(plan);
	deck.statement({ text: "True peace is *restoring what was broken* to completeness." });
	deck.scripture({ book: "Isaiah", verses: "9:2–7", text: ISAIAH_9_2_7 });
	deck.scripture({
		book: "Ephesians",
		verses: "4:1–3",
		text: "[1] I therefore, a prisoner for the Lord, urge you to walk in a manner worthy of the calling to which you have been called, [2] with all humility and gentleness, with patience, bearing with one another in love, [3] eager to maintain the unity of the Spirit in *the bond of peace*.",
	});
	deck.discussion({
		label: "Peace – restoring what was broken to completeness",
		questions: [
			"What Christmas movie do you watch during the Christmas season?",
			"How does this biblical definition of peace (shalom) relate to hope?",
			"There is something miraculous about the birth of Christ. When reading vv5-6, how does this shalom message relate?",
		],
	});
	deck.nextWeek([plan, { number: "01", title: "Joy", readAhead: ["Read-ahead passages"] }], "00");
	deck.cover({ badge: "AUDIO ONLY" });

	const out = path.join(DIST, "advent-sample.pptx");
	await deck.pres.writeFile({ fileName: out });
	await applyTheme(out, THEME);
	await dedupeMedia(out);
	console.log(`built ${path.relative(__dirname, out)}`);
	for (const t of deck.todos) console.warn(`  to finish — ${t}`);

	const render = path.join(DIST, "render", "advent-sample");
	fs.rmSync(render, { recursive: true, force: true });
	fs.mkdirSync(render, { recursive: true });
	runKeynote(`
		tell application "Keynote"
			set d to open (POSIX file "${out}")
			export d to (POSIX file "${render}") as slide images with properties {image format:PNG}
			close d saving no
		end tell`);
	console.log(`rendered ${fs.readdirSync(render).length} slides to ${path.relative(__dirname, render)}/`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
