"use server";

import { getSeriesSlug } from "./getSeriesSlug";
import { groupTeachingsBySeries, type TeachingGroup } from "./groupTeachingsBySeries";
import { prepareTeachingToReturn } from "./prepareTeaching";
import { getAllTeachings } from "./teachings";

async function getSeriesGroups(): Promise<TeachingGroup[]> {
	const all = await getAllTeachings();
	return groupTeachingsBySeries(all.map(prepareTeachingToReturn)).filter((g) => g.series);
}

/**
 * Finds a series by its slug (see `getSeriesSlug`). Teachings are ordered oldest to newest
 * with only featured Scripture. Returns undefined for an unknown slug or a single teaching.
 */
export async function getSeriesBySlug(slug: string): Promise<TeachingGroup | undefined> {
	const groups = await getSeriesGroups();
	return groups.find((g) => g.series && getSeriesSlug(g.series) === slug);
}

/** Slug of every series, newest series first. */
export async function getAllSeriesSlugs(): Promise<string[]> {
	const groups = await getSeriesGroups();
	return groups.map((g) => getSeriesSlug(g.series as string));
}
