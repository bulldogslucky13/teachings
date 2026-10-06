import type { Teaching } from "./teachings";

/**
 * Comparator that sorts teachings from most recent to oldest.
 * Teachings that share a date (e.g. multiple sessions in one day) are ordered
 * by id descending, since later sessions are added with higher ids.
 */
export function compareTeachingsByRecency(
	a: Pick<Teaching, "id" | "date">,
	b: Pick<Teaching, "id" | "date">,
): number {
	const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
	if (dateDiff !== 0) {
		return dateDiff;
	}
	return Number(b.id) - Number(a.id);
}
