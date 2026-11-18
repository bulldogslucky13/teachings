"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button/button";

export interface CopyLinkButtonProps {
	/** Path to copy, e.g. "/series/sola-scriptura-case-studies". Defaults to the current page. */
	path?: string;
	/** Button label (default "Copy link"). */
	label?: string;
}

/** Copies a link to the clipboard; swaps its label and announces "Link copied" for 2s. */
export function CopyLinkButton({ path, label = "Copy link" }: CopyLinkButtonProps) {
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
			<Button variant="secondary" className="w-full justify-between!" onPress={handleCopy}>
				<span>{copied ? "Link copied" : label}</span>
			</Button>
			<span role="status" aria-live="polite" className="sr-only">
				{copied ? "Link copied" : ""}
			</span>
		</>
	);
}
