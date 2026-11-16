import NextLink from "next/link";
import type { CanonBook, CanonBookCoverage, Testament } from "@/lib/teachings/canon";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { CanonStripReadout } from "./canon-strip-readout";

export interface CanonStripProps {
	/** One entry per canon book, in canonical order — from `getCanonCoverage(teachings)`. */
	coverage: CanonBookCoverage[];
	/**
	 * Where a taught book links to, e.g. `(book) => "/archive?q=" + encodeURIComponent(book.name)`.
	 * Because this is a function, render CanonStrip from a Server Component (or from inside
	 * a Client Component) rather than passing it across the server/client boundary.
	 */
	hrefForBook: (book: CanonBook) => string;
	/** `name` of the currently selected book, if any (marked with aria-current). */
	activeBook?: string;
	/** Text shown above the ticks when nothing is hovered. */
	defaultReadout?: string;
	/** Accessible name of the navigation landmark. */
	"aria-label"?: string;
	className?: string;
}

const plural = (n: number) => `${n} ${n === 1 ? "teaching" : "teachings"}`;

/** Tick height by count: 1 → 30px, 2 → 44px, 3+ → 60px. */
const tickHeight = (count: number) =>
	count >= 3 ? "after:h-[60px]" : count === 2 ? "after:h-[44px]" : "after:h-[30px]";

/**
 * The canon strip: 66 ticks, one per book of the Bible in canonical order.
 * Taught books are taller brass ticks (height by number of teachings) and link
 * somewhere; untaught books are short keyline ticks that are named but not focusable.
 * Wraps to two rows (OT, NT) on narrow screens.
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
	const testaments: Array<{ id: Testament; name: string; range: string }> = [
		{ id: "OT", name: "Old Testament", range: "Genesis – Malachi" },
		{ id: "NT", name: "New Testament", range: "Matthew – Revelation" },
	];

	return (
		<nav aria-label={ariaLabel} className={className}>
			<CanonStripReadout
				defaultText={active ? `${active.book.label} · ${plural(active.count)}` : defaultReadout}
			>
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-[34px]">
					{testaments.map((testament) => {
						const books = coverage.filter((c) => c.book.testament === testament.id);
						return (
							<div
								key={testament.id}
								className="min-w-0 sm:basis-0"
								style={{ flexGrow: books.length }}
							>
								<ul
									aria-label={testament.name}
									className="flex h-16 items-end border-b border-text-secondary/40 sm:h-[68px]"
								>
									{books.map(({ book, count }) => (
										<CanonTick
											key={book.name}
											book={book}
											count={count}
											href={count > 0 ? hrefForBook(book) : undefined}
											isActive={book.name === activeBook}
										/>
									))}
								</ul>
								<div
									className={cn(
										labelTypography,
										"mt-2 flex justify-between gap-3 text-text-secondary",
									)}
								>
									<span>{testament.id}</span>
									<span className="hidden normal-case tracking-normal sm:inline">
										{testament.range}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			</CanonStripReadout>
		</nav>
	);
}

interface CanonTickProps {
	book: CanonBook;
	count: number;
	href: string | undefined;
	isActive: boolean;
}

function CanonTick({ book, count, href, isActive }: CanonTickProps) {
	const tick =
		"relative block h-full after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:content-['']";

	if (!href || count === 0) {
		return (
			<li className="h-full min-w-0 flex-1" data-readout={book.label}>
				<span
					role="img"
					aria-label={`${book.label}, no teachings yet`}
					className={cn(
						tick,
						"after:h-2.5 after:w-px after:bg-text-secondary/45 after:transition-[width,background-color] after:duration-150",
						"hover:after:w-[3px] hover:after:bg-text-secondary",
					)}
				/>
			</li>
		);
	}

	return (
		<li className="h-full min-w-0 flex-1" data-readout={`${book.label} · ${plural(count)}`}>
			<NextLink
				href={href}
				prefetch={false}
				aria-label={`${book.label}, ${plural(count)}`}
				aria-current={isActive ? "page" : undefined}
				className={cn(
					tick,
					tickHeight(count),
					"outline-offset-0 after:bg-accent after:transition-[width] after:duration-150",
					isActive ? "after:w-1" : "after:w-0.5",
					"hover:after:w-1 focus-visible:after:w-1",
				)}
			/>
		</li>
	);
}
