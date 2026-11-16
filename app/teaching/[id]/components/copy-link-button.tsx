"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button/button";

/** Copies the current page URL; swaps its label and announces "Link copied" for 2s. */
export function CopyLinkButton() {
	const [copied, setCopied] = useState(false);
	const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, []);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
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
				<span>{copied ? "Link copied" : "Copy link"}</span>
			</Button>
			<span role="status" aria-live="polite" className="sr-only">
				{copied ? "Link copied" : ""}
			</span>
		</>
	);
}
