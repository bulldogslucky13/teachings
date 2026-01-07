import { format } from "date-fns";
import { getMostRecentTeaching } from "../../lib/teachings/get-most-recent";

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
				<p className="text-md text-white/70 mb-2">{formattedDate}</p>
				<h2 className="text-4xl font-bold text-white mb-3">{mostRecentTeaching.title}</h2>
				<p className="text-lg text-white/90">{mostRecentTeaching.description}</p>
			</div>
		</section>
	);
}
