"use server";

import type { Teaching } from "./teachings";
import { getAllTeachings } from "./teachings";

/**
 * Fetches the featured teaching
 * @returns Promise resolving to the featured teaching or undefined if none exists
 */
export async function getFeaturedTeaching(): Promise<Teaching | undefined> {
	const allTeachings = await getAllTeachings();

	const featuredTeaching = allTeachings.find((teaching) => teaching.isFeatured);
	return featuredTeaching;
}
