/**
 * Utility function to get the full URL for a cover photo.
 * Currently returns the path from the public directory,
 * but designed to easily switch to S3 or other storage later.
 *
 * @param filename - The filename of the cover photo
 * @returns The full path/URL to the cover photo
 */
export function getCoverPhotoUrl(filename: string): string {
	return `/images/${filename}`;
}
