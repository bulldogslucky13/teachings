"use server";

import { getAllTeachings, type Teaching } from "./teachings";

/**
 * Parse a scripture search query into book and optional chapter
 * Examples: "Romans 8" -> {book: "Romans", chapter: 8}
 *           "Matthew" -> {book: "Matthew", chapter: undefined}
 *           "2 Corinthians 5" -> {book: "2 Corinthians", chapter: 5}
 */
export function parseScriptureQuery(query: string): {
	book: string;
	chapter?: number;
} | null {
	const trimmed = query.trim();
	if (!trimmed) return null;

	// Try to match book with optional chapter number at the end
	// Handle books that start with numbers (e.g., "1 John", "2 Corinthians")
	const match = trimmed.match(/^([0-9]?\s*[A-Za-z]+(?:\s+[A-Za-z]+)*)\s*(\d+)?$/);

	if (!match || !match[1]) return null;

	const book = match[1].trim();
	const chapter = match[2] ? Number.parseInt(match[2], 10) : undefined;

	return { book, chapter };
}

/**
 * Search teachings by scripture reference
 * Matches book name (case-insensitive, partial match) and optionally chapter
 */
export async function searchTeachingsByScripture(query: string): Promise<Teaching[]> {
	const allTeachings = await getAllTeachings();

	const parsed = parseScriptureQuery(query);
	if (!parsed) return [];

	const { book, chapter } = parsed;
	const normalizedBook = book.toLowerCase();

	return allTeachings.filter((teaching) => {
		// Check if any scripture reference matches
		return teaching.scripture.some((ref) => {
			const refBookLower = ref.book.toLowerCase();

			// Book must match (partial, case-insensitive)
			const bookMatches = refBookLower.includes(normalizedBook);
			if (!bookMatches) return false;

			// If chapter specified, it must match exactly
			if (chapter !== undefined) {
				return ref.chapter === chapter;
			}

			// Book-only search matches
			return true;
		});
	});
}
