import { CanonStrip } from "@/app/components/ui/canon-strip/canon-strip";
import { Label } from "@/app/components/ui/label/label";
import { type CanonBook, getCanonCoverage } from "@/lib/teachings/canon";
import { getAllTeachings } from "@/lib/teachings/teachings";

const hrefForBook = (book: CanonBook, { crossReference }: { crossReference: boolean }) =>
	`/archive?q=${encodeURIComponent(book.name)}${crossReference ? "&crossRef=true" : ""}`;

/**
 * A quiet band between the feature and the series wall: where the teaching has been in Scripture.
 * Loads the unfiltered teachings itself because display-prepared teachings have their
 * cross-references stripped (the strip only ever shows counts).
 */
export async function CanonSection() {
	const coverage = getCanonCoverage(await getAllTeachings());
	return (
		<section
			id="canon"
			aria-labelledby="canon-label"
			className="scroll-mt-6 border-y border-border py-12 min-[900px]:py-10"
		>
			<div className="page-wrap">
				<Label as="p" id="canon-label" className="mb-6">
					Through the canon
				</Label>
				<CanonStrip coverage={coverage} hrefForBook={hrefForBook} />
			</div>
		</section>
	);
}
