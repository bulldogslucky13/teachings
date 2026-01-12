import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/app/components/ui/button/button";
import { Card } from "@/app/components/ui/card/card";
import { Heading } from "@/app/components/ui/heading/heading";
import { Text } from "@/app/components/ui/text/text";
import { getCoverPhotoUrl, getRelatedTeachings, getTeachingById } from "@/lib/teachings";
import { TeachingPlayer } from "./components/teaching-player";

interface GenerateMetadataProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
	const { id } = await params;
	const teaching = await getTeachingById(id);

	if (!teaching) {
		return {
			title: "Teaching Not Found | Teachings - Cameron Bristol",
		};
	}

	const headersList = await headers();
	const host = headersList.get("host") ?? "localhost:3000";
	const protocol = headersList.get("x-forwarded-proto") ?? "https";
	const baseUrl = `${protocol}://${host}`;

	const coverPhotoPath = getCoverPhotoUrl(teaching.coverPhoto);
	const coverPhotoUrl = `${baseUrl}${coverPhotoPath}`;

	return {
		title: teaching.title,
		openGraph: {
			title: teaching.title,
			siteName: "Teachings - Cameron Bristol",
			images: [{ url: coverPhotoUrl }],
			type: "video.other",
		},
		twitter: {
			card: "summary_large_image",
			title: teaching.title,
			images: [coverPhotoUrl],
		},
	};
}

interface TeachingPageProps {
	params: Promise<{ id: string }>;
}

export default async function TeachingPage({ params }: TeachingPageProps) {
	const { id } = await params;
	const teaching = await getTeachingById(id);

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

	const relatedTeachings = await getRelatedTeachings(teaching);

	return <TeachingPlayer teaching={teaching} relatedTeachings={relatedTeachings} />;
}
