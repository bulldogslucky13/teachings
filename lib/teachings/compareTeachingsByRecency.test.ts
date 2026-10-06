import { describe, expect, it } from "vitest";
import { compareTeachingsByRecency } from "./compareTeachingsByRecency";

describe("compareTeachingsByRecency", () => {
	it("should sort teachings by date, most recent first", () => {
		const teachings = [
			{ id: "1", date: "2026-01-01" },
			{ id: "2", date: "2026-03-01" },
			{ id: "3", date: "2026-02-01" },
		];
		const sorted = [...teachings].sort(compareTeachingsByRecency);
		expect(sorted.map((t) => t.id)).toEqual(["2", "3", "1"]);
	});

	it("should place the higher id first when dates are the same", () => {
		const teachings = [
			{ id: "20", date: "2026-10-03" },
			{ id: "21", date: "2026-10-03" },
			{ id: "22", date: "2026-10-04" },
		];
		const sorted = [...teachings].sort(compareTeachingsByRecency);
		expect(sorted.map((t) => t.id)).toEqual(["22", "21", "20"]);
	});

	it("should compare ids numerically rather than alphabetically", () => {
		const teachings = [
			{ id: "9", date: "2026-10-03" },
			{ id: "10", date: "2026-10-03" },
		];
		const sorted = [...teachings].sort(compareTeachingsByRecency);
		expect(sorted.map((t) => t.id)).toEqual(["10", "9"]);
	});

	it("should prefer the more recent date even when its id is lower", () => {
		const teachings = [
			{ id: "5", date: "2026-01-01" },
			{ id: "4", date: "2026-06-01" },
		];
		const sorted = [...teachings].sort(compareTeachingsByRecency);
		expect(sorted.map((t) => t.id)).toEqual(["4", "5"]);
	});
});
