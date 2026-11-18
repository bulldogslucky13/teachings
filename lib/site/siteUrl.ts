/** Public origin of the site, used for absolute URLs in the sitemap and robots.txt. */
export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL ?? "https://teachings.cameronbristol.xyz"
).replace(/\/+$/, "");
