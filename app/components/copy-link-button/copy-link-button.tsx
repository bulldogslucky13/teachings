"use client";

import { useEffect, useRef, useState } from "react";
import { Button as AriaButton } from "react-aria-components";
import { MdCheck, MdLink } from "react-icons/md";
import { Button } from "@/app/components/ui/button/button";
import { cn } from "@/app/components/ui/utils/cn";

export interface CopyLinkButtonProps {
	/** Path to copy, e.g. "/series/sola-scriptura-case-studies". Defaults to the current page. */
	path?: string;
	/** Button text, and the accessible name of the icon variant (default "Copy link"). */
	label?: string;
	/** "button" (default): full-width keyline button. "icon": a small link icon to set beside a title. */
	variant?: "button" | "icon";
	className?: string;
}

/** Copies a link to the clipboard and confirms for 2s ("Link copied", announced to screen readers). */
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

	const status = (
		<span role="status" aria-live="polite" className="sr-only">
			{copied ? "Link copied" : ""}
		</span>
	);

	if (variant === "icon") {
		const Icon = copied ? MdCheck : MdLink;
		return (
			<>
				<AriaButton
					onPress={handleCopy}
					aria-label={label}
					className={cn(
						"inline-grid h-8 w-8 cursor-pointer place-items-center rounded-none border border-transparent text-text-secondary transition-colors duration-150",
						"data-[hovered]:border-border data-[hovered]:text-accent-text",
						copied && "text-accent-text",
						className,
					)}
				>
					<Icon aria-hidden="true" className="h-[18px] w-[18px]" />
				</AriaButton>
				{status}
			</>
		);
	}

	return (
		<>
			<Button
				variant="secondary"
				className={cn("w-full justify-between!", className)}
				onPress={handleCopy}
			>
				<span>{copied ? "Link copied" : label}</span>
			</Button>
			{status}
		</>
	);
}
