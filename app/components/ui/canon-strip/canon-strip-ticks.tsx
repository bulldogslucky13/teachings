import NextLink from "next/link";
import {
	type CanonBook,
	type CanonBookCoverage,
	type CanonBookState,
	describeBookCoverage,
	type Testament,
} from "@/lib/teachings/canon";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";

export type CanonHrefForBook = (book: CanonBook, options: { crossReference: boolean }) => string;

const testaments: Array<{ id: Testament; name: string; range: string }> = [
	{ id: "OT", name: "Old Testament", range: "Genesis – Malachi" },
	{ id: "NT", name: "New Testament", range: "Matthew – Revelation" },
];

/** Tick height by count: 1 → 30px, 2 → 44px, 3+ → 60px. */
const tickHeight = (count: number) =>
	count >= 3 ? "after:h-[60px]" : count === 2 ? "after:h-[44px]" : "after:h-[30px]";

const tickBase =
	"relative block h-full after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:content-['']";

/** The visual of one tick, per state. Shared by the interactive and decorative strips. */
function tickVisual(
	{ state, count }: { state: CanonBookState; count: number },
	isActive: boolean,
	interactive: boolean,
) {
	if (state === "taught") {
		return cn(
			tickHeight(count),
			"after:bg-accent after:transition-[width] after:duration-150",
			isActive ? "after:w-1" : "after:w-0.5",
			interactive && "hover:after:w-1 focus-visible:after:w-1",
		);
	}
	if (state === "cross-referenced") {
		// Dotted left border in the accent colour, no fill: 2px wide, 22px tall.
		return cn(
			"after:h-[22px] after:border-dotted after:border-accent",
			"after:transition-[width,border-left-width] after:duration-150",
			isActive ? "after:w-1 after:border-l-4" : "after:w-0.5 after:border-l-2",
			interactive && "hover:after:w-1 hover:after:border-l-4",
			interactive && "focus-visible:after:w-1 focus-visible:after:border-l-4",
		);
	}
	return cn(
		"after:h-2.5 after:w-px after:bg-text-secondary/45 after:transition-[width,background-color] after:duration-150",
		interactive && "hover:after:w-[3px] hover:after:bg-text-secondary",
	);
}

interface CanonTicksProps {
	coverage: CanonBookCoverage[];
	/** Links when true; plain, unfocusable spans when false (the decorative copy). */
	interactive: boolean;
	hrefForBook: CanonHrefForBook;
	activeBook?: string;
}

/**
 * The two rows of ticks (OT, NT). Rendered twice by CanonStrip, once interactive and once
 * decorative, so the visuals cannot drift between them.
 */
export function CanonTicks({ coverage, interactive, hrefForBook, activeBook }: CanonTicksProps) {
	return (
		<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-[34px]">
			{testaments.map((testament) => {
				const books = coverage.filter((c) => c.book.testament === testament.id);
				return (
					<div key={testament.id} className="min-w-0 sm:basis-0" style={{ flexGrow: books.length }}>
						<ul
							aria-label={interactive ? testament.name : undefined}
							className="flex h-16 items-end border-b border-text-secondary/40 sm:h-[68px]"
						>
							{books.map((entry) => (
								<CanonTick
									key={entry.book.name}
									entry={entry}
									interactive={interactive}
									hrefForBook={hrefForBook}
									isActive={entry.book.name === activeBook}
								/>
							))}
						</ul>
						<div
							className={cn(labelTypography, "mt-2 flex justify-between gap-3 text-text-secondary")}
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
	);
}

interface CanonTickProps {
	entry: CanonBookCoverage;
	interactive: boolean;
	hrefForBook: CanonHrefForBook;
	isActive: boolean;
}

function CanonTick({ entry, interactive, hrefForBook, isActive }: CanonTickProps) {
	const { book, count } = entry;
	const { state, readout, label } = describeBookCoverage(entry);
	const className = cn(tickBase, tickVisual({ state, count }, isActive, interactive));
	const item = "h-full min-w-0 flex-1";

	if (!interactive) {
		return (
			<li className={item}>
				<span className={className} />
			</li>
		);
	}

	if (state === "none") {
		return (
			<li className={item} data-readout={readout}>
				<span role="img" aria-label={label} className={className} />
			</li>
		);
	}

	return (
		<li className={item} data-readout={readout}>
			<NextLink
				href={hrefForBook(book, { crossReference: state === "cross-referenced" })}
				prefetch={false}
				aria-label={label}
				aria-current={isActive ? "page" : undefined}
				className={cn(className, "outline-offset-0")}
			/>
		</li>
	);
}
