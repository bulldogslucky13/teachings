import { canonBooks } from "./canon";

const CHAPTER_AND_VERSES = /\s+\d+(?::[\d,\-–\s]*)?$/;

/**
 * Finds the canon book a scripture search query is about, so the canon strip can mark it.
 * The match is case-insensitive and ignores a trailing chapter/verse part, and accepts either
 * the data spelling ("Psalm") or the display label ("Psalms"). Partial names don't match.
 *
 * @returns the book's `name` (data spelling), or undefined.
 *
 * @example
 * findActiveBook("Romans 8:28") // "Romans"
 * findActiveBook("psalms 23") // "Psalm"
 */
export function findActiveBook(query: string | undefined): string | undefined {
	const bookPart = query?.trim().replace(CHAPTER_AND_VERSES, "").trim().toLowerCase();
	if (!bookPart) return undefined;
	return canonBooks.find(
		(book) => book.name.toLowerCase() === bookPart || book.label.toLowerCase() === bookPart,
	)?.name;
}
