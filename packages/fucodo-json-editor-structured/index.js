/**
 * <json-tree-editor>
 *
 * Schemagesteuerter Baum-/Tabellen-Editor als Progressive Enhancement für
 * eine <textarea>, die JSON enthält – die Schwester-Komponente zu
 * <json-editor> mit derselben Optik, denselben Custom Properties und
 * derselben Bootstrap-Interop.
 *
 *  - Ohne JS: normale <textarea> im Formular.
 *  - Mit JS:  Baumtabelle (Schlüssel | Wert | Typ | Aktionen). Welche Felder
 *             angeboten werden und welches Eingabeelement ein Wert bekommt,
 *             ergibt sich aus dem JSON Schema – inkl. $ref/$defs, allOf,
 *             if/then/else (abhängig vom aktuellen Wert) und anyOf/oneOf.
 *
 * Das Schema ist Pflicht. Ohne Schema bleibt die <textarea> sichtbar und
 * die Komponente meldet den Fehler.
 *
 * Eingaben dürfen zwischenzeitlich ungültig sein (z.B. "6x" in einem
 * integer-Feld – das landet als String im Dokument). Ungültige Werte werden
 * an der Zeile markiert, mit Meldung direkt darunter, zugeklappte Knoten
 * zeigen die Anzahl der Fehler darin, und eine Fehlerliste unten springt per
 * Klick zur Zeile. Nur das Absenden des Formulars wird bei ungültigem Inhalt
 * blockiert (abschaltbar mit dem Attribut allow-invalid).
 *
 * Verwendung:
 *   <json-tree-editor schema-src="/schemas/sso-applications.json">
 *     <textarea name="payload">[]</textarea>
 *   </json-tree-editor>
 *
 * Attribute:
 *   schema-src     URL des JSON Schemas (alternativ inline per
 *                  <script type="application/schema+json">)
 *   indent         Einrückung der JSON-Ansicht (Default 2)
 *   expand-depth   bis zu welcher Ebene initial aufgeklappt wird (Default 1)
 *   allow-invalid  Formular auch mit ungültigem Inhalt absenden
 *
 * Events (bubbeln, direkt am Element -> pro Instanz gescoped):
 *   json-tree-editor:change   detail: { value }
 *   json-tree-editor:valid    detail: { value }
 *   json-tree-editor:invalid  detail: { errors: { pointer, message }[] }
 *
 * API:
 *   .value            get/set – geparster Wert (Kopie)
 *   .schema           get/set – Schema-Objekt
 *   .mode             'tree' | 'json'
 *   .validate()       Validiert sofort, gibt boolean zurück
 *   .expandAll() / .collapseAll()
 *   .reveal(pointer)  Klappt bis zur Zeile auf und fokussiert sie
 *
 * JSON-Ansicht: Ist <json-editor> registriert, wird er für die Rohansicht
 * verwendet (Highlighting + Validierung), sonst eine einfache <textarea>.
 */
import { Validator } from '@cfworker/json-schema';
import {
  SchemaResolver, allowedTypes, getAt, joinPointer, setAt, splitPointer, typeOfValue, valueMatchesType,
} from './schema-resolver.js';
import { normalizeErrors } from './messages.js';
import style from './style.scss';

const svg = (d, extra = '') =>
  `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;

const ICON = {
  chevron: svg('<path d="M6 3.5 10.5 8 6 12.5"/>'),
  up: svg('<path d="M8 13V3M4 7l4-4 4 4"/>'),
  down: svg('<path d="M8 3v10M4 9l4 4 4-4"/>'),
  copy: svg('<rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/>'),
  trash: svg('<path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"/>'),
  plus: svg('<path d="M8 3v10M3 8h10"/>'),
  expand: svg('<path d="M4 6l4 4 4-4"/>'),
  collapse: svg('<path d="M4 10l4-4 4 4"/>'),
  tree: svg('<path d="M3 3h4M5 3v10h4M5 8h4"/><rect x="9.5" y="6.5" width="4" height="3" rx=".5"/><rect x="9.5" y="11.5" width="4" height="3" rx=".5"/>'),
  braces: svg('<path d="M6 2.5c-1.5 0-2 .7-2 2v1.5c0 1-.6 1.8-1.5 2 .9.2 1.5 1 1.5 2v1.5c0 1.3.5 2 2 2M10 2.5c1.5 0 2 .7 2 2v1.5c0 1 .6 1.8 1.5 2-.9.2-1.5 1-1.5 2v1.5c0 1.3-.5 2-2 2"/>'),
};
// Dieselben Statussymbole wie <json-editor>.
const ICON_VALID = '<svg viewBox="0 0 8 8" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z"/></svg>';
const ICON_INVALID = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="4.5"/><path stroke-linejoin="round" d="M5.8 3.6h.4L6 6.5z"/><circle cx="6" cy="8.2" r=".6" fill="currentColor" stroke="none"/></svg>';

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `<style>${style}</style>
<div class="editor">
  <div class="toolbar">
    <div class="mode" role="group" aria-label="Ansicht">
      <button type="button" data-mode="tree" aria-pressed="true">${ICON.tree}Baum</button>
      <button type="button" data-mode="json" aria-pressed="false">${ICON.braces}JSON</button>
    </div>
    <button type="button" data-action="expand-all">${ICON.expand}Alle aufklappen</button>
    <button type="button" data-action="collapse-all">${ICON.collapse}Alle zuklappen</button>
    <span class="status" role="status"><span class="status-icon"></span><span class="status-text"></span></span>
  </div>
  <p class="notice" hidden></p>
  <div class="body">
    <table>
      <colgroup><col class="c-key"><col class="c-value"><col class="c-type"><col class="c-actions"></colgroup>
      <thead><tr><th scope="col">Schlüssel</th><th scope="col">Wert</th><th scope="col">Typ</th><th scope="col"><span class="visually-hidden">Aktionen</span></th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="json-view" hidden></div>
  <div class="fallback" hidden><slot></slot></div>
  <ul class="errors" aria-label="Fehler"></ul>
</div>`;

/** Beschriftung einer anyOf/oneOf-Variante in der Typ-Spalte. */
function variantLabel(variant, index) {
  if (variant.title) return variant.title;
  if (variant.const !== undefined) return variant.const === '' ? 'leer' : JSON.stringify(variant.const);
  if (Array.isArray(variant.enum)) return 'Auswahl';
  const types = allowedTypes(variant).join(' | ');
  if (types && variant.format) return `${types} · ${variant.format}`;
  return types || `Variante ${index + 1}`;
}

const SUMMARY_KEYS = ['title', 'name', 'label', 'type', 'id', 'key', 'domain', 'uri', 'url', 'path'];
const NUMBER_PATTERN = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/;
const ROOT_LABEL = '(Wurzel)';

const escapeHtml = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const isContainer = (value) => value !== null && typeof value === 'object';
const cssEscape = (text) => (globalThis.CSS?.escape ? CSS.escape(text) : String(text).replace(/["\\]/g, '\\$&'));

export class JsonTreeEditor extends HTMLElement {
  static get observedAttributes() {
    return ['schema-src'];
  }

  #textarea = null;
  #form = null;
  #onFormSubmit = null;

  #schema = null;
  #resolver = null;
  #validator = null;

  #data = undefined;
  #mode = 'tree';
  #expanded = new Map();          // pointer -> boolean (explizit gesetzt)
  #errors = [];                   // [{ pointer, message, keyword }]
  #customKeyFor = null;           // Pointer des Objekts, für das gerade ein freier Schlüssel eingegeben wird
  #shape = '';                    // Strukturabdruck des zuletzt gerenderten Baums
  #composing = false;
  #validateHandle = null;

  #els = {};

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(TEMPLATE.content.cloneNode(true));
    const q = (selector) => shadow.querySelector(selector);
    this.#els = {
      tbody: q('tbody'),
      body: q('.body'),
      jsonView: q('.json-view'),
      fallback: q('.fallback'),
      notice: q('.notice'),
      errors: q('.errors'),
      status: q('.status'),
      statusIcon: q('.status-icon'),
      statusText: q('.status-text'),
      toolbar: q('.toolbar'),
    };

    this.#els.toolbar.addEventListener('click', this.#onToolbarClick);
    this.#els.tbody.addEventListener('click', this.#onTreeClick);
    this.#els.tbody.addEventListener('input', this.#onTreeInput);
    this.#els.tbody.addEventListener('change', this.#onTreeChange);
    this.#els.tbody.addEventListener('keydown', this.#onTreeKeydown);
    this.#els.tbody.addEventListener('compositionstart', () => { this.#composing = true; });
    this.#els.tbody.addEventListener('compositionend', () => { this.#composing = false; this.#scheduleValidation(); });
    this.#els.errors.addEventListener('click', this.#onErrorListClick);
  }

  /* ------------------------------------------------------------ lifecycle */

  connectedCallback() {
    this.#textarea = this.querySelector(':scope > textarea');
    if (!(this.#textarea instanceof HTMLTextAreaElement)) {
      console.warn('<json-tree-editor> benötigt ein <textarea>-Kind als Light-DOM-Inhalt.');
      return;
    }

    // Formular-Guard: closest() bindet nur an das eigene Formular, damit
    // mehrere Instanzen auf einer Seite koexistieren.
    this.#form = this.#textarea.closest('form');
    if (this.#form && !this.#onFormSubmit) {
      this.#onFormSubmit = (event) => this.#handleFormSubmit(event);
      this.#form.addEventListener('submit', this.#onFormSubmit);
    }

    this.#loadSchema();
  }

  disconnectedCallback() {
    const form = this.#form;
    const handler = this.#onFormSubmit;
    this.#onFormSubmit = null;
    if (form && handler) {
      const cleanup = () => form.removeEventListener('submit', handler);
      if ('requestIdleCallback' in window) requestIdleCallback(cleanup);
      else setTimeout(cleanup, 0);
    }
    if (this.#validateHandle) clearTimeout(this.#validateHandle);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'schema-src' && this.isConnected && oldValue !== newValue) this.#loadSchema();
  }

  /* ------------------------------------------------------------------ API */

  get value() {
    return this.#data === undefined ? undefined : structuredClone(this.#data);
  }

  set value(next) {
    this.#data = structuredClone(next);
    this.#commit({ render: true });
  }

  get schema() {
    return this.#schema;
  }

  set schema(schema) {
    this.#applySchema(schema);
  }

  get mode() {
    return this.#mode;
  }

  set mode(mode) {
    this.#switchMode(mode === 'json' ? 'json' : 'tree');
  }

  get indent() {
    const value = Number(this.getAttribute('indent'));
    return Number.isFinite(value) && value >= 0 && this.hasAttribute('indent') ? value : 2;
  }

  get expandDepth() {
    const value = Number(this.getAttribute('expand-depth'));
    return this.hasAttribute('expand-depth') && Number.isFinite(value) ? value : 1;
  }

  validate() {
    if (!this.#validator || this.#data === undefined) return false;
    const result = this.#validator.validate(this.#data);
    this.#errors = result.valid ? [] : normalizeErrors(result.errors, (parent, key) => this.#isDeclared(parent, key));
    const valid = this.#errors.length === 0;
    this.#decorate();
    this.toggleAttribute('invalid', !valid);
    this.classList.toggle('is-valid', valid);
    this.classList.toggle('is-invalid', !valid);
    if (valid) {
      this.dispatchEvent(new CustomEvent('json-tree-editor:valid', { bubbles: true, detail: { value: this.value } }));
    } else {
      const errors = this.#errors.map(({ pointer, message }) => ({ pointer, message }));
      this.dispatchEvent(new CustomEvent('json-tree-editor:invalid', { bubbles: true, detail: { errors } }));
    }
    return valid;
  }

  expandAll() {
    this.#walk(this.#data, '', (value, pointer) => { if (isContainer(value)) this.#expanded.set(pointer, true); });
    this.#render();
  }

  collapseAll() {
    this.#walk(this.#data, '', (value, pointer) => { if (isContainer(value) && pointer) this.#expanded.set(pointer, false); });
    this.#render();
  }

  reveal(pointer) {
    if (this.#mode !== 'tree') this.#switchMode('tree');
    const tokens = splitPointer(pointer);
    let current = '';
    for (const token of tokens.slice(0, -1)) {
      current = joinPointer(current, token);
      this.#expanded.set(current, true);
    }
    // Fehler an Containern (z.B. "Pflichtfeld fehlt") -> Container selbst aufklappen.
    if (isContainer(getAt(this.#data, pointer))) this.#expanded.set(pointer, true);
    this.#render();
    const row = this.#rowFor(pointer);
    if (!row) return;
    row.scrollIntoView?.({ block: 'nearest' });
    (row.querySelector('.value input, .value select, .toggle, .type select') ?? row.querySelector('button'))?.focus();
  }

  /* --------------------------------------------------------------- schema */

  async #loadSchema() {
    const src = this.getAttribute('schema-src');
    const inline = this.querySelector(':scope > script[type="application/schema+json"]');
    let schema = null;
    try {
      if (src) {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Schema konnte nicht geladen werden (${response.status}).`);
        schema = await response.json();
      } else if (inline) {
        schema = JSON.parse(inline.textContent);
      }
    } catch (error) {
      this.#fail(`Schema-Fehler: ${error.message}`);
      return;
    }
    if (schema === null) {
      if (!this.#schema) this.#fail('Kein Schema angegeben. Der Baumeditor benötigt ein JSON Schema (schema-src oder <script type="application/schema+json">).');
      return;
    }
    this.#applySchema(schema);
  }

  #applySchema(schema) {
    try {
      this.#resolver = new SchemaResolver(schema);
      this.#validator = new Validator(schema, '2020-12', false);
      this.#schema = schema;
    } catch (error) {
      this.#fail(`Schema-Fehler: ${error.message}`);
      return;
    }
    this.#els.fallback.hidden = true;
    this.#els.notice.hidden = true;

    if (this.#data === undefined) {
      const raw = this.#textarea?.value.trim() ?? '';
      if (!raw) {
        this.#data = this.#resolver.defaultFor(schema);
      } else {
        try {
          this.#data = JSON.parse(raw);
        } catch (error) {
          // Kaputtes JSON: Rohansicht öffnen, damit es repariert werden kann.
          this.#switchMode('json');
          this.#setStatus(`JSON-Syntaxfehler: ${error.message}`, 'error');
          return;
        }
      }
    }
    this.#commit({ render: true, emit: false });
  }

  #fail(message) {
    this.#els.notice.textContent = message;
    this.#els.notice.hidden = false;
    this.#els.body.hidden = true;
    this.#els.jsonView.hidden = true;
    this.#els.fallback.hidden = false; // Original-textarea bleibt benutzbar
    this.#setStatus('', 'error');
    this.toggleAttribute('invalid', true);
  }

  /** Effektives Schema am Pointer, vom Wurzelschema aus entlang der Daten aufgelöst. */
  #effectiveAt(pointer) {
    let schema = this.#schema;
    let value = this.#data;
    let eff = this.#resolver.effective(schema, value);
    for (const token of splitPointer(pointer)) {
      if (Array.isArray(value)) schema = this.#resolver.itemSchema(eff, Number(token));
      else schema = this.#resolver.propertySchema(eff, token).schema;
      value = value?.[token];
      eff = this.#resolver.effective(schema, value);
    }
    return { schema, eff, value };
  }

  #isDeclared(parentPointer, key) {
    try {
      const { eff } = this.#effectiveAt(parentPointer);
      return this.#resolver.propertySchema(eff, key).declared;
    } catch {
      return false;
    }
  }

  /* ----------------------------------------------------------- mutations */

  /** Nach jeder Änderung: textarea synchronisieren, validieren, ggf. neu rendern. */
  #commit({ render = false, emit = true } = {}) {
    if (this.#textarea && this.#data !== undefined) {
      this.#textarea.value = JSON.stringify(this.#data, null, this.indent);
    }
    if (render) this.#render();
    this.validate();
    if (emit) {
      this.dispatchEvent(new CustomEvent('json-tree-editor:change', { bubbles: true, detail: { value: this.value } }));
    }
  }

  #set(pointer, value) {
    this.#data = setAt(this.#data, pointer, value);
  }

  #scheduleValidation() {
    if (this.#validateHandle) clearTimeout(this.#validateHandle);
    this.#validateHandle = setTimeout(() => {
      this.#validateHandle = null;
      if (!this.#composing) this.validate();
    }, 250);
  }

  /**
   * Array-Umbau: explizite Auf-/Zuklapp-Zustände unterhalb des Arrays auf die
   * neuen Indizes umschreiben (mapping: alter Index -> neuer Index | null).
   */
  #remapExpanded(arrayPointer, mapping) {
    const prefix = `${arrayPointer}/`;
    const next = new Map();
    for (const [pointer, state] of this.#expanded) {
      if (!pointer.startsWith(prefix)) { next.set(pointer, state); continue; }
      const [index, ...rest] = pointer.slice(prefix.length).split('/');
      const target = mapping(Number(index));
      if (target === null || target === undefined) continue;
      next.set([`${prefix}${target}`, ...rest].join('/'), state);
    }
    this.#expanded = next;
  }

  #parentOf(pointer) {
    const tokens = splitPointer(pointer);
    const key = tokens.pop();
    const parent = tokens.reduce((acc, token) => joinPointer(acc, token), '');
    return { parent, key };
  }

  #action(action, pointer) {
    switch (action) {
      case 'toggle': {
        const { value } = this.#effectiveAt(pointer);
        this.#expanded.set(pointer, !this.#isExpanded(pointer, value));
        this.#render({ focus: { pointer, role: 'toggle' } });
        return;
      }
      case 'add-item': {
        const { eff, value } = this.#effectiveAt(pointer);
        const index = value.length;
        value.push(this.#resolver.defaultFor(this.#resolver.itemSchema(eff, index)));
        const child = joinPointer(pointer, index);
        this.#expanded.set(child, true);
        this.#commit({ render: true });
        this.#focusRow(child);
        return;
      }
      case 'remove': {
        const { parent, key } = this.#parentOf(pointer);
        const container = getAt(this.#data, parent);
        if (Array.isArray(container)) {
          const removed = Number(key);
          container.splice(removed, 1);
          this.#remapExpanded(parent, (i) => (i === removed ? null : i > removed ? i - 1 : i));
          this.#commit({ render: true });
          this.#focusRow(container.length ? joinPointer(parent, Math.min(removed, container.length - 1)) : parent);
        } else {
          delete container[key];
          this.#expanded.delete(pointer);
          this.#commit({ render: true });
          this.#focusRow(parent);
        }
        return;
      }
      case 'up':
      case 'down': {
        const { parent, key } = this.#parentOf(pointer);
        const list = getAt(this.#data, parent);
        const from = Number(key);
        const to = action === 'up' ? from - 1 : from + 1;
        if (to < 0 || to >= list.length) return;
        [list[from], list[to]] = [list[to], list[from]];
        this.#remapExpanded(parent, (i) => (i === from ? to : i === to ? from : i));
        this.#commit({ render: true });
        this.#render({ focus: { pointer: joinPointer(parent, to), role: action } });
        return;
      }
      case 'duplicate': {
        const { parent, key } = this.#parentOf(pointer);
        const list = getAt(this.#data, parent);
        const at = Number(key);
        list.splice(at + 1, 0, structuredClone(list[at]));
        this.#remapExpanded(parent, (i) => (i > at ? i + 1 : i));
        this.#commit({ render: true });
        this.#focusRow(joinPointer(parent, at + 1));
        return;
      }
      case 'fill-required': {
        const { schema, value } = this.#effectiveAt(pointer);
        for (let round = 0; round < 4; round += 1) {
          const eff = this.#resolver.effective(schema, value);
          const missing = (eff.required ?? []).filter((key) => !Object.hasOwn(value, key));
          if (!missing.length) break;
          for (const key of missing) value[key] = this.#resolver.defaultFor(this.#resolver.propertySchema(eff, key).schema);
        }
        this.#expanded.set(pointer, true);
        this.#commit({ render: true });
        this.#focusRow(pointer);
        return;
      }
      case 'add-custom': {
        this.#addCustomKey(pointer);
        return;
      }
      case 'cancel-custom': {
        this.#customKeyFor = null;
        this.#render({ focus: { pointer, role: 'add-prop' } });
        return;
      }
      default:
    }
  }

  #addProperty(objectPointer, key) {
    const { eff, value } = this.#effectiveAt(objectPointer);
    if (Object.hasOwn(value, key)) return false;
    value[key] = this.#resolver.defaultFor(this.#resolver.propertySchema(eff, key).schema);
    const child = joinPointer(objectPointer, key);
    this.#expanded.set(child, true);
    this.#commit({ render: true });
    this.#focusRow(child);
    return true;
  }

  #addCustomKey(objectPointer) {
    const row = this.#els.tbody.querySelector(`tr.add[data-pointer="${cssEscape(objectPointer)}"]`);
    const input = row?.querySelector('input[data-role="custom-key"]');
    const hint = row?.querySelector('.add-hint');
    const key = input?.value.trim() ?? '';
    const object = getAt(this.#data, objectPointer);
    if (!key) {
      hint.textContent = 'Schlüssel eingeben.';
      input.focus();
      return;
    }
    if (Object.hasOwn(object, key)) {
      hint.textContent = `„${key}“ gibt es schon.`;
      input.focus();
      return;
    }
    this.#customKeyFor = null;
    this.#addProperty(objectPointer, key);
  }

  #changeType(pointer, choice) {
    const { schema, eff, value } = this.#effectiveAt(pointer);
    let next;
    if (choice.startsWith('variant:')) {
      const variant = eff['x-variants'][Number(choice.slice(8))];
      const types = allowedTypes(this.#resolver.effective(variant, undefined));
      next = this.#resolver.matches(variant, value)
        ? value
        : types.length && typeOfValue(value) !== 'object' && typeOfValue(value) !== 'array'
          ? this.#resolver.convert(value, types[0], variant)
          : this.#resolver.defaultFor(variant);
      if (!this.#resolver.matches(variant, next)) next = this.#resolver.defaultFor(variant);
    } else {
      next = this.#resolver.convert(value, choice, schema);
    }
    this.#set(pointer, next);
    if (isContainer(next)) this.#expanded.set(pointer, true);
    this.#commit({ render: true });
    this.#render({ focus: { pointer, role: 'type' } });
  }

  /* --------------------------------------------------------------- events */

  #onToolbarClick = (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.mode) this.#switchMode(button.dataset.mode);
    else if (button.dataset.action === 'expand-all') this.expandAll();
    else if (button.dataset.action === 'collapse-all') this.collapseAll();
  };

  #onTreeClick = (event) => {
    const button = event.target.closest('button[data-action]');
    if (button) {
      this.#action(button.dataset.action, button.closest('tr').dataset.pointer);
      return;
    }
    // Klick auf die Zusammenfassung eines Containers klappt ihn auf/zu.
    const summary = event.target.closest('.summary');
    if (summary) this.#action('toggle', summary.closest('tr').dataset.pointer);
  };

  /** Tippen: Wert sofort übernehmen, Validierung entprellt, kein Neu-Rendern (Caret bleibt stabil). */
  #onTreeInput = (event) => {
    const control = event.target;
    const role = control.dataset.role;
    if (role === 'custom-key') {
      const hint = control.closest('tr').querySelector('.add-hint');
      if (hint) hint.textContent = '';
      return;
    }
    if (role !== 'string' && role !== 'number') return;
    const pointer = control.closest('tr').dataset.pointer;
    this.#set(pointer, role === 'number' ? this.#parseNumber(control.value) : control.value);
    if (this.#textarea) this.#textarea.value = JSON.stringify(this.#data, null, this.indent);
    this.#scheduleValidation();
  };

  /**
   * Abgeschlossene Änderung: Auswahllisten, Checkboxen, und Textfelder beim
   * Verlassen. Danach wird neu gerendert, weil sich über if/then die
   * angebotenen Felder ändern können.
   */
  #onTreeChange = (event) => {
    const control = event.target;
    const row = control.closest('tr');
    const pointer = row?.dataset.pointer;
    if (pointer === undefined) return;
    switch (control.dataset.role) {
      case 'string':
      case 'number':
        // Nur neu rendern, wenn sich durch den Wert die Struktur ändert
        // (if/then, anyOf-Variante). Sonst würde ein Klick, der das blur
        // ausgelöst hat, auf einem ersetzten Element ins Leere gehen.
        this.#commit({ render: this.#computeShape() !== this.#shape });
        return;
      case 'boolean':
        this.#set(pointer, control.checked);
        this.#commit({ render: true });
        this.#render({ focus: { pointer, role: 'boolean' } });
        return;
      case 'enum': {
        const option = control.selectedOptions[0];
        if (option?.dataset.current === '1') return;
        const { eff } = this.#effectiveAt(pointer);
        const choices = eff.const !== undefined ? [eff.const] : eff.enum;
        this.#set(pointer, structuredClone(choices[Number(control.value)]));
        this.#commit({ render: true });
        this.#render({ focus: { pointer, role: 'enum' } });
        return;
      }
      case 'type':
        this.#changeType(pointer, control.value);
        return;
      case 'add-prop': {
        const key = control.value;
        control.value = '';
        if (key === '\u0000custom') {
          this.#customKeyFor = pointer;
          this.#render({ focus: { pointer, role: 'custom-key' } });
        } else if (key) {
          this.#addProperty(pointer, key);
        }
        return;
      }
      default:
    }
  };

  #onTreeKeydown = (event) => {
    const control = event.target;
    if (control.dataset.role === 'custom-key') {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.#addCustomKey(control.closest('tr').dataset.pointer);
      } else if (event.key === 'Escape') {
        this.#action('cancel-custom', control.closest('tr').dataset.pointer);
      }
      return;
    }
    // Enter in einem Wertfeld soll nicht das umgebende Formular absenden.
    if (event.key === 'Enter' && (control.dataset.role === 'string' || control.dataset.role === 'number')) {
      event.preventDefault();
      control.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  #onErrorListClick = (event) => {
    const button = event.target.closest('button[data-pointer]');
    if (button) this.reveal(button.dataset.pointer);
  };

  #parseNumber(text) {
    const trimmed = text.trim().replace(',', '.');
    if (!NUMBER_PATTERN.test(trimmed)) return text; // bleibt als String -> sichtbar ungültig
    const n = Number(trimmed);
    if (!Number.isFinite(n)) return text;
    return n; // 1.5 in einem integer-Feld bleibt eine Zahl, der Validator meldet den Typfehler
  }

  #handleFormSubmit(event) {
    if (event.target !== this.#form) return; // Guard: nur das eigene Formular
    if (!this.#resolver) return;              // Fallback ohne Schema: textarea wird normal abgeschickt
    if (this.#mode === 'json' && !this.#pullFromJsonView()) {
      event.preventDefault();
      return;
    }
    const valid = this.validate();
    if (!valid && !this.hasAttribute('allow-invalid')) {
      event.preventDefault();
      if (this.#errors[0]) this.reveal(this.#errors[0].pointer);
      return;
    }
    if (this.#textarea && this.#data !== undefined) this.#textarea.value = JSON.stringify(this.#data);
  }

  /* ------------------------------------------------------------ JSON-Modus */

  #switchMode(mode) {
    if (mode === this.#mode && (mode === 'tree' ? !this.#els.body.hidden : !this.#els.jsonView.hidden)) return;
    if (mode === 'tree') {
      if (this.#els.jsonView.childElementCount && !this.#pullFromJsonView()) return; // bleibt im JSON-Modus
      this.#els.jsonView.replaceChildren();
    } else {
      this.#mountJsonView();
    }
    this.#mode = mode;
    this.#els.body.hidden = mode !== 'tree';
    this.#els.jsonView.hidden = mode !== 'json';
    for (const button of this.#els.toolbar.querySelectorAll('[data-action$="-all"]')) button.hidden = mode !== 'tree';
    for (const button of this.#els.toolbar.querySelectorAll('[data-mode]')) {
      button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    }
    if (mode === 'tree' && this.#resolver) this.#commit({ render: true });
  }

  #mountJsonView() {
    const text = this.#data === undefined
      ? (this.#textarea?.value ?? '')
      : JSON.stringify(this.#data, null, this.indent);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('aria-label', 'JSON');
    textarea.spellcheck = false;
    if (customElements.get('json-editor')) {
      const editor = document.createElement('json-editor');
      editor.setAttribute('indent', String(this.indent));
      editor.append(textarea);
      if (this.#schema) {
        const script = document.createElement('script');
        script.type = 'application/schema+json';
        script.textContent = JSON.stringify(this.#schema);
        editor.append(script);
      }
      this.#els.jsonView.replaceChildren(editor);
    } else {
      this.#els.jsonView.replaceChildren(textarea);
    }
  }

  /** Übernimmt den Inhalt der JSON-Ansicht. false bei Syntaxfehler. */
  #pullFromJsonView() {
    const textarea = this.#els.jsonView.querySelector('textarea');
    if (!textarea) return true;
    const raw = textarea.value.trim();
    try {
      this.#data = raw ? JSON.parse(raw) : this.#resolver?.defaultFor(this.#schema);
      return true;
    } catch (error) {
      this.#setStatus(`JSON-Syntaxfehler: ${error.message}`, 'error');
      textarea.focus();
      return false;
    }
  }

  /* ------------------------------------------------------------- Rendering */

  #isExpanded(pointer, value) {
    if (this.#expanded.has(pointer)) return this.#expanded.get(pointer);
    return splitPointer(pointer).length <= this.expandDepth;
  }

  #walk(value, pointer, visit) {
    visit(value, pointer);
    if (!isContainer(value)) return;
    for (const [key, child] of Object.entries(value)) this.#walk(child, joinPointer(pointer, key), visit);
  }

  /**
   * Strukturabdruck: welche Container es gibt, welche Felder ihr effektives
   * Schema anbietet/verlangt und welche Variante gewählt ist. Ändert sich
   * das durch eine Eingabe, muss neu gerendert werden.
   */
  #computeShape() {
    if (!this.#resolver || this.#data === undefined) return '';
    const parts = [];
    const visit = (value, schema, pointer) => {
      const eff = this.#resolver.effective(schema, value);
      parts.push(`${pointer}|${typeOfValue(value)}|${eff['x-variant-index'] ?? ''}`);
      if (!isContainer(value)) return;
      if (Array.isArray(value)) {
        value.forEach((item, i) => visit(item, this.#resolver.itemSchema(eff, i), joinPointer(pointer, i)));
        return;
      }
      parts.push(`${Object.keys(eff.properties ?? {}).join(',')}|${(eff.required ?? []).join(',')}|${this.#resolver.allowsFreeKeys(eff)}`);
      for (const [key, child] of Object.entries(value)) {
        const prop = this.#resolver.propertySchema(eff, key);
        parts.push(`${key}:${prop.declared}`);
        visit(child, prop.schema, joinPointer(pointer, key));
      }
    };
    visit(this.#data, this.#schema, '');
    return parts.join('\n');
  }

  #rowFor(pointer) {
    return this.#els.tbody.querySelector(`tr.row[data-pointer="${cssEscape(pointer)}"]`);
  }

  #focusRow(pointer) {
    const row = this.#rowFor(pointer);
    if (!row) return;
    row.scrollIntoView?.({ block: 'nearest' });
    (row.querySelector('.value input, .value select, .toggle') ?? row.querySelector('button'))?.focus();
  }

  /**
   * Rendert den kompletten Baum neu. Fokus und Caret werden über
   * (pointer, role) wiederhergestellt – entweder aus dem aktuell fokussierten
   * Element oder explizit übergeben.
   */
  #render({ focus = null } = {}) {
    if (!this.#resolver || this.#data === undefined || this.#mode !== 'tree') return;
    const active = this.shadowRoot.activeElement;
    let restore = focus;
    if (!restore && active && this.#els.tbody.contains(active)) {
      restore = {
        pointer: active.closest('tr')?.dataset.pointer,
        role: active.dataset.role ?? active.dataset.action,
        start: active.selectionStart,
        end: active.selectionEnd,
      };
    }

    const rows = [];
    const rootEff = this.#resolver.effective(this.#schema, this.#data);
    if (isContainer(this.#data)) {
      this.#renderChildren(rows, this.#data, rootEff, '', 0);
    } else {
      this.#renderNode(rows, { value: this.#data, schema: this.#schema, pointer: '', label: ROOT_LABEL, level: 0 });
    }
    this.#els.tbody.innerHTML = rows.join('');
    this.#shape = this.#computeShape();
    this.#decorate();

    if (restore?.pointer !== undefined) {
      const row = this.#els.tbody.querySelector(`tr[data-pointer="${cssEscape(restore.pointer)}"]${restore.role === 'custom-key' || restore.role === 'add-prop' ? '.add' : '.row'}`);
      const target = row?.querySelector(`[data-role="${restore.role}"], [data-action="${restore.role}"]`)
        ?? row?.querySelector('input, select, button');
      if (target) {
        target.focus();
        if (typeof restore.start === 'number' && 'setSelectionRange' in target) {
          try { target.setSelectionRange(restore.start, restore.end); } catch { /* z.B. type=checkbox */ }
        }
      }
    }
  }

  #renderChildren(rows, value, eff, pointer, level) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        this.#renderNode(rows, {
          value: item,
          schema: this.#resolver.itemSchema(eff, index),
          pointer: joinPointer(pointer, index),
          label: String(index),
          isIndex: true,
          level,
          index,
          count: value.length,
        });
      });
      rows.push(`<tr class="add" data-pointer="${escapeHtml(pointer)}" style="--level:${level}">
        <td class="key" colspan="4"><button type="button" data-action="add-item">${ICON.plus}Eintrag hinzufügen</button></td>
      </tr>`);
      return;
    }

    const required = new Set(eff.required ?? []);
    for (const [key, child] of Object.entries(value)) {
      const prop = this.#resolver.propertySchema(eff, key);
      this.#renderNode(rows, {
        value: child,
        schema: prop.schema,
        pointer: joinPointer(pointer, key),
        label: key,
        level,
        required: required.has(key),
        undeclared: !prop.declared,
        forbidden: prop.forbidden,
      });
    }
    rows.push(this.#renderAddProperty(value, eff, pointer, level, required));
  }

  #renderAddProperty(value, eff, pointer, level, required) {
    const missing = Object.keys(eff.properties ?? {}).filter((key) => !Object.hasOwn(value, key));
    const free = this.#resolver.allowsFreeKeys(eff);
    if (!missing.length && !free) return '';

    if (this.#customKeyFor === pointer) {
      return `<tr class="add" data-pointer="${escapeHtml(pointer)}" style="--level:${level}">
        <td class="key" colspan="4"><div class="add-inline">
          <input type="text" data-role="custom-key" placeholder="neuer_schluessel" aria-label="Neuer Schlüssel">
          <button type="button" data-action="add-custom">${ICON.plus}Hinzufügen</button>
          <button type="button" data-action="cancel-custom">Abbrechen</button>
          <span class="add-hint" role="alert"></span>
        </div></td>
      </tr>`;
    }

    missing.sort((a, b) => Number(required.has(b)) - Number(required.has(a)));
    const options = missing.map((key) => {
      const title = this.#resolver.deref(eff.properties[key])?.title;
      const label = `${key}${required.has(key) ? ' *' : ''}${title ? ` – ${title}` : ''}`;
      return `<option value="${escapeHtml(key)}">${escapeHtml(label)}</option>`;
    }).join('');
    return `<tr class="add" data-pointer="${escapeHtml(pointer)}" style="--level:${level}">
      <td class="key" colspan="2"><select data-role="add-prop" aria-label="Eigenschaft hinzufügen">
        <option value="">+ Eigenschaft hinzufügen …</option>${options}
        ${free ? '<option value="\u0000custom">Eigener Schlüssel …</option>' : ''}
      </select></td><td></td><td></td>
    </tr>`;
  }

  #renderNode(rows, node) {
    const { value, schema, pointer, label, level } = node;
    const eff = this.#resolver.effective(schema, value);
    const container = isContainer(value);
    const expanded = container && this.#isExpanded(pointer, value);
    const description = eff.description ?? eff.title ?? '';

    const toggle = container
      ? `<button type="button" class="toggle" data-action="toggle" aria-expanded="${expanded}" aria-label="${expanded ? 'Zuklappen' : 'Aufklappen'}: ${escapeHtml(label)}">${ICON.chevron}</button>`
      : '<span class="toggle-spacer"></span>';
    const keyLabel = node.isIndex ? `<span class="index">${escapeHtml(label)}</span>` : escapeHtml(label);
    const flags = `${node.required ? '<span class="req" title="Pflichtfeld">*</span>' : ''}${
      node.undeclared ? `<span class="unknown">${node.forbidden ? 'nicht erlaubt' : 'nicht im Schema'}</span>` : ''}`;

    rows.push(`<tr class="row" data-pointer="${escapeHtml(pointer)}" style="--level:${level}" aria-level="${level + 1}">
      <td class="key" title="${escapeHtml(description || label)}">${toggle}${keyLabel}${flags}</td>
      <td class="value">${this.#renderValue(value, eff, container, label)}</td>
      <td class="type">${this.#renderType(value, eff, label)}</td>
      <td class="actions">${this.#renderActions(node)}</td>
    </tr>`);

    if (container && expanded) this.#renderChildren(rows, value, eff, pointer, level + 1);
  }

  #renderValue(value, eff, container, label) {
    const name = escapeHtml(label);
    if (container) {
      const size = Array.isArray(value) ? value.length : Object.keys(value).length;
      const count = Array.isArray(value)
        ? `${size} ${size === 1 ? 'Eintrag' : 'Einträge'}`
        : `${size} ${size === 1 ? 'Feld' : 'Felder'}`;
      return `<div class="summary"><span class="pill">${count}</span><span class="text">${escapeHtml(this.#summarize(value, eff))}</span><span class="badge" aria-live="polite"></span></div>`;
    }

    // Bei anyOf/oneOf mit einer const-Variante (z.B. "" | uri) nicht auf eine
    // Auswahlliste festnageln, solange eine andere Variante freie Eingabe erlaubt.
    const variants = eff['x-variants'];
    const freeVariant = Array.isArray(variants) && variants.some((v) => v.const === undefined && !Array.isArray(v.enum));
    const choices = freeVariant ? null : eff.const !== undefined ? [eff.const] : Array.isArray(eff.enum) ? eff.enum : null;
    if (choices) {
      const currentIndex = choices.findIndex((choice) => JSON.stringify(choice) === JSON.stringify(value));
      const options = choices.map((choice, i) => `<option value="${i}"${i === currentIndex ? ' selected' : ''}>${escapeHtml(typeof choice === 'string' ? choice : JSON.stringify(choice))}</option>`).join('');
      const invalid = currentIndex === -1
        ? `<option data-current="1" selected>${escapeHtml(JSON.stringify(value))} (ungültig)</option>`
        : '';
      return `<select data-role="enum" aria-label="${name}">${invalid}${options}</select>`;
    }

    const kind = this.#primitiveKind(value, eff);
    if (kind === 'null') return '<span class="pill">null</span>';
    if (kind === 'boolean') {
      return `<input type="checkbox" data-role="boolean" aria-label="${name}"${value === true ? ' checked' : ''}>`;
    }
    const placeholder = eff.examples?.[0] ?? eff.default;
    const ph = placeholder !== undefined && typeof placeholder !== 'object' ? ` placeholder="${escapeHtml(placeholder)}"` : '';
    if (kind === 'number' || kind === 'integer') {
      return `<input type="text" inputmode="decimal" class="mono" data-role="number" data-integer="${kind === 'integer' ? 1 : 0}" aria-label="${name}" value="${escapeHtml(value ?? '')}"${ph}>`;
    }
    const inputType = { uri: 'url', email: 'email' }[eff.format] ?? 'text';
    const mono = eff.format || eff.pattern ? ' class="mono"' : '';
    return `<input type="${inputType}" data-role="string"${mono} aria-label="${name}" value="${escapeHtml(value ?? '')}"${ph} spellcheck="false">`;
  }

  /** Welches Eingabeelement bekommt ein primitiver Wert? Vorrang hat der Schema-Typ, damit ungültige Zwischenstände (String im Zahlenfeld) editierbar bleiben. */
  #primitiveKind(value, eff) {
    const types = allowedTypes(eff).filter((type) => type !== 'object' && type !== 'array');
    const actual = typeOfValue(value);
    if (value === null && (types.includes('null') || !types.length)) return 'null';
    if (types.some((type) => valueMatchesType(value, type))) return actual === 'integer' && types.includes('number') ? 'number' : actual;
    const preferred = types.find((type) => type !== 'null');
    if (preferred) return preferred;
    return actual === 'integer' ? 'number' : actual;
  }

  #renderType(value, eff, label) {
    const actual = typeOfValue(value);
    const variants = eff['x-variants'];
    if (Array.isArray(variants) && variants.length > 1) {
      const options = variants.map((variant, i) => {
        const text = variantLabel(variant, i);
        return `<option value="variant:${i}"${i === eff['x-variant-index'] ? ' selected' : ''}>${escapeHtml(text)}</option>`;
      }).join('');
      return `<select data-role="type" aria-label="Variante von ${escapeHtml(label)}">${options}</select>`;
    }

    let types = allowedTypes(eff);
    const any = types.length === 0;
    if (any) types = ['string', 'number', 'boolean', 'object', 'array', 'null'];
    const matching = types.find((type) => valueMatchesType(value, type));
    // Zwischenstand wie "6x" im integer-Feld: das Eingabefeld bleibt passend,
    // die Typ-Spalte zeigt nur den Soll-Typ – die Meldung steht an der Zeile.
    const primitiveMismatch = !matching && !isContainer(value) && !['object', 'array'].includes(types[0]);
    if (types.length === 1 && (matching || primitiveMismatch)) {
      return escapeHtml(eff.format ? `${types[0]} · ${eff.format}` : eff.enum ? 'enum' : types[0]);
    }
    const options = types.map((type) => `<option value="${type}"${type === matching ? ' selected' : ''}>${type}</option>`).join('');
    const current = matching ? '' : `<option selected disabled>${actual} (ungültig)</option>`;
    return `<select data-role="type" aria-label="Typ von ${escapeHtml(label)}">${current}${options}</select>`;
  }

  #renderActions(node) {
    const buttons = [];
    if (node.isIndex) {
      if (node.index > 0) buttons.push(`<button type="button" data-action="up" title="Nach oben" aria-label="Eintrag ${node.index} nach oben">${ICON.up}</button>`);
      if (node.index < node.count - 1) buttons.push(`<button type="button" data-action="down" title="Nach unten" aria-label="Eintrag ${node.index} nach unten">${ICON.down}</button>`);
      buttons.push(`<button type="button" data-action="duplicate" title="Duplizieren" aria-label="Eintrag ${node.index} duplizieren">${ICON.copy}</button>`);
      buttons.push(`<button type="button" data-action="remove" title="Entfernen" aria-label="Eintrag ${node.index} entfernen">${ICON.trash}</button>`);
    } else if (node.pointer !== '' && !node.required) {
      buttons.push(`<button type="button" data-action="remove" title="Entfernen" aria-label="${escapeHtml(node.label)} entfernen">${ICON.trash}</button>`);
    }
    return buttons.join('');
  }

  /**
   * Kurzbeschreibung eines Containers. Das Schema kann die Felder per
   * "x-summary": ["type", "domain"] vorgeben; sonst werden typische
   * Namensfelder bevorzugt und mit den ersten weiteren Textwerten auf zwei
   * Angaben aufgefüllt.
   */
  #summarize(value, eff = {}) {
    if (Array.isArray(value)) {
      return value.filter((item) => typeof item === 'string' && item.trim()).slice(0, 3).join(', ');
    }
    const texts = [];
    const add = (child) => {
      if (texts.length >= 2) return;
      if (typeof child === 'string' && child.trim()) texts.push(child.trim());
      else if (typeof child === 'number') texts.push(String(child));
    };
    if (Array.isArray(eff['x-summary'])) {
      for (const key of eff['x-summary']) add(value[key]);
      return texts.join(', ');
    }
    const preferred = SUMMARY_KEYS.filter((key) => Object.hasOwn(value, key));
    for (const key of preferred) add(value[key]);
    for (const [key, child] of Object.entries(value)) {
      if (!preferred.includes(key) && typeof child === 'string') add(child);
    }
    return texts.join(', ');
  }

  /**
   * Fehler an die gerenderten Zeilen hängen, ohne neu zu rendern:
   * Zeilenmarkierung, Meldungszeile darunter, Fehlerzähler an zugeklappten
   * Containern, Status und Fehlerliste.
   */
  #decorate() {
    const byPointer = new Map();
    const nested = new Map();
    for (const error of this.#errors) {
      if (!byPointer.has(error.pointer)) byPointer.set(error.pointer, []);
      byPointer.get(error.pointer).push(error.message);
      const tokens = splitPointer(error.pointer);
      let ancestor = '';
      for (const token of tokens.slice(0, -1)) {
        ancestor = joinPointer(ancestor, token);
        nested.set(ancestor, (nested.get(ancestor) ?? 0) + 1);
      }
      if (tokens.length) nested.set('', (nested.get('') ?? 0) + 1);
    }

    const tbody = this.#els.tbody;
    for (const old of tbody.querySelectorAll('tr.msg')) old.remove();
    const shown = new Set();
    for (const row of tbody.querySelectorAll('tr.row')) {
      const pointer = row.dataset.pointer;
      const messages = byPointer.get(pointer);
      row.classList.toggle('invalid', Boolean(messages));
      for (const control of row.querySelectorAll('.value input, .value select')) {
        if (messages) control.setAttribute('aria-invalid', 'true');
        else control.removeAttribute('aria-invalid');
      }
      const summaryText = row.querySelector('.summary .text');
      if (summaryText) {
        const { eff, value } = this.#effectiveAt(pointer);
        summaryText.textContent = this.#summarize(value ?? {}, eff);
      }
      const badge = row.querySelector('.badge');
      if (badge) {
        const collapsed = row.querySelector('.toggle')?.getAttribute('aria-expanded') === 'false';
        const count = collapsed ? (nested.get(pointer) ?? 0) : 0;
        badge.textContent = count ? `${count} Fehler` : '';
      }
      if (messages) {
        shown.add(pointer);
        const msg = document.createElement('tr');
        msg.className = 'msg';
        msg.dataset.pointer = pointer;
        msg.style.setProperty('--level', row.style.getPropertyValue('--level'));
        const id = `msg-${Math.random().toString(36).slice(2, 9)}`;
        const fill = this.#errors.some((e) => e.pointer === pointer && e.keyword === 'required')
          ? `<button type="button" data-action="fill-required">${ICON.plus}Fehlende Pflichtfelder ergänzen</button>`
          : '';
        msg.innerHTML = `<td colspan="4" id="${id}"><ul>${messages.map((m) => `<li>${escapeHtml(m)}</li>`).join('')}</ul>${fill}</td>`;
        row.after(msg);
        for (const control of row.querySelectorAll('.value input, .value select')) control.setAttribute('aria-describedby', id);
      }
    }

    // Fehlerliste unten: jeder Eintrag springt zur Zeile.
    this.#els.errors.replaceChildren(...this.#errors.map((error) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.pointer = error.pointer;
      const code = document.createElement('code');
      code.textContent = error.pointer || '/';
      button.append(code, ` ${error.message}`);
      li.append(button);
      return li;
    }));

    const count = this.#errors.length;
    if (count) this.#setStatus(`${count} Fehler`, 'error');
    else this.#setStatus('', 'valid');
  }

  #setStatus(text, state = null) {
    const { status, statusIcon, statusText } = this.#els;
    statusIcon.innerHTML = state === 'valid' ? ICON_VALID : state === 'error' ? ICON_INVALID : '';
    statusText.textContent = text || (state === 'valid' ? 'Gültig' : '');
    status.classList.toggle('status-ok', state === 'valid');
    status.classList.toggle('status-error', state === 'error');
  }
}

if (!customElements.get('json-tree-editor')) {
  customElements.define('json-tree-editor', JsonTreeEditor);
}
