import { CanonStrip } from "@/app/components/ui/canon-strip/canon-strip";
import { Label } from "@/app/components/ui/label/label";
import { type CanonBook, getCanonCoverage } from "@/lib/teachings/canon";
import type { Teaching } from "@/lib/teachings/teachings";

const hrefForBook = (book: CanonBook) => `/archive?q=${encodeURIComponent(book.name)}`;

export interface CanonSectionProps {
	teachings: Teaching[];
}

/** A quiet band between the feature and the series wall: where the teaching has been in Scripture. */
export function CanonSection({ teachings }: CanonSectionProps) {
	return (
		<section
			aria-labelledby="canon-label"
			className="border-y border-border py-12 min-[900px]:py-14"
		>
			<div className="page-wrap">
				<Label as="p" id="canon-label" className="mb-6">
					Through the canon
				</Label>
				<CanonStrip coverage={getCanonCoverage(teachings)} hrefForBook={hrefForBook} />
			</div>
		</section>
	);
}
