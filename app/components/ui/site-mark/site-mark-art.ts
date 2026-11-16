/**
 * Geometry of the site mark on a 32-unit square: a cross standing as the tallest tick
 * on a short run of the canon strip. Shared by the SiteMark component and the generated
 * favicon / Apple icon so the three cannot drift.
 */
export interface SiteMarkStroke {
	d: string;
	width: number;
	opacity?: number;
}

/** `simple` drops the inner ticks and thickens strokes so the mark holds at 16–24px. */
export function siteMarkStrokes(detail: "full" | "simple"): SiteMarkStroke[] {
	if (detail === "simple") {
		return [
			{ d: "M6 25.5H26", width: 1.5, opacity: 0.55 },
			{ d: "M8 25.5V19.5M24 25.5V17.5", width: 2, opacity: 0.8 },
			{ d: "M16 6V25.5M11 12H21", width: 2.75 },
		];
	}
	return [
		{ d: "M6.5 24.5H25.5", width: 0.8, opacity: 0.55 },
		{ d: "M8.5 24.5V20M11.5 24.5V22M20.5 24.5V21M23.5 24.5V18.5", width: 1.1, opacity: 0.8 },
		{ d: "M16 7V24.5M12 12H20", width: 1.7 },
	];
}
