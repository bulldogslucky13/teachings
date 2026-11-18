import { describe, expect, it } from "vitest";
import { getAllSeriesSlugs, getSeriesBySlug } from "./getSeriesBySlug";
import { getSeriesSlug } from "./getSeriesSlug";
import { getAllTeachings } from "./teachings";

describe("getSeriesBySlug", () => {
	it("returns the series group with its teachings oldest to newest", async () => {
		const group = await getSeriesBySlug("merge-romans-11");
		expect(group?.series).toBe("Merge - Romans 11");
		expect(group?.teachings.map((t) => t.id)).toEqual(["1", "2", "3"]);
		expect(group?.startDate).toBe("2025-11-09");
	});

	it("strips cross-referenced scripture", async () => {
		const group = await getSeriesBySlug("merge-romans-11");
		for (const t of group?.teachings ?? []) {
			expect(t.scripture.every((r) => r.referenceType === "featured")).toBe(true);
		}
	});

	it("returns undefined for an unknown slug", async () => {
		expect(await getSeriesBySlug("no-such-series")).toBeUndefined();
	});

	it("does not resolve a single teaching's id or title", async () => {
		const all = await getAllTeachings();
		const single = all.find((t) => !t.series);
		if (!single) throw new Error("fixture missing");
		expect(await getSeriesBySlug(getSeriesSlug(single.title))).toBeUndefined();
	});
});

describe("getAllSeriesSlugs", () => {
	it("lists one unique, non-empty slug per series", async () => {
		const all = await getAllTeachings();
		const names = new Set(all.flatMap((t) => (t.series ? [t.series] : [])));
		const slugs = await getAllSeriesSlugs();
		expect(slugs).toHaveLength(names.size);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect(slugs.every((s) => s.length > 0)).toBe(true);
	});
});
