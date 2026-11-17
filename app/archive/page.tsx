import type { Metadata } from "next";
import { Suspense } from "react";
import { CanonStrip } from "@/app/components/ui/canon-strip";
import { Heading } from "@/app/components/ui/heading/heading";
import { Label } from "@/app/components/ui/label";
import {
	compareTeachingsByRecency,
	formatDateRange,
	getCanonCoverage,
	searchTeachingsByScripture,
} from "@/lib/teachings";
import { findActiveBook } from "@/lib/teachings/findActiveBook";
import { getAllTeachings } from "@/lib/teachings/teachings";
import { ArchiveResults } from "./components/archive-results";
import { ScriptureSearch } from "./components/scripture-search";

export const metadata: Metadata = {
	title: "Archive",
	description: "Every teaching, searchable by book, chapter and verse.",
};

interface ArchivePageProps {
	searchParams: Promise<{ q?: string; crossRef?: string }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
	const { q, crossRef } = await searchParams;
	const query = q?.trim() || undefined;
	const includeCrossReferences = crossRef === "true";

	const [allTeachings, matches, rawTeachings] = await Promise.all([
		searchTeachingsByScripture(),
		searchTeachingsByScripture(query, includeCrossReferences),
		// Unfiltered: the canon strip needs cross-references to count (it exposes only counts).
		getAllTeachings(),
	]);

	const results = [...matches].sort(compareTeachingsByRecency);

	const dates = allTeachings.map((t) => t.date).sort();
	const first = dates[0];
	const last = dates[dates.length - 1];
	const summary = [
		`${allTeachings.length} ${allTeachings.length === 1 ? "teaching" : "teachings"}`,
		first && last ? formatDateRange(first, last) : undefined,
	]
		.filter(Boolean)
		.join(" · ");

	const coverage = getCanonCoverage(rawTeachings);
	const hrefForBook = (book: { name: string }, { crossReference }: { crossReference: boolean }) =>
		`/archive?q=${encodeURIComponent(book.name)}${
			crossReference || includeCrossReferences ? "&crossRef=true" : ""
		}`;

	return (
		<div className="page-wrap pb-24 pt-10 min-[900px]:pt-16">
			<header className="flex flex-col gap-4 pb-10 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between min-[900px]:pb-14">
				<div className="flex flex-col gap-4">
					<Label tone="accent">Archive</Label>
					<Heading level="h1">Every teaching</Heading>
				</div>
				<p className="text-[15px] text-text-secondary min-[900px]:pb-2 min-[900px]:text-right">
					{summary}
				</p>
			</header>

			<CanonStrip
				coverage={coverage}
				hrefForBook={hrefForBook}
				activeBook={findActiveBook(query)}
				aria-label="Browse the archive by book of the Bible"
			/>

			<div className="pb-12 pt-12 min-[900px]:pb-16 min-[900px]:pt-16">
				<Suspense fallback={<div className="h-[88px]" aria-hidden="true" />}>
					<ScriptureSearch />
				</Suspense>
			</div>

			<ArchiveResults
				teachings={results}
				query={query}
				includeCrossReferences={includeCrossReferences}
			/>
		</div>
	);
}
