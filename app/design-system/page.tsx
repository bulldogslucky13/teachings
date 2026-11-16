import type { Metadata } from "next";
import NextLink from "next/link";
import { SeriesPlaque } from "@/app/components/series-plaque/series-plaque";
import { TeachingList, TeachingRow } from "@/app/components/teaching-row/teaching-row";
import { Badge } from "@/app/components/ui/badge/badge";
import { CanonStrip } from "@/app/components/ui/canon-strip/canon-strip";
import { Card, CardBody, CardFooter, CardHeader } from "@/app/components/ui/card/card";
import { CoverMat } from "@/app/components/ui/cover-mat/cover-mat";
import { Heading } from "@/app/components/ui/heading/heading";
import { Label } from "@/app/components/ui/label/label";
import { Link } from "@/app/components/ui/link/link";
import { PlayMark } from "@/app/components/ui/play-button/play-button";
import { SiteMark } from "@/app/components/ui/site-mark";
import { Text } from "@/app/components/ui/text/text";
import { ThemeToggle } from "@/app/components/ui/theme-toggle/theme-toggle";
import { getCanonCoverage, groupTeachingsBySeries } from "@/lib/teachings";
import type { CanonBook } from "@/lib/teachings/canon";
import { getAllTeachings } from "@/lib/teachings/teachings";
import {
	ButtonDemos,
	CheckboxDemos,
	FormDemos,
	PlayButtonDemo,
	SearchDemos,
	SelectDemos,
	TableDemo,
} from "./components/demos";
import { Example, Section, Spec } from "./components/section";

export const metadata: Metadata = {
	title: "Design system",
	description: "Tokens, type and components used across the teachings archive.",
};

const sections = [
	["foundations", "Foundations"],
	["type", "Typography"],
	["actions", "Actions"],
	["forms", "Forms"],
	["display", "Display"],
	["covers", "Covers"],
	["teachings", "Teachings"],
	["canon", "Canon strip"],
] as const;

const surfaceTokens = [
	{ token: "bg-background", note: "Wall (page)", swatch: "bg-background" },
	{ token: "bg-surface", note: "Mat (panels, covers)", swatch: "bg-surface" },
	{ token: "bg-surface-hover", note: "Mat, lifted", swatch: "bg-surface-hover" },
	{ token: "border-border", note: "Keyline (hairlines)", swatch: "bg-border" },
];
const inkTokens = [
	{ token: "text-text-primary", note: "Ink", swatch: "text-text-primary" },
	{ token: "text-text-secondary", note: "Muted ink, AA", swatch: "text-text-secondary" },
	{
		token: "text-text-tertiary",
		note: "Placeholders, large text only",
		swatch: "text-text-tertiary",
	},
	{ token: "text-accent-text", note: "Brass text", swatch: "text-accent-text" },
	{ token: "text-error-500", note: "Error text", swatch: "text-error-500" },
	{ token: "text-success-600", note: "Success text", swatch: "text-success-600" },
	{ token: "text-warning-500", note: "Warning text", swatch: "text-warning-500" },
];
const fillTokens = [
	{ token: "bg-accent", note: "Brass: rules, ticks, fills", swatch: "bg-accent" },
	{ token: "bg-accent-hover", note: "Brass on hover", swatch: "bg-accent-hover" },
	{ token: "text-accent-contrast", note: "Ink on a brass fill", swatch: "bg-accent-contrast" },
	{ token: "bg-error-500", note: "Error", swatch: "bg-error-500" },
	{ token: "bg-success-600", note: "Success", swatch: "bg-success-600" },
	{ token: "bg-warning-500", note: "Warning", swatch: "bg-warning-500" },
];

function SwatchGrid({ children }: { children: React.ReactNode }) {
	return (
		<ul className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">{children}</ul>
	);
}

function Swatch({ token, note, swatch }: { token: string; note: string; swatch: string }) {
	return (
		<li className="flex flex-col gap-2">
			<div className={`h-16 border border-border ${swatch}`} />
			<code className="font-mono text-[0.8125rem] text-text-primary">{token}</code>
			<span className="text-[0.8125rem] text-text-secondary">{note}</span>
		</li>
	);
}

function InkSwatch({ token, note, swatch }: { token: string; note: string; swatch: string }) {
	return (
		<li className="flex flex-col gap-2">
			<div className="border border-border bg-surface px-4 py-3 font-serif text-3xl">
				<span className={swatch}>Aa Gloria</span>
			</div>
			<code className="font-mono text-[0.8125rem] text-text-primary">{token}</code>
			<span className="text-[0.8125rem] text-text-secondary">{note}</span>
		</li>
	);
}

const covers = [
	{ file: "12-2025_the-promised-one-cover.png", ratio: "3:2", name: "The Promised One" },
	{ file: "4-2026-the-security-of-the-love-of-god.png", ratio: "16:9", name: "Love of God" },
	{ file: "truth-that-leads-to-godliness.png", ratio: "16:9", name: "Godliness" },
	{ file: "genesis-3-4-7-2026.png", ratio: "16:9", name: "Genesis" },
];

const hrefForBook = (book: CanonBook, { crossReference }: { crossReference: boolean }) =>
	`/archive?q=${encodeURIComponent(book.name)}${crossReference ? "&crossRef=true" : ""}`;

export default async function DesignSystemPage() {
	const teachings = await getAllTeachings();
	const groups = groupTeachingsBySeries(teachings);
	const seriesGroup = groups.find((g) => g.series && g.teachings.length > 1);
	const singleGroup = groups.find((g) => !g.series);
	const rowTeachings = teachings.slice(0, 3);
	const coverage = getCanonCoverage(teachings);

	return (
		<div className="page-wrap pt-12 pb-24">
			<header className="mb-12 max-w-3xl">
				<Label tone="accent">Reference</Label>
				<Heading level="h1" className="mt-4">
					Design system
				</Heading>
				<p className="mt-6 text-lg text-text-secondary">
					The Gallery: a quiet room at night. Cormorant for display, Hanken Grotesk for interface,
					brass as the one accent, covers hung in uniform mats. Everything below is live and follows
					the current theme.
				</p>
				<div className="mt-6 flex items-center gap-4">
					<Label>Theme</Label>
					<ThemeToggle />
				</div>
				<nav aria-label="Sections" className="mt-10">
					<ul className="flex flex-wrap gap-x-7 gap-y-3">
						{sections.map(([id, name]) => (
							<li key={id}>
								<Link href={`#${id}`} variant="text">
									{name}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</header>

			<Section
				id="foundations"
				title="Foundations"
				intro="Tokens live in app/globals.css and flip with the .dark class. Use the Tailwind class shown; never a raw hex."
			>
				<Spec
					name="Surfaces and keylines"
					usage="bg-background · bg-surface · bg-surface-hover · border-border"
				>
					<SwatchGrid>
						{surfaceTokens.map((t) => (
							<Swatch key={t.token} {...t} />
						))}
					</SwatchGrid>
				</Spec>
				<Spec
					name="Ink and text colours"
					usage="Brass text must use text-accent-text, not text-accent (the lighter brass fails AA as small text in light mode)."
				>
					<SwatchGrid>
						{inkTokens.map((t) => (
							<InkSwatch key={t.token} {...t} />
						))}
					</SwatchGrid>
				</Spec>
				<Spec
					name="Fills"
					usage="bg-accent for rules, ticks, rings and fills; pair text on it with text-accent-contrast."
				>
					<SwatchGrid>
						{fillTokens.map((t) => (
							<Swatch key={t.token} {...t} />
						))}
					</SwatchGrid>
				</Spec>
				<Spec name="Spacing, radius, elevation" usage="page-wrap · rounded-* · shadow-mat">
					<ul className="grid gap-6 text-[0.9375rem] text-text-secondary md:grid-cols-3">
						<li>
							<Label tone="primary" as="p">
								Page width
							</Label>
							<p className="mt-2">
								<code className="font-mono text-text-primary">page-wrap</code>: 1280px max, 24px
								gutters, 56px from 900px. Layouts render inside it; pages never add their own main,
								header or footer.
							</p>
						</li>
						<li>
							<Label tone="primary" as="p">
								Radius
							</Label>
							<p className="mt-2">
								Square-edged: every radius token resolves to 1 or 2px. Only the play mark is round.
							</p>
						</li>
						<li>
							<Label tone="primary" as="p">
								Elevation
							</Label>
							<p className="mt-2">
								<code className="font-mono text-text-primary">shadow-mat</code> is a faint rest
								shadow in light mode and none in dark. No other shadows, gradients or pills.
							</p>
						</li>
					</ul>
				</Spec>
				<Spec
					name="Focus ring"
					usage="Global: 2px solid accent, 3px offset on :focus-visible and [data-focus-visible]. Tab to the controls below."
				>
					<div className="flex flex-wrap items-center gap-6">
						<NextLink
							href="#foundations"
							className="text-text-primary underline decoration-border underline-offset-4"
						>
							A native link
						</NextLink>
						<Link href="#foundations">A design-system link</Link>
						<Label>Press Tab to see the ring</Label>
					</div>
				</Spec>
			</Section>

			<Section
				id="type"
				title="Typography"
				intro="Display is Cormorant Garamond at light weights; interface and body text is Hanken Grotesk."
			>
				<Spec
					name="Heading"
					usage={
						'import { Heading } from "@/app/components/ui/heading/heading" · level h1–h6, weight, id'
					}
				>
					<div className="flex flex-col gap-6">
						<p className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.02] tracking-[-0.01em]">
							Heading one
						</p>
						<Heading level="h2">Heading two, section</Heading>
						<Heading level="h3">Heading three, plaque</Heading>
						<Heading level="h4">Heading four</Heading>
						<Heading level="h5">Heading five, sans</Heading>
						<Heading level="h6">Heading six, label</Heading>
					</div>
				</Spec>
				<Spec
					name="Text"
					usage={
						'import { Text } from "@/app/components/ui/text/text" · variant body | label | caption | overline | series, size xs–xl, as p | span | div'
					}
				>
					<div className="flex flex-col gap-4">
						<Text variant="body">
							Body: Hanken Grotesk at base size for running text and descriptions.
						</Text>
						<Text variant="label">Label: emphasised interface text</Text>
						<Text variant="caption">Caption: smaller, secondary ink</Text>
						<Text variant="overline">Overline: the Gallery label</Text>
						<Text variant="series">Series: Cormorant italic for series names</Text>
						<div className="flex flex-wrap items-baseline gap-x-6">
							{(["xs", "sm", "base", "lg", "xl"] as const).map((s) => (
								<Text key={s} size={s} as="span">
									Size {s}
								</Text>
							))}
						</div>
					</div>
				</Spec>
				<Spec
					name="Label"
					usage={
						'import { Label, labelTypography } from "@/app/components/ui/label/label" · tone secondary | primary | accent, as'
					}
				>
					<div className="flex flex-wrap items-center gap-8">
						<Label>Secondary</Label>
						<Label tone="primary">Primary</Label>
						<Label tone="accent">Accent</Label>
						<Label as="time">12 April 2026</Label>
					</div>
					<p className="mt-4 text-[0.8125rem] text-text-secondary">
						11px, uppercase, 0.14em tracking, medium weight. Use{" "}
						<code className="font-mono">labelTypography</code> when a component needs the same type
						without the element.
					</p>
				</Spec>
				<Spec
					name="SiteMark"
					usage={'import { SiteMark } from "@/app/components/ui/site-mark" · size sm | md'}
				>
					<div className="flex flex-wrap items-center gap-8">
						<SiteMark />
						<SiteMark size="md" />
						<span className="flex items-center gap-3">
							<SiteMark size="md" />
							<span className="font-serif text-[26px] font-medium italic leading-none">
								Teachings
							</span>
						</span>
					</div>
					<p className="mt-4 text-[0.8125rem] text-text-secondary">
						The site mark: a brass keyline plaque holding an italic serif T. Decorative, so the link
						or heading around it carries the name. The favicon, Apple icon and share image
						(app/icon.tsx, app/apple-icon.tsx, app/opengraph-image.tsx) draw the same mark and
						palette.
					</p>
				</Spec>
				<Spec
					name="Link"
					usage={
						'import { Link } from "@/app/components/ui/link/link" · variant default | text | button | plain; external hrefs open in a new tab'
					}
				>
					<div className="flex flex-wrap items-center gap-8">
						<Link href="#type">Default inline link</Link>
						<Link href="#type" variant="text">
							Text link
						</Link>
						<Link href="#type" variant="button">
							Button link
						</Link>
						<Link href="#type" variant="plain" className="font-serif text-2xl italic">
							Plain, unstyled
						</Link>
						<Link href="https://example.com">External link</Link>
					</div>
				</Spec>
			</Section>

			<Section
				id="actions"
				title="Actions"
				intro="Buttons are label-typed rectangles. Brass fill is for the single primary action on a page."
			>
				<Spec
					name="Button"
					usage={
						'import { Button, buttonVariants } from "@/app/components/ui/button/button" · variant primary | secondary | ghost | danger, size sm | md | lg, leftIcon, rightIcon, isDisabled, onPress'
					}
				>
					<ButtonDemos />
				</Spec>
				<Spec
					name="PlayMark and PlayButton"
					usage={
						'import { PlayMark, PlayButton } from "@/app/components/ui/play-button/play-button" · size md | lg, tone default | media; PlayButton requires aria-label'
					}
				>
					<div className="flex flex-col gap-8">
						<Example caption="PlayMark inside a link (add group to the parent)">
							<NextLink href="#actions" className="group inline-flex items-center gap-[18px]">
								<PlayMark />
								<Label tone="primary" className="text-xs">
									Watch
								</Label>
							</NextLink>
						</Example>
						<Example caption="PlayMark, lg, default tone">
							<PlayMark size="lg" />
						</Example>
						<Example caption="PlayButton, media tone, over a poster">
							<div className="flex items-center gap-6">
								<div className="grid h-40 w-72 place-items-center border border-border bg-[#1b1917]">
									<PlayButtonDemo />
								</div>
							</div>
						</Example>
					</div>
				</Spec>
				<Spec
					name="ThemeToggle"
					usage={
						'import { ThemeToggle } from "@/app/components/ui/theme-toggle/theme-toggle" · no props; persists via next-themes'
					}
				>
					<ThemeToggle />
				</Spec>
			</Section>

			<Section
				id="forms"
				title="Forms"
				intro="Fields share one pattern: label above, keyline border that turns brass on focus, description and error beneath."
			>
				<Spec
					name="TextField and TextArea"
					usage={
						'import { TextField } from ".../text-field/text-field", { TextArea } from ".../text-area/text-area" · label, description, errorMessage, size sm | md | lg, isDisabled, isReadOnly; TextArea also resize'
					}
				>
					<FormDemos />
				</Spec>
				<Spec
					name="SearchField"
					usage={
						'import { SearchField } from "@/app/components/ui/search-field/search-field" · label (or aria-label), size md | lg, placeholder, errorMessage, onSubmit'
					}
				>
					<SearchDemos />
				</Spec>
				<Spec
					name="Select"
					usage={
						'import { Select, SelectItem } from "@/app/components/ui/select/select" · label, placeholder, description, errorMessage, selectedKey, onSelectionChange'
					}
				>
					<SelectDemos />
				</Spec>
				<Spec
					name="Checkbox"
					usage={
						'import { Checkbox } from "@/app/components/ui/checkbox/checkbox" · label, description, isSelected, isIndeterminate, isDisabled'
					}
				>
					<CheckboxDemos />
				</Spec>
			</Section>

			<Section id="display" title="Display" intro="Small pieces for marking and grouping content.">
				<Spec
					name="Badge"
					usage={
						'import { Badge } from "@/app/components/ui/badge/badge" · variant default | primary | subtle, size sm | md, icon'
					}
				>
					<div className="flex flex-wrap items-center gap-6">
						<Badge>Default</Badge>
						<Badge variant="primary">Primary</Badge>
						<Badge variant="subtle">Subtle</Badge>
						<Badge variant="subtle" size="sm">
							Subtle small
						</Badge>
						<Badge variant="primary" icon={<span aria-hidden="true">+</span>}>
							With icon
						</Badge>
					</div>
				</Spec>
				<Spec
					name="Card"
					usage={
						'import { Card, CardHeader, CardBody, CardFooter } from "@/app/components/ui/card/card" · variant default | elevated | bordered'
					}
				>
					<div className="grid gap-8 md:grid-cols-3">
						{(["default", "elevated", "bordered"] as const).map((variant) => (
							<Card key={variant} variant={variant}>
								<CardHeader>
									<Label tone="primary">{variant}</Label>
								</CardHeader>
								<CardBody>
									<Text variant="caption">
										Header, body and footer are optional slots with keyline dividers.
									</Text>
								</CardBody>
								<CardFooter>
									<Link href="#display" variant="text">
										Footer link
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</Spec>
				<Spec
					name="Table"
					usage={
						'import { Table, type ColumnDef } from "@/app/components/ui/table/table" · columns [{ header, accessorKey, render? }], data, onRowClick, emptyState (client component: columns/render stay on the client)'
					}
				>
					<TableDemo />
				</Spec>
			</Section>

			<Section
				id="covers"
				title="Covers"
				intro="Every cover hangs in the same mat whatever its own proportions, so mixed art sits together."
			>
				<Spec
					name="CoverMat"
					usage={
						'import { CoverMat } from "@/app/components/ui/cover-mat/cover-mat" · coverPhoto (filename), alt, size lg | md | sm, aspectRatio (mat, default "4 / 3"), interactive (needs a parent with class group), priority'
					}
				>
					<div className="flex flex-col gap-10">
						<Example caption="lg · the feature block">
							<NextLink href="#covers" className="group block max-w-2xl">
								<CoverMat coverPhoto="12-2025_the-promised-one-cover.png" size="lg" interactive />
							</NextLink>
						</Example>
						<Example caption="md · series wall; art ratios 3:2, 16:9, 16:9 in identical mats (hover or focus to see the interactive state)">
							<ul className="grid gap-6 sm:grid-cols-3">
								{covers.slice(0, 3).map((c) => (
									<li key={c.file}>
										<NextLink
											href="#covers"
											aria-label={`${c.name} (${c.ratio} art)`}
											className="group block"
										>
											<CoverMat coverPhoto={c.file} size="md" interactive />
										</NextLink>
									</li>
								))}
							</ul>
						</Example>
						<Example caption="sm · related teachings; and a non-interactive md for comparison">
							<ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
								{covers.map((c) => (
									<li key={c.file}>
										<CoverMat coverPhoto={c.file} size="sm" />
									</li>
								))}
							</ul>
						</Example>
					</div>
				</Spec>
			</Section>

			<Section
				id="teachings"
				title="Teachings"
				intro="Shared compositions built from the pieces above, shown with real archive data."
			>
				<Spec
					name="TeachingRow and TeachingList"
					usage={
						'import { TeachingList, TeachingRow } from "@/app/components/teaching-row/teaching-row" · teaching, href, showSeries, isCurrent'
					}
				>
					<div className="flex flex-col gap-10">
						<Example caption="Default">
							<TeachingList aria-label="Recent teachings">
								{rowTeachings.map((t) => (
									<TeachingRow key={t.id} teaching={t} />
								))}
							</TeachingList>
						</Example>
						<Example caption="Without series column, first row marked as the current page">
							<TeachingList aria-label="Recent teachings, compact">
								{rowTeachings.map((t, i) => (
									<TeachingRow key={t.id} teaching={t} showSeries={false} isCurrent={i === 0} />
								))}
							</TeachingList>
						</Example>
					</div>
				</Spec>
				<Spec
					name="SeriesPlaque"
					usage={
						'import { SeriesPlaque } from "@/app/components/series-plaque/series-plaque" · group (from groupTeachingsBySeries), headingLevel h2 | h3 | h4, matSize, hrefForTeaching, seriesHref, currentTeachingId'
					}
				>
					<div className="grid gap-10 md:grid-cols-2">
						{seriesGroup && (
							<Example caption="Series group">
								<SeriesPlaque group={seriesGroup} headingLevel="h4" />
							</Example>
						)}
						{singleGroup && (
							<Example caption="Single teaching">
								<SeriesPlaque group={singleGroup} headingLevel="h4" />
							</Example>
						)}
					</div>
				</Spec>
				<Spec
					name="SiteHeader and SiteFooter"
					usage={
						"Mounted once in app/layout.tsx; do not render them on a page. This page sits between them."
					}
				>
					<p className="text-text-secondary">
						The header carries the wordmark, primary navigation and ThemeToggle.
					</p>
				</Spec>
			</Section>

			<Section
				id="canon"
				title="Canon strip"
				intro="One tick per book, canonical order. Solid brass ticks are books taught from (taller with more teachings), dotted brass ticks are only cross-referenced, short keylines have nothing yet. Both brass states link to the archive."
			>
				<Spec
					name="CanonStrip"
					usage={
						'import { CanonStrip } from "@/app/components/ui/canon-strip/canon-strip" · coverage (getCanonCoverage: count = teachings featuring the book, crossReferenceCount = teachings that only cross-reference it), hrefForBook (book, { crossReference: boolean }) => string, where crossReference is true for cross-referenced-only books so the link can add &crossRef=true (function: render from a Server Component), activeBook, defaultReadout, aria-label'
					}
				>
					<div className="flex flex-col gap-10">
						<Example caption="Live coverage: solid (taught from), dotted (cross-referenced only, e.g. Exodus, Luke, John) and keyline ticks, with legend">
							<CanonStrip coverage={coverage} hrefForBook={hrefForBook} />
						</Example>
						<Example caption="With an active cross-referenced book">
							<CanonStrip
								coverage={coverage}
								hrefForBook={hrefForBook}
								activeBook="Jeremiah"
								aria-label="Browse by book, Jeremiah selected"
							/>
						</Example>
						<Example caption="With an active taught book">
							<CanonStrip
								coverage={coverage}
								hrefForBook={hrefForBook}
								activeBook="Psalm"
								aria-label="Browse by book, Psalm selected"
							/>
						</Example>
					</div>
					<p className="mt-6 max-w-3xl text-[15px] text-text-secondary">
						Compact (viewport under 640px or a coarse pointer): the ticks become a decorative,
						unfocusable picture and a list of text links, grouped Taught from and Cross-referenced
						with 44px tap targets, takes over. The cross-referenced group is collapsed until asked
						for (or until one of its books is selected). Switched in CSS only.
					</p>
				</Spec>
			</Section>
		</div>
	);
}
