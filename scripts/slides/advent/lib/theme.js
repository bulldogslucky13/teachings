// The series' look in one place, taken from the Advent template
// (Dropbox: College Hour/FA26/Advent/advent20-template.pptx): coral folded-paper
// background, white MORVA type, and the gold "ADVENT" wordmark with greenery.
// Change a colour or font here and every deck picks it up on the next build.

const THEME = {
	name: "Advent",
	headFontFace: "MORVA",
	bodyFontFace: "MORVA",
	colors: {
		dk1: "3A1F1F", // deep warm brown — rarely used; text sits on the coral paper
		lt1: "FFFFFF", // white — all slide text, as in the template
		dk2: "1F4D2B", // evergreen, from the greenery on the wordmark
		lt2: "FBE3DF", // pale blush — secondary text
		accent1: "F2EC9B", // pale gold, lifted from the wordmark — emphasis in Scripture and statements
		accent2: "FBD3CD", // light blush — quieter labels (references, "next week")
		accent3: "C9C740", // wordmark gold
		accent4: "EE5557", // the coral paper
		accent5: "B23A3D", // deep coral — rules and "to finish" boxes
		accent6: "2F6B2E", // leaf green
		hlink: "F2EC9B",
		folHlink: "C9C740",
	},
};

// Slide canvas (LAYOUT_WIDE, the same 16:9 as the template).
const W = 13.333;
const H = 7.5;

// The template's two full-bleed images, resized from 5600px to 2400px.
const ASSETS = {
	cover: { path: "assets/cover.jpg", w: 2400, h: 1350 },
	background: { path: "assets/background.jpg", w: 2400, h: 1350 },
};

// The background carries the ADVENT wordmark in its bottom-right corner. Text stays
// above this line wherever it would reach that corner.
const WORDMARK = { x: 8.1, y: 6.0 };

module.exports = { THEME, W, H, ASSETS, WORDMARK };
