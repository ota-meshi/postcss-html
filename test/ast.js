import { fileURLToPath } from "node:url";
import chai from "chai";
import { jestSnapshotPlugin } from "mocha-chai-jest-snapshot";
import syntax from "postcss-html";
import { listupFixtures } from "./utils.js";

chai.use(jestSnapshotPlugin());

const AST_FIXTURE_ROOT = fileURLToPath(
	new URL("../test-fixtures/ast", import.meta.url),
);

describe("AST tests", () => {
	for (const { filename, content } of listupFixtures(AST_FIXTURE_ROOT)) {
		describe(filename, function () {
			it("ast", () => {
				const document = syntax.parse(content, {
					from: `/${filename}`,
				});
				for (const root of document.nodes) {
					if (document === root.document) {
						Object.defineProperty(root, "document", {
							configurable: true,
							enumerable: true,
							writable: true,
							value: "$document",
						});
					}
				}
				chai.expect(document).toMatchSnapshot();
			});
			it("toString", () => {
				const document = syntax.parse(content, {
					from: `/${filename}`,
				});
				chai.expect(document.toString()).equal(content);
			});
		});
	}
});
