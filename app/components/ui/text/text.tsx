import type { ReactNode } from "react";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

/**
 * - body: running text (Hanken Grotesk)
 * - label: emphasised UI text
 * - caption: secondary, smaller
 * - overline: the Gallery label — 11px uppercase tracked (same as <Label />). Ignores `size`.
 * - series: Cormorant italic, for series names
 */
const textVariants = cva("", {
	variants: {
		variant: {
			body: "text-text-primary",
			label: "font-medium text-text-primary",
			caption: "text-text-secondary",
			overline: cn(labelTypography, "text-text-secondary"),
			series: "font-serif italic text-text-secondary",
		},
		size: {
			xs: "text-xs",
			sm: "text-[0.8125rem]",
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
	variant?: "body" | "label" | "caption" | "overline" | "series";
	size?: "xs" | "sm" | "base" | "lg" | "xl";
	as?: "p" | "span" | "div";
	className?: string;
	children: ReactNode;
}

const defaultSize: Record<NonNullable<TextProps["variant"]>, TextProps["size"]> = {
	body: "base",
	label: "base",
	caption: "sm",
	overline: undefined,
	series: "lg",
};

export function Text({ variant = "body", size, as, className, children }: TextProps) {
	const Component = as || (variant === "body" ? "p" : "span");
	const resolvedSize = variant === "overline" ? undefined : (size ?? defaultSize[variant]);

	return (
		<Component className={cn(textVariants({ variant, size: resolvedSize }), className)}>
			{children}
		</Component>
	);
}
