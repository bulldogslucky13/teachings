"use client";

import type { ReactNode } from "react";
import {
	Checkbox as AriaCheckbox,
	type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";
import { cn } from "../utils/cn";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "children"> {
	label: ReactNode;
	description?: string;
	className?: string;
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
	return (
		<AriaCheckbox
			className={cn(
				"group flex items-start gap-3 text-text-primary cursor-pointer",
				"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		>
			{({ isSelected, isFocusVisible }) => (
				<>
					<div
						className={cn(
							"flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors mt-0.5",
							"border-border",
							isSelected && "border-primary-500 bg-primary-500",
							isFocusVisible && "ring-2 ring-primary-500 ring-offset-2 ring-offset-background",
						)}
					>
						{isSelected && (
							<svg
								aria-hidden="true"
								className="h-3 w-3 text-white"
								viewBox="0 0 12 12"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M2 6l3 3 5-5" />
							</svg>
						)}
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{label}</span>
						{description && (
							<span className="text-xs text-text-secondary mt-0.5">{description}</span>
						)}
					</div>
				</>
			)}
		</AriaCheckbox>
	);
}
