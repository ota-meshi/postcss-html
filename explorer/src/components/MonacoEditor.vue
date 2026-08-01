<template>
	<div class="root"></div>
</template>

<script>
import * as monaco from "monaco-editor";

self.MonacoEnvironment = {
	getWorker(_workerId, label) {
		if (label === "json") {
			return new Worker(
				new URL("monaco-editor/language/json/json.worker.js", import.meta.url),
			);
		}
		if (label === "html") {
			return new Worker(
				new URL("monaco-editor/language/html/html.worker.js", import.meta.url),
			);
		}
		if (label === "css") {
			return new Worker(
				new URL("monaco-editor/language/css/css.worker.js", import.meta.url),
			);
		}
		return new Worker(
			new URL("monaco-editor/editor/editor.worker.js", import.meta.url),
		);
	},
};
export default {
	name: "MonacoEditor",
	props: {
		modelValue: {
			type: String,
			default: "",
		},
		language: {
			type: String,
			default: "json",
		},
		readOnly: Boolean,
	},
	emits: ["update:modelValue", "changeCursorPosition", "focusEditorText"],
	watch: {
		modelValue(newValue) {
			const vm = this;
			if (vm.editor) {
				if (newValue !== vm.editor.getValue()) {
					vm.editor.setValue(newValue);
				}
			}
		},
	},
	mounted() {
		const vm = this;
		const options = Object.assign(
			{
				value: vm.modelValue,
				readOnly: vm.readOnly,
				theme: "vs-dark",
				language: vm.language,
				automaticLayout: true,
				fontSize: 14,
				// tabSize: 2,
				minimap: {
					enabled: false,
				},
				renderControlCharacters: true,
				renderIndentGuides: true,
				renderValidationDecorations: "on",
				renderWhitespace: "boundary",
				scrollBeyondLastLine: false,
			},
			vm.options,
		);

		vm.editor = monaco.editor.create(vm.$el, options);
		vm.editor.onDidChangeModelContent((evt) => {
			const value = vm.editor.getValue();
			if (vm.modelValue !== value) {
				vm.$emit("update:modelValue", value, evt);
			}
		});
		vm.editor.onDidChangeCursorPosition((evt) => {
			vm.$emit("changeCursorPosition", evt);
		});
		vm.editor.onDidFocusEditorText((evt) => {
			vm.$emit("focusEditorText", evt);
		});
		monaco.json.jsonDefaults.setDiagnosticsOptions({
			validate: false,
		});
	},
	methods: {
		setCursorPosition(loc, { columnOffset = 0 } = {}) {
			const vm = this;
			if (vm.editor) {
				vm.editor.setSelection({
					startLineNumber: loc.start.line,
					startColumn: loc.start.column + columnOffset,
					endLineNumber: loc.end.line,
					endColumn: loc.end.column + columnOffset,
				});
			}
		},
	},
};
</script>
<style scoped>
.root {
	width: 100%;
	height: 100%;
}
</style>
