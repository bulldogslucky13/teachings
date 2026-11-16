import { useId } from "react";
import { type CanonBookCoverage, describeBookCoverage } from "@/lib/teachings/canon";
import { Label } from "../label/label";
import { Link } from "../link/link";
import { CanonBookGroup } from "./canon-strip-book-group";
import type { CanonHrefForBook } from "./canon-strip-ticks";

interface CanonBookListProps {
	coverage: CanonBookCoverage[];
	hrefForBook: CanonHrefForBook;
	activeBook?: string;
	className?: string;
}

/**
 * The compact (touch / small screen) replacement for the ticks: text links in two groups,
 * each at least 44px tall with room between them. Hidden with CSS elsewhere.
 */
export function CanonBookList({
	coverage,
	hrefForBook,
	activeBook,
	className,
}: CanonBookListProps) {
	const idBase = useId();
	const groups = [
		{
			id: "taught",
			title: "Taught from",
			crossReference: false,
			items: coverage.filter((c) => c.count > 0).map((c) => ({ entry: c, n: c.count })),
		},
		{
			id: "cross-referenced",
			title: "Cross-referenced",
			crossReference: true,
			items: coverage
				.filter((c) => c.count === 0 && c.crossReferenceCount > 0)
				.map((c) => ({ entry: c, n: c.crossReferenceCount })),
		},
	].filter((group) => group.items.length > 0);

	return (
		<div className={className}>
			{groups.map((group) => {
				const labelId = `${idBase}-${group.id}`;
				const list = (
					<ul
						key="list"
						{...(group.crossReference
							? { "aria-label": group.title }
							: { "aria-labelledby": labelId })}
						className="mt-1 flex flex-wrap gap-x-4"
					>
						{group.items.map(({ entry, n }) => {
							const isActive = entry.book.name === activeBook;
							return (
								<li key={entry.book.name}>
									<Link
										variant="plain"
										href={hrefForBook(entry.book, { crossReference: group.crossReference })}
										aria-label={describeBookCoverage(entry).label}
										aria-current={isActive ? "page" : undefined}
										className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] text-text-primary"
									>
										<span
											className={
												isActive
													? "text-accent-text underline decoration-accent decoration-2 underline-offset-[6px]"
													: "underline decoration-border decoration-1 underline-offset-[6px] group-data-[hovered]:decoration-accent"
											}
										>
											{entry.book.label}
										</span>
										<span className="text-text-secondary">{n}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				);
				return group.crossReference ? (
					<div key={group.id} className="mt-6 first:mt-0">
						<CanonBookGroup
							title={group.title}
							count={group.items.length}
							defaultExpanded={group.items.some((i) => i.entry.book.name === activeBook)}
						>
							{list}
						</CanonBookGroup>
					</div>
				) : (
					<div key={group.id} className="mt-6 first:mt-0">
						<Label as="p" id={labelId}>
							{group.title}
						</Label>
						{list}
					</div>
				);
			})}
		</div>
	);
}
