import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { ThemeProvider } from "./components/providers/theme-provider";
import { SiteFooter } from "./components/site-footer/site-footer";
import { SiteHeader } from "./components/site-header/site-header";
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	style: ["normal", "italic"],
	display: "swap",
	variable: "--font-cormorant-garamond",
});

const hankenGrotesk = Hanken_Grotesk({
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
	variable: "--font-hanken-grotesk",
});

const SITE_TITLE = "Teachings — Cameron Bristol";
const SITE_DESCRIPTION =
	"An archive of Bible teachings by Cameron Bristol, arranged by series and by book of Scripture.";

export const metadata: Metadata = {
	title: {
		template: "%s · Teachings — Cameron Bristol",
		default: SITE_TITLE,
	},
	description: SITE_DESCRIPTION,
	openGraph: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		siteName: SITE_TITLE,
		type: "website",
	},
	twitter: { card: "summary_large_image" },
	verification: { google: "5Winog-VlFSQwH72y7l4rOk-H0LS1THFgCOMe2a1dl4" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${cormorantGaramond.variable} ${hankenGrotesk.variable}`}
		>
			<body className="flex min-h-dvh flex-col bg-background font-sans text-text-primary">
				<ThemeProvider>
					<a
						href="#content"
						className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-3 focus:text-label focus:font-medium focus:uppercase focus:tracking-label focus:text-text-primary"
					>
						Skip to content
					</a>
					<SiteHeader />
					<main id="content" tabIndex={-1} className="flex-1 focus:outline-none">
						{children}
					</main>
					<SiteFooter />
				</ThemeProvider>
			</body>
		</html>
	);
}
