"use client";

import {
	TextField as AriaTextField,
	Input,
	type InputProps,
	Label,
	Text,
} from "react-aria-components";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const inputVariants = cva(
	"w-full rounded-md border bg-surface text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "border-border focus:border-primary-500 focus:ring-primary-500",
				error: "border-error-500 focus:border-error-600 focus:ring-error-500",
			},
			size: {
				sm: "h-9 px-3 py-1 text-sm",
				md: "h-11 px-4 py-2 text-base",
				lg: "h-13 px-5 py-3 text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export interface TextFieldProps extends VariantProps<typeof inputVariants> {
	label?: string;
	description?: string;
	errorMessage?: string;
	variant?: "default" | "error";
	size?: "sm" | "md" | "lg";
	placeholder?: string;
	type?: InputProps["type"];
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	name?: string;
	className?: string;
}

export function TextField({
	label,
	description,
	errorMessage,
	variant = "default",
	size = "md",
	className,
	placeholder,
	type,
	value,
	defaultValue,
	onChange,
	isDisabled,
	isReadOnly,
	isRequired,
	name,
}: TextFieldProps) {
	return (
		<AriaTextField
			className={cn("flex flex-col gap-1.5", className)}
			isInvalid={!!errorMessage}
			isDisabled={isDisabled}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			name={name}
		>
			{label && <Label className="text-sm font-medium text-text-primary">{label}</Label>}
			<Input
				className={inputVariants({ variant: errorMessage ? "error" : variant, size })}
				placeholder={placeholder}
				type={type}
			/>
			{description && (
				<Text slot="description" className="text-xs text-text-secondary">
					{description}
				</Text>
			)}
			{errorMessage && (
				<Text slot="errorMessage" className="text-xs text-error-500">
					{errorMessage}
				</Text>
			)}
		</AriaTextField>
	);
}
