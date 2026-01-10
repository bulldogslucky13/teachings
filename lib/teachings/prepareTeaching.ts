import type { Teaching } from "./teachings";

/**
 * Filters out scripture references marked as hidden from a teaching.
 */
export function prepareTeachingToReturn(teaching: Teaching): Teaching {
	const cloned = structuredClone(teaching);

	cloned.scripture = cloned.scripture.filter((ref) => !ref.isHidden);

	return cloned;
}
