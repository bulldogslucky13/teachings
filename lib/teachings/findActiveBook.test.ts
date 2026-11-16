import { describe, expect, it } from "vitest";
import { findActiveBook } from "./findActiveBook";

describe("findActiveBook", () => {
	it("matches a bare book name, case-insensitively", () => {
		expect(findActiveBook("Romans")).toBe("Romans");
		expect(findActiveBook("romans")).toBe("Romans");
		expect(findActiveBook("  ROMANS  ")).toBe("Romans");
	});

	it("ignores a chapter or verse part", () => {
		expect(findActiveBook("Romans 8")).toBe("Romans");
		expect(findActiveBook("Romans 8:28")).toBe("Romans");
		expect(findActiveBook("romans 8:28-30")).toBe("Romans");
		expect(findActiveBook("John 3:16")).toBe("John");
	});

	it("handles numbered books without confusing them with the chapter", () => {
		expect(findActiveBook("1 John")).toBe("1 John");
		expect(findActiveBook("1 John 3")).toBe("1 John");
		expect(findActiveBook("2 Corinthians 5:17")).toBe("2 Corinthians");
		expect(findActiveBook("John 1")).toBe("John");
	});

	it("matches the display label as well as the data spelling", () => {
		expect(findActiveBook("Psalm 32")).toBe("Psalm");
		expect(findActiveBook("Psalms")).toBe("Psalm");
		expect(findActiveBook("psalms 23")).toBe("Psalm");
	});

	it("returns undefined for partial or unknown books and empty input", () => {
		expect(findActiveBook("Rom")).toBeUndefined();
		expect(findActiveBook("zzz")).toBeUndefined();
		expect(findActiveBook("")).toBeUndefined();
		expect(findActiveBook(undefined)).toBeUndefined();
		expect(findActiveBook("8")).toBeUndefined();
	});
});
