import { describe, expect, it } from "vitest";
import { groupTeachingsBySeries } from "./groupTeachingsBySeries";
import type { Teaching } from "./teachings";

const t = (id: string, date: string, series?: string, coverPhoto = `${id}.png`): Teaching => ({
	id,
	date,
	series,
	coverPhoto,
	title: `T${id}`,
	description: "",
	videoUrl: "",
	topics: [],
	scripture: [],
});

describe("groupTeachingsBySeries", () => {
	it("returns an empty list for no teachings", () => {
		expect(groupTeachingsBySeries([])).toEqual([]);
	});

	it("groups by series, oldest to newest inside a group", () => {
		const groups = groupTeachingsBySeries([
			t("3", "2026-05-24", "Truth"),
			t("1", "2026-03-22", "Truth"),
			t("2", "2026-05-10", "Truth"),
		]);
		expect(groups).toHaveLength(1);
		expect(groups[0]?.series).toBe("Truth");
		expect(groups[0]?.key).toBe("series:Truth");
		expect(groups[0]?.teachings.map((x) => x.id)).toEqual(["1", "2", "3"]);
		expect(groups[0]?.startDate).toBe("2026-03-22");
		expect(groups[0]?.endDate).toBe("2026-05-24");
	});

	it("makes single-item groups for teachings without a series", () => {
		const groups = groupTeachingsBySeries([t("1", "2026-05-03"), t("2", "2026-04-26")]);
		expect(groups).toHaveLength(2);
		expect(groups[0]?.series).toBeUndefined();
		expect(groups[0]?.key).toBe("teaching:1");
		expect(groups[0]?.teachings).toHaveLength(1);
		expect(groups[0]?.startDate).toBe("2026-05-03");
		expect(groups[0]?.endDate).toBe("2026-05-03");
	});

	it("orders groups by their most recent teaching", () => {
		const groups = groupTeachingsBySeries([
			t("1", "2025-11-09", "Romans"),
			t("2", "2026-04-07"),
			t("3", "2026-04-26", "Psalms"),
			t("4", "2025-11-30", "Romans"),
			t("5", "2026-05-24", "Truth"),
			t("6", "2026-03-22", "Truth"),
		]);
		expect(groups.map((g) => g.key)).toEqual([
			"series:Truth",
			"series:Psalms",
			"teaching:2",
			"series:Romans",
		]);
	});

	it("breaks date ties by the later-added (higher id) teaching", () => {
		const groups = groupTeachingsBySeries([
			t("13", "2026-04-26"),
			t("14", "2026-04-26", "Psalms"),
			t("12", "2026-04-19", "Psalms"),
		]);
		expect(groups.map((g) => g.key)).toEqual(["series:Psalms", "teaching:13"]);
	});

	it("uses the most recent teaching's cover photo for the group", () => {
		const groups = groupTeachingsBySeries([
			t("1", "2026-01-04", "Evangelism", "a.png"),
			t("2", "2026-01-18", "Evangelism", "b.png"),
		]);
		expect(groups[0]?.coverPhoto).toBe("b.png");
	});
});
