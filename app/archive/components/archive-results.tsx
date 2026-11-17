import { TeachingList, TeachingRow } from "@/app/components/teaching-row";
import { Label } from "@/app/components/ui/label";
import { Link } from "@/app/components/ui/link/link";
import type { Teaching } from "@/lib/teachings";

interface ArchiveResultsProps {
	/** Newest first. */
	teachings: Teaching[];
	query?: string;
	includeCrossReferences: boolean;
}

const plural = (n: number) => `${n} ${n === 1 ? "teaching" : "teachings"}`;

function groupByYear(teachings: Teaching[]) {
	const groups = new Map<string, Teaching[]>();
	for (const teaching of teachings) {
		const year = teaching.date.slice(0, 4);
		groups.set(year, [...(groups.get(year) ?? []), teaching]);
	}
	return [...groups.entries()];
}

export function ArchiveResults({ teachings, query, includeCrossReferences }: ArchiveResultsProps) {
	const hasQuery = Boolean(query);
	const status = hasQuery
		? `${plural(teachings.length)} for “${query}”${includeCrossReferences ? ", including cross-references" : ""}`
		: plural(teachings.length);

	return (
		<div>
			<p
				aria-live="polite"
				className="flex flex-wrap items-baseline gap-x-5 gap-y-1 pb-4 text-[15px] text-text-secondary"
			>
				<span>{status}</span>
				{hasQuery && (
					<Link href="/archive" variant="text" aria-label="Clear search">
						Clear
					</Link>
				)}
			</p>

			{teachings.length === 0 ? (
				<EmptyState query={query} />
			) : (
				<div className="flex flex-col gap-12">
					{groupByYear(teachings).map(([year, rows]) => (
						<section key={year} aria-labelledby={`year-${year}`}>
							<Label as="h2" id={`year-${year}`} className="pb-3">
								{year}
							</Label>
							<TeachingList aria-labelledby={`year-${year}`}>
								{rows.map((teaching) => (
									<TeachingRow key={teaching.id} teaching={teaching} />
								))}
							</TeachingList>
						</section>
					))}
				</div>
			)}
		</div>
	);
}

function EmptyState({ query }: { query?: string }) {
	return (
		<div className="border-t border-border py-12">
			<p className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] leading-tight text-text-primary [overflow-wrap:anywhere]">
				Nothing here for &ldquo;{query}&rdquo;.
			</p>
			<p className="mt-4 max-w-prose text-text-secondary">
				Try a book name such as Romans or Psalm, or include cross-references to look beyond the main
				passages of each teaching.
			</p>
			<p className="mt-8">
				<Link href="/archive" variant="text">
					Show every teaching
				</Link>
			</p>
		</div>
	);
}
