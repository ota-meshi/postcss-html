import parse from "./parse.js";
import stringify from "./stringify.js";

function postcssHtml(config) {
	const syntax = {
		parse: (source, opts) =>
			parse(String(source), { config, syntax, ...(opts || {}) }),
		stringify,
	};
	return syntax;
}

const defaultSyntax = postcssHtml();
postcssHtml.parse = defaultSyntax.parse;
postcssHtml.stringify = defaultSyntax.stringify;

export default postcssHtml;
// Let `require("postcss-html")` on Node.js 22.12+ return the same value as
// the default export, keeping the CommonJS API identical to v1.
export { postcssHtml as "module.exports" };
