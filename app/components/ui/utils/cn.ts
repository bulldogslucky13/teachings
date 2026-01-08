import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge className strings with clsx
 * Handles conditional classes and merges Tailwind utilities
 */
export function cn(...inputs: ClassValue[]) {
	return clsx(inputs);
}
