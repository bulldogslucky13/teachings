// Publish built decks as Keynote files into the ministry Dropbox, one folder per
// sermon. A deck edited in Keynote after the last build is never overwritten: bring
// the edits into the sermon source, then rebuild with --force.

const fs = require("fs");
const path = require("path");
const { runKeynote } = require("./keynote");

const OUTPUT_ROOT =
	process.env.SLIDES_OUTPUT_ROOT || "/Users/cameronbristol/Wildwood Student Min Dropbox/College Ministry/College Hour/FA26/Advent";
const MANIFEST = path.join(__dirname, "..", ".last-build.json");

// mtimes are compared to the second; syncing can shift the sub-second part.
function canOverwrite({ mtimeMs, recordedMtimeMs, force = false }) {
	if (force || mtimeMs === undefined) return true;
	if (recordedMtimeMs === undefined) return false;
	return Math.floor(mtimeMs / 1000) === Math.floor(recordedMtimeMs / 1000);
}

// A deck marked `taught: true` in series.js is a record of what was taught, so a
// build leaves its Keynote file alone unless --include-taught asks for it.
function shouldPublish({ noPublish = false, taught = false, includeTaught = false } = {}) {
	if (noPublish) return false;
	return !taught || includeTaught;
}

const readManifest = () => {
	try {
		return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
	} catch {
		return {};
	}
};

function saveAsKeynote(pptxPath, keyPath) {
	const script = `
		tell application "Keynote"
			set d to open (POSIX file "${pptxPath}")
			save d in (POSIX file "${keyPath}")
			close d saving no
		end tell`;
	runKeynote(script);
}

// Returns the Keynote path written, or null when the existing file was left alone.
function publish(pptxPath, { folder, file }, { force = false } = {}) {
	const dir = path.join(OUTPUT_ROOT, folder);
	const keyPath = path.join(dir, `${file}.key`);
	const manifest = readManifest();
	const mtimeMs = fs.existsSync(keyPath) ? fs.statSync(keyPath).mtimeMs : undefined;
	if (!canOverwrite({ mtimeMs, recordedMtimeMs: manifest[keyPath], force })) {
		console.warn(
			`skipped ${keyPath}\n  it was edited in Keynote after the last build. Bring those edits into the sermon source, then run with --force.`,
		);
		return null;
	}
	fs.mkdirSync(dir, { recursive: true });
	saveAsKeynote(pptxPath, keyPath);
	manifest[keyPath] = fs.statSync(keyPath).mtimeMs;
	fs.writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, "\t")}\n`);
	return keyPath;
}

module.exports = { canOverwrite, shouldPublish, publish, OUTPUT_ROOT };
