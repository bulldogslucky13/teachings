"use client";

import { useEffect, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { Button } from "@/app/components/ui/button/button";
import { textLinkStyles } from "@/app/components/ui/link/link";
import { cn } from "@/app/components/ui/utils/cn";

export interface CopyLinkButtonProps {
	/** Path to copy, e.g. "/series/sola-scriptura-case-studies". Defaults to the current page. */
	path?: string;
	/** Button label (default "Copy link"). */
	label?: string;
	/** "button" (default): full-width keyline button. "text": a quiet uppercase text action. */
	variant?: "button" | "text";
	className?: string;
}

/** Copies a link to the clipboard; swaps its label and announces "Link copied" for 2s. */
export function CopyLinkButton({
	path,
	label = "Copy link",
	variant = "button",
	className,
}: CopyLinkButtonProps) {
	const [copied, setCopied] = useState(false);
	const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, []);

	const handleCopy = async () => {
		try {
			const url = path ? new URL(path, window.location.origin).href : window.location.href;
			await navigator.clipboard.writeText(url);
			setCopied(true);
			if (timeout.current) clearTimeout(timeout.current);
			timeout.current = setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy link:", err);
		}
	};

	return (
		<>
			{variant === "text" ? (
				<AriaButton
					onPress={handleCopy}
					className={cn(textLinkStyles, "cursor-pointer", className)}
				>
					{copied ? "Link copied" : label}
				</AriaButton>
			) : (
				<Button
					variant="secondary"
					className={cn("w-full justify-between!", className)}
					onPress={handleCopy}
				>
					<span>{copied ? "Link copied" : label}</span>
				</Button>
			)}
			<span role="status" aria-live="polite" className="sr-only">
				{copied ? "Link copied" : ""}
			</span>
		</>
	);
}
