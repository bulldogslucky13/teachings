import { describe, expect, it } from "vitest";
import { canonBooks, getCanonCoverage } from "./canon";
import { searchTeachingsByScripture } from "./searchByScripture";
import { getAllTeachings, type ScriptureReference, type Teaching } from "./teachings";

const teaching = (id: string, scripture: Array<[string, ScriptureReference["referenceType"]]>) =>
	({
		id,
		coverPhoto: "x.png",
		date: "2026-01-01",
		title: id,
		description: "",
		videoUrl: "",
		topics: [],
		scripture: scripture.map(([book, referenceType]) => ({ book, chapter: 1, referenceType })),
	}) satisfies Teaching;

describe("canonBooks", () => {
	it("lists 66 books, 39 OT then 27 NT", () => {
		expect(canonBooks).toHaveLength(66);
		expect(canonBooks.filter((b) => b.testament === "OT")).toHaveLength(39);
		expect(canonBooks.filter((b) => b.testament === "NT")).toHaveLength(27);
		expect(canonBooks.slice(0, 39).every((b) => b.testament === "OT")).toBe(true);
	});

	it("is in canonical Protestant order", () => {
		expect(canonBooks[0]?.name).toBe("Genesis");
		expect(canonBooks[38]?.name).toBe("Malachi");
		expect(canonBooks[39]?.name).toBe("Matthew");
		expect(canonBooks[65]?.name).toBe("Revelation");
	});

	it("uses the data spelling for Psalms but a plural label", () => {
		const psalms = canonBooks.find((b) => b.label === "Psalms");
		expect(psalms?.name).toBe("Psalm");
	});

	it("has unique names", () => {
		expect(new Set(canonBooks.map((b) => b.name)).size).toBe(66);
	});

	it("spells every book used in the teaching data", async () => {
		const names = new Set(canonBooks.map((b) => b.name));
		const teachings = await getAllTeachings();
		for (const t of teachings) {
			for (const ref of t.scripture) {
				expect(names.has(ref.book), ref.book).toBe(true);
			}
		}
	});
});

describe("getCanonCoverage", () => {
	it("returns one entry per canon book in order", () => {
		const coverage = getCanonCoverage([]);
		expect(coverage).toHaveLength(66);
		expect(coverage.map((c) => c.book)).toEqual(canonBooks);
		expect(coverage.every((c) => c.count === 0)).toBe(true);
	});

	it("counts a teaching once per featured book", () => {
		const coverage = getCanonCoverage([
			teaching("1", [
				["Romans", "featured"],
				["Romans", "featured"],
				["Genesis", "cross-referenced"],
			]),
			teaching("2", [
				["Romans", "featured"],
				["Psalm", "featured"],
			]),
		]);
		const count = (name: string) => coverage.find((c) => c.book.name === name)?.count;
		expect(count("Romans")).toBe(2);
		expect(count("Psalm")).toBe(1);
		expect(count("Genesis")).toBe(0);
	});

	it("produces book queries that the archive search resolves", async () => {
		const coverage = getCanonCoverage(await getAllTeachings());
		for (const { book, count } of coverage) {
			if (count === 0) continue;
			const results = await searchTeachingsByScripture(book.name);
			expect(results.length, book.name).toBeGreaterThanOrEqual(count);
		}
	});
});
