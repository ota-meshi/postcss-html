import Input from "postcss/lib/input";
import Document from "./document.js";

const reNewLine = /\r?\n|\r/g;

class Locations {
	constructor(source) {
		const breaks = [];
		reNewLine.lastIndex = 0;
		let match;
		while ((match = reNewLine.exec(source))) {
			// A line terminator is one character for `\n` and `\r`, but two for
			// `\r\n`. Keep its length so the first column of the following line
			// can be computed regardless of which terminator was used.
			breaks.push({ index: match.index, length: match[0].length });
		}

		this.breaks = breaks;
		this.source = source;
	}

	// Offset of the first character of the line, or `source.length` for a line
	// that does not exist. Line 1 always starts at 0; every later line starts
	// just past the terminator that ends the previous one.
	getLineStart(line) {
		if (line <= 1) {
			return 0;
		}
		const lineBreak = this.breaks[line - 2];
		return lineBreak ? lineBreak.index + lineBreak.length : this.source.length;
	}

	getOffsetFromLoc(loc) {
		return this.getLineStart(loc.line) + loc.column - 1;
	}

	getLocFromOffset(offset) {
		for (let index = 0; index < this.breaks.length; index++) {
			const lineBreak = this.breaks[index];
			if (offset <= lineBreak.index) {
				// Inside the line that this terminator ends, which starts right
				// after the previous one.
				const lineStart = this.getLineStart(index + 1);
				return { line: index + 1, column: offset - lineStart + 1 };
			}
			if (offset < lineBreak.index + lineBreak.length) {
				// Between the `\r` and the `\n` of a CRLF pair: report the end of
				// the line that the terminator ends.
				return {
					line: index + 1,
					column: lineBreak.index - this.getLineStart(index + 1) + 1,
				};
			}
		}

		// After the last terminator, or the source has no terminator at all.
		const line = this.breaks.length + 1;
		return { line, column: offset - this.getLineStart(line) + 1 };
	}
}

class LocalFixer {
	constructor(locations, style) {
		const { line, column } = locations.getLocFromOffset(style.startIndex);
		this.line = line - 1;
		this.column = column - 1;
		this.style = style;
		this.source = locations.source;
	}

	fixLocation(object) {
		if (object) {
			if (object.line === 1) {
				object.column += this.column;
			}
			object.line += this.line;
			if (typeof object.offset === "number") {
				object.offset += this.style.startIndex;
			}
			if (typeof object.endLine === "number") {
				if (object.endLine === 1) {
					object.endColumn += this.column;
				}
				object.endLine += this.line;
			}
		}
	}

	node(node) {
		this.fixLocation(node.source.start);
		this.fixLocation(node.source.end);
	}

	root(root) {
		this.node(root);
		root.walk((node) => {
			this.node(node);
		});
	}

	error(error) {
		if (error && error.name === "CssSyntaxError") {
			this.fixLocation(error);
			this.fixLocation(error.input);
			error.message = error.message.replace(
				/:\d+:\d+:/,
				`:${error.line}:${error.column}:`,
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
						document: this.source,
						map: false,
					},
					style.opts,
				),
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

export default function parseStyles(source, opts, styles) {
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

					// This property will cause toJSON to fail.
					// Also, this property is likely unnecessary.
					// However, for backward compatibility, we can set `enumerable: false` to work around the toJSON issue.
					// https://github.com/ota-meshi/postcss-html/issues/146
					Object.defineProperty(root, "document", {
						configurable: true,
						enumerable: false,
						writable: true,
						value: document,
					});
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
