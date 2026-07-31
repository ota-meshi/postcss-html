import { Document as PostCssDocument } from "postcss";
import stringify from "../stringify.js";

class Document extends PostCssDocument {
	toString(stringifier) {
		return super.toString(stringifier || { stringify });
	}

	each(callback) {
		const result = this.nodes.map((node) => node.each(callback));
		return result.every((result) => result !== false) && result.pop();
	}

	append(...args) {
		this.last.append.apply(this.last, args);
		return this;
	}

	prepend(...args) {
		this.first.prepend.apply(this.first, args);
		return this;
	}

	insertBefore(exist, add) {
		exist.prepend(add);
		return this;
	}

	insertAfter(exist, add) {
		exist.append(add);
		return this;
	}
}
export default Document;
