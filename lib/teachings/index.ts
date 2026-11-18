export {
	type CanonBook,
	type CanonBookCoverage,
	canonBooks,
	getCanonCoverage,
	type Testament,
} from "./canon";
export { compareTeachingsByRecency } from "./compareTeachingsByRecency";
export { formatDateRange, formatTeachingDate, type TeachingDateStyle } from "./formatDate";
export {
	formatScriptureReference,
	getBibleGatewayUrl,
	summarizeScriptureReferences,
} from "./formatScriptureReference";
export { formatVerseRanges } from "./formatVerseRanges";
export { getCoverPhotoUrl } from "./getCoverPhotoUrl";
export { getFeaturedTeaching } from "./getFeaturedTeaching";
export { getRecentTeachings } from "./getRecentTeachings";
export { getRelatedTeachings } from "./getRelatedTeachings";
export { getAllSeriesSlugs, getSeriesBySlug } from "./getSeriesBySlug";
export { getSeriesHref, getSeriesSlug } from "./getSeriesSlug";
export { getSeriesTeachings } from "./getSeriesTeachings";
export { getTeachingById } from "./getTeachingById";
export { groupTeachingsBySeries, type TeachingGroup } from "./groupTeachingsBySeries";
export { searchTeachingsByScripture } from "./searchByScripture";
export type { ScriptureReference, Teaching } from "./teachings";
export {
	clearVideoProgress,
	getVideoProgress,
	saveVideoProgress,
	type VideoProgress,
} from "./videoProgressStorage";
export { getYouTubeEmbedUrl, isYouTubeUrl } from "./videoUtils";
