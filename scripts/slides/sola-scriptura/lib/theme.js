// The series' look in one place. Colours are sampled from the original cover art.
// Change a colour or font here and every deck picks it up on the next build.

const THEME = {
	name: "Sola Scriptura",
	headFontFace: "Times New Roman",
	bodyFontFace: "Cambria",
	colors: {
		dk1: "16120F", // iron-gall ink — titles and body text
		lt1: "F4ECDF", // light parchment — text on dark slides, card fills
		dk2: "4A3F35", // umber — historical quotations
		lt2: "E2D3BD", // parchment
		accent1: "721111", // Reformation red — reserved for Scripture
		accent2: "8A7A68", // weathered stone — labels, rules, footers
		accent3: "5C0B0B", // deep red — the "SCRIPTURA" ink
		accent4: "231E1A", // charcoal — dark slide background
		accent5: "C9B79C", // dim parchment — secondary text on dark slides
		accent6: "D0715F", // light red — Scripture references on dark slides
		hlink: "721111",
		folHlink: "5C0B0B",
	},
};

// Slide canvas (LAYOUT_WIDE) and the scale of the original 1672×941 cover art.
const W = 13.333;
const H = 7.5;
const PX = W / 1672;
const px = (n) => n * PX;

// Natural pixel sizes of the raster assets (see scripts/make_assets.py).
const ASSETS = {
	parchment: { path: "assets/parchment.jpg", w: 2400, h: 1350 },
	cathedral: { path: "assets/cathedral.png", w: 861, h: 941, x: 811, y: 0 },
	// P46 ink: sepia for parchment; the "Light" twins are pale ink for the red blocks
	romans: { path: "assets/manuscript-romans.png", w: 830, h: 850 },
	romansLight: { path: "assets/manuscript-romans-light.png", w: 830, h: 850 },
	philippians: { path: "assets/manuscript-philippians.png", w: 830, h: 820 },
	philippiansLight: { path: "assets/manuscript-philippians-light.png", w: 830, h: 820 },
	colossians: { path: "assets/manuscript-colossians.png", w: 630, h: 370 },
	colossiansLight: { path: "assets/manuscript-colossians-light.png", w: 630, h: 370 },
	// older, stained paper that sits behind the manuscript and fades into the parchment
	agedPatch: { path: "assets/aged-patch.png", w: 520, h: 484 },
	agedStrip: { path: "assets/aged-strip.png", w: 160, h: 1100 },
	agedCard: { path: "assets/aged-card.jpg", w: 400, h: 1000 },
	redGrunge: { path: "assets/red-grunge.png", w: 640, h: 640 },
};

const SERIES = "SOLA SCRIPTURA · CASE STUDIES";

module.exports = { THEME, W, H, PX, px, ASSETS, SERIES };
