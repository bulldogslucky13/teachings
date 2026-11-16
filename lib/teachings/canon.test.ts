import { describe, expect, it } from "vitest";
import { canonBooks, describeBookCoverage, getCanonCoverage } from "./canon";
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
		expect(coverage.every((c) => c.count === 0 && c.crossReferenceCount === 0)).toBe(true);
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
		const find = (name: string) => coverage.find((c) => c.book.name === name);
		expect(find("Romans")?.count).toBe(2);
		expect(find("Psalm")?.count).toBe(1);
		expect(find("Genesis")?.count).toBe(0);
		expect(find("Genesis")?.crossReferenceCount).toBe(1);
	});

	it("counts cross-references only for teachings that do not feature the book", () => {
		const coverage = getCanonCoverage([
			// Features and cross-references Romans: counts toward `count` only.
			teaching("1", [
				["Romans", "featured"],
				["Romans", "cross-referenced"],
				["Isaiah", "cross-referenced"],
				["Isaiah", "cross-referenced"],
			]),
			teaching("2", [["Isaiah", "cross-referenced"]]),
			teaching("3", [["Romans", "cross-referenced"]]),
		]);
		const find = (name: string) => coverage.find((c) => c.book.name === name);
		expect(find("Romans")).toMatchObject({ count: 1, crossReferenceCount: 1 });
		expect(find("Isaiah")).toMatchObject({ count: 0, crossReferenceCount: 2 });
		expect(find("Genesis")).toMatchObject({ count: 0, crossReferenceCount: 0 });
	});

	it("produces book queries that the archive search resolves", async () => {
		const coverage = getCanonCoverage(await getAllTeachings());
		for (const { book, count, crossReferenceCount } of coverage) {
			if (count > 0) {
				const results = await searchTeachingsByScripture(book.name);
				expect(results.length, book.name).toBeGreaterThanOrEqual(count);
			}
			if (count === 0 && crossReferenceCount > 0) {
				const results = await searchTeachingsByScripture(book.name, true);
				expect(results.length, `${book.name} (cross-referenced)`).toBeGreaterThanOrEqual(
					crossReferenceCount,
				);
			}
		}
	});
});

describe("describeBookCoverage", () => {
	const book = (label: string) => ({ name: label, label, testament: "NT" as const });
	const describe_ = (label: string, count: number, crossReferenceCount: number) =>
		describeBookCoverage({ book: book(label), count, crossReferenceCount });

	it("describes a taught-only book", () => {
		expect(describe_("Romans", 3, 0)).toEqual({
			state: "taught",
			readout: "Romans · 3 teachings",
			label: "Romans, 3 teachings",
		});
		expect(describe_("Romans", 1, 0).readout).toBe("Romans · 1 teaching");
	});

	it("describes a taught book that is also cross-referenced elsewhere", () => {
		expect(describe_("Romans", 3, 2)).toEqual({
			state: "taught",
			readout: "Romans · 3 teachings · cross-referenced in 2 more",
			label: "Romans, 3 teachings, cross-referenced in 2 more",
		});
	});

	it("describes a cross-referenced-only book", () => {
		expect(describe_("Jeremiah", 0, 1)).toEqual({
			state: "cross-referenced",
			readout: "Jeremiah · cross-referenced in 1 teaching",
			label: "Jeremiah, cross-referenced in 1 teaching",
		});
		expect(describe_("Jeremiah", 0, 2).readout).toBe("Jeremiah · cross-referenced in 2 teachings");
	});

	it("describes a book with neither", () => {
		expect(describe_("Obadiah", 0, 0)).toEqual({
			state: "none",
			readout: "Obadiah",
			label: "Obadiah, no teachings yet",
		});
	});
});
