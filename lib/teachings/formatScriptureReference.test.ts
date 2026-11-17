import { describe, expect, it } from "vitest";
import {
	formatScriptureReference,
	getBibleGatewayUrl,
	summarizeScriptureReferences,
} from "./formatScriptureReference";
import type { ScriptureReference } from "./teachings";

const ref = (
	book: string,
	chapter: number,
	verses?: string[],
	referenceType: ScriptureReference["referenceType"] = "featured",
): ScriptureReference => ({ book, chapter, verses, referenceType });

describe("formatScriptureReference", () => {
	it("formats a book, chapter and verse range", () => {
		expect(
			formatScriptureReference(
				ref("Romans", 11, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]),
			),
		).toBe("Romans 11:1-10");
	});

	it("separates non-contiguous verse groups with a comma and space", () => {
		expect(
			formatScriptureReference(ref("1 Thessalonians", 5, ["1", "2", "3", "4", "5", "8", "9"])),
		).toBe("1 Thessalonians 5:1-5, 8-9");
	});

	it("omits the verse part when there are no verses", () => {
		expect(formatScriptureReference(ref("Psalm", 100))).toBe("Psalm 100");
		expect(formatScriptureReference(ref("Psalm", 100, []))).toBe("Psalm 100");
	});
});

describe("getBibleGatewayUrl", () => {
	it("builds an ESV Bible Gateway URL", () => {
		expect(getBibleGatewayUrl(ref("Romans", 11, ["1", "2"]))).toBe(
			"https://www.biblegateway.com/passage/?search=Romans%2011%3A1-2&version=ESV",
		);
	});

	it("encodes book numbers and multiple verse groups", () => {
		expect(getBibleGatewayUrl(ref("1 John", 1, ["1", "3"]))).toBe(
			"https://www.biblegateway.com/passage/?search=1%20John%201%3A1%2C%203&version=ESV",
		);
	});
});

describe("summarizeScriptureReferences", () => {
	it("returns an empty string when there are no featured references", () => {
		expect(summarizeScriptureReferences([])).toBe("");
		expect(summarizeScriptureReferences([ref("John", 3, ["16"], "cross-referenced")])).toBe("");
	});

	it("returns the single featured reference", () => {
		expect(summarizeScriptureReferences([ref("Titus", 2, ["11", "12", "13", "14"])])).toBe(
			"Titus 2:11-14",
		);
	});

	it("returns the first featured reference plus a count of the rest", () => {
		expect(
			summarizeScriptureReferences([
				ref("Genesis", 9, ["9"]),
				ref("John", 3, ["16"], "cross-referenced"),
				ref("Exodus", 20, ["1"]),
				ref("Hebrews", 8, ["13"]),
			]),
		).toBe("Genesis 9:9 · +2");
	});
});
