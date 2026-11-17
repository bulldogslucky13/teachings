import { TeachingList, TeachingRow } from "@/app/components/teaching-row/teaching-row";
import { Link } from "@/app/components/ui/link/link";
import type { Teaching } from "@/lib/teachings/teachings";

export interface RecentSectionProps {
	teachings: Teaching[];
}

export function RecentSection({ teachings }: RecentSectionProps) {
	return (
		<section id="recent" aria-labelledby="recent-heading" className="scroll-mt-6 pb-24">
			<div className="page-wrap">
				<h2
					id="recent-heading"
					className="pb-6 font-serif text-[40px] font-normal leading-[1.1] text-text-primary"
				>
					Recently added
				</h2>
				<TeachingList aria-labelledby="recent-heading">
					{teachings.map((teaching) => (
						<TeachingRow key={teaching.id} teaching={teaching} />
					))}
				</TeachingList>
				<p className="mt-7">
					<Link href="/archive" variant="text">
						Open the full archive →
					</Link>
				</p>
			</div>
		</section>
	);
}
