"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/button/button";
import { Heading } from "@/app/components/ui/heading/heading";
import { Text } from "@/app/components/ui/text/text";
import { getCoverPhotoUrl, type Teaching } from "@/lib/teachings";

export interface FeaturedTeachingHeroProps {
	teaching: Teaching;
}

export function FeaturedTeachingHero({ teaching }: FeaturedTeachingHeroProps) {
	const coverPhotoUrl = getCoverPhotoUrl(teaching.coverPhoto);
	const formattedDate = new Date(teaching.date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<section className="relative w-full min-h-[70vh] flex items-end overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 w-full h-full bg-cover bg-center"
				style={{ backgroundImage: `url(${coverPhotoUrl})` }}
				aria-hidden="true"
			/>

			{/* Gradient Overlay - Bottom to Top */}
			<div
				className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30"
				aria-hidden="true"
			/>

			{/* Content Container */}
			<div className="relative w-full max-w-7xl mx-auto px-6 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
				{/* Featured Badge */}
				<div className="mb-4">
					<Text
						variant="overline"
						className="inline-block px-3 py-1 bg-primary-600/90 text-white rounded-md backdrop-blur-sm"
					>
						Featured Teaching
					</Text>
				</div>

				{/* Date */}
				<Text variant="caption" className="mb-3 text-white/80">
					{formattedDate}
				</Text>

				{/* Title */}
				<Heading level="h1" className="mb-4 text-white max-w-4xl">
					{teaching.title}
				</Heading>

				{/* Description */}
				<Text size="lg" className="mb-8 text-white/90 max-w-2xl">
					{teaching.description}
				</Text>

				{/* Watch Now Button */}
				<Link href={`/teachings/${teaching.id}`}>
					<Button variant="primary" size="lg">
						Watch Now
					</Button>
				</Link>
			</div>
		</section>
	);
}
