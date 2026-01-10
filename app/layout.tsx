import type { ReactNode } from "react";
import { ThemeProvider } from "./components/providers/theme-provider";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
