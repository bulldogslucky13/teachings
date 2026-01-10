/**
 * Detects whether a video URL is a YouTube video
 * @param videoUrl - The video URL to check
 * @returns true if the URL is a YouTube URL, false otherwise
 */
export function isYouTubeUrl(videoUrl: string): boolean {
	try {
		const url = new URL(videoUrl);
		return url.hostname.includes("youtube.com") || url.hostname.includes("youtu.be");
	} catch {
		return false;
	}
}

/**
 * Converts various YouTube URL formats to a standardized embed URL
 * Supports:
 * - Watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
 * - Short URLs: https://youtu.be/VIDEO_ID
 * - Embed URLs: https://www.youtube.com/embed/VIDEO_ID
 * @param videoUrl - The YouTube URL to convert
 * @returns The standardized YouTube embed URL, or null if invalid
 */
export function getYouTubeEmbedUrl(videoUrl: string): string | null {
	try {
		const url = new URL(videoUrl);

		// Handle youtu.be short URLs
		if (url.hostname.includes("youtu.be")) {
			const videoId = url.pathname.slice(1); // Remove leading slash
			return `https://www.youtube.com/embed/${videoId}`;
		}

		// Handle youtube.com URLs
		if (url.hostname.includes("youtube.com")) {
			// If already an embed URL, return as-is
			if (url.pathname.startsWith("/embed/")) {
				return videoUrl;
			}

			// Handle watch URLs
			if (url.pathname === "/watch") {
				const videoId = url.searchParams.get("v");
				if (videoId) {
					return `https://www.youtube.com/embed/${videoId}`;
				}
			}
		}

		return null;
	} catch {
		return null;
	}
}
