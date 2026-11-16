import { ImageResponse } from "next/og";
import { siteMarkStrokes } from "./components/ui/site-mark/site-mark-art";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const BRASS = "#c8a96e";
const WALL = "#0f0e0d";

export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: WALL,
			}}
		>
			<svg
				width={32}
				height={32}
				viewBox="0 0 32 32"
				fill="none"
				stroke={BRASS}
				role="img"
				aria-label="Teachings"
			>
				<rect x={1.0} y={1.0} width={30} height={30} strokeWidth={2} />
				{siteMarkStrokes("simple").map((stroke) => (
					<path key={stroke.d} d={stroke.d} strokeWidth={stroke.width} opacity={stroke.opacity} />
				))}
			</svg>
		</div>,
		size,
	);
}
