import type { MetadataRoute } from "next";
import { getCoverPhotoUrl } from "./getCoverPhotoUrl";
import { getSeriesHref } from "./getSeriesSlug";
import { groupTeachingsBySeries } from "./groupTeachingsBySeries";
import type { Teaching } from "./teachings";

const byDateThenId = (a: Teaching, b: Teaching) =>
	a.date.localeCompare(b.date) || Number(a.id) - Number(b.id);

/**
 * Every public page as sitemap entries with absolute URLs: home, archive, each series
 * page and each teaching page. Dates are the newest teaching each page shows;
 * series and teachings carry their cover image.
 */
export function buildSitemap(
	teachings: readonly Teaching[],
	baseUrl: string,
): MetadataRoute.Sitemap {
	const base = baseUrl.replace(/\/+$/, "");
	const sorted = [...teachings].sort(byDateThenId);
	const newest = sorted[sorted.length - 1]?.date;
	const image = (coverPhoto: string) => [`${base}${getCoverPhotoUrl(coverPhoto)}`];

	const series = groupTeachingsBySeries(sorted)
		.filter((group) => group.series)
		.sort((a, b) => a.startDate.localeCompare(b.startDate))
		.map((group) => ({
			url: `${base}${getSeriesHref(group.series as string)}`,
			lastModified: group.endDate,
			changeFrequency: "monthly" as const,
			priority: 0.8,
			images: image(group.coverPhoto),
		}));

	return [
		{ url: `${base}/`, lastModified: newest, changeFrequency: "weekly", priority: 1 },
		{ url: `${base}/archive`, lastModified: newest, changeFrequency: "weekly", priority: 0.9 },
		...series,
		...sorted.map((teaching) => ({
			url: `${base}/teaching/${teaching.id}`,
			lastModified: teaching.date,
			changeFrequency: "yearly" as const,
			priority: 0.7,
			images: image(teaching.coverPhoto),
		})),
	];
}
