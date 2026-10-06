"use server";

import { compareTeachingsByRecency } from "./compareTeachingsByRecency";
import { prepareTeachingToReturn } from "./prepareTeaching";
import type { Teaching } from "./teachings";
import { getAllTeachings } from "./teachings";

/**
 * Fetches the most recent teachings sorted by date
 * @param limit - Maximum number of teachings to return (default: 5)
 * @returns Promise resolving to array of recent teachings
 */
export async function getRecentTeachings(limit = 5): Promise<Teaching[]> {
	const allTeachings = await getAllTeachings();
	const recentTeachings = [...allTeachings].sort(compareTeachingsByRecency).slice(0, limit);
	return recentTeachings.map(prepareTeachingToReturn);
}
