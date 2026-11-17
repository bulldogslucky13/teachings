"use client";

import type { ReactNode } from "react";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";
import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";

interface CanonBookGroupProps {
	title: string;
	/** Number of books in the group, shown beside the title. */
	count: number;
	defaultExpanded?: boolean;
	children: ReactNode;
}

/**
 * A collapsible group in the compact book list. Used for the cross-referenced books,
 * which outnumber the taught ones and would otherwise push the page a long way down.
 */
export function CanonBookGroup({ title, count, defaultExpanded, children }: CanonBookGroupProps) {
	return (
		<Disclosure defaultExpanded={defaultExpanded} className="group/disclosure">
			<Button
				slot="trigger"
				className={cn(
					labelTypography,
					"flex min-h-11 w-full items-center justify-between gap-4 border-y border-border text-left text-text-secondary",
					"data-[hovered]:text-text-primary data-[pressed]:text-text-primary",
				)}
			>
				<span>
					{title} <span className="text-text-tertiary">· {count}</span>
				</span>
				<span aria-hidden="true" className="text-accent-text">
					<span className="group-data-[expanded]/disclosure:hidden">Show</span>
					<span className="hidden group-data-[expanded]/disclosure:inline">Hide</span>
				</span>
			</Button>
			<DisclosurePanel>{children}</DisclosurePanel>
		</Disclosure>
	);
}
