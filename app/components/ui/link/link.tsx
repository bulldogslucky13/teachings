"use client";

import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

/**
 * - default: inline text link, keyline underline that turns brass on hover
 * - text: the Gallery "textlink" — uppercase label with a keyline rule beneath
 * - button: a rectangular keyline button (secondary button look) as a link
 * - plain: no styling beyond focus; for wrapping rows, mats, wordmarks
 */
const linkVariants = cva("cursor-pointer transition-colors duration-150", {
	variants: {
		variant: {
			default:
				"text-text-primary underline decoration-border decoration-1 underline-offset-4 data-[hovered]:decoration-accent",
			text: cn(
				labelTypography,
				"inline-block border-b border-border pb-[3px] text-text-secondary data-[hovered]:border-accent data-[hovered]:text-text-primary",
			),
			button: cn(
				labelTypography,
				"inline-flex min-h-12 items-center justify-center gap-3 border border-border px-4 py-3.5 text-text-primary data-[hovered]:border-text-secondary",
			),
			plain: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface LinkProps extends AriaLinkProps, VariantProps<typeof linkVariants> {
	variant?: "default" | "text" | "button" | "plain";
}

export function Link({ className, variant, href, ...props }: LinkProps) {
	const isExternal = href?.toString().startsWith("http");

	return (
		<AriaLink
			href={href}
			target={isExternal ? "_blank" : undefined}
			rel={isExternal ? "noopener noreferrer" : undefined}
			className={(renderProps) =>
				cn(
					linkVariants({
						variant,
					}),
					typeof className === "function" ? className(renderProps) : className,
				)
			}
			{...props}
		/>
	);
}
