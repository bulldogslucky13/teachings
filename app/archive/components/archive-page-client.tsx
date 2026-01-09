"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ColumnDef, Table } from "@/app/components/ui/table/table";
import {
	formatVerseRanges,
	getCoverPhotoUrl,
	type ScriptureReference,
	type Teaching,
} from "@/lib/teachings";

interface ArchivePageClientProps {
	teachings: Teaching[];
}

export function ArchivePageClient({ teachings }: ArchivePageClientProps) {
	const router = useRouter();

	// Define table columns
	const columns: ColumnDef<Teaching, keyof Teaching>[] = [
		{
			header: "Cover Photo",
			accessorKey: "coverPhoto",
			render: (_value, row) => (
				<div className="w-20 aspect-video relative overflow-hidden rounded">
					<Image
						src={getCoverPhotoUrl(row.coverPhoto)}
						alt={row.title}
						fill
						className="object-cover"
						sizes="80px"
					/>
				</div>
			),
		},
		{
			header: "Title",
			accessorKey: "title",
			render: (value) => <span className="text-left">{String(value)}</span>,
		},
		{
			header: "Scripture",
			accessorKey: "scripture",
			render: (value) => {
				const scriptures = value as ScriptureReference[];
				return (
					<span className="text-left">
						{scriptures
							.map((ref) => {
								const versesFormatted = ref.verses ? `:${formatVerseRanges(ref.verses)}` : "";
								return `${ref.book} ${ref.chapter}${versesFormatted}`;
							})
							.join(", ")}
					</span>
				);
			},
		},
		{
			header: "Date",
			accessorKey: "date",
			render: (value) => {
				const date = new Date(value as string);
				return (
					<span className="text-right">
						{date.toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						})}
					</span>
				);
			},
		},
	];

	// Handle row click to navigate to teaching page
	const handleRowClick = (row: Teaching) => {
		router.push(`/teaching/${row.id}`);
	};

	return <Table columns={columns} data={teachings} onRowClick={handleRowClick} />;
}
