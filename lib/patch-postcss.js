"use strict";

const path = require("path");
const Document = require("./html/document");
const patched = {};

function isPromise(obj) {
	return obj && typeof obj.then === "function";
}

function patchLazyResult(LazyResult) {
	const runOnRoot = LazyResult.prototype.runOnRoot;

	LazyResult.prototype.runOnRoot = function run(...args) {
		const result = this.result;
		if (result.root instanceof Document) {
			const document = result.root;
			try {
				const results = document.nodes.map((root) => {
					result.root = root;
					return runOnRoot.call(this, ...args);
				});
				if (results.some(isPromise)) {
					return Promise.all(results);
				}
				return results;
			} finally {
				result.root = document;
			}
		}
		return runOnRoot.call(this, ...args);
	};
}

function patchNode(Node) {
	const originalNodeToString = Node.prototype.toString;
	Node.prototype.toString = function toString(stringifier) {
		return originalNodeToString.call(
			this,
			stringifier || this.root().source.syntax
		);
	};
}

module.exports = function patchPostcss() {
	patchLibs("node", patchNode);
	patchLibs("lazy-result", patchLazyResult);
};

function patchLibs(patchLibTarget, patchFn) {
	findPostcss()
		.map((dir) => path.join(dir, "lib", patchLibTarget))
		.filter((file) => !patched[file])
		.forEach((file) => {
			try {
				patchFn(require(file));
			} catch {
				//
			}
			patched[file] = true;
		});
}

function findPostcss() {
	const result = new Set();
	for (const file in require.cache) {
		const match = /^.+?(\\|\/)postcss\1/.exec(file);
		if (match) {
			result.add(match[0]);
		}
	}
	return [...result];
}
