import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

/**
 * A mat-coloured panel with a keyline border.
 * - default: mat + keyline
 * - elevated: adds the subtle mat shadow (visible in light mode only)
 * - bordered: the Gallery "panel" with an inner keyline 7px in from the edge
 */
const cardVariants = cva("relative border border-border bg-surface", {
	variants: {
		variant: {
			default: "",
			elevated: "shadow-mat",
			bordered:
				"shadow-mat before:pointer-events-none before:absolute before:inset-[7px] before:border before:border-border [&>*]:relative",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export interface CardProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	variant?: "default" | "elevated" | "bordered";
	children: ReactNode;
}

export function Card({ className, variant, children, ...props }: CardProps) {
	return (
		<div className={cn(cardVariants({ variant }), className)} {...props}>
			{children}
		</div>
	);
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
	return (
		<div className={cn("border-b border-border px-6 py-4", className)} {...props}>
			{children}
		</div>
	);
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
	return (
		<div className={cn("px-6 py-5", className)} {...props}>
			{children}
		</div>
	);
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
	return (
		<div className={cn("border-t border-border px-6 py-4", className)} {...props}>
			{children}
		</div>
	);
}
