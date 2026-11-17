"use client";

import { useState } from "react";
import { MdArrowForward, MdPlayArrow } from "react-icons/md";
import { Button } from "@/app/components/ui/button/button";
import { Checkbox } from "@/app/components/ui/checkbox/checkbox";
import { Label } from "@/app/components/ui/label/label";
import { PlayButton } from "@/app/components/ui/play-button/play-button";
import { SearchField } from "@/app/components/ui/search-field/search-field";
import { Select, SelectItem } from "@/app/components/ui/select/select";
import { type ColumnDef, Table } from "@/app/components/ui/table/table";
import { TextArea } from "@/app/components/ui/text-area/text-area";
import { TextField } from "@/app/components/ui/text-field/text-field";
import { Example } from "./section";

export function ButtonDemos() {
	const variants = ["primary", "secondary", "ghost", "danger"] as const;
	const sizes = ["sm", "md", "lg"] as const;
	return (
		<div className="flex flex-col gap-8">
			{variants.map((variant) => (
				<Example key={variant} caption={variant}>
					<div className="flex flex-wrap items-center gap-4">
						{sizes.map((size) => (
							<Button key={size} variant={variant} size={size}>
								{size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
							</Button>
						))}
						<Button variant={variant} isDisabled>
							Disabled
						</Button>
						<Button variant={variant} leftIcon={<MdPlayArrow aria-hidden="true" />}>
							Watch
						</Button>
						<Button variant={variant} rightIcon={<MdArrowForward aria-hidden="true" />}>
							Continue
						</Button>
					</div>
				</Example>
			))}
		</div>
	);
}

export function FormDemos() {
	const [bio, setBio] = useState("");
	return (
		<div className="grid gap-10 md:grid-cols-2">
			<TextField label="Name" placeholder="Your name" description="Shown beside your note." />
			<TextField
				label="Email"
				type="email"
				defaultValue="not-an-email"
				errorMessage="Enter a valid email address."
			/>
			<TextField label="Small" size="sm" placeholder="size sm" />
			<TextField label="Large" size="lg" placeholder="size lg" />
			<TextField label="Disabled" isDisabled defaultValue="Not editable" />
			<TextField label="Read only" isReadOnly defaultValue="Read only value" />
			<TextArea
				label="Note"
				placeholder="Write a note"
				value={bio}
				onChange={setBio}
				description={`${bio.length} characters`}
			/>
			<TextArea label="Message" errorMessage="Message is required." resize="none" />
		</div>
	);
}

export function SelectDemos() {
	return (
		<div className="grid gap-10 md:grid-cols-2">
			<Select label="Series" placeholder="Choose a series" description="Opens a listbox.">
				<SelectItem id="psalms">Psalms</SelectItem>
				<SelectItem id="genesis">Genesis</SelectItem>
				<SelectItem id="romans">Romans 11</SelectItem>
			</Select>
			<Select label="Sort" defaultSelectedKey="newest">
				<SelectItem id="newest">Newest first</SelectItem>
				<SelectItem id="oldest">Oldest first</SelectItem>
			</Select>
			<Select label="With error" errorMessage="Choose one to continue.">
				<SelectItem id="a">Option A</SelectItem>
			</Select>
			<Select label="Disabled" isDisabled>
				<SelectItem id="a">Option A</SelectItem>
			</Select>
		</div>
	);
}

export function CheckboxDemos() {
	return (
		<div className="flex flex-col gap-5">
			<Checkbox label="Unchecked" />
			<Checkbox label="Checked" defaultSelected />
			<Checkbox label="Indeterminate" isIndeterminate />
			<Checkbox label="With description" description="Supporting text sits beneath the label." />
			<Checkbox label="Disabled" isDisabled />
			<Checkbox label="Disabled, checked" isDisabled defaultSelected />
		</div>
	);
}

interface Row extends Record<string, unknown> {
	id: number;
	title: string;
	series: string;
	date: string;
}

const rows: Row[] = [
	{ id: 1, title: "Psalm 100", series: "Psalms", date: "2026-04-12" },
	{ id: 2, title: "What is Sanctification?", series: "Doctrine", date: "2026-03-29" },
	{
		id: 3,
		title: "The Importance of the Local Church",
		series: "Single teaching",
		date: "2026-03-05",
	},
];

export function TableDemo() {
	const [picked, setPicked] = useState<Row | null>(null);
	const columns = [
		{ header: "Title", accessorKey: "title" } satisfies ColumnDef<Row, "title">,
		{ header: "Series", accessorKey: "series" } satisfies ColumnDef<Row, "series">,
		{ header: "Date", accessorKey: "date" } satisfies ColumnDef<Row, "date">,
	];
	return (
		<div className="flex flex-col gap-4">
			<Table<Row> columns={columns} data={rows} onRowClick={setPicked} />
			<Label>
				{picked ? `Selected: ${picked.title}` : "Rows are actionable: click or press Enter"}
			</Label>
			<Table<Row>
				columns={columns}
				data={[]}
				emptyState={<p className="text-text-secondary">No teachings match.</p>}
			/>
		</div>
	);
}

export function SearchDemos() {
	return (
		<div className="grid gap-10 md:grid-cols-2">
			<SearchField
				label="Search"
				placeholder="Search teachings"
				description="Escape or the cross clears."
			/>
			<SearchField label="Large (page-level)" size="lg" placeholder="A book or a passage" />
			<SearchField aria-label="Search, no visible label" placeholder="aria-label only" />
			<SearchField
				label="With error"
				errorMessage="Could not parse that reference."
				defaultValue="Hezekiah 3"
			/>
			<SearchField label="Disabled" isDisabled defaultValue="Romans" />
		</div>
	);
}

export function PlayButtonDemo() {
	const [plays, setPlays] = useState(0);
	return (
		<div className="flex flex-wrap items-center gap-8">
			<PlayButton aria-label="Play demo" size="lg" onPress={() => setPlays((n) => n + 1)} />
			<PlayButton
				aria-label="Play demo (medium)"
				size="md"
				onPress={() => setPlays((n) => n + 1)}
			/>
			<Label>Pressed {plays} times</Label>
		</div>
	);
}
