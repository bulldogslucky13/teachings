import { FeaturedTeachingHero } from "@/app/components/featured-teaching-hero/featured-teaching-hero";
import { RecentTeachings } from "@/app/components/recent-teachings/recent-teachings";
import { teachings } from "@/lib/teachings";

export default function Page() {
	const featuredTeaching = teachings.find((teaching) => teaching.isFeatured);

	if (!featuredTeaching) {
		return null;
	}

	// Get last 5 teachings sorted by date (most recent first)
	const recentTeachings = [...teachings]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, 5);

	return (
		<main>
			<FeaturedTeachingHero teaching={featuredTeaching} />
			<RecentTeachings teachings={recentTeachings} />
		</main>
	);
}
