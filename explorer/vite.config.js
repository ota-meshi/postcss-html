import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

function shim(name) {
	return fileURLToPath(new URL(`./shim/${name}.js`, import.meta.url));
}

export default defineConfig({
	base: "/postcss-html/",
	plugins: [vue()],
	resolve: {
		alias: [
			{ find: /^(?:node:)?module$/u, replacement: shim("module") },
			{ find: /^(?:node:)?path$/u, replacement: shim("path") },
			{ find: /^(?:node:)?fs$/u, replacement: shim("fs") },
			{ find: /^glob$/u, replacement: shim("glob") },
		],
	},
	define: {
		"process.version": JSON.stringify(process.version),
	},
});
