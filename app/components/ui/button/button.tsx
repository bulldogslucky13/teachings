"use client";

import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

export const buttonVariants = cva(
	cn(
		"inline-flex items-center justify-center gap-3 rounded-none border text-center transition-colors duration-150 cursor-pointer",
		"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
		labelTypography,
	),
	{
		variants: {
			variant: {
				primary:
					"border-accent bg-accent text-accent-contrast data-[hovered]:border-accent-hover data-[hovered]:bg-accent-hover data-[pressed]:bg-accent-hover",
				secondary:
					"border-border bg-transparent text-text-primary data-[hovered]:border-text-secondary data-[pressed]:bg-surface-hover",
				ghost:
					"border-transparent bg-transparent text-text-secondary data-[hovered]:text-text-primary data-[pressed]:text-text-primary",
				danger:
					"border-error-500 bg-transparent text-error-500 data-[hovered]:bg-error-500/10 data-[pressed]:bg-error-500/15",
			},
			size: {
				sm: "min-h-9 px-3 py-2",
				md: "min-h-12 px-4 py-3.5",
				lg: "min-h-14 px-6 py-4 text-xs",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "md",
		},
	},
);

export interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
}

export function Button({
	className,
	variant,
	size,
	leftIcon,
	rightIcon,
	children,
	...props
}: ButtonProps) {
	return (
		<AriaButton
			className={(renderProps) =>
				cn(
					buttonVariants({
						variant,
						size,
					}),
					typeof className === "function" ? className(renderProps) : className,
				)
			}
			{...props}
		>
			{(renderProps) => (
				<>
					{leftIcon && <span className="flex items-center">{leftIcon}</span>}
					{typeof children === "function" ? children(renderProps) : children}
					{rightIcon && <span className="flex items-center">{rightIcon}</span>}
				</>
			)}
		</AriaButton>
	);
}
