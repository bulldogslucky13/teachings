"use client";

import { useTheme } from "next-themes";
import { useId, useSyncExternalStore } from "react";
import { ToggleButton } from "react-aria-components";
import { cn } from "../utils/cn";

const subscribe = () => () => {};

/** True only after hydration, so server and first client render match. */
function useHydrated() {
	return useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
}

export interface ThemeToggleProps {
	className?: string;
}

/*
 * The transition utilities are marked important on purpose: next-themes switches themes
 * with `disableTransitionOnChange`, which briefly applies `* { transition: none !important }`
 * so page colours snap. The icon is the one thing that should animate through the switch.
 * The reduced-motion override is repeated here because these rules outrank the global one.
 */
const part =
	"origin-center [transform-box:fill-box] transition-[translate,scale,rotate,opacity]! duration-500! ease-in-out! motion-reduce:duration-[0.01ms]!";

/**
 * Sun / moon icon button (react-aria ToggleButton, pressed = dark theme).
 * Uses next-themes; the choice is persisted by next-themes in localStorage.
 * One drawing that morphs with the theme: the sun's disc grows, a masking disc slides
 * across it to leave a crescent, and the rays turn and draw in; it runs backwards on
 * the way to light. State comes from the `.dark` class in CSS, so it is right before
 * hydration.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const hydrated = useHydrated();
	const maskId = useId();
	const isDark = hydrated && resolvedTheme === "dark";

	return (
		<ToggleButton
			aria-label="Dark theme"
			isSelected={isDark}
			onChange={(selected) => setTheme(selected ? "dark" : "light")}
			className={cn(
				"relative size-10 shrink-0 cursor-pointer text-text-secondary transition-colors duration-150",
				"data-[hovered]:text-text-primary data-[pressed]:text-accent-text",
				className,
			)}
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className="absolute inset-0 m-auto size-5 overflow-visible"
			>
				<mask id={maskId}>
					<rect x="-4" y="-4" width="32" height="32" fill="white" />
					<circle
						cx="17.5"
						cy="7"
						r="7.5"
						fill="black"
						className={cn(part, "translate-x-[14px] -translate-y-[10px] dark:translate-0")}
					/>
				</mask>
				<g mask={`url(#${maskId})`}>
					<circle
						cx="12"
						cy="12"
						r="5"
						fill="currentColor"
						className={cn(part, "dark:scale-[1.8]")}
					/>
				</g>
				<path
					d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.5"
					className={cn(part, "dark:rotate-45 dark:scale-0 dark:opacity-0")}
				/>
			</svg>
		</ToggleButton>
	);
}
