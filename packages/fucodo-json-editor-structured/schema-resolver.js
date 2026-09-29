/**
 * Schema-Auflösung für <json-tree-editor>.
 *
 * Reine Funktionen ohne DOM-Abhängigkeit (isoliert testbar). Kernaufgabe:
 * zu einem Knoten im JSON-Dokument das *effektive* Schema bestimmen – also
 * $ref aufgelöst, allOf zusammengeführt, if/then/else anhand des aktuellen
 * Werts ausgewertet und bei anyOf/oneOf die passende Variante gewählt.
 * Daraus leitet die UI ab, welche Felder angeboten werden, welches Widget ein
 * Wert bekommt und womit neue Einträge vorbelegt werden.
 *
 * Validierung selbst passiert nicht hier, sondern mit @cfworker/json-schema
 * über das Gesamtdokument. Der Validator wird nur benutzt, um die Bedingung
 * eines `if` bzw. die passende anyOf/oneOf-Variante zu ermitteln.
 */
import { Validator } from '@cfworker/json-schema';

export const JSON_TYPES = ['string', 'number', 'integer', 'boolean', 'object', 'array', 'null'];

/* ------------------------------------------------------------------ */
/* JSON Pointer                                                         */
/* ------------------------------------------------------------------ */

export const escapePointerToken = (token) => String(token).replace(/~/g, '~0').replace(/\//g, '~1');
export const unescapePointerToken = (token) => token.replace(/~1/g, '/').replace(/~0/g, '~');

export function joinPointer(pointer, token) {
  return `${pointer}/${escapePointerToken(token)}`;
}

export function splitPointer(pointer) {
  if (!pointer) return [];
  return pointer.slice(1).split('/').map(unescapePointerToken);
}

export function getAt(root, pointer) {
  let node = root;
  for (const token of splitPointer(pointer)) {
    if (node === null || typeof node !== 'object') return undefined;
    node = node[token];
  }
  return node;
}

/** Setzt einen Wert per Pointer und gibt die (ggf. neue) Wurzel zurück. */
export function setAt(root, pointer, value) {
  const tokens = splitPointer(pointer);
  if (!tokens.length) return value;
  const parent = getAt(root, `/${tokens.slice(0, -1).map(escapePointerToken).join('/')}`.replace(/^\/$/, ''));
  const key = tokens.at(-1);
  if (Array.isArray(parent)) parent[Number(key)] = value;
  else if (parent && typeof parent === 'object') parent[key] = value;
  return root;
}

/** Wandelt cfworker-instanceLocation ("#/0/domain") in einen JSON Pointer ("/0/domain"). */
export function locationToPointer(location) {
  const raw = location.startsWith('#') ? location.slice(1) : location;
  return raw.split('/').map((part) => {
    try { return decodeURIComponent(part); } catch { return part; }
  }).join('/');
}

/* ------------------------------------------------------------------ */
/* Typen                                                                */
/* ------------------------------------------------------------------ */

export function typeOfValue(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  return typeof value; // string | number | boolean | object | undefined
}

/** Passt der Wert zum Schema-Typ? integer ist auch ein number. */
export function valueMatchesType(value, type) {
  const actual = typeOfValue(value);
  return actual === type || (type === 'number' && actual === 'integer');
}

/** Liste der laut Schema erlaubten Typen (leer = beliebig). */
export function allowedTypes(schema) {
  if (!schema || typeof schema !== 'object') return [];
  if (schema.const !== undefined) return [typeOfValue(schema.const) === 'integer' ? 'integer' : typeOfValue(schema.const)];
  if (Array.isArray(schema.enum)) {
    return [...new Set(schema.enum.map((v) => typeOfValue(v)))];
  }
  if (Array.isArray(schema.type)) return schema.type;
  if (typeof schema.type === 'string') return [schema.type];
  if (schema.properties || schema.required || schema.additionalProperties !== undefined) return ['object'];
  if (schema.items || schema.prefixItems) return ['array'];
  return [];
}

/* ------------------------------------------------------------------ */
/* Resolver                                                             */
/* ------------------------------------------------------------------ */

const MERGE_UNION_OBJECTS = ['properties', 'patternProperties', '$defs', 'definitions'];

export class SchemaResolver {
  #root;
  #validators = new WeakMap();

  constructor(rootSchema) {
    if (rootSchema === undefined || rootSchema === null) throw new Error('Schema fehlt.');
    this.#root = rootSchema;
  }

  get root() {
    return this.#root;
  }

  /** Löst lokale $ref ("#/…") auf. Externe Referenzen werden ignoriert (→ {}). */
  deref(schema, seen = new Set()) {
    if (schema === true || schema === undefined) return {};
    if (schema === false) return { not: {} };
    if (!schema.$ref || typeof schema.$ref !== 'string') return schema;
    if (seen.has(schema.$ref)) return {};
    seen.add(schema.$ref);
    const { $ref, ...rest } = schema;
    let target = {};
    if ($ref.startsWith('#')) {
      const found = getAt(this.#root, locationToPointer($ref));
      if (found !== undefined) target = this.deref(found, seen);
    }
    return Object.keys(rest).length ? mergeSchemas(target, rest) : target;
  }

  /** Testet einen Wert gegen ein Teilschema (mit Zugriff auf die $defs der Wurzel). */
  matches(schema, value) {
    if (schema === true || schema === undefined) return true;
    if (schema === false) return false;
    if (value === undefined) return false; // noch kein Wert: Bedingung gilt als nicht erfüllt
    let validator = this.#validators.get(schema);
    if (!validator) {
      const wrapped = { ...schema };
      if (this.#root.$defs && !wrapped.$defs) wrapped.$defs = this.#root.$defs;
      if (this.#root.definitions && !wrapped.definitions) wrapped.definitions = this.#root.definitions;
      validator = new Validator(wrapped, '2020-12', true);
      this.#validators.set(schema, validator);
    }
    return validator.validate(value).valid;
  }

  /**
   * Effektives Schema für einen Wert: $ref, allOf, if/then/else und
   * anyOf/oneOf werden zu einem flachen Schema zusammengeführt.
   * Zusätzlich: `x-variants` = Liste der anyOf/oneOf-Alternativen (für die
   * Typ-/Variantenauswahl in der UI) und `x-variant-index` = gewählte.
   */
  effective(schema, value, depth = 0) {
    let current = this.deref(schema);
    if (depth > 16) return current;

    const { allOf, if: ifSchema, then: thenSchema, else: elseSchema, anyOf, oneOf, ...base } = current;
    let result = { ...base };

    if (Array.isArray(allOf)) {
      for (const part of allOf) result = mergeSchemas(result, this.effective(part, value, depth + 1));
    }

    if (ifSchema !== undefined) {
      const branch = this.matches(ifSchema, value) ? thenSchema : elseSchema;
      if (branch !== undefined) result = mergeSchemas(result, this.effective(branch, value, depth + 1));
    }

    const alternatives = anyOf ?? oneOf;
    if (Array.isArray(alternatives) && alternatives.length) {
      const resolved = alternatives.map((alt) => this.deref(alt));
      const index = this.pickVariant(resolved, value);
      result = mergeSchemas(result, this.effective(resolved[index], value, depth + 1));
      result['x-variants'] = resolved;
      result['x-variant-index'] = index;
    }

    return result;
  }

  /** Wählt die anyOf/oneOf-Variante, die zum Wert passt – sonst die mit passendem Typ, sonst die erste. */
  pickVariant(variants, value) {
    const exact = variants.findIndex((variant) => this.matches(variant, value));
    if (exact !== -1) return exact;
    const typeMatches = (variant) => {
      const types = allowedTypes(this.deref(variant));
      return types.length > 0 && types.some((type) => valueMatchesType(value, type));
    };
    // Bevorzugt freie Varianten (ohne const/enum): "abc" in "" | uri gehört zur uri-Variante.
    const isFixed = (variant) => variant.const !== undefined || Array.isArray(variant.enum);
    const free = variants.findIndex((variant) => !isFixed(variant) && typeMatches(variant));
    if (free !== -1) return free;
    const byType = variants.findIndex(typeMatches);
    return byType !== -1 ? byType : 0;
  }

  /** Schema der Eigenschaft `key` innerhalb eines effektiven Objekt-Schemas. */
  propertySchema(effectiveParent, key) {
    if (effectiveParent.properties && Object.hasOwn(effectiveParent.properties, key)) {
      return { schema: effectiveParent.properties[key], declared: true };
    }
    for (const [pattern, schema] of Object.entries(effectiveParent.patternProperties ?? {})) {
      try {
        if (new RegExp(pattern, 'u').test(key)) return { schema, declared: true };
      } catch { /* ungültiges Pattern im Schema ignorieren */ }
    }
    const extra = effectiveParent.additionalProperties ?? effectiveParent.unevaluatedProperties;
    if (extra === false) return { schema: {}, declared: false, forbidden: true };
    return { schema: extra === undefined || extra === true ? {} : extra, declared: false };
  }

  /** Schema des Array-Elements an Position `index`. */
  itemSchema(effectiveParent, index) {
    if (Array.isArray(effectiveParent.prefixItems) && index < effectiveParent.prefixItems.length) {
      return effectiveParent.prefixItems[index];
    }
    if (Array.isArray(effectiveParent.items)) { // draft-07-Tupel
      return index < effectiveParent.items.length
        ? effectiveParent.items[index]
        : (effectiveParent.additionalItems ?? {});
    }
    return effectiveParent.items ?? effectiveParent.unevaluatedItems ?? {};
  }

  /** Dürfen frei benannte Schlüssel ergänzt werden? */
  allowsFreeKeys(effectiveParent) {
    const extra = effectiveParent.additionalProperties ?? effectiveParent.unevaluatedProperties;
    return extra !== false;
  }

  /**
   * Vorbelegung für einen neuen Wert. Bei Objekten werden Pflichtfelder
   * ergänzt – mehrfach, weil ein gesetztes Feld (z.B. type) per if/then
   * weitere Pflichtfelder nach sich ziehen kann.
   */
  defaultFor(schema, preferredType = null, depth = 0) {
    const resolved = this.deref(schema);
    if (resolved.default !== undefined) return structuredClone(resolved.default);
    if (resolved.const !== undefined) return structuredClone(resolved.const);
    if (Array.isArray(resolved.enum) && resolved.enum.length) return structuredClone(resolved.enum[0]);

    const flat = this.effective(resolved, undefined);
    const types = allowedTypes(flat);
    const type = preferredType ?? types.find((t) => t !== 'null') ?? types[0] ?? 'string';
    if (flat.default !== undefined && preferredType === null) return structuredClone(flat.default);

    switch (type) {
      case 'object': return depth > 8 ? {} : this.#fillRequired({}, resolved, depth);
      case 'array': return [];
      case 'integer':
      case 'number': return typeof flat.minimum === 'number' ? flat.minimum : 0;
      case 'boolean': return false;
      case 'null': return null;
      default: return '';
    }
  }

  #fillRequired(object, schema, depth) {
    for (let round = 0; round < 4; round += 1) {
      const eff = this.effective(schema, object);
      let added = false;
      for (const key of eff.required ?? []) {
        if (Object.hasOwn(object, key)) continue;
        object[key] = this.defaultFor(this.propertySchema(eff, key).schema, null, depth + 1);
        added = true;
      }
      if (!added) break;
    }
    return object;
  }

  /** Konvertiert einen Wert beim Typwechsel möglichst verlustarm. */
  convert(value, targetType, schema) {
    if (valueMatchesType(value, targetType)) return value;
    const text = value === null || value === undefined ? '' : typeof value === 'object' ? '' : String(value);
    switch (targetType) {
      case 'string': return text;
      case 'integer': {
        const n = Number(text);
        return text.trim() !== '' && Number.isFinite(n) ? Math.trunc(n) : this.defaultFor(schema, 'integer');
      }
      case 'number': {
        const n = Number(text);
        return text.trim() !== '' && Number.isFinite(n) ? n : this.defaultFor(schema, 'number');
      }
      case 'boolean': return text === 'true' || text === '1';
      case 'null': return null;
      case 'array': return [];
      case 'object': return this.defaultFor(schema, 'object');
      default: return value;
    }
  }
}

/**
 * Führt zwei (bereits dereferenzierte) Schemas zusammen – Semantik wie allOf,
 * soweit die UI sie braucht: properties/required werden vereinigt, gleiche
 * Property-Schemas werden per allOf verschachtelt, type wird geschnitten,
 * sonstige Schlüsselwörter: der spätere Teil gewinnt.
 */
export function mergeSchemas(a, b) {
  if (!a || typeof a !== 'object') return b && typeof b === 'object' ? { ...b } : {};
  if (!b || typeof b !== 'object') return { ...a };
  const out = { ...a };
  for (const [key, value] of Object.entries(b)) {
    if (MERGE_UNION_OBJECTS.includes(key) && out[key] && typeof out[key] === 'object') {
      const merged = { ...out[key] };
      for (const [prop, sub] of Object.entries(value)) {
        merged[prop] = Object.hasOwn(merged, prop) ? { allOf: [merged[prop], sub] } : sub;
      }
      out[key] = merged;
    } else if (key === 'required' && Array.isArray(out.required)) {
      out.required = [...new Set([...out.required, ...value])];
    } else if (key === 'type' && out.type !== undefined) {
      const left = [].concat(out.type);
      const right = [].concat(value);
      const both = left.filter((t) => right.includes(t) || (t === 'integer' && right.includes('number')));
      out.type = both.length === 1 ? both[0] : both.length ? both : value;
    } else {
      out[key] = value;
    }
  }
  return out;
}
