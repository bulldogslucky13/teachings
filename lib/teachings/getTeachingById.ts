import type { Teaching } from "./teachings";
import { teachings } from "./teachings";

/**
 * Retrieves a teaching by its ID.
 * @param id - The unique identifier of the teaching
 * @returns The teaching object if found, undefined otherwise
 */
export async function getTeachingById(id: string): Promise<Teaching | undefined> {
	return teachings.find((t) => t.id === id);
}
