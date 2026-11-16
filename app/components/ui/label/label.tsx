import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

/** The Gallery label type: 11px, uppercase, tracked .14em, medium weight. */
export const labelTypography = "text-label font-medium uppercase tracking-label";

export const labelVariants = cva(labelTypography, {
	variants: {
		tone: {
			secondary: "text-text-secondary",
			primary: "text-text-primary",
			accent: "text-accent-text",
		},
	},
	defaultVariants: {
		tone: "secondary",
	},
});

export interface LabelProps
	extends Omit<HTMLAttributes<HTMLElement>, "children">,
		VariantProps<typeof labelVariants> {
	tone?: "secondary" | "primary" | "accent";
	/** Element to render. Defaults to `span`. */
	as?: "span" | "p" | "div" | "h2" | "h3" | "h4" | "dt" | "dd" | "time" | "label";
	children: ReactNode;
}

/**
 * Small uppercase museum-label text used for dates, counts, section labels and nav.
 */
export function Label({ tone, as = "span", className, children, ...props }: LabelProps) {
	const Component = as as ElementType;
	return (
		<Component className={cn(labelVariants({ tone }), className)} {...props}>
			{children}
		</Component>
	);
}
