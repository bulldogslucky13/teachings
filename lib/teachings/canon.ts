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
	/**
	 * Number of teachings that cross-reference this book without featuring it. A teaching that
	 * both features and cross-references a book counts only toward `count`.
	 */
	crossReferenceCount: number;
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
 * Counts, for every canon book, how many teachings feature it (`count`) and how many only
 * cross-reference it (`crossReferenceCount`). A teaching counts once per book no matter how
 * many references it has in that book, and a book it features is never also counted as
 * cross-referenced.
 */
export function getCanonCoverage(
	teachings: ReadonlyArray<Pick<Teaching, "scripture">>,
): CanonBookCoverage[] {
	const featured = new Map<string, number>();
	const crossReferenced = new Map<string, number>();
	for (const teaching of teachings) {
		const featuredBooks = new Set(
			teaching.scripture.filter((ref) => ref.referenceType === "featured").map((ref) => ref.book),
		);
		const crossReferencedBooks = new Set(
			teaching.scripture
				.filter((ref) => ref.referenceType === "cross-referenced" && !featuredBooks.has(ref.book))
				.map((ref) => ref.book),
		);
		for (const book of featuredBooks) {
			featured.set(book, (featured.get(book) ?? 0) + 1);
		}
		for (const book of crossReferencedBooks) {
			crossReferenced.set(book, (crossReferenced.get(book) ?? 0) + 1);
		}
	}
	return canonBooks.map((book) => ({
		book,
		count: featured.get(book.name) ?? 0,
		crossReferenceCount: crossReferenced.get(book.name) ?? 0,
	}));
}

export type CanonBookState = "taught" | "cross-referenced" | "none";

export interface CanonBookDescription {
	/** `taught` when featured at least once, `cross-referenced` when only cross-referenced. */
	state: CanonBookState;
	/** Visual text, e.g. "Romans · 3 teachings · cross-referenced in 2 more". */
	readout: string;
	/** Accessible name, e.g. "Romans, 3 teachings, cross-referenced in 2 more". */
	label: string;
}

const teachingsOf = (n: number) => `${n} ${n === 1 ? "teaching" : "teachings"}`;

/** The one place the strip and the book list get their wording from. */
export function describeBookCoverage({
	book,
	count,
	crossReferenceCount,
}: CanonBookCoverage): CanonBookDescription {
	if (count > 0) {
		const extra = crossReferenceCount > 0 ? `cross-referenced in ${crossReferenceCount} more` : "";
		return {
			state: "taught",
			readout: [book.label, teachingsOf(count), extra].filter(Boolean).join(" · "),
			label: [book.label, teachingsOf(count), extra].filter(Boolean).join(", "),
		};
	}
	if (crossReferenceCount > 0) {
		const extra = `cross-referenced in ${teachingsOf(crossReferenceCount)}`;
		return {
			state: "cross-referenced",
			readout: `${book.label} · ${extra}`,
			label: `${book.label}, ${extra}`,
		};
	}
	return { state: "none", readout: book.label, label: `${book.label}, no teachings yet` };
}
