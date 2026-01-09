"use client";

import type { ReactNode } from "react";
import {
	Table as AriaTable,
	type TableProps as AriaTableProps,
	Cell,
	Column,
	Row,
	TableBody,
	TableHeader,
} from "react-aria-components";
import { cn } from "../utils/cn";

export interface ColumnDef<Data, Key extends keyof Data = keyof Data> {
	header: string;
	accessorKey: Key;
	render?: (value: Data[Key], row: Data) => ReactNode;
}

export interface TableProps<Data> extends Omit<AriaTableProps, "children"> {
	columns: ColumnDef<Data, keyof Data>[];
	data: Data[];
	onRowClick?: (row: Data) => void;
	emptyState?: ReactNode;
	className?: string;
}

export function Table<Data extends Record<string, unknown>>({
	columns,
	data,
	onRowClick,
	emptyState,
	className,
	...props
}: TableProps<Data>) {
	const hasData = data.length > 0;

	if (!hasData && emptyState) {
		return <div className="py-8">{emptyState}</div>;
	}

	if (!hasData) {
		return <div className="py-8 text-center text-text-secondary">No data available</div>;
	}

	const firstColumnKey = columns[0]?.accessorKey;

	return (
		<div className="overflow-x-auto rounded-lg border border-border bg-surface">
			<AriaTable
				aria-label="Data table"
				className={cn("w-full border-collapse", className)}
				{...props}
			>
				<TableHeader className="bg-surface-hover">
					{columns.map((column) => (
						<Column
							key={String(column.accessorKey)}
							isRowHeader={column.accessorKey === firstColumnKey}
							className="border-b border-border px-4 py-2 text-left text-sm font-semibold text-text-primary"
						>
							{column.header}
						</Column>
					))}
				</TableHeader>
				<TableBody>
					{data.map((row, rowIndex) => (
						<Row
							key={rowIndex}
							className={cn(
								"border-b border-border/50 transition-colors last:border-b-0",
								rowIndex % 2 === 0 ? "bg-surface" : "bg-surface-hover/50",
								onRowClick && "cursor-pointer hover:bg-surface-hover",
							)}
							onAction={() => onRowClick?.(row)}
						>
							{columns.map((column) => {
								const value = row[column.accessorKey];
								const content = column.render ? column.render(value, row) : String(value ?? "");

								return (
									<Cell
										key={String(column.accessorKey)}
										className="px-4 py-2 text-sm text-text-primary"
									>
										{content}
									</Cell>
								);
							})}
						</Row>
					))}
				</TableBody>
			</AriaTable>
		</div>
	);
}
