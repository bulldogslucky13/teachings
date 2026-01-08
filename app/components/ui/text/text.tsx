import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const textVariants = cva("", {
	variants: {
		variant: {
			body: "text-text-primary",
			label: "text-text-primary font-medium",
			caption: "text-text-secondary text-sm",
			overline: "text-text-tertiary text-xs uppercase tracking-wider",
		},
		size: {
			xs: "text-xs",
			sm: "text-sm",
			base: "text-base",
			lg: "text-lg",
			xl: "text-xl",
		},
	},
	defaultVariants: {
		variant: "body",
		size: "base",
	},
});

export interface TextProps extends VariantProps<typeof textVariants> {
	variant?: "body" | "label" | "caption" | "overline";
	size?: "xs" | "sm" | "base" | "lg" | "xl";
	as?: "p" | "span" | "div";
	className?: string;
	children: ReactNode;
}

export function Text({ variant = "body", size = "base", as, className, children }: TextProps) {
	const Component = as || (variant === "body" ? "p" : "span");

	return (
		<Component className={cn(textVariants({ variant, size }), className)}>{children}</Component>
	);
}
