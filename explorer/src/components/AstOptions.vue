<template>
	<div class="ast-options">
		<label>
			filename
			<input
				:value="modelValue.filename"
				@input="updateFilename($event.target.value)"
			/>
		</label>
		<label
			><input
				type="checkbox"
				:checked="modelValue.showLocations"
				@change="updateShowLocations($event.target.checked)"
			/>
			Locations
		</label>
	</div>
</template>

<script>
export default {
	name: "AstOptions",
	props: {
		modelValue: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	emits: ["update:modelValue"],
	methods: {
		updateFilename(newValue) {
			this.$emit("update:modelValue", {
				...this.modelValue,
				filename: newValue,
			});
		},
		updateShowLocations(newValue) {
			this.$emit("update:modelValue", {
				...this.modelValue,
				showLocations: newValue,
			});
		},
	},
};
</script>

<style scoped>
.ast-options {
	text-align: right;
}
label {
	padding-left: 8px;
}
</style>
