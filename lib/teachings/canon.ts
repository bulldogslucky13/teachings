import type { Teaching } from "./teachings";

export type Testament = "OT" | "NT";

export interface CanonBook {
	/** Spelling used in the teaching data and accepted by `searchTeachingsByScripture`. */
	name: string;
	/** Display name (e.g. "Psalms" where the data uses "Psalm"). */
	label: string;
	testament: Testament;
}

export interface CanonBookCoverage {
	book: CanonBook;
	/** Number of teachings whose featured scripture includes this book. */
	count: number;
}

const OLD_TESTAMENT = [
	"Genesis",
	"Exodus",
	"Leviticus",
	"Numbers",
	"Deuteronomy",
	"Joshua",
	"Judges",
	"Ruth",
	"1 Samuel",
	"2 Samuel",
	"1 Kings",
	"2 Kings",
	"1 Chronicles",
	"2 Chronicles",
	"Ezra",
	"Nehemiah",
	"Esther",
	"Job",
	"Psalm",
	"Proverbs",
	"Ecclesiastes",
	"Song of Solomon",
	"Isaiah",
	"Jeremiah",
	"Lamentations",
	"Ezekiel",
	"Daniel",
	"Hosea",
	"Joel",
	"Amos",
	"Obadiah",
	"Jonah",
	"Micah",
	"Nahum",
	"Habakkuk",
	"Zephaniah",
	"Haggai",
	"Zechariah",
	"Malachi",
] as const;

const NEW_TESTAMENT = [
	"Matthew",
	"Mark",
	"Luke",
	"John",
	"Acts",
	"Romans",
	"1 Corinthians",
	"2 Corinthians",
	"Galatians",
	"Ephesians",
	"Philippians",
	"Colossians",
	"1 Thessalonians",
	"2 Thessalonians",
	"1 Timothy",
	"2 Timothy",
	"Titus",
	"Philemon",
	"Hebrews",
	"James",
	"1 Peter",
	"2 Peter",
	"1 John",
	"2 John",
	"3 John",
	"Jude",
	"Revelation",
] as const;

const DISPLAY_LABELS: Record<string, string> = { Psalm: "Psalms" };

/** The 66 books of the Protestant canon, in canonical order. */
export const canonBooks: readonly CanonBook[] = [
	...OLD_TESTAMENT.map((name) => ({
		name,
		label: DISPLAY_LABELS[name] ?? name,
		testament: "OT" as const,
	})),
	...NEW_TESTAMENT.map((name) => ({
		name,
		label: DISPLAY_LABELS[name] ?? name,
		testament: "NT" as const,
	})),
];

/**
 * Counts, for every canon book, how many teachings feature it. A teaching counts once
 * per book no matter how many featured references it has in that book.
 * Cross-referenced scripture is ignored.
 */
export function getCanonCoverage(
	teachings: ReadonlyArray<Pick<Teaching, "scripture">>,
): CanonBookCoverage[] {
	const counts = new Map<string, number>();
	for (const teaching of teachings) {
		const books = new Set(
			teaching.scripture.filter((ref) => ref.referenceType === "featured").map((ref) => ref.book),
		);
		for (const book of books) {
			counts.set(book, (counts.get(book) ?? 0) + 1);
		}
	}
	return canonBooks.map((book) => ({ book, count: counts.get(book.name) ?? 0 }));
}
