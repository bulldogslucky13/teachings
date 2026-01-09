import Link from "next/link";
import { TeachingCard } from "@/app/components/teaching-card/teaching-card";
import { Heading } from "@/app/components/ui/heading/heading";
import { Text } from "@/app/components/ui/text/text";
import { getAllTeachings, searchTeachingsByScripture } from "@/lib/teachings";
import { ScriptureSearch } from "./components/scripture-search";

interface ArchivePageProps {
	searchParams: Promise<{ q?: string }>;
}

export default async function ArchivePage({ searchParams }: ArchivePageProps) {
	const { q: searchQuery } = await searchParams;

	// Get filtered teachings based on search
	const filteredTeachings = searchQuery
		? await searchTeachingsByScripture(searchQuery)
		: await getAllTeachings();

	// Sort by most recent date
	const sortedTeachings = [...filteredTeachings].sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
				{/* Header */}
				<div className="mb-8">
					<Heading level="h1" className="mb-2">
						Teaching Archive
					</Heading>
					<Text variant="body" className="text-foreground/70">
						Search by scripture or browse all teachings
					</Text>
				</div>

				{/* Search Input */}
				<div className="mb-8">
					<ScriptureSearch />
				</div>

				{/* Results Grid */}
				{sortedTeachings.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{sortedTeachings.map((teaching) => (
							<TeachingCard key={teaching.id} teaching={teaching} />
						))}
					</div>
				) : (
					<EmptyState searchQuery={searchQuery} />
				)}
			</div>
		</div>
	);
}

function EmptyState({ searchQuery }: { searchQuery?: string }) {
	return (
		<div className="flex flex-col items-center justify-center py-16 px-4">
			<div className="text-center max-w-md">
				<Heading level="h2" className="mb-4">
					No teachings found
				</Heading>
				<Text variant="body" className="text-foreground/70 mb-6">
					{searchQuery
						? `No teachings found for "${searchQuery}". Try a different search term or browse all teachings.`
						: "No teachings available at this time."}
				</Text>
				{searchQuery && (
					<Link href="/archive" className="text-primary hover:underline">
						Clear search and view all teachings
					</Link>
				)}
			</div>
		</div>
	);
}
