import { SeriesPlaque } from "@/app/components/series-plaque/series-plaque";
import { Label } from "@/app/components/ui/label/label";
import type { TeachingGroup } from "@/lib/teachings/groupTeachingsBySeries";

export interface SeriesWallProps {
	groups: TeachingGroup[];
	totalTeachings: number;
}

/** Every series, and every single teaching, hung as plaques on the wall. */
export function SeriesWall({ groups, totalTeachings }: SeriesWallProps) {
	const seriesCount = groups.filter((g) => g.series).length;
	const singleCount = groups.length - seriesCount;
	const counts = [
		`${seriesCount} series`,
		singleCount > 0
			? `${singleCount} single ${singleCount === 1 ? "teaching" : "teachings"}`
			: null,
		`${totalTeachings} in all`,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<section id="series" aria-labelledby="series-heading" className="scroll-mt-24 pt-[88px]">
			<div className="page-wrap">
				<div className="mb-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-border pb-5">
					<h2
						id="series-heading"
						className="font-serif text-[40px] font-normal leading-[1.1] text-text-primary"
					>
						Series
					</h2>
					<Label as="p">{counts}</Label>
				</div>
				<div className="grid grid-cols-1 gap-x-12 gap-y-16 pb-28 min-[620px]:grid-cols-2 min-[1000px]:grid-cols-3">
					{groups.map((group) => (
						<SeriesPlaque key={group.key} group={group} headingLevel="h3" />
					))}
				</div>
			</div>
		</section>
	);
}
