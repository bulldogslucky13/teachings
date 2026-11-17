// The series plan. Title slides and each deck's "next week" slide read from here,
// so add the next sermon here as soon as it's known. `folder` is the sermon's folder
// in the ministry Dropbox (see lib/publish.js); `file` names the deck saved there.
// Set `taught: true` once a sermon has been taught: the build then leaves its Keynote
// file alone, so later changes to the slide types can't alter a deck already used.

module.exports = [
	{
		number: "01",
		taught: true,
		folder: "11-08 - The Jewel and The Safe",
		file: "01-the-jewel-and-the-safe",
		title: "The Jewel & The Safe",
		line1: "THE JEWEL &",
		line2: "THE SAFE",
		subtitle: "SOLA SCRIPTURA  ·  SOLA FIDE",
		passage: "2 TIMOTHY 3:16–17  ·  EPHESIANS 2:8–10",
		shortPassage: "2 TIM 3:16–17  ·  EPH 2:8–10", // for the top-right tag
		question: "Is Scripture alone enough — and how can we be saved?",
		readAhead: ["2 Timothy 3:14–17", "Ephesians 2:1–10"],
	},
	{
		number: "02",
		taught: true,
		folder: "11-15 - The Incarnation",
		file: "02-the-word-made-flesh",
		title: "The Word & The Witness",
		line1: "THE WORD &",
		line2: "THE WITNESS",
		subtitle: "SCRIPTURE  ·  TRADITION  ·  CREED",
		passage: "MATTHEW 15:1–6",
		question: "How should we view the relationship between Scripture and tradition?",
		readAhead: ["John 1:1–18", "Philippians 2:5–11", "Colossians 2:9"],
	},
];
