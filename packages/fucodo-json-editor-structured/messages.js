/**
 * Übersetzt die Fehler von @cfworker/json-schema in deutschsprachige,
 * zeilengenaue Meldungen für <json-tree-editor>.
 *
 * cfworker liefert pro Fehler eine ganze Kette (items → allOf → if → then →
 * required …). Für die UI interessieren nur die Blätter; die
 * "Verpackungs"-Fehler werden verworfen. Fehler zu nicht erlaubten
 * Eigenschaften hängen an der Eigenschaft selbst, nicht am Elternobjekt,
 * damit genau die betroffene Zeile markiert wird.
 */
import { joinPointer, locationToPointer } from './schema-resolver.js';

const WRAPPER_KEYWORDS = new Set([
  'items', 'prefixItems', 'additionalItems', 'unevaluatedItems', 'contains',
  'properties', 'patternProperties', 'propertyNames', 'dependentSchemas',
  'allOf', 'if', 'then', 'else', '$ref', '$dynamicRef', 'not-wrapper',
]);

const quoted = (text) => [...String(text).matchAll(/"([^"]*)"/g)].map((match) => match[1]);
// cfworker nennt den Grenzwert jeweils zuletzt: "String is too short (0 < 1).", "1 is less than 3."
const limit = (text) => (String(text).match(/-?\d+(?:\.\d+)?/g) ?? ['']).at(-1);

function translate(error) {
  const [q1, q2] = quoted(error.error);
  const n = limit(error.error);
  switch (error.keyword) {
    case 'type': return `Falscher Typ: erwartet ${q2 ?? '?'}, ist ${q1 ?? '?'}.`;
    case 'format': return `Ungültiges Format, erwartet wird ${q1 ?? 'ein anderes Format'}.`;
    case 'enum': return 'Wert ist nicht in der Liste der erlaubten Werte.';
    case 'const': return 'Wert entspricht nicht dem vorgegebenen Wert.';
    case 'minLength': return `Mindestens ${n} Zeichen erforderlich.`;
    case 'maxLength': return `Höchstens ${n} Zeichen erlaubt.`;
    case 'pattern': return 'Wert entspricht nicht dem geforderten Muster.';
    case 'minimum': return `Wert muss mindestens ${n} sein.`;
    case 'maximum': return `Wert darf höchstens ${n} sein.`;
    case 'exclusiveMinimum': return `Wert muss größer als ${n} sein.`;
    case 'exclusiveMaximum': return `Wert muss kleiner als ${n} sein.`;
    case 'multipleOf': return `Wert muss ein Vielfaches von ${n} sein.`;
    case 'minItems': return `Mindestens ${n} Einträge erforderlich.`;
    case 'maxItems': return `Höchstens ${n} Einträge erlaubt.`;
    case 'uniqueItems': return 'Einträge müssen eindeutig sein.';
    case 'minProperties': return `Mindestens ${n} Eigenschaften erforderlich.`;
    case 'maxProperties': return `Höchstens ${n} Eigenschaften erlaubt.`;
    case 'anyOf':
    case 'oneOf': return 'Wert passt zu keiner der erlaubten Varianten.';
    case 'not': return 'Wert ist hier ausdrücklich nicht erlaubt.';
    case 'false': return 'Wert ist hier nicht erlaubt.';
    default: return error.error;
  }
}

/**
 * @param {Array} errors            cfworker `result.errors`
 * @param {(parentPointer: string, key: string) => boolean} isDeclared
 *        true, wenn das effektive Schema des Elternobjekts die Eigenschaft
 *        deklariert. cfworker meldet bei fehlgeschlagener Property-Validierung
 *        zusätzlich "unevaluatedProperties" für dieselbe Eigenschaft – das ist
 *        ein Folgefehler und wird damit ausgefiltert.
 * @returns {{ pointer: string, message: string, keyword: string, missing?: string }[]}
 */
export function normalizeErrors(errors, isDeclared = () => false) {
  const out = [];
  const seen = new Set();
  const forbidden = new Set();
  const push = (entry) => {
    const id = `${entry.pointer}\u0000${entry.message}`;
    if (seen.has(id)) return;
    seen.add(id);
    out.push(entry);
  };

  for (const error of errors) {
    const pointer = locationToPointer(error.instanceLocation);
    if (WRAPPER_KEYWORDS.has(error.keyword)) continue;

    if (error.keyword === 'required') {
      const [missing] = quoted(error.error);
      push({ pointer, keyword: 'required', missing, message: `Pflichtfeld „${missing}“ fehlt.` });
      continue;
    }

    if (error.keyword === 'unevaluatedProperties' || error.keyword === 'additionalProperties') {
      const [key] = quoted(error.error);
      if (key === undefined || isDeclared(pointer, key)) continue;
      const child = joinPointer(pointer, key);
      forbidden.add(child);
      push({ pointer: child, keyword: error.keyword, message: 'Eigenschaft ist an dieser Stelle nicht erlaubt.' });
      continue;
    }

    if (error.keyword === 'false') {
      // Folgefehler einer unevaluated-/additionalProperties-Meldung (s.o.)
      // oder einer bereits gefilterten, weil deklarierten Eigenschaft.
      const tokens = pointer.split('/');
      const key = tokens.pop();
      if (forbidden.has(pointer) || isDeclared(tokens.join('/'), key)) continue;
    }

    push({ pointer, keyword: error.keyword, message: translate(error) });
  }

  // "false"-Fehler, deren unevaluated-Meldung erst später kam, nachträglich entfernen
  return out.filter((entry) => !(entry.keyword === 'false' && forbidden.has(entry.pointer)));
}
