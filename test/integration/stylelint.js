import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import stylelint from "stylelint";
import stylelintConfig from "stylelint-config-standard";
import { listupFixtures } from "../utils.js";

const customSyntax = createRequire(import.meta.url).resolve("postcss-html");

chai.use(jestSnapshotPlugin());

const FIXTURE_ROOT = fileURLToPath(
	new URL("../../test-fixtures/integration/stylelint", import.meta.url),
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
