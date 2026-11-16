import Image from "next/image";
import { getCoverPhotoUrl } from "@/lib/teachings/getCoverPhotoUrl";
import { cn } from "../utils/cn";
import { cva } from "../utils/variants";

const DEFAULT_SIZES: Record<CoverMatSize, string> = {
	lg: "(min-width: 1280px) 680px, (min-width: 900px) 55vw, 100vw",
	md: "(min-width: 1280px) 380px, (min-width: 1000px) 30vw, (min-width: 620px) 45vw, 100vw",
	sm: "(min-width: 1100px) 300px, (min-width: 700px) 30vw, 100vw",
};

export type CoverMatSize = "lg" | "md" | "sm";

const artVariants = cva("absolute", {
	variants: {
		size: {
			lg: "inset-x-[9%] inset-y-[12%]",
			md: "inset-x-[9%] inset-y-[12%]",
			sm: "inset-x-[10%] inset-y-[13%]",
		},
	},
	defaultVariants: { size: "md" },
});

export interface CoverMatProps {
	/** Cover photo filename (as stored on the teaching), resolved with `getCoverPhotoUrl`. */
	coverPhoto: string;
	/**
	 * Alt text. Leave empty (default) when the mat sits inside a link or next to a heading
	 * that already names the teaching — the image is then decorative.
	 */
	alt?: string;
	/** lg = feature block, md = series wall, sm = related teachings. */
	size?: CoverMatSize;
	/** CSS aspect-ratio of the mat (not the image). Default "4 / 3". */
	aspectRatio?: string;
	/** Override the `sizes` hint passed to next/image. */
	sizes?: string;
	/**
	 * Enables the hover/focus state (inner keyline turns brass, art lifts 2px).
	 * The state is driven by a `group` class on an ancestor link.
	 */
	interactive?: boolean;
	/** Load eagerly with high priority (use for the above-the-fold feature). */
	priority?: boolean;
	className?: string;
}

/**
 * The uniform mat that every cover sits in: a fixed-ratio panel in the mat colour,
 * with an outer and inner keyline, and the art shown whole at its native ratio.
 */
export function CoverMat({
	coverPhoto,
	alt = "",
	size = "md",
	aspectRatio = "4 / 3",
	sizes,
	interactive = false,
	priority = false,
	className,
}: CoverMatProps) {
	return (
		<div
			className={cn("relative block w-full border border-border bg-surface shadow-mat", className)}
			style={{ aspectRatio }}
		>
			<span
				aria-hidden="true"
				className={cn(
					"pointer-events-none absolute inset-x-[3.375%] inset-y-[4.5%] border border-border transition-colors duration-200",
					interactive &&
						"group-hover:border-accent group-focus-visible:border-accent group-data-[focus-visible]:border-accent group-data-[hovered]:border-accent",
				)}
			/>
			<div className={artVariants({ size })}>
				<Image
					src={getCoverPhotoUrl(coverPhoto)}
					alt={alt}
					fill
					sizes={sizes ?? DEFAULT_SIZES[size]}
					priority={priority}
					className={cn(
						"object-contain transition-transform duration-200",
						interactive &&
							"group-hover:-translate-y-0.5 group-focus-visible:-translate-y-0.5 group-data-[hovered]:-translate-y-0.5 motion-reduce:transform-none",
					)}
				/>
			</div>
		</div>
	);
}
