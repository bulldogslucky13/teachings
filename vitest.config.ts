import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		// the slide decks have their own node:test suite (scripts/slides/*/package.json)
		exclude: [...configDefaults.exclude, "scripts/slides/**"],
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "."),
		},
	},
});
