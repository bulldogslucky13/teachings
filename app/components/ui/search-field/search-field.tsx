"use client";

import {
	SearchField as AriaSearchField,
	type SearchFieldProps as AriaSearchFieldProps,
	Button,
	Input,
	Label,
	Text,
} from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, "children" | "className"> {
	/** Visible label above the field. If omitted, pass `aria-label`. */
	label?: string;
	description?: string;
	errorMessage?: string;
	placeholder?: string;
	/** md (16px input) or lg (22px Cormorant input, for page-level search). */
	size?: "md" | "lg";
	className?: string;
}

/**
 * Underlined search input: a keyline rule that turns brass on focus, a search glyph,
 * and a clear button that appears once there is a value. Escape also clears.
 */
export function SearchField({
	label,
	description,
	errorMessage,
	placeholder,
	size = "md",
	className,
	...props
}: SearchFieldProps) {
	return (
		<AriaSearchField
			{...props}
			isInvalid={!!errorMessage || props.isInvalid}
			className={cn("group flex flex-col gap-2", className)}
		>
			{label && <Label className={cn(labelTypography, "text-text-secondary")}>{label}</Label>}
			<div
				className={cn(
					"flex items-center gap-3 border-b border-text-secondary/50 transition-colors duration-150",
					"focus-within:border-accent focus-within:shadow-[0_1px_0_0_var(--color-accent)]",
					"group-data-[invalid]:border-error-500 group-data-[disabled]:opacity-50",
				)}
			>
				<svg
					aria-hidden="true"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.25"
					className={cn("shrink-0 text-text-secondary", size === "lg" ? "h-5 w-5" : "h-4 w-4")}
				>
					<circle cx="6.75" cy="6.75" r="5" />
					<path d="M10.5 10.5L15 15" />
				</svg>
				<Input
					placeholder={placeholder}
					className={cn(
						"min-w-0 flex-1 bg-transparent py-3 text-text-primary outline-none placeholder:text-text-tertiary",
						"[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
						size === "lg" ? "font-serif text-[1.375rem] leading-tight" : "text-base",
					)}
				/>
				<Button
					aria-label="Clear search"
					className={cn(
						"-mr-2 grid h-9 w-9 shrink-0 cursor-pointer place-items-center text-text-secondary transition-colors duration-150",
						"data-[hovered]:text-text-primary group-data-[empty]:invisible",
					)}
				>
					<svg
						aria-hidden="true"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.25"
						className="h-3 w-3"
					>
						<path d="M1.5 1.5l9 9M10.5 1.5l-9 9" />
					</svg>
				</Button>
			</div>
			{description && (
				<Text slot="description" className="text-[0.8125rem] text-text-secondary">
					{description}
				</Text>
			)}
			{errorMessage && (
				<Text slot="errorMessage" className="text-[0.8125rem] text-error-500">
					{errorMessage}
				</Text>
			)}
		</AriaSearchField>
	);
}
