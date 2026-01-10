"use server";

import { prepareTeachingToReturn } from "./prepareTeaching";
import type { Teaching } from "./teachings";
import { getAllTeachings } from "./teachings";

/**
 * Retrieves a teaching by its ID.
 * @param id - The unique identifier of the teaching
 * @returns The teaching object if found, undefined otherwise
 */
export async function getTeachingById(id: string): Promise<Teaching | undefined> {
	const allTeachings = await getAllTeachings();
	const teaching = allTeachings.find((t) => t.id === id);
	return teaching ? prepareTeachingToReturn(teaching) : undefined;
}
