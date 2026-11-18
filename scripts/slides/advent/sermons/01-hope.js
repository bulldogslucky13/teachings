// Advent 01 — Hope (11/29/26). Ready for the transcript: walk it in order and replace
// the "to finish" slide with one slide per thing the room should see. Slide text is
// Cameron's wording from the transcript; Scripture is ESV, copied from esv.org.
//
//   deck.statement({ text, ref })                  a main point, read word for word
//   deck.scripture({ book, verses, text })         prose with [n], or poetry: "\n" per line, "|" to indent
//   deck.quote({ text, attribution, source })      source goes to the speaker notes
//   deck.discussion({ label, questions })          one slide per discussion section
//
// See sample.js for each of these in use.

const SERIES = require("../series");

const plan = SERIES.find((s) => s.number === "01");

module.exports = {
	number: "01",

	build(deck) {
		deck.section("Opening");
		deck.cover();
		deck.sermonTitle(plan);

		deck.section("Teaching");
		deck.todo("Slides from the Hope transcript");

		deck.section("Discussion");
		deck.discussion({ label: "Hope" });
		deck.nextWeek(SERIES, "01");
		// end on the series cover while groups talk
		deck.cover();
	},
};
