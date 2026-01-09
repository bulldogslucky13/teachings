"use client";

import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				primary:
					"bg-primary-600 text-white data-[hovered]:bg-primary-700 data-[pressed]:bg-primary-900",
				secondary:
					"bg-transparent border-2 border-primary-600 text-primary-500 data-[hovered]:bg-primary-600/10 data-[pressed]:bg-primary-600/20",
				ghost:
					"bg-transparent text-text-secondary data-[hovered]:text-text-primary data-[hovered]:bg-surface-hover data-[pressed]:bg-surface",
				danger: "bg-error-500 text-white data-[hovered]:bg-error-600 data-[pressed]:bg-error-600",
			},
			size: {
				sm: "h-9 px-3 text-sm",
				md: "h-11 px-5 text-base",
				lg: "h-13 px-7 text-lg",
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
					{leftIcon && <span className="mr-2 flex items-center">{leftIcon}</span>}
					{typeof children === "function" ? children(renderProps) : children}
					{rightIcon && <span className="ml-2 flex items-center">{rightIcon}</span>}
				</>
			)}
		</AriaButton>
	);
}
