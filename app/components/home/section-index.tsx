import { labelTypography } from "@/app/components/ui/label/label";
import { Link } from "@/app/components/ui/link/link";
import { cn } from "@/app/components/ui/utils/cn";

export interface SectionIndexProps {
	seriesCount: number;
}

/**
 * Phone-only contents row at the top of the home page. On a phone the feature fills the
 * first screen, so this names what lies below it; on wider screens the canon strip
 * shows at the bottom of the first screen instead and the row is hidden.
 */
export function SectionIndex({ seriesCount }: SectionIndexProps) {
	const items = [
		{ href: "#canon", label: "By book" },
		{ href: "#series", label: `Series · ${seriesCount}` },
		{ href: "#recent", label: "Recently added" },
	];

	return (
		<nav aria-label="On this page" className="border-y border-border min-[900px]:hidden">
			<ul className="page-wrap flex items-center justify-between gap-4">
				{items.map((item) => (
					<li key={item.href}>
						<Link
							href={item.href}
							variant="plain"
							className={cn(
								labelTypography,
								"inline-flex min-h-11 items-center whitespace-nowrap text-text-secondary data-[hovered]:text-text-primary",
							)}
						>
							{item.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
