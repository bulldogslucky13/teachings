"use client";

import Link from "next/link";
import { Card } from "@/app/components/ui/card/card";
import { Heading } from "@/app/components/ui/heading/heading";
import { Text } from "@/app/components/ui/text/text";
import { getCoverPhotoUrl } from "@/lib/teachings";
import type { Teaching } from "@/lib/teachings/teachings";

export interface TeachingCardProps {
	teaching: Teaching;
}

export function TeachingCard({ teaching }: TeachingCardProps) {
	const coverPhotoUrl = getCoverPhotoUrl(teaching.coverPhoto);
	const formattedDate = new Date(teaching.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<Link
			href={`/teaching/${teaching.id}`}
			className="group block transition-transform hover:scale-[1.02]"
		>
			<Card variant="elevated" className="overflow-hidden h-full">
				{/* Thumbnail */}
				<div className="relative w-full aspect-video overflow-hidden bg-surface">
					<img
						src={coverPhotoUrl}
						alt={teaching.title}
						className="object-cover w-full h-full transition-transform group-hover:scale-105"
					/>
				</div>

				{/* Content */}
				<div className="p-4 space-y-2">
					{/* Date */}
					<Text variant="caption" className="text-text-tertiary">
						{formattedDate}
					</Text>

					{/* Title */}
					<Heading level="h3" className="text-xl! line-clamp-2 group-hover:text-primary-400">
						{teaching.title}
					</Heading>

					{/* Description */}
					<Text variant="body" className="text-text-secondary line-clamp-2">
						{teaching.description}
					</Text>
				</div>
			</Card>
		</Link>
	);
}
