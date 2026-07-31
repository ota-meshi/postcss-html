import postcssParse from "postcss/lib/parse";
import Input from "postcss/lib/input";
import TemplateParser from "./template-parser.js";
import TemplateSafeParser from "./template-safe-parser.js";

function templateParse(css, opts, Parser) {
	const input = new Input(css, opts);

	const parser = new Parser(input);
	parser.parse();

	return parser.root;
}

export default function buildTemplateSyntax(baseSyntax) {
	return {
		parse(css, opts) {
			return templateParse(
				css,
				opts,
				baseSyntax.parse === postcssParse ? TemplateParser : TemplateSafeParser,
			);
		},
		stringify(...args) {
			return baseSyntax.stringify(...args);
		},
	};
}
