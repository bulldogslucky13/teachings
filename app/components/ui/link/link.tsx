"use client";

import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const linkVariants = cva(
	"transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"text-primary-500 underline-offset-4 data-[hovered]:underline data-[hovered]:text-primary-400",
				button:
					"inline-flex items-center justify-center rounded-md px-5 py-2 font-medium bg-primary-600 text-white data-[hovered]:bg-primary-700 data-[pressed]:bg-primary-900",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface LinkProps extends AriaLinkProps, VariantProps<typeof linkVariants> {
	variant?: "default" | "button";
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
