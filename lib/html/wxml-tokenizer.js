"use strict";

const { Tokenizer } = require("htmlparser2");

const STATE_IN_TAG_NAME = 3; // State.InTagName
const STATE_SPECIAL_START_SEQUENCE = 23; // State.SpecialStartSequence
const CHAR_W = "w".charCodeAt(0);
const CHAR_X = "x".charCodeAt(0);
const CHAR_S = "s".charCodeAt(0);

// </wxs
const WXS_END_SEQUENCE = new Uint8Array([
	"<".charCodeAt(0),
	"/".charCodeAt(0),
	CHAR_W,
	CHAR_X,
	CHAR_S,
]);

function isTagBoundary(charCode) {
	return (
		charCode == null ||
		charCode === "/".charCodeAt(0) || // /
		charCode === ">".charCodeAt(0) || // >
		charCode === " ".charCodeAt(0) || // space
		charCode === "\t".charCodeAt(0) || // tab
		charCode === "\n".charCodeAt(0) || // \n
		charCode === "\r".charCodeAt(0) || // \r
		charCode === "\f".charCodeAt(0) // \f
	);
}

/** Lowercase ASCII letter char-code for case-insensitive tag checks. */
function lowerCase(code) {
	return code | 0x20;
}

module.exports = class WxmlTokenizer extends Tokenizer {
	stateBeforeTagName(c) {
		const w = lowerCase(c);
		const x = lowerCase(this.buffer.charCodeAt(this.index + 1));
		const s = lowerCase(this.buffer.charCodeAt(this.index + 2));
		const boundary = this.buffer.charCodeAt(this.index + 3);

		// If we are entering a <wxs ...> tag, switch to htmlparser2's "special/raw-text" mode
		// (similar to <script>): treat everything inside as plain text until </wxs>,
		// so style-like text in JS code won't be parsed as real HTML attributes/tags.
		if (
			w === CHAR_W &&
			x === CHAR_X &&
			s === CHAR_S &&
			isTagBoundary(boundary)
		) {
			this.sectionStart = this.index;
			this.isSpecial = true;
			this.currentSequence = WXS_END_SEQUENCE;
			this.sequenceIndex = 3;
			this.state = STATE_SPECIAL_START_SEQUENCE;
			return;
		}

		super.stateBeforeTagName(c);
	}

	stateInTagName(c) {
		this.state = STATE_IN_TAG_NAME;
		super.stateInTagName(c);
	}
};
