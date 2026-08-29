/**
 * prettyPrintJson(value, indent = 2) -> String
 *
 * Wie `JSON.stringify(value, null, indent)`, mit einer Abweichung: Arrays,
 * die ausschließlich aus Primitiven (string/number/boolean/null) bestehen,
 * bleiben auf einer Zeile statt ein Element pro Zeile zu bekommen. Objekte
 * werden immer mehrzeilig dargestellt, auch wenn sie kurz sind. Arrays, die
 * Objekte oder weitere Arrays enthalten, werden ebenfalls mehrzeilig
 * dargestellt (jedes Element rekursiv nach denselben Regeln).
 *
 * Beispiel:
 *   {"skills":["a","b"],"address":{"city":"Berlin"}}
 * wird zu:
 *   {
 *     "skills": ["a", "b"],
 *     "address": {
 *       "city": "Berlin"
 *     }
 *   }
 */
export function prettyPrintJson(value, indent = 2) {
    const pad = ' '.repeat(Math.max(0, indent));
    return stringify(value, 0);

    function stringify(val, depth) {
        if (Array.isArray(val)) return stringifyArray(val, depth);
        if (val !== null && typeof val === 'object') return stringifyObject(val, depth);
        return JSON.stringify(val);
    }

    function stringifyArray(arr, depth) {
        if (arr.length === 0) return '[]';
        if (isPrimitiveArray(arr)) {
            return `[${arr.map((item) => JSON.stringify(item)).join(', ')}]`;
        }
        const inner = pad.repeat(depth + 1);
        const closing = pad.repeat(depth);
        const items = arr.map((item) => inner + stringify(item, depth + 1));
        return `[\n${items.join(',\n')}\n${closing}]`;
    }

    function stringifyObject(obj, depth) {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';
        const inner = pad.repeat(depth + 1);
        const closing = pad.repeat(depth);
        const items = keys.map((key) => `${inner}${JSON.stringify(key)}: ${stringify(obj[key], depth + 1)}`);
        return `{\n${items.join(',\n')}\n${closing}}`;
    }

    function isPrimitiveArray(arr) {
        return arr.every((item) => item === null || typeof item !== 'object');
    }
}