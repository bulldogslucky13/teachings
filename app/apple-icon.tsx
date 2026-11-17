import { ImageResponse } from "next/og";
import { siteMarkStrokes } from "./components/ui/site-mark/site-mark-art";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const BRASS = "#c8a96e";
const WALL = "#0f0e0d";

export default function AppleIcon() {
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
				width={152}
				height={152}
				viewBox="0 0 32 32"
				fill="none"
				stroke={BRASS}
				role="img"
				aria-label="Teachings"
			>
				<rect x={0.3} y={0.3} width={31.4} height={31.4} strokeWidth={0.6} />
				{siteMarkStrokes("full").map((stroke) => (
					<path key={stroke.d} d={stroke.d} strokeWidth={stroke.width} opacity={stroke.opacity} />
				))}
			</svg>
		</div>,
		size,
	);
}
