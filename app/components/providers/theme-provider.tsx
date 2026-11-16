"use client";

import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";
import { RouterProvider } from "react-aria-components";

interface ThemeProviderProps {
	children: ReactNode;
}

declare module "react-aria-components" {
	interface RouterConfig {
		routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
	}
}

/**
 * App-wide client providers.
 * - next-themes: dark is the default ("a quiet gallery at night"); a visitor's explicit
 *   choice is persisted in localStorage under `theme`.
 * - react-aria RouterProvider: makes react-aria Links (ui/link) navigate client-side.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
	const router = useRouter();

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}
			themes={["light", "dark"]}
			disableTransitionOnChange
		>
			<RouterProvider navigate={router.push}>{children}</RouterProvider>
		</NextThemesProvider>
	);
}
