"use strict";

const path = require("path");
const chai = require("chai");
const { jestSnapshotPlugin } = require("mocha-chai-jest-snapshot");
const stylelint = require("stylelint");
// stylelint-config-standard v40+ is ESM-only; require() returns the module
// namespace object, so the config itself is on `default`.
const stylelintConfig = require("stylelint-config-standard").default;
const { listupFixtures } = require("../utils");
const customSyntax = require.resolve("../..");

chai.use(jestSnapshotPlugin());

const FIXTURE_ROOT = path.resolve(
	__dirname,
	"../../test-fixtures/integration/stylelint",
);

describe("Integration with stylelint", () => {
	for (const { filename, content } of listupFixtures(FIXTURE_ROOT)) {
		describe(`stylelint with html`, () => {
			it(filename, () =>
				stylelint
					.lint({
						code: content,
						codeFilename: filename,
						customSyntax,
						config: stylelintConfig,
					})
					.then((result) => {
						const actual = result.results[0].warnings;
						chai.expect(actual).toMatchSnapshot();
					}),
			);
		});
		describe(`stylelint --fix with html`, () => {
			it(filename, () =>
				stylelint
					.lint({
						code: content,
						codeFilename: filename,
						customSyntax,
						config: stylelintConfig,
						fix: true,
					})
					.then((result) => {
						// stylelint v16 deprecated `output` and v17 removed it;
						// the fixed code is now on `code`.
						const actual = result.code;
						chai.expect(actual).toMatchSnapshot();
					}),
			);
		});
	}
});
