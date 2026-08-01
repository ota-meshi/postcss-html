import { createApp } from "vue";
import App from "./App.vue";

if (typeof window !== "undefined") {
	if (typeof window.global === "undefined") {
		window.global = {};
	}
	// The bundler may have already defined a partial `process`
	// (e.g. `{ version }`), so keep it and fill in the missing parts.
	const process = {
		env: {},
		cwd: () => undefined,
		...(typeof window.process === "undefined" ? {} : window.process),
	};
	window.process = new Proxy(process, {
		get(_t, p) {
			if (!process[p]) {
				console.log(p);
			}
			return process[p];
		},
	});
}

createApp(App).mount("#app");
