import { createRequire } from "node:module";
import path from "node:path";

export function loadModule(moduleName) {
	try {
		const cwd = process.cwd();
		const relativeTo = path.join(cwd, "__placeholder__.js");
		const loaded = createRequire(relativeTo)(moduleName);
		// Unwrap the namespace object of an ES module loaded via require(esm).
		return loaded && loaded[Symbol.toStringTag] === "Module" && loaded.default
			? loaded.default
			: loaded;
	} catch (error) {
		if (!isModuleNotFoundError(error)) {
			throw error;
		}
		// ignore
	}
	return null;
}

export function isModuleNotFoundError(error) {
	return (
		error &&
		typeof error === "object" &&
		(error.code === "MODULE_NOT_FOUND" || error.code === "ERR_MODULE_NOT_FOUND")
	);
}
