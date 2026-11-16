import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getCanonCoverage } from "@/lib/teachings/canon";
import { getAllTeachings } from "@/lib/teachings/teachings";

export const alt = "Teachings — Cameron Bristol";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WALL = "#0f0e0d";
const KEYLINE = "#2e2a26";
const TEXT = "#ece7df";
const SECONDARY = "#9c958a";
const BRASS = "#c8a96e";

const FRAME_INSET = 36;
const CONTENT_PAD = 88;
const CONTENT_WIDTH = size.width - CONTENT_PAD * 2;
const TESTAMENT_GAP = 34;
const TICK_AREA_HEIGHT = 60;

function tickHeight(count: number) {
	if (count >= 3) return 60;
	if (count === 2) return 44;
	return 30;
}

export default async function OpengraphImage() {
	const [serif, sans, teachings] = await Promise.all([
		readFile(join(process.cwd(), "assets/fonts/cormorant-garamond-latin-500-italic.woff")),
		readFile(join(process.cwd(), "assets/fonts/hanken-grotesk-latin-500-normal.woff")),
		getAllTeachings(),
	]);

	const coverage = getCanonCoverage(teachings);
	const otCount = coverage.filter((c) => c.book.testament === "OT").length;
	const ntCount = coverage.length - otCount;
	// Tick slots are proportional to book counts; the testament gap is carved out of the total.
	const slot = (CONTENT_WIDTH - TESTAMENT_GAP) / coverage.length;
	const otWidth = slot * otCount;
	const ntWidth = slot * ntCount;

	const renderTestament = (testament: "OT" | "NT", width: number) => (
		<div style={{ display: "flex", alignItems: "flex-end", width, height: TICK_AREA_HEIGHT }}>
			{coverage
				.filter((c) => c.book.testament === testament)
				.map((c) => (
					<div
						key={c.book.name}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "flex-end",
							width: slot,
							height: TICK_AREA_HEIGHT,
						}}
					>
						<div
							style={
								c.count > 0
									? { width: 3, height: tickHeight(c.count), background: BRASS }
									: { width: 1, height: 10, background: KEYLINE }
							}
						/>
					</div>
				))}
		</div>
	);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				position: "relative",
				background: WALL,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: FRAME_INSET,
					left: FRAME_INSET,
					right: FRAME_INSET,
					bottom: FRAME_INSET,
					border: `1px solid ${BRASS}`,
					opacity: 0.55,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: `${CONTENT_PAD - 24}px ${CONTENT_PAD}px ${CONTENT_PAD - 18}px`,
				}}
			>
				<div
					style={{
						display: "flex",
						fontFamily: "Hanken",
						fontWeight: 500,
						fontSize: 20,
						letterSpacing: "0.14em",
						textTransform: "uppercase",
						color: SECONDARY,
					}}
				>
					Cameron Bristol
				</div>

				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{
							display: "flex",
							fontFamily: "Cormorant",
							fontStyle: "italic",
							fontWeight: 500,
							fontSize: 170,
							lineHeight: 1,
							color: TEXT,
						}}
					>
						Teachings
					</div>
					<div
						style={{
							display: "flex",
							width: 64,
							height: 2,
							background: BRASS,
							marginTop: 22,
						}}
					/>
					<div
						style={{
							display: "flex",
							marginTop: 26,
							fontFamily: "Hanken",
							fontWeight: 500,
							fontSize: 30,
							color: SECONDARY,
						}}
					>
						Bible teaching, arranged by series and by book of Scripture.
					</div>
				</div>

				<div style={{ display: "flex", flexDirection: "column", width: CONTENT_WIDTH }}>
					<div style={{ display: "flex", alignItems: "flex-end" }}>
						{renderTestament("OT", otWidth)}
						<div style={{ display: "flex", width: TESTAMENT_GAP }} />
						{renderTestament("NT", ntWidth)}
					</div>
					<div
						style={{
							display: "flex",
							width: CONTENT_WIDTH,
							height: 1,
							background: SECONDARY,
							opacity: 0.4,
						}}
					/>
				</div>
			</div>
		</div>,
		{
			...size,
			fonts: [
				{ name: "Cormorant", data: serif, style: "italic", weight: 500 },
				{ name: "Hanken", data: sans, style: "normal", weight: 500 },
			],
		},
	);
}
