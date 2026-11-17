import type { ReactNode } from "react";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

/**
 * Gallery heading scale (Cormorant Garamond, light weights):
 * h1 40–72px display · h2 32/40px section · h3 24px plaque · h4 22px · h5 18px sans · h6 label
 */
const headingVariants = cva("text-text-primary", {
	variants: {
		level: {
			h1: "font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.01em] [overflow-wrap:break-word]",
			h2: "font-serif text-[2rem] font-normal leading-[1.1] sm:text-[2.5rem]",
			h3: "font-serif text-2xl font-medium leading-[1.15]",
			h4: "font-serif text-[1.375rem] font-medium leading-[1.2]",
			h5: "font-sans text-lg font-medium leading-snug",
			h6: cn(labelTypography, "text-text-secondary"),
		},
		weight: {
			normal: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-semibold",
		},
	},
	defaultVariants: {
		level: "h2",
	},
});

export interface HeadingProps extends VariantProps<typeof headingVariants> {
	level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	weight?: "normal" | "medium" | "semibold" | "bold";
	id?: string;
	className?: string;
	children: ReactNode;
}

export function Heading({ level = "h2", weight, id, className, children }: HeadingProps) {
	const Component = level;

	return (
		<Component id={id} className={cn(headingVariants({ level, weight }), className)}>
			{children}
		</Component>
	);
}
