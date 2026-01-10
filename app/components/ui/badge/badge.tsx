"use client";

import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const badgeVariants = cva("inline-flex items-center justify-center rounded-full font-medium", {
	variants: {
		variant: {
			default: "bg-surface text-text-primary",
			primary: "bg-primary-500 text-white",
			subtle: "bg-surface-hover/50 text-text-secondary",
		},
		size: {
			sm: "text-xs px-2 py-0.5",
			md: "text-sm px-3 py-1",
		},
	},
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
