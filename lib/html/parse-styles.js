"use strict";

const Input = require("postcss/lib/input");
const Document = require("./document");

const reNewLine = /\r?\n|\r/g;

class Locations {
	constructor(source) {
		let match;
		const lines = [];
		reNewLine.lastIndex = 0;
		while ((match = reNewLine.exec(source))) {
			lines.push(match.index);
		}
		lines.push(source.length);

		this.lines = lines;
		this.source = source;
	}

	getOffsetFromLoc(loc) {
		const lineIndex = loc.line - 2;
		return (lineIndex >= 0 ? this.lines[lineIndex] : -1) + loc.column;
	}

	getLocFromOffset(offset) {
		let line = 0;
		let column = offset;
		this.lines.some((lineEndIndex, lineNumber) => {
			if (lineEndIndex >= offset) {
				line = lineNumber;
				if (this.lines[line - 1] != null) {
					column = offset - this.lines[line - 1] - 1;
				}
				return true;
			}
			return false;
		});

		return { line, column };
	}
}

class LocalFixer {
	constructor(locations, style) {
		const { line, column } = locations.getLocFromOffset(style.startIndex);
		this.line = line;
		this.column = column;
		this.line = line;
		this.column = column;
		this.style = style;
	}

	object(object) {
		if (object) {
			if (object.line === 1) {
				object.column += this.column;
			}
			object.line += this.line;
			if (typeof object.offset === "number") {
				object.offset += this.style.startIndex;
			}
		}
	}

	node(node) {
		this.object(node.source.start);
		this.object(node.source.end);
	}

	root(root) {
		this.node(root);
		root.walk((node) => {
			this.node(node);
		});
	}

	error(error) {
		if (error && error.name === "CssSyntaxError") {
			this.object(error);
			this.object(error.input);
			error.message = error.message.replace(
				/:\d+:\d+:/,
				`:${error.line}:${error.column}:`
			);
		}
		return error;
	}

	parse(opts) {
		const style = this.style;
		const syntax = style.syntax;
		let root;
		try {
			root = syntax.parse(
				style.content,
				Object.assign(
					{},
					opts,
					{
						map: false,
					},
					style.opts
				)
			);
		} catch (error) {
			this.error(error);

			throw error;
		}
		this.root(root);

		root.source.inline = Boolean(style.inline);
		root.source.lang = style.lang;
		root.source.syntax = syntax;
		patchRoot(root, syntax);
		return root;
	}
}

function docFixer(source, opts) {
	const locations = new Locations(source);
	return function parseStyle(style) {
		return new LocalFixer(locations, style).parse(opts);
	};
}

function parseStyles(source, opts, styles) {
	const document = new Document();

	let index = 0;
	if (styles.length) {
		const parseStyle = docFixer(source, opts);
		styles
			.sort((a, b) => a.startIndex - b.startIndex)
			.forEach((style) => {
				const root = parseStyle(style);
				if (root) {
					root.raws.codeBefore = source.slice(index, style.startIndex);

					// Note: Stylelint is still using this property.
					try {
						Object.defineProperty(root.raws, "beforeStart", {
							configurable: true,
							get() {
								return root.raws.codeBefore;
							},
							set(value) {
								root.raws.codeBefore = value;
							},
						});
					} catch {
						// ignore
					}

					index =
						style.startIndex + (style.content || root.source.input.css).length;

					root.document = document;
					document.nodes.push(root);
				}
			});
	}

	const last = document.nodes[document.nodes.length - 1];
	if (last) {
		last.raws.codeAfter = index ? source.slice(index) : source;
	}
	document.source = {
		input: new Input(source, opts),
		start: {
			line: 1,
			column: 1,
		},
		opts,
	};
	return document;
}

module.exports = parseStyles;

function patchRoot(root, syntax) {
	const originalToString = root.toString;
	try {
		Object.defineProperty(root, "toString", {
			configurable: true,
			enumerable: false,
			value(stringifier) {
				return originalToString.call(this, stringifier || syntax);
			},
		});
	} catch {
		// ignore
	}
}
