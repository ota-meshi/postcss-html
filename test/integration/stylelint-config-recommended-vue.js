"use strict";

const { fail } = require("assert");
const cp = require("child_process");
const path = require("path");

const STYLELINT = `.${path.sep}node_modules${path.sep}.bin${path.sep}stylelint`;

const FIXTURE_ROOT = path.resolve(
	__dirname,
	"../../test-fixtures/integration/stylelint-config-recommended-vue",
);

describe("Integration with stylelint-config-recommended-vue", () => {
	let originalCwd;

	before(() => {
		originalCwd = process.cwd();
		process.chdir(FIXTURE_ROOT);
		cp.execSync("npm i --no-package-lock --legacy-peer-deps", {
			stdio: "inherit",
		});
	});
	after(() => {
		process.chdir(originalCwd);
	});

	it("should lint without errors", () => {
		cp.execSync(`${STYLELINT} src/valid.vue`, { stdio: "inherit" });
	});
	it("should lint with errors", () => {
		try {
			cp.execSync(`${STYLELINT} src/invalid.vue`, { stdio: "inherit" });
			fail("Expect an error, but without errors");
		} catch {
			// Expected!
		}
	});
});
