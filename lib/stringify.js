import postcssStringify from "postcss/lib/stringify";
import Document from "./html/document.js";

export default function stringify(node, builder) {
	if (!(node instanceof Document)) {
		const syntax = node.source.syntax || node.root().source.syntax;
		if (syntax && syntax.stringify) {
			syntax.stringify(node, builder);
		} else {
			postcssStringify(node, builder);
		}
		return;
	}

	if (node.nodes.length) {
		node.nodes.forEach((root) => {
			builder(root.raws.codeBefore, root, "codeBefore");
			if (root.source.syntax) {
				root.source.syntax.stringify(root, builder);
			} else {
				postcssStringify(root, builder);
			}
			builder(root.raws.codeAfter || "", root, "codeAfter");
		});
	} else {
		// If it do not have root, it will output the input.
		builder(node.source.input.css);
	}
}
