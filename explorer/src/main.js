import { createApp } from "vue";
import App from "./App.vue";

if (typeof window !== "undefined") {
	if (typeof window.global === "undefined") {
		window.global = {};
	}
	if (typeof window.process === "undefined") {
		const process = {
			env: {},
			cwd: () => undefined,
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
}

createApp(App).mount("#app");
