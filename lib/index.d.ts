import type { Syntax } from "postcss";

type PostcssHtml = {
	(options?: Record<string, any>): Syntax;
} & Syntax;

const postHtml: PostcssHtml;
export = postHtml;
