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
	formatScriptureReference,
	formatTeachingDate,
	getBibleGatewayUrl,
	getCoverPhotoUrl,
	getRelatedTeachings,
	getSeriesHref,
	getSeriesTeachings,
	getTeachingById,
	type ScriptureReference,
} from "@/lib/teachings";
import { SeriesPanel } from "./components/series-panel";
import { TeachingVideo } from "./components/teaching-video";

interface GenerateMetadataProps {
	params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
	const { id } = await params;
	const teaching = await getTeachingById(id);

	if (!teaching) {
		return {
			title: "Teaching not found",
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

function BackLink() {
	return (
		<div className="page-wrap pt-2 pb-7">
			<Link variant="plain" href="/archive">
				<Label className="transition-colors hover:text-text-primary">← Archive</Label>
			</Link>
		</div>
	);
}

function ScriptureLinks({
	refs,
	secondary = false,
}: {
	refs: ScriptureReference[];
	secondary?: boolean;
}) {
	return (
		<div className="overflow-hidden">
			<ul className="-ml-[15px] flex flex-wrap">
				{refs.map((ref, index) => (
					<li
						key={`${ref.book}-${ref.chapter}-${index}`}
						className="my-[3px] border-l border-border px-[14px] leading-[1.4]"
					>
						<Link
							variant="plain"
							href={getBibleGatewayUrl(ref)}
							className={
								secondary
									? "border-b border-transparent text-[15px] text-text-secondary data-[hovered]:border-accent data-[hovered]:text-text-primary"
									: "border-b border-transparent text-base data-[hovered]:border-accent"
							}
						>
							{formatScriptureReference(ref)}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default async function TeachingPage({ params }: TeachingPageProps) {
	const { id } = await params;
	const teaching = await getTeachingById(id);

	if (!teaching) {
		return (
			<div className="page-wrap py-24 min-[900px]:py-32">
				<Label as="p">Not found</Label>
				<Heading level="h1" className="mt-4 max-w-[18ch]">
					That teaching isn’t here.
				</Heading>
				<div className="mt-10">
					<Link variant="text" href="/archive">
						Browse the archive
					</Link>
				</div>
			</div>
		);
	}

	const [seriesTeachings, relatedAll, nextTeaching] = await Promise.all([
		getSeriesTeachings(teaching),
		getRelatedTeachings(teaching),
		teaching.nextInSeries ? getTeachingById(teaching.nextInSeries) : Promise.resolve(undefined),
	]);

	const showSeriesPanel = Boolean(teaching.series) && seriesTeachings.length > 1;
	const listedIds = new Set(showSeriesPanel ? seriesTeachings.map((t) => t.id) : []);
	if (nextTeaching) listedIds.add(nextTeaching.id);
	// Prefer teachings not already shown in the series panel; backfill if there are too few.
	const related = [
		...relatedAll.filter((t) => !listedIds.has(t.id)),
		...relatedAll.filter((t) => listedIds.has(t.id) && t.id !== nextTeaching?.id),
	].slice(0, 3);

	return (
		<>
			<BackLink />

			<div className="bg-black py-10 min-[900px]:py-14">
				<div className="mx-auto max-w-[1100px] px-6 min-[900px]:px-14">
					<TeachingVideo
						teachingId={teaching.id}
						title={teaching.title}
						videoUrl={teaching.videoUrl}
					/>
				</div>
			</div>

			<div className="page-wrap">
				<div className="grid gap-14 pt-14 pb-24 min-[1000px]:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] min-[1000px]:gap-[72px] min-[1000px]:pt-[72px]">
					<article>
						<Label as="p">
							<time dateTime={teaching.date}>{formatTeachingDate(teaching.date, "long")}</time>
							{teaching.series && (
								<>
									{" · "}
									<Link
										variant="plain"
										href={getSeriesHref(teaching.series)}
										className="border-b border-transparent font-serif text-[17px] font-medium normal-case italic tracking-normal text-text-primary data-[hovered]:border-accent"
									>
										{teaching.series}
									</Link>
								</>
							)}
						</Label>
						<Heading level="h1" className="mt-[18px]">
							{teaching.title}
						</Heading>

						{teaching.description && (
							<p className="mt-7 max-w-[62ch] text-lg leading-[1.6] text-text-secondary">
								{teaching.description}
							</p>
						)}

						{teaching.scripture.length > 0 && (
							<section
								aria-labelledby="scripture-heading"
								className="mt-11 border-t border-border pt-[22px]"
							>
								<Label as="h2" id="scripture-heading" className="mb-3 block">
									Scripture
								</Label>
								<ScriptureLinks refs={teaching.scripture} />
							</section>
						)}

						{teaching.topics.length > 0 && (
							<section
								aria-labelledby="topics-heading"
								className="mt-11 border-t border-border pt-[22px]"
							>
								<Label as="h2" id="topics-heading" className="mb-3 block">
									Topics
								</Label>
								<p className="max-w-[62ch] font-serif text-[22px] italic leading-[1.45]">
									{teaching.topics.join(", ")}
								</p>
							</section>
						)}
					</article>

					<aside
						aria-label="Series and actions"
						className="relative flex flex-col gap-7 self-start border border-border bg-surface px-8 py-9 shadow-mat before:pointer-events-none before:absolute before:inset-[7px] before:border before:border-border before:content-[''] [&>*]:relative"
					>
						{showSeriesPanel && teaching.series && (
							<SeriesPanel
								series={teaching.series}
								teachings={seriesTeachings}
								currentId={teaching.id}
							/>
						)}
						<div className="grid gap-3">
							<CopyLinkButton />
							{teaching.series && (
								<CopyLinkButton path={getSeriesHref(teaching.series)} label="Copy series link" />
							)}
							{teaching.notesUrl && (
								<Link variant="button" href={teaching.notesUrl} className="w-full justify-between!">
									<span>
										Download slides
										<span className="sr-only"> (PDF, opens in a new tab)</span>
									</span>
									<span
										aria-hidden="true"
										className="text-[13px] font-normal normal-case tracking-normal text-text-secondary"
									>
										PDF
									</span>
								</Link>
							)}
						</div>
					</aside>
				</div>

				{nextTeaching && (
					<section aria-labelledby="next-heading" className="border-t border-border pb-14 pt-10">
						<NextLink
							href={`/teaching/${nextTeaching.id}`}
							className="group flex items-center justify-between gap-6"
						>
							<span className="min-w-0">
								<Label as="h2" id="next-heading" className="block">
									Next in this series
								</Label>
								<span className="mt-2 block font-serif text-[28px] leading-[1.15] text-text-primary transition-colors group-hover:text-accent-text min-[900px]:text-[34px]">
									{nextTeaching.title}
								</span>
							</span>
							<PlayMark />
						</NextLink>
					</section>
				)}

				{related.length > 0 && (
					<section aria-labelledby="related-heading" className="border-t border-border pb-28 pt-12">
						<Heading level="h2" id="related-heading" className="mb-10">
							Related teachings
						</Heading>
						<ul className="grid grid-cols-1 gap-12 min-[700px]:grid-cols-3 min-[700px]:gap-10">
							{related.map((item) => (
								<li key={item.id}>
									<NextLink href={`/teaching/${item.id}`} className="group block">
										<CoverMat coverPhoto={item.coverPhoto} size="sm" interactive />
										<Label as="p" className="mt-[18px]">
											<time dateTime={item.date}>{formatTeachingDate(item.date)}</time>
										</Label>
										<span className="mt-1.5 block font-serif text-[22px] leading-[1.2] text-text-primary transition-colors group-hover:text-accent-text">
											{item.title}
										</span>
									</NextLink>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</>
	);
}
