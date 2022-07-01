import pako from "pako";

/**
 * Serialize a given state as a base64 string.
 * @param {State} state The state to serialize.
 * @returns {string} The serialized string.
 */
export function serializeState(state) {
	const saveData = {
		code: state.code,
		options: state.options,
	};
	const jsonString = JSON.stringify(saveData);

	const uint8Arr = new TextEncoder().encode(jsonString);
	const compressedString = String.fromCharCode(...pako.deflate(uint8Arr));
	const base64 =
		(typeof window !== "undefined" && window.btoa(compressedString)) ||
		compressedString;

	console.log(
		`The compress rate of serialized string: ${(
			(100 * base64.length) /
			jsonString.length
		).toFixed(1)}% (${jsonString.length}B → ${base64.length}B)`
	);

	return base64;
}
