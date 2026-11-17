import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";
import { siteMarkStrokes } from "./site-mark-art";

const siteMarkVariants = cva("block shrink-0 text-accent", {
	variants: {
		size: {
			sm: "size-6",
			md: "size-8",
			lg: "size-16",
		},
	},
	defaultVariants: {
		size: "sm",
	},
});

export interface SiteMarkProps extends VariantProps<typeof siteMarkVariants> {
	size?: "sm" | "md" | "lg";
	/** `simple` drops the inner ticks for small sizes. Defaults to `simple` for `sm`. */
	detail?: "full" | "simple";
	className?: string;
}

/**
 * The Teachings mark: a square keyline plaque in which a cross stands as the tallest
 * tick on the canon strip. Decorative (`aria-hidden`); the link or heading that
 * contains it carries the name.
 */
export function SiteMark({ size = "sm", detail, className }: SiteMarkProps) {
	const resolved = detail ?? (size === "sm" ? "simple" : "full");
	const frame = resolved === "simple" ? 1.5 : 1;
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 32 32"
			fill="none"
			stroke="currentColor"
			className={cn(siteMarkVariants({ size }), className)}
		>
			<rect
				x={frame / 2}
				y={frame / 2}
				width={32 - frame}
				height={32 - frame}
				strokeWidth={frame}
				className="fill-background"
			/>
			{siteMarkStrokes(resolved).map((stroke) => (
				<path key={stroke.d} d={stroke.d} strokeWidth={stroke.width} opacity={stroke.opacity} />
			))}
		</svg>
	);
}
