import { describe, expect, it } from "vitest";
import { formatDateRange, formatTeachingDate } from "./formatDate";

describe("formatTeachingDate", () => {
	it("defaults to the medium style", () => {
		expect(formatTeachingDate("2026-05-24")).toBe("May 24, 2026");
	});

	it("is UTC-safe on the first of the month", () => {
		expect(formatTeachingDate("2026-03-01")).toBe("Mar 1, 2026");
		expect(formatTeachingDate("2026-01-01", "monthYear")).toBe("Jan 2026");
	});

	it("supports long, monthDay and monthYear styles", () => {
		expect(formatTeachingDate("2026-03-22", "long")).toBe("March 22, 2026");
		expect(formatTeachingDate("2026-03-22", "monthDay")).toBe("Mar 22");
		expect(formatTeachingDate("2026-03-22", "monthYear")).toBe("Mar 2026");
	});

	it("returns an empty string for invalid input", () => {
		expect(formatTeachingDate("not-a-date")).toBe("");
	});
});

describe("formatDateRange", () => {
	it("collapses a range within one month", () => {
		expect(formatDateRange("2026-04-13", "2026-04-26")).toBe("Apr 2026");
	});

	it("handles a single date", () => {
		expect(formatDateRange("2026-04-13", "2026-04-13")).toBe("Apr 2026");
	});

	it("shares the year when both months are in the same year", () => {
		expect(formatDateRange("2026-03-22", "2026-05-24")).toBe("Mar–May 2026");
	});

	it("shows both years when the range crosses a year", () => {
		expect(formatDateRange("2025-11-09", "2026-01-18")).toBe("Nov 2025–Jan 2026");
	});

	it("orders reversed input", () => {
		expect(formatDateRange("2026-05-24", "2026-03-22")).toBe("Mar–May 2026");
	});
});
