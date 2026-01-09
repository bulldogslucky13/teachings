import type { Teaching } from "./teachings";
import { teachings } from "./teachings";

/**
 * Fetches the most recent teachings sorted by date
 * @param limit - Maximum number of teachings to return (default: 5)
 * @returns Promise resolving to array of recent teachings
 */
export async function getRecentTeachings(limit = 5): Promise<Teaching[]> {
	const recentTeachings = [...teachings]
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
		.slice(0, limit);
	return recentTeachings;
}
