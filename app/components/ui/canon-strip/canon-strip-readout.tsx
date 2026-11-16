"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";

interface CanonStripReadoutProps {
	/** Text shown when nothing is hovered or focused. */
	defaultText: string;
	children: ReactNode;
}

const readoutOf = (target: EventTarget | null) =>
	target instanceof Element
		? (target.closest("[data-readout]")?.getAttribute("data-readout") ?? undefined)
		: undefined;

/**
 * Client wrapper for CanonStrip: shows the hovered/focused book above the ticks.
 * Uses delegated listeners so the ticks themselves can be server-rendered links.
 * The readout is visual only (aria-hidden): every tick already carries its full
 * accessible name, so announcing it again would be redundant.
 */
export function CanonStripReadout({ defaultText, children }: CanonStripReadoutProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [hovered, setHovered] = useState<string>();
	const [focused, setFocused] = useState<string>();
	const active = focused ?? hovered;

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const onOver = (e: MouseEvent) => setHovered(readoutOf(e.target));
		const onLeave = () => setHovered(undefined);
		const onFocusIn = (e: FocusEvent) => setFocused(readoutOf(e.target));
		const onFocusOut = (e: FocusEvent) => {
			if (!el.contains(e.relatedTarget as Node | null)) setFocused(undefined);
		};
		el.addEventListener("mouseover", onOver);
		el.addEventListener("mouseleave", onLeave);
		el.addEventListener("focusin", onFocusIn);
		el.addEventListener("focusout", onFocusOut);
		return () => {
			el.removeEventListener("mouseover", onOver);
			el.removeEventListener("mouseleave", onLeave);
			el.removeEventListener("focusin", onFocusIn);
			el.removeEventListener("focusout", onFocusOut);
		};
	}, []);

	return (
		<div ref={ref}>
			<p
				aria-hidden="true"
				className={cn(
					labelTypography,
					"mb-3 min-h-[1.4em] transition-colors duration-150",
					active ? "text-accent-text" : "text-text-secondary",
				)}
			>
				{active ?? defaultText}
			</p>
			{children}
		</div>
	);
}
