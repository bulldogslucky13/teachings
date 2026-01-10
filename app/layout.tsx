import Script from "next/script";
import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Script id="theme-detection" strategy="beforeInteractive">
					{`
						(function() {
							const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

							function updateTheme(e) {
								if (e.matches) {
									document.documentElement.classList.add('dark');
								} else {
									document.documentElement.classList.remove('dark');
								}
							}

							// Set initial theme
							updateTheme(mediaQuery);

							// Listen for system theme changes
							mediaQuery.addEventListener('change', updateTheme);
						})();
					`}
				</Script>
				{children}
			</body>
		</html>
	);
}
