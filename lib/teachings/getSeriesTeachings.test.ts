import { describe, expect, it } from "vitest";
import { getSeriesTeachings } from "./getSeriesTeachings";
import { getAllTeachings } from "./teachings";

describe("getSeriesTeachings", () => {
	it("returns every teaching in the same series ordered by date", async () => {
		const all = await getAllTeachings();
		const member = all.find((t) => t.series === "Merge - Romans 11");
		if (!member) throw new Error("fixture missing");
		const series = await getSeriesTeachings(member);
		expect(series.map((t) => t.id)).toEqual(["1", "2", "3"]);
		const dates = series.map((t) => t.date);
		expect([...dates].sort()).toEqual(dates);
	});

	it("strips cross-referenced scripture", async () => {
		const all = await getAllTeachings();
		const member = all.find((t) => t.series === "Merge - Romans 11");
		if (!member) throw new Error("fixture missing");
		const series = await getSeriesTeachings(member);
		for (const t of series) {
			expect(t.scripture.every((r) => r.referenceType === "featured")).toBe(true);
		}
	});

	it("returns an empty list for a teaching without a series", async () => {
		const all = await getAllTeachings();
		const single = all.find((t) => !t.series);
		if (!single) throw new Error("fixture missing");
		expect(await getSeriesTeachings(single)).toEqual([]);
	});
});
