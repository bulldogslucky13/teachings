import type { ReactNode } from "react";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

/**
 * A quiet uppercase label. No pill, no fill: the Gallery marks things with type, not chips.
 */
const badgeVariants = cva(cn("inline-flex items-center", labelTypography), {
	variants: {
		variant: {
			default: "text-text-secondary",
			primary: "text-accent-text",
			subtle: "border border-border text-text-secondary",
		},
		size: {
			sm: "",
			md: "",
		},
	},
	compoundVariants: [
		{ variant: "subtle", size: "sm", className: "px-1.5 py-px" },
		{ variant: "subtle", size: "md", className: "px-2 py-0.5" },
	],
	defaultVariants: {
		variant: "default",
		size: "md",
	},
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
	variant?: "default" | "primary" | "subtle";
	size?: "sm" | "md";
	icon?: ReactNode;
	children: ReactNode;
	className?: string;
}

export function Badge({ variant, size, icon, children, className }: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ variant, size }), icon && "gap-1.5", className)}>
			{icon && <span className="flex items-center [&>svg]:h-[1em] [&>svg]:w-[1em]">{icon}</span>}
			{children}
		</span>
	);
}
