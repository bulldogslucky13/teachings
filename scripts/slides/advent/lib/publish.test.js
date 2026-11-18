const test = require("node:test");
const assert = require("node:assert/strict");
const { canOverwrite, shouldPublish } = require("./publish");

test("canOverwrite allows a file that does not exist yet", () => {
	assert.equal(canOverwrite({ mtimeMs: undefined, recordedMtimeMs: undefined }), true);
});

test("canOverwrite allows a file left exactly as the last build wrote it", () => {
	assert.equal(canOverwrite({ mtimeMs: 1000, recordedMtimeMs: 1000 }), true);
});

test("canOverwrite tolerates sub-second mtime drift from syncing", () => {
	assert.equal(canOverwrite({ mtimeMs: 1000.7, recordedMtimeMs: 1000 }), true);
});

test("canOverwrite refuses a file changed since the last build", () => {
	assert.equal(canOverwrite({ mtimeMs: 9000, recordedMtimeMs: 1000 }), false);
});

test("canOverwrite refuses an existing file the build never wrote", () => {
	assert.equal(canOverwrite({ mtimeMs: 9000, recordedMtimeMs: undefined }), false);
});

test("force overrides the guard", () => {
	assert.equal(canOverwrite({ mtimeMs: 9000, recordedMtimeMs: 1000, force: true }), true);
});

test("shouldPublish publishes a deck that has not been taught", () => {
	assert.equal(shouldPublish({}), true);
});

test("shouldPublish honours --no-publish", () => {
	assert.equal(shouldPublish({ noPublish: true }), false);
});

test("shouldPublish leaves a taught deck alone", () => {
	assert.equal(shouldPublish({ taught: true }), false);
});

test("shouldPublish republishes a taught deck only when asked to", () => {
	assert.equal(shouldPublish({ taught: true, includeTaught: true }), true);
	assert.equal(shouldPublish({ taught: true, includeTaught: true, noPublish: true }), false);
});
