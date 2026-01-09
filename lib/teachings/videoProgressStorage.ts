/**
 * Video progress tracking utilities using local storage
 */

const STORAGE_KEY_PREFIX = "teaching_video_progress_";

export interface VideoProgress {
	teachingId: string;
	currentTime: number;
	lastUpdated: Date;
}

/**
 * Save video progress to local storage
 * @param teachingId - Unique identifier for the teaching
 * @param currentTime - Current playback time in seconds
 */
export function saveVideoProgress(teachingId: string, currentTime: number): void {
	if (!isLocalStorageAvailable()) {
		console.warn("Local storage not available, cannot save video progress");
		return;
	}

	try {
		const progress: VideoProgress = {
			teachingId,
			currentTime,
			lastUpdated: new Date(),
		};

		localStorage.setItem(`${STORAGE_KEY_PREFIX}${teachingId}`, JSON.stringify(progress));
	} catch (error) {
		console.error("Failed to save video progress:", error);
	}
}

/**
 * Retrieve saved video progress for a teaching
 * @param teachingId - Unique identifier for the teaching
 * @returns VideoProgress object or null if not found
 */
export function getVideoProgress(teachingId: string): VideoProgress | null {
	if (!isLocalStorageAvailable()) {
		return null;
	}

	try {
		const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${teachingId}`);
		if (!stored) {
			return null;
		}

		const progress = JSON.parse(stored) as VideoProgress;

		// Validate the stored data
		if (
			typeof progress.teachingId !== "string" ||
			typeof progress.currentTime !== "number" ||
			!progress.lastUpdated
		) {
			console.warn("Corrupt video progress data, removing from storage");
			clearVideoProgress(teachingId);
			return null;
		}

		// Convert lastUpdated back to Date object
		progress.lastUpdated = new Date(progress.lastUpdated);

		return progress;
	} catch (error) {
		console.error("Failed to retrieve video progress:", error);
		// Clear corrupt data
		clearVideoProgress(teachingId);
		return null;
	}
}

/**
 * Clear saved progress for a specific teaching
 * @param teachingId - Unique identifier for the teaching
 */
export function clearVideoProgress(teachingId: string): void {
	if (!isLocalStorageAvailable()) {
		return;
	}

	try {
		localStorage.removeItem(`${STORAGE_KEY_PREFIX}${teachingId}`);
	} catch (error) {
		console.error("Failed to clear video progress:", error);
	}
}

/**
 * Check if local storage is available
 * @returns true if local storage is available and working
 */
function isLocalStorageAvailable(): boolean {
	try {
		const testKey = "__ls_test__";
		localStorage.setItem(testKey, "test");
		localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}
