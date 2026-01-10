import { describe, expect, it } from "vitest";
import { searchTeachingsByScripture } from "./searchByScripture";

describe("searchTeachingsByScripture", () => {
	describe("book-only search", () => {
		it("should match all teachings with Romans references", async () => {
			const results = await searchTeachingsByScripture("Romans");
			expect(results.length).toBeGreaterThan(0);
			// All results should have at least one Romans scripture reference
			for (const teaching of results) {
				const hasRomans = teaching.scripture.some((ref) =>
					ref.book.toLowerCase().includes("romans"),
				);
				expect(hasRomans).toBe(true);
			}
		});

		it("should match teachings with Matthew references", async () => {
			const results = await searchTeachingsByScripture("Matthew");
			expect(results.length).toBeGreaterThan(0);
			for (const teaching of results) {
				const hasMatthew = teaching.scripture.some((ref) =>
					ref.book.toLowerCase().includes("matthew"),
				);
				expect(hasMatthew).toBe(true);
			}
		});
	});

	describe("partial chapter matching", () => {
		it("should match Romans chapters 1, 10-19 when searching 'Romans 1'", async () => {
			const results = await searchTeachingsByScripture("Romans 1");
			// Results should include teachings with Romans chapters starting with "1"
			for (const teaching of results) {
				const hasMatchingChapter = teaching.scripture.some(
					(ref) =>
						ref.book.toLowerCase().includes("romans") && ref.chapter.toString().startsWith("1"),
				);
				expect(hasMatchingChapter).toBe(true);
			}
		});

		it("should match only Romans chapter 11 when searching 'Romans 11'", async () => {
			const results = await searchTeachingsByScripture("Romans 11");
			// Results should include only Romans chapter 11 (partial match on "11")
			for (const teaching of results) {
				const hasMatchingChapter = teaching.scripture.some(
					(ref) =>
						ref.book.toLowerCase().includes("romans") && ref.chapter.toString().startsWith("11"),
				);
				expect(hasMatchingChapter).toBe(true);
			}
		});
	});

	describe("verse-level search", () => {
		it("should match teachings with Romans 11:1 when searching 'Romans 11:1'", async () => {
			const results = await searchTeachingsByScripture("Romans 11:1");
			// Results should have Romans 11 with verse 1
			for (const teaching of results) {
				const hasMatchingVerse = teaching.scripture.some(
					(ref) =>
						ref.book.toLowerCase().includes("romans") &&
						ref.chapter === 11 &&
						ref.verses?.includes("1"),
				);
				expect(hasMatchingVerse).toBe(true);
			}
		});

		it("should match teachings with any verse in range when searching 'Romans 11:1-10'", async () => {
			const results = await searchTeachingsByScripture("Romans 11:1-10");
			// Results should have Romans 11 with at least one verse from 1-10
			for (const teaching of results) {
				const hasMatchingVerse = teaching.scripture.some((ref) => {
					if (!ref.book.toLowerCase().includes("romans") || ref.chapter !== 11 || !ref.verses) {
						return false;
					}
					// Check if any verse from 1-10 exists
					const verseNumbers = ref.verses.map((v) => Number.parseInt(v, 10));
					return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some((v) => verseNumbers.includes(v));
				});
				expect(hasMatchingVerse).toBe(true);
			}
		});

		it("should match teachings with any specified verse when searching 'Romans 11:1,3,5'", async () => {
			const results = await searchTeachingsByScripture("Romans 11:1,3,5");
			// Results should have Romans 11 with at least one of verses 1, 3, or 5
			for (const teaching of results) {
				const hasMatchingVerse = teaching.scripture.some((ref) => {
					if (!ref.book.toLowerCase().includes("romans") || ref.chapter !== 11 || !ref.verses) {
						return false;
					}
					// Check if any of verses 1, 3, 5 exist
					const verseNumbers = ref.verses.map((v) => Number.parseInt(v, 10));
					return [1, 3, 5].some((v) => verseNumbers.includes(v));
				});
				expect(hasMatchingVerse).toBe(true);
			}
		});
	});

	describe("edge cases", () => {
		it("should return empty array for invalid query", async () => {
			const results = await searchTeachingsByScripture("");
			expect(results).toEqual([]);
		});

		it("should return empty array for non-existent book", async () => {
			const results = await searchTeachingsByScripture("NonExistentBook");
			expect(results).toEqual([]);
		});

		it("should handle books with numbers (e.g., 2 Corinthians)", async () => {
			const results = await searchTeachingsByScripture("2 Corinthians");
			for (const teaching of results) {
				const hasCorinthians = teaching.scripture.some((ref) =>
					ref.book.toLowerCase().includes("corinthians"),
				);
				expect(hasCorinthians).toBe(true);
			}
		});
	});
});
