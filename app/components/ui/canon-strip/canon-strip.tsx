import { type CanonBookCoverage, describeBookCoverage } from "@/lib/teachings/canon";
import { CanonBookList } from "./canon-strip-book-list";
import { CanonStripLegend } from "./canon-strip-legend";
import { CanonStripReadout } from "./canon-strip-readout";
import { type CanonHrefForBook, CanonTicks } from "./canon-strip-ticks";

export interface CanonStripProps {
	/** One entry per canon book, in canonical order — from `getCanonCoverage(teachings)`. */
	coverage: CanonBookCoverage[];
	/**
	 * Where a book links to. `crossReference` is true for books that are only cross-referenced
	 * (never featured), so the target can include cross-references, e.g.
	 * `(book, { crossReference }) => "/archive?q=" + encodeURIComponent(book.name) + (crossReference ? "&crossRef=true" : "")`.
	 * Because this is a function, render CanonStrip from a Server Component (or from inside
	 * a Client Component) rather than passing it across the server/client boundary.
	 */
	hrefForBook: CanonHrefForBook;
	/** `name` of the currently selected book, if any (marked with aria-current). */
	activeBook?: string;
	/** Text shown above the ticks when nothing is hovered. */
	defaultReadout?: string;
	/** Accessible name of the navigation landmark. */
	"aria-label"?: string;
	className?: string;
}

/** Compact = viewport below 640px, or a coarse pointer. Pure CSS, so there is no hydration flash. */
const hideWhenCompact = "max-sm:hidden pointer-coarse:hidden";
const showWhenCompact = "hidden max-sm:block pointer-coarse:block";

/**
 * The canon strip: 66 ticks, one per book of the Bible in canonical order.
 * - Taught from: solid brass tick, taller with more teachings. Links to the book.
 * - Cross-referenced only: dotted brass tick. Links to the book including cross-references.
 * - Neither: short keyline tick, named but not focusable.
 *
 * Wraps to two rows (OT, NT) on narrow screens. In compact mode (below 640px or a coarse
 * pointer) the ticks are a decorative picture and the book list below carries the links.
 */
export function CanonStrip({
	coverage,
	hrefForBook,
	activeBook,
	defaultReadout = "Every book taught so far. Choose one.",
	"aria-label": ariaLabel = "Browse by book of the Bible",
	className,
}: CanonStripProps) {
	const active = coverage.find((c) => c.book.name === activeBook);
	const hasCrossReferenced = coverage.some((c) => c.count === 0 && c.crossReferenceCount > 0);

	return (
		<nav aria-label={ariaLabel} className={className}>
			<CanonStripReadout
				defaultText={active ? describeBookCoverage(active).readout : defaultReadout}
			>
				<div className={hideWhenCompact}>
					<CanonTicks
						coverage={coverage}
						interactive
						hrefForBook={hrefForBook}
						activeBook={activeBook}
					/>
				</div>
				<div aria-hidden="true" className={showWhenCompact}>
					<CanonTicks
						coverage={coverage}
						interactive={false}
						hrefForBook={hrefForBook}
						activeBook={activeBook}
					/>
				</div>
			</CanonStripReadout>
			<CanonStripLegend showCrossReferenced={hasCrossReferenced} />
			<CanonBookList
				coverage={coverage}
				hrefForBook={hrefForBook}
				activeBook={activeBook}
				className={`${showWhenCompact} mt-8`}
			/>
		</nav>
	);
}
