/**
 * Formats an array of verse numbers into a readable string with range notation.
 * Consecutive verses are collapsed into ranges (e.g., "1-5" instead of "1,2,3,4,5").
 * Non-consecutive verses remain comma-separated (e.g., "1,5,9").
 *
 * @param verses - Array of verse numbers as strings (may be unsorted or undefined)
 * @returns Formatted string with ranges (e.g., "1-3,7,10-12") or empty string if no verses
 *
 * @example
 * formatVerseRanges(["1", "2", "3", "7", "8"]) // "1-3,7-8"
 * formatVerseRanges(["5"]) // "5"
 * formatVerseRanges(["3", "1", "2"]) // "1-3"
 * formatVerseRanges([]) // ""
 * formatVerseRanges(undefined) // ""
 */
export function formatVerseRanges(verses: string[] | undefined): string {
	// Handle undefined or empty array
	if (!verses || verses.length === 0) {
		return "";
	}

	// Convert to numbers, filter invalid values, and sort
	const verseNumbers = verses
		.map((v) => Number.parseInt(v, 10))
		.filter((n) => !Number.isNaN(n))
		.sort((a, b) => a - b);

	// If no valid verses after filtering, return empty string
	if (verseNumbers.length === 0) {
		return "";
	}

	// Single verse edge case
	if (verseNumbers.length === 1) {
		return String(verseNumbers[0]);
	}

	// Build ranges
	const ranges: string[] = [];
	let rangeStart = verseNumbers[0] as number;
	let rangeEnd = verseNumbers[0] as number;

	for (let i = 1; i < verseNumbers.length; i++) {
		const currentVerse = verseNumbers[i] as number;

		// Check if current verse is consecutive to the range end
		if (currentVerse === rangeEnd + 1) {
			// Extend the current range
			rangeEnd = currentVerse;
		} else {
			// Current verse breaks the sequence, close the current range
			if (rangeStart === rangeEnd) {
				// Single verse, no range notation
				ranges.push(String(rangeStart));
			} else {
				// Range of verses
				ranges.push(`${rangeStart}-${rangeEnd}`);
			}

			// Start a new range
			rangeStart = currentVerse;
			rangeEnd = currentVerse;
		}
	}

	// Close the final range
	if (rangeStart === rangeEnd) {
		ranges.push(String(rangeStart));
	} else {
		ranges.push(`${rangeStart}-${rangeEnd}`);
	}

	return ranges.join(",");
}
