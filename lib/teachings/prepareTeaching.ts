import type { Teaching } from "./teachings";

/**
 * Filters out scripture references that are not featured from a teaching.
 * Uses whitelist approach (referenceType === "featured") to ensure only explicitly
 * featured scriptures are displayed, guarding against accidentally exposing new
 * reference types added in the future.
 */
export function prepareTeachingToReturn(teaching: Teaching): Teaching {
	const cloned = structuredClone(teaching);

	cloned.scripture = cloned.scripture.filter((ref) => ref.referenceType === "featured");

	return cloned;
}
