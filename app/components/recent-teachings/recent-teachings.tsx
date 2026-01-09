"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button/button";
import { Heading } from "@/app/components/ui/heading/heading";
import type { Teaching } from "@/lib/teachings/teachings";
import { TeachingCard } from "../teaching-card/teaching-card";

export interface RecentTeachingsProps {
	teachings: Teaching[];
}

export function RecentTeachings({ teachings }: RecentTeachingsProps) {
	return (
		<section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
			{/* Header with Archive button */}
			<div className="flex items-center justify-between mb-8">
				<Heading level="h2">Recent Teachings</Heading>
				<Link href="/archive">
					<Button variant="secondary">Teaching Archive</Button>
				</Link>
			</div>

			{/* Grid of teaching cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
				{teachings.map((teaching) => (
					<TeachingCard key={teaching.id} teaching={teaching} />
				))}
			</div>
		</section>
	);
}
