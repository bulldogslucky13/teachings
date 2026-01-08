"use client";

import {
	TextArea as AriaTextArea,
	TextField as AriaTextField,
	Label,
	Text,
} from "react-aria-components";
import { cn } from "../utils/cn";
import { cva, type VariantProps } from "../utils/variants";

const textAreaVariants = cva(
	"w-full rounded-md border bg-surface text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]",
	{
		variants: {
			variant: {
				default: "border-border focus:border-primary-500 focus:ring-primary-500",
				error: "border-error-500 focus:border-error-600 focus:ring-error-500",
			},
			size: {
				sm: "px-3 py-2 text-sm",
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
			<AriaTextArea
				className={textAreaVariants({ variant: errorMessage ? "error" : variant, size, resize })}
				placeholder={placeholder}
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
