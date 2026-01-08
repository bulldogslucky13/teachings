import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const cardVariants = cva("bg-surface rounded-lg", {
	variants: {
		variant: {
			default: "",
			elevated: "shadow-lg shadow-black/20",
			bordered: "border border-border",
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
		<div className={cn("px-6 py-4 border-b border-border", className)} {...props}>
			{children}
		</div>
	);
}

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardBody({ className, children, ...props }: CardBodyProps) {
	return (
		<div className={cn("px-6 py-4", className)} {...props}>
			{children}
		</div>
	);
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
	children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
	return (
		<div className={cn("px-6 py-4 border-t border-border", className)} {...props}>
			{children}
		</div>
	);
}
