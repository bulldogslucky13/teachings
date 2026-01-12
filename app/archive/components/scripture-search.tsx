"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/app/components/ui/checkbox/checkbox";

export function ScriptureSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

	// Get initial crossRef state from URL
	const includeCrossRefs = searchParams.get("crossRef") === "true";

	const updateUrl = (query: string, crossRef: boolean) => {
		const params = new URLSearchParams();
		if (query) {
			params.set("q", query);
		}
		if (crossRef) {
			params.set("crossRef", "true");
		}
		router.push(`/archive?${params.toString()}`);
	};

	const handleSearch = (value: string) => {
		setSearchQuery(value);

		// Update URL with debounced search
		const timeoutId = setTimeout(() => {
			updateUrl(value, includeCrossRefs);
		}, 300);

		return () => clearTimeout(timeoutId);
	};

	const handleCrossRefChange = (isSelected: boolean) => {
		updateUrl(searchQuery, isSelected);
	};

	return (
		<div className="space-y-3">
			<input
				type="text"
				placeholder='Search by scripture (e.g., "Romans 8", "Romans 8:28")'
				value={searchQuery}
				onChange={(e) => handleSearch(e.target.value)}
				className="w-full max-w-2xl px-4 py-3 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-500"
			/>
			<Checkbox
				label="Include cross-references"
				isSelected={includeCrossRefs}
				onChange={handleCrossRefChange}
			/>
		</div>
	);
}
