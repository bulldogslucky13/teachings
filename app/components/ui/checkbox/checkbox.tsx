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
				"group flex cursor-pointer items-start gap-3 text-text-primary outline-none",
				"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		>
			{({ isSelected, isIndeterminate, isFocusVisible }) => (
				<>
					<div
						className={cn(
							"mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center border transition-colors duration-150",
							isSelected || isIndeterminate
								? "border-accent bg-accent text-accent-contrast"
								: "border-text-secondary/60 bg-transparent group-data-[hovered]:border-text-secondary",
							isFocusVisible && "outline-2 outline-offset-2 outline-accent",
						)}
					>
						{isSelected && (
							<svg
								aria-hidden="true"
								className="h-3 w-3"
								viewBox="0 0 12 12"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="square"
							>
								<path d="M2.5 6.25l2.5 2.5 4.5-5" />
							</svg>
						)}
						{isIndeterminate && !isSelected && (
							<span aria-hidden="true" className="h-px w-2.5 bg-current" />
						)}
					</div>
					<div className="flex flex-col">
						<span className="text-[0.9375rem] leading-snug">{label}</span>
						{description && (
							<span className="mt-0.5 text-[0.8125rem] text-text-secondary">{description}</span>
						)}
					</div>
				</>
			)}
		</AriaCheckbox>
	);
}
