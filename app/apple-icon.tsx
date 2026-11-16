import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
	const serif = await readFile(
		join(process.cwd(), "assets/fonts/cormorant-garamond-latin-500-italic.woff"),
	);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				background: "#0f0e0d",
				padding: 14,
			}}
		>
			<div
				style={{
					flex: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					border: "2px solid #c8a96e",
					color: "#c8a96e",
					fontFamily: "Cormorant",
					fontStyle: "italic",
					fontWeight: 500,
					fontSize: 150,
					lineHeight: 1,
					paddingRight: 10,
				}}
			>
				T
			</div>
		</div>,
		{
			...size,
			fonts: [{ name: "Cormorant", data: serif, style: "italic", weight: 500 }],
		},
	);
}
