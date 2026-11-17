"use client";

import {
	TextArea as AriaTextArea,
	TextField as AriaTextField,
	Label,
	Text,
} from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const textAreaVariants = cva(
	"min-h-[96px] w-full rounded-none border bg-surface text-text-primary transition-colors duration-150 placeholder:text-text-tertiary data-[hovered]:border-text-secondary data-[focused]:border-accent data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
	{
		variants: {
			variant: {
				default: "border-border",
				error: "border-error-500 data-[hovered]:border-error-500 data-[focused]:border-error-600",
			},
			size: {
				sm: "px-3 py-2 text-[0.9375rem]",
				md: "px-4 py-3 text-base",
				lg: "px-5 py-4 text-lg",
			},
			resize: {
				none: "resize-none",
				vertical: "resize-y",
				horizontal: "resize-x",
				both: "resize",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
			resize: "vertical",
		},
	},
);

export interface TextAreaProps extends VariantProps<typeof textAreaVariants> {
	label?: string;
	description?: string;
	errorMessage?: string;
	variant?: "default" | "error";
	size?: "sm" | "md" | "lg";
	resize?: "none" | "vertical" | "horizontal" | "both";
	placeholder?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	name?: string;
	className?: string;
}

export function TextArea({
	label,
	description,
	errorMessage,
	variant = "default",
	size = "md",
	resize = "vertical",
	className,
	placeholder,
	value,
	defaultValue,
	onChange,
	isDisabled,
	isReadOnly,
	isRequired,
	name,
}: TextAreaProps) {
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
			<AriaTextArea
				className={textAreaVariants({ variant: errorMessage ? "error" : variant, size, resize })}
				placeholder={placeholder}
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
