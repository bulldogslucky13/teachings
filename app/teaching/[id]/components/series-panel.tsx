import { CopyLinkButton } from "@/app/components/copy-link-button/copy-link-button";
import { Label } from "@/app/components/ui/label/label";
import { Link } from "@/app/components/ui/link/link";
import { formatTeachingDate, getSeriesHref, type Teaching } from "@/lib/teachings";

interface SeriesPanelProps {
	series: string;
	teachings: Teaching[];
	currentId: string;
}

/** Numbered list of every teaching in the series, with the current one marked. */
export function SeriesPanel({ series, teachings, currentId }: SeriesPanelProps) {
	return (
		<section aria-labelledby="series-heading">
			<Label as="h2" id="series-heading">
				In this series
			</Label>
			<div className="mt-1 mb-4 flex items-start justify-between gap-3">
				<p className="font-serif text-[22px] italic leading-[1.2]">
					<Link
						variant="plain"
						href={getSeriesHref(series)}
						className="text-text-primary transition-colors data-[hovered]:text-accent-text"
					>
						{series}
					</Link>
				</p>
				<CopyLinkButton
					variant="icon"
					path={getSeriesHref(series)}
					label="Copy series link"
					className="-mt-0.5 -mr-2 flex-none"
				/>
			</div>
			<ol className="border-t border-border">
				{teachings.map((item, index) => {
					const isCurrent = item.id === currentId;
					const rowClass =
						"grid grid-cols-[22px_minmax(0,1fr)_auto] items-baseline gap-2 py-3 text-[15px] leading-[1.35]";
					const content = (
						<>
							<span className="relative text-[13px] tabular-nums">
								{isCurrent && (
									<>
										<span
											aria-hidden="true"
											className="absolute top-[0.45em] -left-4 h-[7px] w-[7px] rounded-full bg-accent"
										/>
										<span className="sr-only">Now viewing, </span>
									</>
								)}
								{index + 1}
							</span>
							<span>{item.title}</span>
							<span className="whitespace-nowrap text-[13px] tabular-nums">
								{formatTeachingDate(item.date, "monthDay")}
							</span>
						</>
					);

					return (
						<li key={item.id} className="border-b border-border">
							{isCurrent ? (
								<div aria-current="page" className={`${rowClass} text-text-primary`}>
									{content}
								</div>
							) : (
								<Link
									variant="plain"
									href={`/teaching/${item.id}`}
									className={`${rowClass} text-text-secondary transition-colors data-[hovered]:text-text-primary`}
								>
									{content}
								</Link>
							)}
						</li>
					);
				})}
			</ol>
		</section>
	);
}
