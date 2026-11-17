"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
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

const icon =
	"absolute inset-0 m-auto size-[18px] transition-[rotate,scale,opacity] duration-300 ease-out";

/**
 * Sun / moon icon button (react-aria ToggleButton, pressed = dark theme).
 * Uses next-themes; the choice is persisted by next-themes in localStorage.
 * Which icon shows is decided in CSS from the `.dark` class, so it is right before
 * hydration; on a press the outgoing icon turns and fades as the other turns in.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const hydrated = useHydrated();
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
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="square"
				className={cn(icon, "dark:-rotate-90 dark:scale-50 dark:opacity-0")}
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
			</svg>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinejoin="miter"
				className={cn(
					icon,
					"rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100",
				)}
			>
				<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
			</svg>
		</ToggleButton>
	);
}
