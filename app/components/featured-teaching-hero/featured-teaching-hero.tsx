"use client";

import Link from "next/link";
import { MdPlayArrow } from "react-icons/md";
import { Badge } from "@/app/components/ui/badge";
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
		timeZone: "UTC",
	});

	return (
		<section className="relative w-full min-h-[50vh] md:min-h-[90vh] flex items-end overflow-hidden">
			{/* Background Image */}
			<div
				className="absolute inset-0 w-full h-full bg-contain bg-no-repeat bg-black bg-center"
				style={{ backgroundImage: `url(${coverPhotoUrl})` }}
				aria-hidden="true"
			/>

			{/* Gradient Overlay - Bottom to Top */}
			<div
				className="absolute inset-0 bg-linear-to-t from-black/95 via-black/70 to-black/30"
				aria-hidden="true"
			/>

			{/* Content Container */}
			<div className="relative w-full max-w-7xl mx-auto px-6 py-16 md:px-8 md:py-20 lg:px-12 lg:py-24">
				{/* Featured Badge */}
				<div className="mb-4">
					<Badge variant="primary" size="md">
						Featured Teaching
					</Badge>
				</div>

				{/* Date */}
				<Text variant="caption" className="mb-3">
					{formattedDate}
				</Text>

				{/* Title */}
				<Heading level="h1" className="mb-4 max-w-4xl text-white">
					{teaching.title}
				</Heading>

				{/* Description */}
				<Text size="lg" className="mb-8 max-w-2xl text-white">
					{teaching.description}
				</Text>

				{/* Watch Now Button */}
				<Link href={`/teaching/${teaching.id}`}>
					<Button variant="primary" size="lg" leftIcon={<MdPlayArrow size={24} />}>
						Watch Now
					</Button>
				</Link>
			</div>
		</section>
	);
}
