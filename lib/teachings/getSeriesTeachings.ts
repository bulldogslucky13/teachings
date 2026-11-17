"use server";

import { prepareTeachingToReturn } from "./prepareTeaching";
import type { Teaching } from "./teachings";
import { getAllTeachings } from "./teachings";

/**
 * Returns every teaching in the same series as `teaching` (including itself),
 * ordered oldest to newest. Returns an empty list if the teaching has no series.
 */
export async function getSeriesTeachings(teaching: Pick<Teaching, "series">): Promise<Teaching[]> {
	if (!teaching.series) return [];
	const allTeachings = await getAllTeachings();
	return allTeachings
		.filter((t) => t.series === teaching.series)
		.sort((a, b) => a.date.localeCompare(b.date) || Number(a.id) - Number(b.id))
		.map(prepareTeachingToReturn);
}
