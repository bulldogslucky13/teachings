import NextLink from "next/link";
import type { ReactNode } from "react";
import { labelTypography } from "@/app/components/ui/label/label";
import { cn } from "@/app/components/ui/utils/cn";
import { formatTeachingDate } from "@/lib/teachings/formatDate";
import { summarizeScriptureReferences } from "@/lib/teachings/formatScriptureReference";
import type { Teaching } from "@/lib/teachings/teachings";

export interface TeachingRowProps {
	teaching: Teaching;
	/** Defaults to `/teaching/{id}`. */
	href?: string;
	/** Show the series column (default true). */
	showSeries?: boolean;
	/** Marks the row as the current page. */
	isCurrent?: boolean;
	className?: string;
}

/**
 * One teaching as a single link row: date label, title, series and a short
 * featured-Scripture summary. Four columns from 900px; two lines below that
 * (title, then a meta line). Render inside <TeachingList>.
 */
export function TeachingRow({
	teaching,
	href = `/teaching/${teaching.id}`,
	showSeries = true,
	isCurrent = false,
	className,
}: TeachingRowProps) {
	const refs = summarizeScriptureReferences(teaching.scripture);

	return (
		<li className={cn("border-b border-border", className)}>
			<NextLink
				href={href}
				aria-current={isCurrent ? "page" : undefined}
				className={cn(
					"group grid grid-cols-1 items-baseline gap-x-8 gap-y-1 py-[18px] min-[900px]:py-[22px]",
					"min-[900px]:grid-cols-[120px_minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]",
				)}
			>
				<span
					className={cn(
						"font-serif text-2xl leading-[1.2] text-text-primary transition-colors duration-150 group-hover:text-accent-text",
						"min-[900px]:col-start-2 min-[900px]:row-start-1",
					)}
				>
					{teaching.title}
				</span>
				<span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5 min-[900px]:contents">
					<time
						dateTime={teaching.date}
						className={cn(
							labelTypography,
							"text-text-secondary min-[900px]:col-start-1 min-[900px]:row-start-1",
						)}
					>
						{formatTeachingDate(teaching.date)}
					</time>
					{showSeries && (
						<span className="font-serif text-[17px] italic text-text-secondary min-[900px]:col-start-3 min-[900px]:row-start-1 min-[900px]:text-[19px]">
							{teaching.series ?? ""}
						</span>
					)}
					{refs && (
						<span className="text-[13px] tracking-[0.02em] text-text-secondary min-[900px]:col-start-4 min-[900px]:row-start-1">
							{refs}
						</span>
					)}
				</span>
			</NextLink>
		</li>
	);
}

export interface TeachingListProps {
	children: ReactNode;
	/** Accessible name for the list, if it is not labelled by a nearby heading. */
	"aria-label"?: string;
	"aria-labelledby"?: string;
	className?: string;
}

/** A hairline-ruled list of <TeachingRow>s. */
export function TeachingList({ children, className, ...aria }: TeachingListProps) {
	return (
		<ul className={cn("border-t border-border", className)} {...aria}>
			{children}
		</ul>
	);
}
