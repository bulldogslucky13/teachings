import { FeaturedTeachingHero } from "@/app/components/featured-teaching-hero/featured-teaching-hero";
import { teachings } from "@/lib/teachings";

export default function Page() {
	const featuredTeaching = teachings.find((teaching) => teaching.isFeatured);

	if (!featuredTeaching) {
		return null;
	}

	return (
		<main>
			<FeaturedTeachingHero teaching={featuredTeaching} />
		</main>
	);
}
