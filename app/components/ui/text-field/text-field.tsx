"use client";

import {
	TextField as AriaTextField,
	Input,
	type InputProps,
	Label,
	Text,
} from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const inputVariants = cva(
	"w-full rounded-none border bg-surface text-text-primary transition-colors duration-150 placeholder:text-text-tertiary data-[hovered]:border-text-secondary data-[focused]:border-accent data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
	{
		variants: {
			variant: {
				default: "border-border",
				error: "border-error-500 data-[hovered]:border-error-500 data-[focused]:border-error-600",
			},
			size: {
				sm: "h-10 px-3 py-1 text-[0.9375rem]",
				md: "h-12 px-4 py-2 text-base",
				lg: "h-14 px-5 py-3 text-lg",
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
			className={cn("flex flex-col gap-2", className)}
			isInvalid={!!errorMessage}
			isDisabled={isDisabled}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			value={value}
			defaultValue={defaultValue}
			onChange={onChange}
			name={name}
		>
			{label && <Label className={cn(labelTypography, "text-text-secondary")}>{label}</Label>}
			<Input
				className={inputVariants({ variant: errorMessage ? "error" : variant, size })}
				placeholder={placeholder}
				type={type}
			/>
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
		</AriaTextField>
	);
}
