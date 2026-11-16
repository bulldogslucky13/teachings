"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { type Key, ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { labelTypography } from "../label/label";
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

/**
 * "Light / Dark" segmented control (react-aria ToggleButtonGroup, single selection).
 * Uses next-themes; the choice is persisted by next-themes in localStorage.
 * Before hydration neither option is marked, avoiding a mismatch with the stored theme.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme();
	const hydrated = useHydrated();
	const current = hydrated && resolvedTheme ? resolvedTheme : undefined;

	return (
		<ToggleButtonGroup
			aria-label="Colour theme"
			selectionMode="single"
			disallowEmptySelection
			selectedKeys={current ? [current] : []}
			onSelectionChange={(keys: Set<Key>) => {
				const [next] = keys;
				if (typeof next === "string") setTheme(next);
			}}
			className={cn(
				"inline-flex items-center border border-border px-2.5 py-[5px] whitespace-nowrap text-text-secondary transition-colors duration-150 hover:border-text-secondary",
				labelTypography,
				"tracking-[0.1em]",
				className,
			)}
		>
			<ThemeOption id="light">Light</ThemeOption>
			<span aria-hidden="true" className="px-1">
				/
			</span>
			<ThemeOption id="dark">Dark</ThemeOption>
		</ToggleButtonGroup>
	);
}

function ThemeOption({ id, children }: { id: string; children: string }) {
	return (
		<ToggleButton
			id={id}
			className={cn(
				"cursor-pointer py-0.5 uppercase outline-offset-2 transition-colors duration-150",
				"data-[hovered]:text-text-primary data-[selected]:text-text-primary",
			)}
		>
			{children}
		</ToggleButton>
	);
}
