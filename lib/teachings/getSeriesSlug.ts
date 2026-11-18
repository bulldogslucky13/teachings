/**
 * Turns a series name into a URL slug.
 *
 * @example
 * getSeriesSlug("Sola Scriptura Case Studies") // "sola-scriptura-case-studies"
 * getSeriesSlug("Psalms - God's Heart Book") // "psalms-gods-heart-book"
 */
export function getSeriesSlug(series: string): string {
	return series
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/['’]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

/** Path of a series' own page, e.g. "/series/sola-scriptura-case-studies". */
export function getSeriesHref(series: string): string {
	return `/series/${getSeriesSlug(series)}`;
}
