import postcssParse from "postcss/lib/parse";
import postcssStringify from "postcss/lib/stringify";
import postcssSafeParser from "postcss-safe-parser";

export const cssSyntax = {
	parse: postcssParse,
	stringify: postcssStringify,
};
export const cssSafeSyntax = {
	parse: postcssSafeParser,
	stringify: postcssStringify,
};
