import NextLink from "next/link";
import { Fragment } from "react";
import { CoverMat } from "@/app/components/ui/cover-mat/cover-mat";
import { Label } from "@/app/components/ui/label/label";
import { Link } from "@/app/components/ui/link/link";
import { PlayMark } from "@/app/components/ui/play-button/play-button";
import { formatTeachingDate } from "@/lib/teachings/formatDate";
import { formatScriptureReference } from "@/lib/teachings/formatScriptureReference";
import type { Teaching } from "@/lib/teachings/teachings";

const VISIBLE_REFS = 3;

export interface FeatureBlockProps {
	teaching: Teaching;
}

/**
 * The home page's lead: the most recent teaching, its cover hung large on the left,
 * with title, description, featured Scripture and a Watch link on the right.
 */
export function FeatureBlock({ teaching }: FeatureBlockProps) {
	const href = `/teaching/${teaching.id}`;
	const featured = teaching.scripture.filter((ref) => ref.referenceType === "featured");
	const shown = featured.slice(0, VISIBLE_REFS);
	const hidden = featured.length - shown.length;

	return (
		<section
			aria-labelledby="feature-title"
			className="pt-8 pb-[72px] min-[900px]:pt-6 min-[900px]:pb-14"
		>
			<div className="page-wrap">
				<div className="grid items-center gap-10 min-[900px]:grid-cols-[7fr_5fr] min-[900px]:gap-[72px]">
					<NextLink
						href={href}
						tabIndex={-1}
						aria-hidden="true"
						// From 900px the mat is also capped by viewport height so the canon strip below
						// stays on the first screen.
						className="group block min-[900px]:max-w-[max(360px,calc((100svh-350px)*4/3))]"
					>
						<CoverMat coverPhoto={teaching.coverPhoto} size="lg" interactive priority />
					</NextLink>
					<div className="min-w-0">
						<Label as="p" className="mb-[22px]">
							Most recent ·{" "}
							<time dateTime={teaching.date}>{formatTeachingDate(teaching.date, "long")}</time>
						</Label>
						<h1
							id="feature-title"
							className="font-serif text-[clamp(44px,5.5vw,84px)] min-[900px]:text-[clamp(40px,min(5vw,7.5svh),84px)] font-normal leading-none tracking-[-0.01em] text-text-primary [overflow-wrap:break-word]"
						>
							{teaching.title}
						</h1>
						{teaching.series && (
							<p className="mt-5 font-serif text-[26px] italic leading-[1.2] text-accent-text">
								{teaching.series}
							</p>
						)}
						{/* On wide but short screens the description is clamped so the canon strip below
						    stays on the first screen; the teaching page carries it in full. */}
						{teaching.description && (
							<p className="mt-7 max-w-[46ch] text-[17px] leading-[1.6] text-text-secondary [@media(min-width:900px)_and_(max-height:1000px)]:line-clamp-4">
								{teaching.description}
							</p>
						)}
						{shown.length > 0 && (
							<p className="mt-6 max-w-[46ch] text-[13px] tracking-[0.02em] text-text-secondary">
								{shown.map((ref, i) => (
									<Fragment key={`${ref.book}-${ref.chapter}-${i}`}>
										{i > 0 && (
											<span aria-hidden="true" className="px-[0.5em] opacity-60">
												/
											</span>
										)}
										<span className="text-text-primary">{formatScriptureReference(ref)}</span>
									</Fragment>
								))}
								{hidden > 0 && (
									<>
										<span aria-hidden="true" className="px-[0.5em] opacity-60">
											/
										</span>
										and {hidden} more {hidden === 1 ? "passage" : "passages"}
									</>
								)}
							</p>
						)}
						<div className="mt-10 flex flex-wrap items-center gap-7">
							<NextLink href={href} className="group inline-flex items-center gap-[18px]">
								<PlayMark />
								<Label tone="primary" className="text-xs">
									Watch
								</Label>
								<span className="sr-only"> {teaching.title}</span>
							</NextLink>
							{teaching.notesUrl && (
								<Link href={teaching.notesUrl} variant="text">
									Lesson slides
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
