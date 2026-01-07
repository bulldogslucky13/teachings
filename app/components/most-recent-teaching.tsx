import { getMostRecentTeaching } from "../../lib/teachings/get-most-recent";

export async function MostRecentTeaching() {
	const mostRecentTeaching = await getMostRecentTeaching();

	if (!mostRecentTeaching) {
		return null;
	}

	return (
		<section
			className="relative w-full h-96 bg-cover bg-center flex items-center justify-center"
			style={{
				backgroundImage: `url(/images/${mostRecentTeaching.coverPhoto})`,
			}}
		>
			<div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />
			<div className="relative z-10 text-center px-4 max-w-4xl">
				<h2 className="text-4xl font-bold text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
					{mostRecentTeaching.title}
				</h2>
				<p className="text-xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
					{mostRecentTeaching.description}
				</p>
			</div>
		</section>
	);
}
