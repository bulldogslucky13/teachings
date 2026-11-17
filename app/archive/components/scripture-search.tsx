"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Checkbox } from "@/app/components/ui/checkbox/checkbox";
import { SearchField } from "@/app/components/ui/search-field";

const DEBOUNCE_MS = 300;

/**
 * Scripture search for the archive. The URL (`?q=`, `?crossRef=true`) is the source of truth so
 * results are server-rendered and shareable; this component only edits it. Typing is debounced
 * and uses `router.replace` so it doesn't fill the history; the field also follows external URL
 * changes (e.g. a canon tick link).
 */
export function ScriptureSearch() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const urlQuery = searchParams.get("q") ?? "";
	const includeCrossRefs = searchParams.get("crossRef") === "true";

	const [value, setValue] = useState(urlQuery);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	// The last query we put in (or saw in) the URL, to tell our own updates from external ones.
	const lastSent = useRef(urlQuery);

	const cancelPending = useCallback(() => {
		clearTimeout(timer.current);
		timer.current = undefined;
	}, []);

	const updateUrl = useCallback(
		(query: string, crossRef: boolean) => {
			const params = new URLSearchParams();
			const trimmed = query.trim();
			if (trimmed) params.set("q", trimmed);
			if (crossRef) params.set("crossRef", "true");
			lastSent.current = trimmed;
			const search = params.toString();
			router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
		},
		[router, pathname],
	);

	// Follow external URL changes (canon tick, back/forward, "Clear" link).
	useEffect(() => {
		if (urlQuery !== lastSent.current) {
			cancelPending();
			lastSent.current = urlQuery;
			setValue(urlQuery);
		}
	}, [urlQuery, cancelPending]);

	// Never leave a timer running after unmount.
	useEffect(() => cancelPending, [cancelPending]);

	const handleChange = (next: string) => {
		setValue(next);
		cancelPending();
		if (next.trim() === "") {
			// Clearing applies straight away.
			updateUrl("", includeCrossRefs);
			return;
		}
		timer.current = setTimeout(() => {
			timer.current = undefined;
			updateUrl(next, includeCrossRefs);
		}, DEBOUNCE_MS);
	};

	const handleCrossRefChange = (isSelected: boolean) => {
		cancelPending();
		updateUrl(value, isSelected);
	};

	return (
		<div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-12">
			<SearchField
				label="Search by Scripture"
				placeholder="Romans 8, Psalm 32, John 3:16"
				size="lg"
				value={value}
				onChange={handleChange}
				onSubmit={(submitted) => {
					cancelPending();
					updateUrl(submitted, includeCrossRefs);
				}}
				className="min-w-0 flex-1 md:max-w-2xl"
			/>
			<Checkbox
				label="Include cross-references"
				isSelected={includeCrossRefs}
				onChange={handleCrossRefChange}
				className="md:pb-3.5"
			/>
		</div>
	);
}
