// Run an AppleScript against Keynote. Keynote is started first (in the background),
// because a script sent while it is not running, or still launching, fails with
// "Application isn't running".

const { execFileSync } = require("child_process");

function runKeynote(script, { attempts = 5, waitSeconds = 2 } = {}) {
	execFileSync("open", ["-ga", "Keynote"], { stdio: "pipe" });
	for (let attempt = 1; ; attempt++) {
		try {
			return execFileSync("osascript", ["-e", script], { stdio: "pipe", encoding: "utf8" });
		} catch (err) {
			if (attempt >= attempts) throw err;
			execFileSync("sleep", [String(waitSeconds)]);
		}
	}
}

module.exports = { runKeynote };
