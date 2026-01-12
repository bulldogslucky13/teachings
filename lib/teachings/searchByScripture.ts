import { prepareTeachingToReturn } from "./prepareTeaching";
import { getAllTeachings, type Teaching } from "./teachings";

/**
 * Parse a scripture search query into book, optional chapter, and optional verses
 * Examples: "Romans 8" -> {book: "Romans", chapter: 8}
 *           "Matthew" -> {book: "Matthew", chapter: undefined}
 *           "2 Corinthians 5" -> {book: "2 Corinthians", chapter: 5}
 *           "Romans 8:28" -> {book: "Romans", chapter: 8, verses: [28]}
 *           "Romans 8:28-30" -> {book: "Romans", chapter: 8, verses: [28, 29, 30]}
 *           "Romans 8:1,3,5" -> {book: "Romans", chapter: 8, verses: [1, 3, 5]}
 */
function parseScriptureQuery(query: string): {
	book: string;
	chapter?: number;
	verses?: number[];
} | null {
	const trimmed = query.trim();
	if (!trimmed) return null;

	// Try to match book with optional chapter and verses
	// Handle books that start with numbers (e.g., "1 John", "2 Corinthians")
	// Pattern: "Book Chapter:Verses" where verses can be "1", "1-3", or "1,3,5"
	const match = trimmed.match(/^([0-9]?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s*(\d+)?(?::([0-9\-,]+))?$/);

	if (!match || !match[1]) return null;

	const book = match[1].trim();
	const chapter = match[2] ? Number.parseInt(match[2], 10) : undefined;

	// Parse verses if present
	let verses: number[] | undefined;
	if (match[3]) {
		verses = [];
		const verseParts = match[3].split(",");

		for (const part of verseParts) {
			if (part.includes("-")) {
				// Handle range (e.g., "28-30")
				const rangeParts = part.split("-");
				if (rangeParts.length === 2) {
					const start = Number.parseInt(rangeParts[0]?.trim() ?? "", 10);
					const end = Number.parseInt(rangeParts[1]?.trim() ?? "", 10);
					if (!Number.isNaN(start) && !Number.isNaN(end)) {
						for (let i = start; i <= end; i++) {
							verses.push(i);
						}
					}
				}
			} else {
				// Handle single verse
				const verse = Number.parseInt(part.trim(), 10);
				if (!Number.isNaN(verse)) {
					verses.push(verse);
				}
			}
		}

		// If we couldn't parse any verses, set to undefined
		if (verses.length === 0) {
			verses = undefined;
		}
	}

	return { book, chapter, verses };
}

/**
 * Search teachings by scripture reference
 * Matches book name (case-insensitive, partial match) and optionally chapter
 * Supports partial chapter matching (e.g., "Romans 1" matches chapters 1, 10-19)
 * Supports verse-level matching (e.g., "Romans 8:28" only matches if verse 28 exists)
 * If query is empty or invalid, returns all teachings with hidden scripture filtered out
 *
 * @param query - Scripture search query (e.g., "Romans 8", "Matthew 5:3-10")
 * @param includeCrossReferences - When false (default), only search featured scriptures.
 *                                  When true, also search cross-referenced scriptures.
 */
export async function searchTeachingsByScripture(
	query?: string,
	includeCrossReferences = false,
): Promise<Teaching[]> {
	const allTeachings = await getAllTeachings();

	const parsed = query ? parseScriptureQuery(query) : null;
	if (!parsed) return allTeachings.map(prepareTeachingToReturn);

	const { book, chapter, verses } = parsed;
	const normalizedBook = book.toLowerCase();

	return allTeachings
		.filter((teaching) => {
			// Filter scripture references based on includeCrossReferences setting
			const scriptureToSearch = includeCrossReferences
				? teaching.scripture
				: teaching.scripture.filter((ref) => ref.referenceType === "featured");

			// Check if any scripture reference matches
			return scriptureToSearch.some((ref) => {
				const refBookLower = ref.book.toLowerCase();

				// Book must match (partial, case-insensitive)
				const bookMatches = refBookLower.includes(normalizedBook);
				if (!bookMatches) return false;

				// If chapter is specified
				if (chapter !== undefined) {
					// If verses are also specified, use exact chapter match + verse matching
					if (verses !== undefined && verses.length > 0) {
						// Exact chapter match required for verse-level search
						if (ref.chapter !== chapter) return false;

						// Check if any searched verse exists in the teaching's verses array
						if (!ref.verses || ref.verses.length === 0) return false;

						// Convert teaching verses (stored as strings) to numbers for comparison
						const refVerseNumbers = ref.verses.map((v) => Number.parseInt(v, 10));

						// Check if any of the searched verses exist in the teaching
						return verses.some((searchedVerse) => refVerseNumbers.includes(searchedVerse));
					}

					// No verses specified - use partial chapter matching
					// "Romans 1" should match chapters 1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
					const chapterStr = chapter.toString();
					const refChapterStr = ref.chapter.toString();
					return refChapterStr.startsWith(chapterStr);
				}

				// Book-only search matches all chapters
				return true;
			});
		})
		.map(prepareTeachingToReturn);
}
