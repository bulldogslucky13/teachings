import NextLink from "next/link";
import { CoverMat, type CoverMatSize } from "@/app/components/ui/cover-mat/cover-mat";
import { labelTypography } from "@/app/components/ui/label/label";
import { cn } from "@/app/components/ui/utils/cn";
import { formatDateRange, formatTeachingDate } from "@/lib/teachings/formatDate";
import { summarizeScriptureReferences } from "@/lib/teachings/formatScriptureReference";
import type { TeachingGroup } from "@/lib/teachings/groupTeachingsBySeries";
import type { Teaching } from "@/lib/teachings/teachings";

export interface SeriesPlaqueProps {
	/** A group from `groupTeachingsBySeries`. */
	group: TeachingGroup;
	/** Heading level of the plaque title (default "h3"). */
	headingLevel?: "h2" | "h3" | "h4";
	/** Mat size (default "md"). */
	matSize?: CoverMatSize;
	/** Where a teaching links to. Defaults to `/teaching/{id}`. */
	hrefForTeaching?: (teaching: Teaching) => string;
	/** Where the series mat and title link to. Defaults to the series' first teaching. */
	seriesHref?: string;
	/** Id of the teaching being viewed, marked with aria-current in the list. */
	currentTeachingId?: string;
	/** Load the cover eagerly. */
	priority?: boolean;
	className?: string;
}

const plural = (n: number) => `${n} ${n === 1 ? "teaching" : "teachings"}`;
const defaultHref = (teaching: Teaching) => `/teaching/${teaching.id}`;

/**
 * A matted cover with a museum label beneath it.
 * - Series: title, "4 teachings · Mar–May 2026", then each teaching as a link with its date.
 * - Single teaching: the whole plaque is one link; shows the featured Scripture line.
 */
export function SeriesPlaque({
	group,
	headingLevel = "h3",
	matSize = "md",
	hrefForTeaching = defaultHref,
	seriesHref,
	currentTeachingId,
	priority,
	className,
}: SeriesPlaqueProps) {
	const Heading = headingLevel;
	const titleClass = "font-serif text-2xl font-medium leading-[1.15] text-text-primary";
	const [first] = group.teachings;

	if (!first) return null;

	if (!group.series) {
		const refs = summarizeScriptureReferences(first.scripture);
		return (
			<article className={className}>
				<NextLink href={hrefForTeaching(first)} className="group block">
					<CoverMat coverPhoto={group.coverPhoto} size={matSize} interactive priority={priority} />
					<div className="pt-[22px]">
						<Heading
							className={cn(
								titleClass,
								"transition-colors duration-150 group-hover:text-accent-text",
							)}
						>
							{first.title}
						</Heading>
						<p className={cn(labelTypography, "mt-2 text-text-secondary")}>
							Single teaching · {formatTeachingDate(first.date)}
						</p>
						{refs && (
							<p className="mt-[18px] border-t border-border pt-3 text-[15px] text-text-secondary">
								{refs}
							</p>
						)}
					</div>
				</NextLink>
			</article>
		);
	}

	const href = seriesHref ?? hrefForTeaching(first);

	return (
		<article className={className}>
			<NextLink href={href} className="group block" tabIndex={-1} aria-hidden="true">
				<CoverMat coverPhoto={group.coverPhoto} size={matSize} interactive priority={priority} />
			</NextLink>
			<div className="pt-[22px]">
				<Heading className={titleClass}>
					<NextLink href={href} className="transition-colors duration-150 hover:text-accent-text">
						{group.series}
					</NextLink>
				</Heading>
				<p className={cn(labelTypography, "mt-2 text-text-secondary")}>
					{plural(group.teachings.length)} · {formatDateRange(group.startDate, group.endDate)}
				</p>
				<ul className="mt-[18px] border-t border-border">
					{group.teachings.map((teaching) => {
						const isCurrent = teaching.id === currentTeachingId;
						return (
							<li key={teaching.id} className="border-b border-border">
								<NextLink
									href={hrefForTeaching(teaching)}
									aria-current={isCurrent ? "page" : undefined}
									className={cn(
										"flex items-baseline justify-between gap-4 py-[9px] text-[15px] leading-[1.35] transition-colors duration-150 hover:text-text-primary",
										isCurrent ? "text-text-primary" : "text-text-secondary",
									)}
								>
									<span>{teaching.title}</span>
									<time
										dateTime={teaching.date}
										className="whitespace-nowrap text-[13px] tabular-nums"
									>
										{formatTeachingDate(teaching.date, "monthDay")}
									</time>
								</NextLink>
							</li>
						);
					})}
				</ul>
			</div>
		</article>
	);
}
