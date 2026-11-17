"use client";

import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cn } from "../utils/cn";
import { cva } from "../utils/variants";

const playVariants = cva(
	"inline-grid flex-none place-items-center rounded-full border transition-colors duration-200",
	{
		variants: {
			size: {
				md: "h-[52px] w-[52px] [&>svg]:ml-[3px] [&>svg]:h-4 [&>svg]:w-3.5",
				lg: "h-[84px] w-[84px] [&>svg]:ml-[5px] [&>svg]:h-[26px] [&>svg]:w-[22px]",
			},
			tone: {
				/** On the wall/mat: brass ring, ink triangle, follows the theme. */
				default:
					"border-accent text-text-primary group-hover:bg-accent/15 group-data-[hovered]:bg-accent/15",
				/** Over video/poster art: fixed dark scrim + brass ring regardless of theme. */
				media:
					"border-[#c8a96e] bg-black/60 text-[#ece7df] group-hover:bg-[#c8a96e]/20 group-data-[hovered]:bg-[#c8a96e]/20",
			},
		},
		defaultVariants: { size: "md", tone: "default" },
	},
);

export type PlayMarkSize = "md" | "lg";
export type PlayMarkTone = "default" | "media";

function PlayTriangle() {
	return (
		<svg viewBox="0 0 14 16" aria-hidden="true" fill="currentColor">
			<path d="M0 0 L14 8 L0 16 Z" />
		</svg>
	);
}

export interface PlayMarkProps {
	size?: PlayMarkSize;
	tone?: PlayMarkTone;
	className?: string;
}

/**
 * The circular brass-ring play affordance, as a purely visual element (aria-hidden).
 * Put it inside a link or button that carries the accessible name, and add `group`
 * to that parent so its hover tints the ring.
 *
 * @example
 * <NextLink href="/teaching/18" className="group inline-flex items-center gap-[18px]">
 *   <PlayMark />
 *   <Label tone="primary" className="text-xs">Watch</Label>
 * </NextLink>
 */
export function PlayMark({ size, tone, className }: PlayMarkProps) {
	return (
		<span aria-hidden="true" className={cn(playVariants({ size, tone }), className)}>
			<PlayTriangle />
		</span>
	);
}

export interface PlayButtonProps extends Omit<AriaButtonProps, "children" | "className"> {
	/** Required: e.g. "Play What is Eschatology?" */
	"aria-label": string;
	size?: PlayMarkSize;
	tone?: PlayMarkTone;
	className?: string;
}

/**
 * A real button version of the play affordance (e.g. the big play over a video poster).
 */
export function PlayButton({ size = "lg", tone = "media", className, ...props }: PlayButtonProps) {
	return (
		<AriaButton {...props} className={cn("group cursor-pointer rounded-full", className)}>
			<PlayMark size={size} tone={tone} />
		</AriaButton>
	);
}
