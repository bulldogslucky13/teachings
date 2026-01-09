import { describe, expect, it } from "vitest";
import { formatVerseRanges } from "./formatVerseRanges";

describe("formatVerseRanges", () => {
	it("should format consecutive verses as a range", () => {
		expect(formatVerseRanges(["1", "2", "3", "4", "5"])).toBe("1-5");
	});

	it("should format multiple ranges with non-consecutive verses", () => {
		expect(formatVerseRanges(["1", "2", "3", "7", "8", "9"])).toBe("1-3,7-9");
	});

	it("should format mixed ranges and single verses", () => {
		expect(formatVerseRanges(["1", "2", "3", "7", "10", "11", "12"])).toBe("1-3,7,10-12");
	});

	it("should format non-consecutive single verses", () => {
		expect(formatVerseRanges(["1", "5", "9"])).toBe("1,5,9");
	});

	it("should format a single verse without range notation", () => {
		expect(formatVerseRanges(["5"])).toBe("5");
	});

	it("should sort and format out of order verses correctly", () => {
		expect(formatVerseRanges(["3", "1", "2", "7", "5"])).toBe("1-3,5,7");
	});

	it("should return empty string for empty array", () => {
		expect(formatVerseRanges([])).toBe("");
	});

	it("should return empty string for undefined verses", () => {
		expect(formatVerseRanges(undefined)).toBe("");
	});

	it("should handle two consecutive verses as a range", () => {
		expect(formatVerseRanges(["5", "6"])).toBe("5-6");
	});

	it("should handle large verse numbers", () => {
		expect(formatVerseRanges(["100", "101", "102", "200"])).toBe("100-102,200");
	});

	it("should handle duplicate verses by treating them as one", () => {
		// After sorting and processing, duplicates appear consecutive
		// but should be filtered during range building
		expect(formatVerseRanges(["1", "1", "2", "3"])).toBe("1-3");
	});

	it("should ignore invalid verse strings", () => {
		// Filter out NaN values during parsing
		expect(formatVerseRanges(["1", "invalid", "2", "3"])).toBe("1-3");
	});
});
