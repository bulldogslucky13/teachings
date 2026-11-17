import { formatVerseRanges } from "./formatVerseRanges";
import type { ScriptureReference } from "./teachings";

type ReferenceParts = Pick<ScriptureReference, "book" | "chapter" | "verses">;

/**
 * Formats a scripture reference for display.
 *
 * @example
 * formatScriptureReference({ book: "Romans", chapter: 11, verses: ["1", ..., "10"] }) // "Romans 11:1-10"
 * formatScriptureReference({ book: "1 Thessalonians", chapter: 5, verses: ["1", ..., "5", "8"] }) // "1 Thessalonians 5:1-5, 8"
 * formatScriptureReference({ book: "Psalm", chapter: 100 }) // "Psalm 100"
 */
export function formatScriptureReference(ref: ReferenceParts): string {
	const verses = formatVerseRanges(ref.verses).split(",").join(", ");
	return verses ? `${ref.book} ${ref.chapter}:${verses}` : `${ref.book} ${ref.chapter}`;
}

/**
 * Builds a Bible Gateway (ESV) URL for a scripture reference.
 */
export function getBibleGatewayUrl(ref: ReferenceParts): string {
	return `https://www.biblegateway.com/passage/?search=${encodeURIComponent(formatScriptureReference(ref))}&version=ESV`;
}

/**
 * Summarises a teaching's featured references on one line: the first featured
 * reference, plus a count of the remaining featured references.
 *
 * @example "1 Thessalonians 5:1-5, 8-11 · +10"
 */
export function summarizeScriptureReferences(scripture: ScriptureReference[]): string {
	const featured = scripture.filter((ref) => ref.referenceType === "featured");
	const [first] = featured;
	if (!first) return "";
	const rest = featured.length - 1;
	const head = formatScriptureReference(first);
	return rest > 0 ? `${head} · +${rest}` : head;
}
