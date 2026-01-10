"use server";

import { prepareTeachingToReturn } from "./prepareTeaching";
import type { Teaching } from "./teachings";
import { getAllTeachings } from "./teachings";

/**
 * Get related teachings for a given teaching based on similarity.
 * Priority: 1) Next in series, 2) Same series, 3) Overlapping scripture, 4) Shared topics, 5) Most recent
 * @param teaching - The teaching to find related content for
 * @param allTeachings - The full list of teachings to search from
 * @param limit - Maximum number of related teachings to return (default: 6)
 * @returns Array of related teachings, sorted by relevance
 */
export async function getRelatedTeachings(teaching: Teaching, limit = 6): Promise<Teaching[]> {
	const allTeachings = await getAllTeachings();
	// Filter out the current teaching
	const candidates = allTeachings.filter((t) => t.id !== teaching.id);

	// Score each candidate based on similarity
	const scored = candidates.map((candidate) => {
		let score = 0;

		// 1. Next in series (highest priority) - add 10000 points
		if (teaching.nextInSeries && candidate.id === teaching.nextInSeries) {
			score += 10000;
		}

		// 2. Same series - add 1000 points
		if (teaching.series && candidate.series === teaching.series) {
			score += 1000;
		}

		// 3. Overlapping scripture (same book+chapter) - add 100 points per match
		const scriptureMatches = countScriptureMatches(teaching.scripture, candidate.scripture);
		score += scriptureMatches * 100;

		// 4. Shared topics - add 10 points per shared topic
		const topicMatches = countTopicMatches(teaching.topics, candidate.topics);
		score += topicMatches * 10;

		// 5. Most recent (fallback) - add recency score (0-1 points)
		// More recent teachings get slightly higher scores
		const recencyScore = getRecencyScore(candidate.date);
		score += recencyScore;

		return { teaching: candidate, score };
	});

	// Sort by score (descending) and return top N
	return scored
		.sort((a, b) => b.score - a.score)
		.slice(0, limit)
		.map((item) => prepareTeachingToReturn(item.teaching));
}

/**
 * Count how many scripture references match by book and chapter
 */
function countScriptureMatches(
	scripture1: Teaching["scripture"],
	scripture2: Teaching["scripture"],
): number {
	let matches = 0;

	for (const ref1 of scripture1) {
		for (const ref2 of scripture2) {
			if (ref1.book.toLowerCase() === ref2.book.toLowerCase() && ref1.chapter === ref2.chapter) {
				matches++;
			}
		}
	}

	return matches;
}

/**
 * Count how many topics are shared between two teachings
 */
function countTopicMatches(topics1: string[], topics2: string[]): number {
	const set1 = new Set(topics1.map((t) => t.toLowerCase()));
	const set2 = new Set(topics2.map((t) => t.toLowerCase()));

	let matches = 0;
	for (const topic of set1) {
		if (set2.has(topic)) {
			matches++;
		}
	}

	return matches;
}

/**
 * Calculate a recency score (0-1) based on how recent the teaching is
 * More recent = higher score
 */
function getRecencyScore(dateString: string): number {
	try {
		const teachingDate = new Date(dateString);
		const now = new Date();
		const daysSinceTeaching = Math.floor(
			(now.getTime() - teachingDate.getTime()) / (1000 * 60 * 60 * 24),
		);

		// Normalize to 0-1 scale: teachings within last year get higher scores
		// After 365 days, score approaches 0
		const maxDays = 365;
		const score = Math.max(0, 1 - daysSinceTeaching / maxDays);

		return score;
	} catch {
		return 0;
	}
}
