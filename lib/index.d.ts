import type { Syntax } from "postcss";

type PostcssHtml = {
	(options?: Record<string, any>): Syntax;
} & Syntax;

declare const postcssHtml: PostcssHtml;
export default postcssHtml;
