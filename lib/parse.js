import extract from "./html/extract-styles.js";
import parseStyles from "./html/parse-styles.js";

export default function parse(source, opts) {
	const document = parseStyles(source, opts, extract(source, opts));
	document.source.lang = "html";
	document.source.syntax = opts.syntax;
	return document;
}
