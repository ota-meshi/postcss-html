/* eslint node/no-unsupported-features/es-syntax: off -- not node */
// eslint-disable-next-line node/no-unpublished-import -- ignore
import pako from "pako"

/**
 * Deserialize a given serialized string then update this object.
 * @param {string} serializedString A serialized string.
 * @returns {object} The deserialized state.
 */
export function deserializeState(serializedString) {
    const state = {
        code: undefined,
        options: undefined,
    }

    if (serializedString === "") {
        return state
    }

    try {
        const compressedString = window.atob(serializedString)
        const uint8Arr = pako.inflate(
            Uint8Array.from(compressedString, (c) => c.charCodeAt(0)),
        )

        // eslint-disable-next-line node/no-unsupported-features/node-builtins -- ignore
        const jsonText = new TextDecoder().decode(uint8Arr)
        const json = JSON.parse(jsonText)

        if (typeof json === "object" && json != null) {
            if (typeof json.code === "string") {
                state.code = json.code
            }
            if (typeof json.options === "object" && json.options != null) {
                state.options = json.options
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console -- demo
        console.error(error)
    }

    return state
}
