import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const headingVariants = cva("text-text-primary", {
	variants: {
		level: {
			h1: "font-serif text-5xl font-bold leading-tight",
			h2: "font-serif text-4xl font-bold leading-tight",
			h3: "font-serif text-3xl font-semibold leading-snug",
			h4: "font-sans text-2xl font-semibold leading-snug",
			h5: "font-sans text-xl font-medium leading-normal",
			h6: "font-sans text-lg font-medium leading-normal",
		},
		weight: {
			normal: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
		},
	},
	defaultVariants: {
		level: "h2",
	},
});

export interface HeadingProps extends VariantProps<typeof headingVariants> {
	level?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	weight?: "normal" | "medium" | "semibold" | "bold";
	className?: string;
	children: ReactNode;
}

export function Heading({ level = "h2", weight, className, children }: HeadingProps) {
	const Component = level;

	return (
		<Component className={cn(headingVariants({ level, weight }), className)}>{children}</Component>
	);
}
