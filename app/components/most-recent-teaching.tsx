import { format } from "date-fns";
import { getMostRecentTeaching } from "../../lib/teachings/get-most-recent";
import { Heading } from "./ui/heading/heading";
import { Text } from "./ui/text/text";

export async function MostRecentTeaching() {
	const mostRecentTeaching = await getMostRecentTeaching();

	if (!mostRecentTeaching) {
		return null;
	}

	const formattedDate = format(new Date(mostRecentTeaching.date), "MMMM d, yyyy");

	return (
		<section
			className="relative w-full h-[600px] bg-contain bg-no-repeat bg-center bg-black flex items-end"
			style={{
				backgroundImage: `url(/images/${mostRecentTeaching.coverPhoto})`,
			}}
		>
			<div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />
			<div className="relative z-10 mx-8 mb-12 w-full">
				<Text variant="caption" className="text-white/70 mb-2">
					{formattedDate}
				</Text>
				<Heading level="h2" className="text-white mb-3">
					{mostRecentTeaching.title}
				</Heading>
				<Text variant="body" size="lg" className="text-white/90">
					{mostRecentTeaching.description}
				</Text>
			</div>
		</section>
	);
}
