/**
 * Date helpers for teaching dates, which are stored as "YYYY-MM-DD".
 * All formatting is done in UTC so the calendar date never shifts with the
 * viewer's (or server's) time zone.
 */

export type TeachingDateStyle = "medium" | "long" | "monthDay" | "monthYear";

const formatters: Record<TeachingDateStyle, Intl.DateTimeFormat> = {
	medium: new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}),
	long: new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC",
	}),
	monthDay: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
	monthYear: new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }),
};

const monthOnly = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

function parseTeachingDate(date: string): Date | undefined {
	const parsed = new Date(`${date.slice(0, 10)}T00:00:00Z`);
	return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

/**
 * Formats a "YYYY-MM-DD" teaching date.
 *
 * @example
 * formatTeachingDate("2026-05-24") // "May 24, 2026"
 * formatTeachingDate("2026-03-22", "long") // "March 22, 2026"
 * formatTeachingDate("2026-03-22", "monthDay") // "Mar 22"
 * formatTeachingDate("2026-03-22", "monthYear") // "Mar 2026"
 */
export function formatTeachingDate(date: string, style: TeachingDateStyle = "medium"): string {
	const parsed = parseTeachingDate(date);
	return parsed ? formatters[style].format(parsed) : "";
}

/**
 * Formats the span between two "YYYY-MM-DD" dates at month resolution.
 *
 * @example
 * formatDateRange("2026-04-13", "2026-04-26") // "Apr 2026"
 * formatDateRange("2026-03-22", "2026-05-24") // "Mar–May 2026"
 * formatDateRange("2025-11-09", "2026-01-18") // "Nov 2025–Jan 2026"
 */
export function formatDateRange(start: string, end: string): string {
	const a = parseTeachingDate(start);
	const b = parseTeachingDate(end);
	if (!a || !b) return a || b ? formatters.monthYear.format((a ?? b) as Date) : "";

	const [from, to] = a <= b ? [a, b] : [b, a];
	const sameYear = from.getUTCFullYear() === to.getUTCFullYear();

	if (sameYear && from.getUTCMonth() === to.getUTCMonth()) {
		return formatters.monthYear.format(from);
	}
	if (sameYear) {
		return `${monthOnly.format(from)}–${formatters.monthYear.format(to)}`;
	}
	return `${formatters.monthYear.format(from)}–${formatters.monthYear.format(to)}`;
}
