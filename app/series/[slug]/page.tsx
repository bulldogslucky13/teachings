import type { Metadata } from "next";
import { headers } from "next/headers";
import NextLink from "next/link";
import { CopyLinkButton } from "@/app/components/copy-link-button/copy-link-button";
import { CoverMat } from "@/app/components/ui/cover-mat/cover-mat";
import { Heading } from "@/app/components/ui/heading/heading";
import { Label } from "@/app/components/ui/label/label";
import { Link } from "@/app/components/ui/link/link";
import { PlayMark } from "@/app/components/ui/play-button/play-button";
import {
	formatDateRange,
	formatTeachingDate,
	getCoverPhotoUrl,
	getSeriesBySlug,
	getSeriesHref,
	summarizeScriptureReferences,
	type TeachingGroup,
} from "@/lib/teachings";

interface SeriesPageProps {
	params: Promise<{ slug: string }>;
}

const plural = (n: number) => `${n} ${n === 1 ? "teaching" : "teachings"}`;

function describeSeries(group: TeachingGroup) {
	const titles = group.teachings.map((t) => t.title).join("; ");
	return `A series of ${plural(group.teachings.length)} by Cameron Bristol, ${formatDateRange(group.startDate, group.endDate)}: ${titles}.`;
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
	const { slug } = await params;
	const group = await getSeriesBySlug(slug);

	if (!group?.series) {
		return { title: "Series not found" };
	}

	const headersList = await headers();
	const host = headersList.get("host") ?? "localhost:3000";
	const protocol = headersList.get("x-forwarded-proto") ?? "https";
	const baseUrl = `${protocol}://${host}`;

	const coverPhotoUrl = `${baseUrl}${getCoverPhotoUrl(group.coverPhoto)}`;
	const description = describeSeries(group);
	const path = getSeriesHref(group.series);

	return {
		title: group.series,
		description,
		alternates: { canonical: `${baseUrl}${path}` },
		openGraph: {
			title: group.series,
			description,
			url: `${baseUrl}${path}`,
			siteName: "Teachings - Cameron Bristol",
			images: [{ url: coverPhotoUrl }],
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: group.series,
			description,
			images: [coverPhotoUrl],
		},
	};
}

function BackLink() {
	return (
		<div className="page-wrap pt-2 pb-7">
			<Link variant="plain" href="/#series">
				<Label className="transition-colors hover:text-text-primary">← Series</Label>
			</Link>
		</div>
	);
}

export default async function SeriesPage({ params }: SeriesPageProps) {
	const { slug } = await params;
	const group = await getSeriesBySlug(slug);
	const first = group?.teachings[0];

	if (!group?.series || !first) {
		return (
			<div className="page-wrap py-24 min-[900px]:py-32">
				<Label as="p">Not found</Label>
				<Heading level="h1" className="mt-4 max-w-[18ch]">
					That series isn’t here.
				</Heading>
				<div className="mt-10">
					<Link variant="text" href="/#series">
						Browse every series
					</Link>
				</div>
			</div>
		);
	}

	const firstHref = `/teaching/${first.id}`;

	return (
		<>
			<BackLink />

			<section aria-labelledby="series-title" className="pb-[72px] min-[900px]:pb-24">
				<div className="page-wrap">
					<div className="grid items-center gap-10 min-[900px]:grid-cols-[7fr_5fr] min-[900px]:gap-[72px]">
						<NextLink href={firstHref} tabIndex={-1} aria-hidden="true" className="group block">
							<CoverMat coverPhoto={group.coverPhoto} size="lg" interactive priority />
						</NextLink>
						<div className="min-w-0">
							<Label as="p" className="mb-[22px]">
								Series · {plural(group.teachings.length)} ·{" "}
								{formatDateRange(group.startDate, group.endDate)}
							</Label>
							<div>
								<h1
									id="series-title"
									className="inline font-serif text-[clamp(40px,5vw,72px)] font-normal leading-[1.05] tracking-[-0.01em] text-text-primary [overflow-wrap:break-word]"
								>
									{group.series}
								</h1>
								<CopyLinkButton
									variant="icon"
									size="lg"
									label="Copy series link"
									className="ml-2 align-middle"
								/>
							</div>
							<div className="mt-10">
								<NextLink href={firstHref} className="group inline-flex items-center gap-[18px]">
									<PlayMark />
									<Label tone="primary" className="text-xs">
										Start from the beginning
									</Label>
									<span className="sr-only">: {first.title}</span>
								</NextLink>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section aria-labelledby="teachings-heading" className="page-wrap pb-28">
				<div className="mb-2 border-b border-border pb-5">
					<Heading level="h2" id="teachings-heading">
						The teachings
					</Heading>
				</div>
				<ol>
					{group.teachings.map((teaching, index) => {
						const refs = summarizeScriptureReferences(teaching.scripture);
						return (
							<li key={teaching.id} className="border-b border-border">
								<NextLink
									href={`/teaching/${teaching.id}`}
									className="group grid grid-cols-[36px_minmax(0,1fr)] gap-x-4 py-7 min-[900px]:grid-cols-[64px_minmax(0,1fr)] min-[900px]:py-9"
								>
									<span
										aria-hidden="true"
										className="font-serif text-[28px] leading-[1.15] tabular-nums text-accent-text"
									>
										{index + 1}
									</span>
									<span className="min-w-0">
										<span className="sr-only">Part {index + 1}: </span>
										<span className="block font-serif text-[28px] leading-[1.15] text-text-primary transition-colors duration-150 group-hover:text-accent-text min-[900px]:text-[32px]">
											{teaching.title}
										</span>
										<Label as="span" className="mt-2 block">
											<time dateTime={teaching.date}>
												{formatTeachingDate(teaching.date, "long")}
											</time>
											{refs && ` · ${refs}`}
										</Label>
										{teaching.description && (
											<span className="mt-4 block max-w-[62ch] text-[17px] leading-[1.6] text-text-secondary">
												{teaching.description}
											</span>
										)}
										<span aria-hidden="true" className="mt-6 inline-flex items-center gap-[14px]">
											<PlayMark />
											<Label tone="primary" className="text-xs">
												Watch
											</Label>
										</span>
									</span>
								</NextLink>
							</li>
						);
					})}
				</ol>
			</section>
		</>
	);
}
