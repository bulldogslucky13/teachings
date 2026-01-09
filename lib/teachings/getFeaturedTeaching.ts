import type { Teaching } from "./teachings";
import { teachings } from "./teachings";

/**
 * Fetches the featured teaching
 * @returns Promise resolving to the featured teaching or undefined if none exists
 */
export async function getFeaturedTeaching(): Promise<Teaching | undefined> {
	const featuredTeaching = teachings.find((teaching) => teaching.isFeatured);
	return featuredTeaching;
}
