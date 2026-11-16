import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
	const serif = await readFile(
		join(process.cwd(), "assets/fonts/cormorant-garamond-latin-500-italic.woff"),
	);

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background: "#0f0e0d",
				border: "1px solid #c8a96e",
				color: "#c8a96e",
				fontFamily: "Cormorant",
				fontStyle: "italic",
				fontWeight: 500,
				fontSize: 30,
				lineHeight: 1,
				paddingBottom: 1,
				paddingRight: 3,
			}}
		>
			T
		</div>,
		{
			...size,
			fonts: [{ name: "Cormorant", data: serif, style: "italic", weight: 500 }],
		},
	);
}
