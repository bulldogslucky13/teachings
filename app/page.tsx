import { CanonSection } from "@/app/components/home/canon-section";
import { FeatureBlock } from "@/app/components/home/feature-block";
import { RecentSection } from "@/app/components/home/recent-section";
import { SectionIndex } from "@/app/components/home/section-index";
import { SeriesWall } from "@/app/components/home/series-wall";
import {
	getFeaturedTeaching,
	getRecentTeachings,
	groupTeachingsBySeries,
	searchTeachingsByScripture,
} from "@/lib/teachings";

export default async function Page() {
	const featuredTeaching = await getFeaturedTeaching();

	// We should always have a feature teaching.
	if (!featuredTeaching) {
		return null;
	}

	// No query returns every teaching, prepared for display.
	const [allTeachings, recentTeachings] = await Promise.all([
		searchTeachingsByScripture("", false),
		getRecentTeachings(5),
	]);

	const groups = groupTeachingsBySeries(allTeachings);

	return (
		<>
			<SectionIndex seriesCount={groups.filter((group) => group.series).length} />
			<FeatureBlock teaching={featuredTeaching} />
			<CanonSection />
			<SeriesWall groups={groups} totalTeachings={allTeachings.length} />
			<RecentSection teachings={recentTeachings} />
		</>
	);
}
