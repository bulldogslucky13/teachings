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
} from "react-aria-components";
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
		<AriaSelect {...props} className={cn("flex flex-col gap-1.5", className)}>
			{label && <Label className="text-sm font-medium text-text-primary">{label}</Label>}
			<Button
				className={cn(
					"flex h-11 w-full items-center justify-between rounded-md border bg-surface px-4 py-2 text-base text-text-primary transition-colors",
					"focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
					"data-[hovered]:bg-surface-hover",
					"disabled:cursor-not-allowed disabled:opacity-50",
					errorMessage ? "border-error-500" : "border-border",
				)}
			>
				<SelectValue className="flex-1 text-left data-[placeholder]:text-text-tertiary" />
				<span aria-hidden="true" className="ml-2">
					▼
				</span>
			</Button>
			{description && <span className="text-xs text-text-secondary">{description}</span>}
			{errorMessage && <span className="text-xs text-error-500">{errorMessage}</span>}
			<Popover
				className={cn(
					"min-w-[--trigger-width] rounded-md border border-border bg-surface shadow-lg",
					"data-[entering]:animate-in data-[entering]:fade-in",
					"data-[exiting]:animate-out data-[exiting]:fade-out",
				)}
			>
				<ListBox items={items} className="max-h-60 overflow-auto p-1 outline-none">
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
				"relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-text-primary outline-none",
				"data-[focused]:bg-surface-hover data-[hovered]:bg-surface-hover",
				"data-[selected]:bg-primary-600 data-[selected]:text-white",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				className,
			)}
		>
			{children}
		</ListBoxItem>
	);
}
