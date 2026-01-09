import { FeaturedTeachingHero } from "@/app/components/featured-teaching-hero/featured-teaching-hero";
import { RecentTeachings } from "@/app/components/recent-teachings/recent-teachings";
import { getFeaturedTeaching, getRecentTeachings } from "@/lib/teachings";

export default async function Page() {
	const featuredTeaching = await getFeaturedTeaching();

	// We should always have a feature teaching.
	if (!featuredTeaching) {
		return null;
	}

	const recentTeachings = await getRecentTeachings(5);

	return (
		<main className="bg-background">
			<FeaturedTeachingHero teaching={featuredTeaching} />
			<RecentTeachings teachings={recentTeachings} />
		</main>
	);
}
