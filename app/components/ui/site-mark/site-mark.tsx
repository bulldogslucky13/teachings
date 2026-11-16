import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const siteMarkVariants = cva(
	"inline-flex shrink-0 select-none items-center justify-center border border-accent bg-background font-serif font-medium italic leading-none text-accent-text",
	{
		variants: {
			size: {
				sm: "size-6 text-[22px]",
				md: "size-8 text-[29px]",
			},
		},
		defaultVariants: {
			size: "sm",
		},
	},
);

export interface SiteMarkProps extends VariantProps<typeof siteMarkVariants> {
	size?: "sm" | "md";
	className?: string;
}

/**
 * The Teachings mark: a square keyline plaque holding an italic serif "T".
 * Decorative (`aria-hidden`); the link or heading that contains it carries the name.
 */
export function SiteMark({ size, className }: SiteMarkProps) {
	return (
		<span aria-hidden="true" className={cn(siteMarkVariants({ size }), className)}>
			T
		</span>
	);
}
