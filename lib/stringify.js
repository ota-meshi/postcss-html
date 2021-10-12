"use strict";

const postcssStringify = require("postcss/lib/stringify");
const Document = require("./html/document");
const patchPostcss = require("./patch-postcss");

module.exports = stringify;

function stringify(node, builder) {
	patchPostcss();
	if (!(node instanceof Document)) {
		const syntax = node.source.syntax || node.root().source.syntax;
		if (syntax && syntax.stringify) {
			syntax.stringify(node, builder);
		} else {
			postcssStringify(node, builder);
		}
		return;
	}

	node.nodes.forEach((root) => {
		builder(root.raws.beforeStart, root, "beforeStart");
		if (root.source.syntax) {
			root.source.syntax.stringify(root, builder);
		} else {
			postcssStringify(root, builder);
		}
	});
	builder(node.raws.afterEnd, node, "afterEnd");
}
