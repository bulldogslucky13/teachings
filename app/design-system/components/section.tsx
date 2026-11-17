import type { ReactNode } from "react";
import { Heading } from "@/app/components/ui/heading/heading";
import { Label } from "@/app/components/ui/label/label";
import { cn } from "@/app/components/ui/utils/cn";

export function Section({
	id,
	title,
	intro,
	children,
}: {
	id: string;
	title: string;
	intro?: string;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			aria-labelledby={`${id}-heading`}
			className="scroll-mt-6 border-t border-border py-14"
		>
			<div className="mb-10 max-w-2xl">
				<Heading level="h2" id={`${id}-heading`}>
					{title}
				</Heading>
				{intro && <p className="mt-4 text-text-secondary">{intro}</p>}
			</div>
			<div className="flex flex-col gap-14">{children}</div>
		</section>
	);
}

/** One documented item: heading, usage note, then the live example. */
export function Spec({
	name,
	usage,
	children,
	className,
}: {
	name: string;
	usage: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div>
			<Heading level="h3">{name}</Heading>
			<p className="mt-2 mb-6 max-w-3xl font-mono text-[0.8125rem] leading-relaxed text-text-secondary">
				{usage}
			</p>
			<div className={className}>{children}</div>
		</div>
	);
}

/** A captioned example within a Spec. */
export function Example({
	caption,
	children,
	className,
}: {
	caption: string;
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<Label>{caption}</Label>
			<div>{children}</div>
		</div>
	);
}
