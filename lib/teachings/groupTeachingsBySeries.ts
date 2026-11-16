import type { Teaching } from "./teachings";

export interface TeachingGroup {
	/** Stable key: "series:<name>" or "teaching:<id>" for a single teaching. */
	key: string;
	/** Series name, or undefined for a teaching that is not part of a series. */
	series: string | undefined;
	/** Cover photo filename of the group's most recent teaching. */
	coverPhoto: string;
	/** Teachings in the group, oldest to newest. */
	teachings: Teaching[];
	/** "YYYY-MM-DD" of the oldest teaching. */
	startDate: string;
	/** "YYYY-MM-DD" of the newest teaching. */
	endDate: string;
}

const byDateAscending = (a: Teaching, b: Teaching) =>
	a.date.localeCompare(b.date) || Number(a.id) - Number(b.id) || a.id.localeCompare(b.id);

/**
 * Groups teachings by series. Teachings without a series become single-item groups.
 * Groups are ordered by their most recent teaching, newest first (ties: higher id first).
 */
export function groupTeachingsBySeries(teachings: readonly Teaching[]): TeachingGroup[] {
	const buckets = new Map<string, Teaching[]>();

	for (const teaching of teachings) {
		const key = teaching.series ? `series:${teaching.series}` : `teaching:${teaching.id}`;
		const bucket = buckets.get(key);
		if (bucket) bucket.push(teaching);
		else buckets.set(key, [teaching]);
	}

	const groups: TeachingGroup[] = [];
	for (const [key, bucket] of buckets) {
		const sorted = [...bucket].sort(byDateAscending);
		const first = sorted[0] as Teaching;
		const last = sorted[sorted.length - 1] as Teaching;
		groups.push({
			key,
			series: first.series,
			coverPhoto: last.coverPhoto,
			teachings: sorted,
			startDate: first.date,
			endDate: last.date,
		});
	}

	const newestId = (group: TeachingGroup) =>
		Number(group.teachings[group.teachings.length - 1]?.id);
	return groups.sort(
		(a, b) =>
			b.endDate.localeCompare(a.endDate) || newestId(b) - newestId(a) || a.key.localeCompare(b.key),
	);
}
