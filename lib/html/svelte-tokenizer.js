"use strict";

const htmlparser = require("htmlparser2");
const { loadModule, isModuleNotFoundError } = require("../shared/load-module");

const OPEN_BRACE = "{".charCodeAt(0);

module.exports = class SvelteTokenizer extends htmlparser.Tokenizer {
	stateBeforeAttributeValue(c) {
		if (c === OPEN_BRACE) {
			const startIndex = this.index;
			const endIndex = getIndexOfExpressionEnd(this.buffer, startIndex + 1);
			if (endIndex != null) {
				this.sectionStart = startIndex;
				this.index = endIndex + 1;

				this.cbs.onattribdata(this.sectionStart, this.index);
				this.sectionStart = -1;
				this.cbs.onattribend(1 /* QuoteType.Unquoted */, this.index);
				this.state = 8 /* BeforeAttributeName */;
				this.stateBeforeAttributeName(this.buffer.charCodeAt(this.index));
				return;
			}
		}
		super.stateBeforeAttributeValue(c);
	}
};

function getIndexOfExpressionEnd(source, startIndex) {
	const acorn = getAcorn();
	/* istanbul ignore if */
	if (!acorn) {
		return null;
	}
	let node;
	try {
		node = acorn.parseExpressionAt(source, startIndex, {
			sourceType: "module",
			ecmaVersion: "latest",
		});
	} catch (_e) {
		/* istanbul ignore next */
		return null;
	}

	let numParens = 0;
	for (let i = startIndex; i < node.start; i += 1) {
		if (source[i] === "(") numParens += 1;
	}

	let index = node.end;
	while (numParens > 0) {
		const char = source[index];

		if (char === ")") {
			numParens -= 1;
		} else if (!char.trim()) {
			return null;
		}

		index += 1;
	}

	return getIndexOfNextCloseBrace(source, index);
}

function getIndexOfNextCloseBrace(source, startIndex) {
	for (let index = startIndex; index < source.length; index++) {
		const char = source[index];
		if (char === "}") {
			return index;
		}
		if (!char.trim()) {
			break;
		}
	}
	return null;
}

let acorn;

function getAcorn() {
	if (!acorn) {
		acorn = loadModule("acorn");
		if (!acorn) {
			try {
				// eslint-disable-next-line node/no-extraneous-require -- ignore
				acorn = require("acorn");
			} catch (error) {
				if (!isModuleNotFoundError(error)) {
					throw error;
				}
				// ignore
			}
		}
	}
	return acorn;
}
