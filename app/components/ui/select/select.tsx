"use client";

import {
	Select as AriaSelect,
	type SelectProps as AriaSelectProps,
	Button,
	Label,
	ListBox,
	ListBoxItem,
	type ListBoxItemProps,
	Popover,
	SelectValue,
	Text,
} from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, "children"> {
	label?: string;
	description?: string;
	errorMessage?: string;
	placeholder?: string;
	children: React.ReactNode | ((item: T) => React.ReactNode);
	items?: Iterable<T>;
	className?: string;
}

export function Select<T extends object>({
	label,
	description,
	errorMessage,
	placeholder = "Select an option",
	children,
	items,
	className,
	...props
}: SelectProps<T>) {
	return (
		<AriaSelect
			placeholder={placeholder}
			isInvalid={!!errorMessage || props.isInvalid}
			{...props}
			className={cn("group flex flex-col gap-2", className)}
		>
			{label && <Label className={cn(labelTypography, "text-text-secondary")}>{label}</Label>}
			<Button
				className={cn(
					"flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 border bg-surface px-4 py-2 text-left text-base text-text-primary transition-colors duration-150",
					"data-[hovered]:border-text-secondary data-[pressed]:bg-surface-hover",
					"data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
					errorMessage ? "border-error-500" : "border-border",
				)}
			>
				<SelectValue className="flex-1 truncate data-[placeholder]:text-text-tertiary" />
				<svg
					aria-hidden="true"
					viewBox="0 0 12 8"
					className="h-2 w-3 shrink-0 text-text-secondary transition-transform duration-150 group-data-[open]:rotate-180"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.25"
				>
					<path d="M1 1.5l5 5 5-5" />
				</svg>
			</Button>
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
			<Popover
				offset={4}
				className="min-w-(--trigger-width) border border-border bg-surface shadow-mat outline-none"
			>
				<ListBox items={items} className="max-h-72 overflow-auto py-1 outline-none">
					{children}
				</ListBox>
			</Popover>
		</AriaSelect>
	);
}

export interface SelectItemProps extends ListBoxItemProps {
	children: React.ReactNode;
}

export function SelectItem({ children, className, ...props }: SelectItemProps) {
	return (
		<ListBoxItem
			{...props}
			className={cn(
				"relative flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 text-[0.9375rem] text-text-secondary outline-none",
				"data-[focused]:bg-surface-hover data-[focused]:text-text-primary data-[hovered]:bg-surface-hover data-[hovered]:text-text-primary",
				"data-[selected]:text-text-primary",
				"before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-transparent data-[selected]:before:bg-accent",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				typeof className === "string" ? className : undefined,
			)}
		>
			{children}
		</ListBoxItem>
	);
}
