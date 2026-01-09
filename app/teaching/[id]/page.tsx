"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdLink } from "react-icons/md";
import { Button } from "@/app/components/ui/button/button";
import { Card, CardBody } from "@/app/components/ui/card/card";
import { Heading } from "@/app/components/ui/heading/heading";
import { Text } from "@/app/components/ui/text/text";
import {
	getCoverPhotoUrl,
	getRelatedTeachings,
	getVideoProgress,
	saveVideoProgress,
	teachings,
} from "@/lib/teachings";

export default function TeachingPage() {
	const params = useParams();
	const teachingId = params.id as string;
	const teaching = teachings.find((t) => t.id === teachingId);

	const videoRef = useRef<HTMLVideoElement>(null);
	const [showCopied, setShowCopied] = useState(false);

	// Load saved progress on mount
	useEffect(() => {
		if (!teaching || !videoRef.current) return;

		const progress = getVideoProgress(teachingId);
		if (progress?.currentTime) {
			videoRef.current.currentTime = progress.currentTime;
		}
	}, [teaching, teachingId]);

	// Save progress periodically
	useEffect(() => {
		if (!teaching || !videoRef.current) return;

		const video = videoRef.current;
		const saveProgress = () => {
			saveVideoProgress(teachingId, video.currentTime);
		};

		// Save progress every 5 seconds during playback
		const interval = setInterval(() => {
			if (!video.paused) {
				saveProgress();
			}
		}, 5000);

		// Save on pause, seek, and before unload
		video.addEventListener("pause", saveProgress);
		video.addEventListener("seeked", saveProgress);
		window.addEventListener("beforeunload", saveProgress);

		return () => {
			clearInterval(interval);
			video.removeEventListener("pause", saveProgress);
			video.removeEventListener("seeked", saveProgress);
			window.removeEventListener("beforeunload", saveProgress);
			saveProgress(); // Save on unmount
		};
	}, [teaching, teachingId]);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			setShowCopied(true);
			setTimeout(() => setShowCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	const formatScriptureReference = (scripture: {
		book: string;
		chapter: number;
		verses?: string[];
	}) => {
		const versesText = scripture.verses?.length ? `:${scripture.verses.join(",")}` : "";
		return `${scripture.book} ${scripture.chapter}${versesText}`;
	};

	const getBibleUrl = (scripture: { book: string; chapter: number; verses?: string[] }) => {
		const reference = formatScriptureReference(scripture);
		return `https://www.bible.com/search/bible?q=${encodeURIComponent(reference)}`;
	};

	if (!teaching) {
		return (
			<div className="container mx-auto px-4 py-16">
				<Card variant="elevated" className="p-12 text-center">
					<Heading level="h2">Teaching Not Found</Heading>
					<Text variant="body" className="mt-4 mb-8">
						The teaching you're looking for doesn't exist.
					</Text>
					<Link href="/">
						<Button variant="primary">Go Home</Button>
					</Link>
				</Card>
			</div>
		);
	}

	const relatedTeachings = getRelatedTeachings(teaching, teachings);

	return (
		<div className="min-h-screen bg-background">
			{/* Video Player Section */}
			<div className="w-full bg-black">
				<div className="container mx-auto">
					<video
						ref={videoRef}
						className="w-full aspect-video"
						controls
						preload="metadata"
						src={teaching.videoUrl}
					>
						<track kind="captions" />
						Your browser does not support the video tag.
					</video>
				</div>
			</div>

			{/* Teaching Info Section */}
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2">
						<div className="mb-6">
							<Heading level="h1" className="mb-2">
								{teaching.title}
							</Heading>
							<Text variant="caption">{new Date(teaching.date).toLocaleDateString()}</Text>
						</div>

						{teaching.series && (
							<div className="mb-4">
								<Text variant="label" className="text-sm">
									Series:
								</Text>
								<Text variant="body" className="ml-2">
									{teaching.series}
								</Text>
							</div>
						)}

						<div className="mb-6">
							<Text variant="body" size="lg">
								{teaching.description}
							</Text>
						</div>

						{teaching.scripture.length > 0 && (
							<div className="mb-6">
								<Text variant="label" className="mb-2">
									Scripture References:
								</Text>
								<div className="flex flex-wrap gap-2">
									{teaching.scripture.map((ref, index) => (
										<a
											key={`${ref.book}-${ref.chapter}-${index}`}
											href={getBibleUrl(ref)}
											target="_blank"
											rel="noopener noreferrer"
											className="text-text-primary hover:text-primary-light underline"
										>
											{formatScriptureReference(ref)}
										</a>
									))}
								</div>
							</div>
						)}

						{teaching.topics.length > 0 && (
							<div className="mb-6">
								<Text variant="label" className="mb-2">
									Topics:
								</Text>
								<div className="flex flex-wrap gap-2">
									{teaching.topics.map((topic) => (
										<span
											key={topic}
											className="px-3 py-1 bg-surface rounded-full text-sm text-text-secondary"
										>
											{topic}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<Card variant="elevated" className="p-6">
							<Button
								variant="primary"
								className="w-full"
								onPress={handleCopyLink}
								leftIcon={<MdLink size={20} />}
							>
								{showCopied ? "Link Copied!" : "Copy Link"}
							</Button>
						</Card>
					</div>
				</div>

				{/* Related Teachings Section */}
				{relatedTeachings.length > 0 && (
					<div className="mt-16">
						<Heading level="h2" className="mb-6">
							Related Teachings
						</Heading>
						<div className="overflow-x-auto pb-4">
							<div className="flex gap-6" style={{ width: "max-content" }}>
								{relatedTeachings.map((related) => (
									<Link
										key={related.id}
										href={`/teaching/${related.id}`}
										className="block w-80 flex-shrink-0"
									>
										<Card
											variant="elevated"
											className="overflow-hidden transition-transform hover:scale-[1.02]"
										>
											<div className="relative aspect-video">
												<Image
													src={getCoverPhotoUrl(related.coverPhoto)}
													alt={related.title}
													fill
													className="object-cover transition-transform hover:scale-105"
												/>
											</div>
											<CardBody className="p-4">
												<Heading level="h4" className="mb-2 line-clamp-2">
													{related.title}
												</Heading>
												<Text variant="caption" className="mb-2">
													{new Date(related.date).toLocaleDateString()}
												</Text>
												<Text variant="body" className="line-clamp-2">
													{related.description}
												</Text>
											</CardBody>
										</Card>
									</Link>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
