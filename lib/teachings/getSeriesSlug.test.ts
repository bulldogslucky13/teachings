import { describe, expect, it } from "vitest";
import { getSeriesHref, getSeriesSlug } from "./getSeriesSlug";

describe("getSeriesSlug", () => {
	it("lowercases and hyphenates words", () => {
		expect(getSeriesSlug("Sola Scriptura Case Studies")).toBe("sola-scriptura-case-studies");
	});

	it("collapses punctuation and separators into a single hyphen", () => {
		expect(getSeriesSlug("Merge - Romans 11")).toBe("merge-romans-11");
		expect(getSeriesSlug("Holy, Yet Near")).toBe("holy-yet-near");
	});

	it("drops apostrophes rather than splitting on them", () => {
		expect(getSeriesSlug("Psalms - God's Heart Book")).toBe("psalms-gods-heart-book");
		expect(getSeriesSlug("God’s Heart")).toBe("gods-heart");
	});

	it("spells out ampersands", () => {
		expect(getSeriesSlug("Tradition & The Incarnation")).toBe("tradition-and-the-incarnation");
	});

	it("strips accents and trims stray hyphens", () => {
		expect(getSeriesSlug("  Café Talks!  ")).toBe("cafe-talks");
	});

	it("returns an empty string when nothing is left", () => {
		expect(getSeriesSlug("—")).toBe("");
	});
});

describe("getSeriesHref", () => {
	it("builds the series page path", () => {
		expect(getSeriesHref("Sola Scriptura Case Studies")).toBe(
			"/series/sola-scriptura-case-studies",
		);
	});
});
