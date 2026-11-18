import { describe, expect, it } from "vitest";
import { buildSitemap } from "./buildSitemap";
import type { Teaching } from "./teachings";

const BASE = "https://example.com";

const t = (id: string, date: string, series?: string): Teaching => ({
	id,
	date,
	series,
	coverPhoto: `${id}.png`,
	title: `T${id}`,
	description: "",
	videoUrl: "",
	topics: [],
	scripture: [],
});

const teachings = [
	t("1", "2026-03-22", "Holy, Yet Near"),
	t("2", "2026-04-05", "Holy, Yet Near"),
	t("3", "2026-05-10"),
];

describe("buildSitemap", () => {
	it("lists the home page, archive, every series and every teaching once", () => {
		const urls = buildSitemap(teachings, BASE).map((e) => e.url);
		expect(urls).toEqual([
			"https://example.com/",
			"https://example.com/archive",
			"https://example.com/series/holy-yet-near",
			"https://example.com/teaching/1",
			"https://example.com/teaching/2",
			"https://example.com/teaching/3",
		]);
	});

	it("dates the home page and archive by the newest teaching", () => {
		const [home, archive] = buildSitemap(teachings, BASE);
		expect(home?.lastModified).toBe("2026-05-10");
		expect(archive?.lastModified).toBe("2026-05-10");
	});

	it("dates a series by its newest teaching and a teaching by its own date", () => {
		const entries = buildSitemap(teachings, BASE);
		const byUrl = new Map(entries.map((e) => [e.url, e]));
		expect(byUrl.get("https://example.com/series/holy-yet-near")?.lastModified).toBe("2026-04-05");
		expect(byUrl.get("https://example.com/teaching/1")?.lastModified).toBe("2026-03-22");
	});

	it("attaches absolute cover image URLs to series and teachings", () => {
		const entries = buildSitemap(teachings, BASE);
		const byUrl = new Map(entries.map((e) => [e.url, e]));
		expect(byUrl.get("https://example.com/series/holy-yet-near")?.images).toEqual([
			"https://example.com/images/2.png",
		]);
		expect(byUrl.get("https://example.com/teaching/3")?.images).toEqual([
			"https://example.com/images/3.png",
		]);
	});

	it("ignores a trailing slash on the base URL", () => {
		const [home] = buildSitemap(teachings, `${BASE}/`);
		expect(home?.url).toBe("https://example.com/");
	});

	it("returns just the home page and archive when there are no teachings", () => {
		const entries = buildSitemap([], BASE);
		expect(entries.map((e) => e.url)).toEqual([
			"https://example.com/",
			"https://example.com/archive",
		]);
		expect(entries[0]?.lastModified).toBeUndefined();
	});
});
