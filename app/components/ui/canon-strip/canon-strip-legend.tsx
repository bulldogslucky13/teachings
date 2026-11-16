import { labelTypography } from "../label/label";
import { cn } from "../utils/cn";

interface CanonStripLegendProps {
	/** Show the dotted "Cross-referenced" item (only when some book is cross-referenced only). */
	showCrossReferenced: boolean;
}

/** Miniature ticks explaining the strip. Decorative: every real tick has its own accessible name. */
export function CanonStripLegend({ showCrossReferenced }: CanonStripLegendProps) {
	const item = "inline-flex items-center gap-2";
	return (
		<p
			aria-hidden="true"
			className={cn(labelTypography, "mt-5 flex flex-wrap gap-x-6 gap-y-2 text-text-secondary")}
		>
			<span className={item}>
				<span className="block h-3.5 w-0.5 bg-accent" />
				Taught from
			</span>
			{showCrossReferenced && (
				<span className={item}>
					<span className="block h-3.5 w-0.5 border-l-2 border-dotted border-accent" />
					Cross-referenced
				</span>
			)}
			<span className={item}>
				<span className="block h-2.5 w-px bg-text-secondary/45" />
				Not yet
			</span>
		</p>
	);
}
