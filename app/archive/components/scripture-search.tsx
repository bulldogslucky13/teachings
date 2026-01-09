"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ScriptureSearch() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

	const handleSearch = (value: string) => {
		setSearchQuery(value);

		// Update URL with debounced search
		const timeoutId = setTimeout(() => {
			const params = new URLSearchParams(searchParams);
			if (value) {
				params.set("q", value);
			} else {
				params.delete("q");
			}
			router.push(`/archive?${params.toString()}`);
		}, 300);

		return () => clearTimeout(timeoutId);
	};

	return (
		<input
			type="text"
			placeholder='Search by scripture (e.g., "Romans 8" or "Matthew")'
			value={searchQuery}
			onChange={(e) => handleSearch(e.target.value)}
			className="w-full max-w-2xl px-4 py-3 rounded-lg bg-surface border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
		/>
	);
}
