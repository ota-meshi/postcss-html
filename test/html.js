import { expect } from "chai";
import postcss from "postcss";
import syntax from "postcss-html";

describe("html tests", () => {
	it("Invalid HTML", () => {
		const html = "<";
		const document = syntax.parse(html, {
			from: "invalid.html",
		});
		expect(document.source).to.haveOwnProperty("lang", "html");
		expect(document.nodes).to.have.lengthOf(0);
		expect(document.toString()).equal(html);
	});

	it("less", () => {
		const html = [
			"<html>",
			"<head>",
			'<style type="text/less">',
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</head>",
			"<body>",
			'<div style="font-family: serif, serif;">',
			"</div>",
			"</body>",
			"</html>",
		].join("\n");
		const document = syntax.parse(html, {
			from: "less.html",
		});
		expect(document.source).to.haveOwnProperty("lang", "html");
		expect(document.nodes).to.have.lengthOf(2);
		expect(document.toString()).equal(html);
	});

	it("stringify for append node", () => {
		const html = [
			"<html>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</html>",
		].join("\n");
		return postcss([
			function (root) {
				root.append({
					selector: "b",
				});
			},
		])
			.process(html, {
				syntax,
				from: "append.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						"<html>",
						"<style>",
						"a {",
						"\tdisplay: flex;",
						"}",
						"b {}",
						"</style>",
						"</html>",
					].join("\n"),
				);
			});
	});

	it("stringify for prepend node", () => {
		const html = [
			"<html>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</html>",
		].join("\n");
		return postcss([
			function (root) {
				root.prepend({
					selector: "b",
				});
			},
		])
			.process(html, {
				syntax,
				from: "prepend.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						"<html>",
						"<style>",
						"b {}",
						"a {",
						"\tdisplay: flex;",
						"}",
						"</style>",
						"</html>",
					].join("\n"),
				);
			});
	});

	it("stringify for insertBefore node", () => {
		function insertBeforePlugin() {
			return {
				postcssPlugin: "insertBeforePlugin",
				Root(root) {
					root.insertBefore(
						root.last,
						postcss.rule({
							selector: "b",
						}),
					);
				},
			};
		}

		insertBeforePlugin.postcss = true;
		const html = [
			"<html>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</html>",
		].join("\n");
		return postcss([insertBeforePlugin])
			.process(html, {
				syntax,
				from: "insertBefore.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						"<html>",
						"<style>",
						"b {}",
						"a {",
						"\tdisplay: flex;",
						"}",
						"</style>",
						"<style>",
						"b {}",
						"a {",
						"\tdisplay: flex;",
						"}",
						"</style>",
						"</html>",
					].join("\n"),
				);
			});
	});

	it("stringify for insertAfter node", () => {
		function insertAfterPlugin() {
			return {
				postcssPlugin: "insertAfterPlugin",
				Root(root) {
					root.insertAfter(
						root.first,
						postcss.rule({
							selector: "b",
						}),
					);
				},
			};
		}

		insertAfterPlugin.postcss = true;
		const html = [
			"<html>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</html>",
		].join("\n");
		return postcss([insertAfterPlugin])
			.process(html, {
				syntax,
				from: "insertAfter.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						"<html>",
						"<style>",
						"a {",
						"\tdisplay: flex;",
						"}b {}",
						"</style>",
						"<style>",
						"a {",
						"\tdisplay: flex;",
						"}b {}",
						"</style>",
						"</html>",
					].join("\n"),
				);
			});
	});

	it("stringify for unshift node", () => {
		function unshiftNodePlugin() {
			return {
				postcssPlugin: "unshiftNodePlugin",
				Root(root) {
					root.nodes = [...postcss.parse("b {}").nodes, ...root.nodes];
				},
			};
		}

		unshiftNodePlugin.postcss = true;
		const html = [
			"<html>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</html>",
		].join("\n");
		return postcss([unshiftNodePlugin])
			.process(html, {
				syntax,
				from: "unshift.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						"<html>",
						"<style>",
						"b {}a {",
						"\tdisplay: flex;",
						"}",
						"</style>",
						"</html>",
					].join("\n"),
				);
			});
	});

	it("stringify for push node", () => {
		function pushNodePlugin() {
			return {
				postcssPlugin: "pushNodePlugin",
				Root(root) {
					root.nodes = [...root.nodes, ...postcss.parse("b {}").nodes];
				},
			};
		}

		pushNodePlugin.postcss = true;

		const html = [
			"<html>",
			"<style>",
			"a {",
			"\tdisplay: flex;",
			"}",
			"</style>",
			"</html>",
		].join("\n");

		return postcss([pushNodePlugin])
			.process(html, {
				syntax,
				from: "push.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						"<html>",
						"<style>",
						"a {",
						"\tdisplay: flex;",
						"}b {}",
						"</style>",
						"</html>",
					].join("\n"),
				);
			});
	});

	it("stringify for nodes array", () => {
		function nodesArrayPlugin() {
			return {
				postcssPlugin: "nodesArrayPlugin",
				Root(root) {
					root.nodes = postcss.parse("b {}").nodes;
				},
			};
		}

		nodesArrayPlugin.postcss = true;

		const html = ["<html>", "<style>", "</style>", "</html>"].join("\n");
		return postcss([nodesArrayPlugin])
			.process(html, {
				syntax,
				from: "push.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					["<html>", "<style>", "b {}</style>", "</html>"].join("\n"),
				);
			});
	});

	it("stringify for nodes array for empty tags", () => {
		function nodesArrayPlugin() {
			return {
				postcssPlugin: "nodesArrayPlugin",
				Root(root) {
					root.nodes = postcss.parse("b {}").nodes;
				},
			};
		}

		nodesArrayPlugin.postcss = true;

		const html = [
			//
			"<style></style>",
			"<style></style>",
		].join("\n");
		return postcss([nodesArrayPlugin])
			.process(html, {
				syntax,
				from: "push.html",
			})
			.then((result) => {
				expect(result.root.source).to.haveOwnProperty("lang", "html");
				expect(result.content).to.equal(
					[
						//
						"<style>b {}</style>",
						"<style>b {}</style>",
					].join("\n"),
				);
			});
	});

	it("<style> tag in last line", () => {
		const html = "\n<style>b{}</style>";
		const document = syntax.parse(html, {
			from: "style_tag_in_last_line.html",
		});
		expect(document.source).to.haveOwnProperty("lang", "html");
		expect(document.nodes).to.be.lengthOf(1);
		expect(document.toString()).equal(html);
		expect(document.first.source.start.line).to.equal(2);
		expect(document.first.source.start.column).to.equal(8);
	});

	it("reports the same positions for every line terminator", () => {
		// `\r\n` is two characters while `\n` is one. The first column of every
		// line after a terminator used to shift, so the same document reported
		// different columns depending on which line ending it used.
		const positions = {};
		// Lone `\r` is deliberately not covered: the style content is extracted
		// with its terminators collapsed, which collapses the reported lines too.
		for (const lineBreak of ["\n", "\r\n"]) {
			const html = [
				"<html>",
				"<body>",
				"<style>",
				"a {}",
				"b {}",
				"</style>",
				"</body>",
				"</html>",
			].join(lineBreak);
			const document = syntax.parse(html, {
				from: `line_break_${JSON.stringify(lineBreak)}.html`,
			});

			expect(document.nodes).to.be.lengthOf(1);
			const root = document.first;
			const label = `line break ${JSON.stringify(lineBreak)}`;
			expect(root.nodes, label).to.be.lengthOf(2);
			expect(document.toString(), label).equal(html);

			// Positions must not depend on the terminator's length, so compare
			// each node's location to the style block's own start rather than to
			// the line numbers of the surrounding HTML.
			positions[lineBreak] = [root, ...root.nodes].map((node) => [
				node.source.start.line - root.source.start.line,
				node.source.start.column - root.source.start.column,
			]);
		}

		expect(positions).to.deep.equal({
			"\n": [
				[0, 0],
				[0, 0],
				[1, 0],
			],
			"\r\n": [
				[0, 0],
				[0, 0],
				[1, 0],
			],
		});
	});

	it("translates between an offset and a location consistently", () => {
		const html = "<style>\r\n</style>";
		const document = syntax.parse(html, {
			from: "offset_round_trip.html",
		});

		// `</style>` starts at the offset the parser reports, and the location
		// of that offset is the first column of line 2.
		const start = document.first.source.start;
		expect(html.slice(start.offset, start.offset + "</style>".length)).to.equal(
			"</style>",
		);
		expect(start.line).to.equal(2);
		expect(start.column).to.equal(1);
	});

	it("react inline styles", () => {
		const html = `
			<div style={divStyle}/>
			<div style={{ height: '10%' }}/>
			<div style={{height: '10%'}}/>
			<div style={createMarkup()}/>
			<div style = {divStyle} />
			<div style = {{ height: '10%' }} />
			<div style = {{height: '10%'}} />
			<div style = {createMarkup()} />
		`;
		const document = syntax.parse(html, {
			from: "react_inline_styles.html",
		});
		expect(document.source).to.haveOwnProperty("lang", "html");
		expect(document.nodes).to.be.lengthOf(0);
		expect(document.toString()).equal(html);
	});
});
