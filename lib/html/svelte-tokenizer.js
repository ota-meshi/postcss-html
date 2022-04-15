"use strict";

const htmlparser = require("htmlparser2");
const { loadModule } = require("../shared/load-module");

const OPEN_BRACE = "{".charCodeAt(0);

module.exports = class SvelteTokenizer extends htmlparser.Tokenizer {
	stateBeforeAttributeValue(c) {
		if (c === OPEN_BRACE) {
			const startIndex = this._index;
			const endIndex = getIndexOfExpressionEnd(this.buffer, startIndex + 1);
			if (endIndex != null) {
				this.sectionStart = startIndex;
				this._index = endIndex + 1;

				this.cbs.onattribdata(this.getSection());
				this.sectionStart = -1;
				this.cbs.onattribend(null);
				this._state = 8 /* BeforeAttributeName */;
				this.stateBeforeAttributeName(this.buffer.charCodeAt(this._index));
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
	return acorn || (acorn = loadModule("acorn"));
}
