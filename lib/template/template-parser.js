import Parser from "postcss/lib/parser";
import templateTokenize from "./template-tokenize.js";

class TemplateParser extends Parser {
	createTokenizer() {
		this.tokenizer = templateTokenize(this.input);
	}
}
export default TemplateParser;
