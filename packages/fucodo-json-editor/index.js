/**
 * <json-editor>
 *
 * Progressive Enhancement für eine <textarea>, die JSON enthält:
 *  - Ohne JS: normale, funktionierende <textarea> (z.B. in einem <form>)
 *  - Mit JS:  Syntax-Highlighting, Pretty-Print-Darstellung, Live-Validierung
 *             gegen ein JSON-Schema, Fehlerliste, und automatisches
 *             Komprimieren (Minify) beim Speichern bzw. beim Absenden des
 *             umschließenden Formulars.
 *
 * Verwendung:
 *   <json-editor schema-src="/schemas/person.json">
 *     <textarea name="payload">{"name":"Kay"}</textarea>
 *   </json-editor>
 *
 * Bootstrap-Interop: Setzt man die Klasse "form-control" auf den Host
 * (<json-editor class="form-control">), übernimmt die Component intern
 * dieselben Bootstrap-CSS-Variablen wie ein natives <textarea class="form-control">
 * (--bs-body-bg, --bs-border-color, --bs-border-radius, --bs-form-valid-color,
 * --bs-form-invalid-color, --bs-focus-ring-color, ...). Wichtig: CSS Custom
 * Properties vererben sich über die Shadow-DOM-Grenze, echte CSS-Klassen/
 * Selektoren aus bootstrap.css (z.B. ".valid-feedback") aber nicht - deshalb
 * bildet das Shadow-Stylesheet unten das visuelle Verhalten dieser Klassen
 * selbst nach, gespeist aus denselben Bootstrap-Variablen, statt sich auf
 * die externen Bootstrap-Regeln zu verlassen.
 *
 * Zusätzlich spiegelt die Component den Validierungsstatus als echte
 * Bootstrap-Klassen auf den Host selbst (this.classList: "is-valid" /
 * "is-invalid"), damit die Component sich in eine umgebende
 * .was-validated-Formularlogik einfügt.
 *
 * Events (bubbeln, Listener sitzt direkt auf dem Element -> pro Instanz gescoped):
 *   json-editor:valid     detail: { value }      – geparstes JSON ist schema-valide
 *   json-editor:invalid   detail: { errors[] }   – Syntax- oder Schema-Fehler
 *   json-editor:minified  detail: { value }      – nach erfolgreichem minify()
 *
 * Öffentliche API:
 *   .value          get/set – Rohwert der textarea
 *   .format()        – pretty-print (Einrückung via [indent]-Attribut)
 *   .minify()         – komprimiert auf eine Zeile
 *   .validate()       – erzwingt sofortige Validierung, gibt boolean zurück
 *
 * Theming über CSS Custom Properties (Default abseits von .form-control):
 *   --json-editor-height, --json-editor-font, --json-editor-bg,
 *   --json-editor-border, --json-editor-radius, --json-editor-fg,
 *   --json-editor-error, --json-editor-ok,
 *   --json-editor-padding-x, --json-editor-padding-y, --json-editor-line-height,
 *   --json-editor-key, --json-editor-string, --json-editor-number,
 *   --json-editor-keyword, --json-editor-punct
 *
 * Hinweis: Die JSON-Schema-Validierung nutzt @cfworker/json-schema (CSP-safe,
 * kein eval). Der Import ist ein bare specifier (npm-Konvention) – im Browser
 * ohne Bundler per Import Map auflösen, siehe demo/demo.html.
 */
import { Validator } from '@cfworker/json-schema';
import { highlightJson } from './highlight-json.js';
import { prettyPrintJson } from './pretty-print.js';
import style from './style.scss'

// Dieselben Pfade wie Bootstraps eingebettete .is-valid/.is-invalid-Icons
// (form-control Hintergrundgrafiken), hier als inline SVG mit currentColor
// statt fester Hexfarbe, damit sie --json-editor-ok/-error (bzw. bei
// .form-control die Bootstrap-Variablen) mitziehen.
const ICON_VALID =
    '<svg viewBox="0 0 8 8" aria-hidden="true" focusable="false"><path fill="currentColor" d="M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z"/></svg>';
const ICON_INVALID =
    '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="4.5"/><path stroke-linejoin="round" d="M5.8 3.6h.4L6 6.5z"/><circle cx="6" cy="8.2" r=".6" fill="currentColor" stroke="none"/></svg>';

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `<style> ${style}</style>
<div class="editor">
  <div class="toolbar">
    <button type="button" data-action="format">Formatieren</button>
    <button type="button" data-action="minify">Komprimieren</button>
    <span class="status"><span class="status-icon"></span><span class="status-text"></span></span>
  </div>
  <div class="code-area">
    <pre class="highlight" aria-hidden="true"><code></code></pre>
    <slot></slot>
  </div>
</div>
<ul class="errors" role="alert"></ul>
`;

export class Index extends HTMLElement {
  static get observedAttributes() {
    return ['schema-src', 'indent'];
  }

  #textarea = null;
  #highlightCode = null;
  #errorsEl = null;
  #statusEl = null;
  #statusIconEl = null;
  #statusTextEl = null;
  #validator = null;
  #debounceHandle = null;
  #form = null;
  #onFormSubmit = null;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(TEMPLATE.content.cloneNode(true));
    this.#highlightCode = shadow.querySelector('.highlight code');
    this.#errorsEl = shadow.querySelector('.errors');
    this.#statusEl = shadow.querySelector('.status');
    this.#statusIconEl = shadow.querySelector('.status-icon');
    this.#statusTextEl = shadow.querySelector('.status-text');
    shadow.querySelector('[data-action="format"]').addEventListener('click', () => this.format());
    shadow.querySelector('[data-action="minify"]').addEventListener('click', () => this.minify());
  }

  connectedCallback() {
    this.#textarea = this.querySelector('textarea');
    if (!(this.#textarea instanceof HTMLTextAreaElement)) {
      console.warn('<json-editor> benötigt ein <textarea>-Kind als Light-DOM-Inhalt.');
      return;
    }

    this.#loadSchema();

    this.#textarea.addEventListener('input', this.#onInput);
    this.#textarea.addEventListener('blur', this.#onBlur);
    this.#textarea.addEventListener('scroll', this.#onScroll);

    // Initiales Pretty-Print + Highlight, falls der Inhalt bereits gültiges JSON ist
    this.format({ silent: true });
    this.#updateHighlight();
    this.validate();

    // Formular-Guard: closest() bindet den submit-Handler nur an das eigene
    // Formular, damit mehrere <json-editor>-Instanzen auf einer Seite
    // koexistieren können, ohne sich gegenseitig zu triggern.
    this.#form = this.#textarea.closest('form');
    if (this.#form) {
      this.#onFormSubmit = (event) => this.#handleFormSubmit(event);
      this.#form.addEventListener('submit', this.#onFormSubmit);
    }
  }

  disconnectedCallback() {
    this.#textarea?.removeEventListener('input', this.#onInput);
    this.#textarea?.removeEventListener('blur', this.#onBlur);
    this.#textarea?.removeEventListener('scroll', this.#onScroll);

    const form = this.#form;
    const handler = this.#onFormSubmit;
    if (form && handler) {
      const cleanup = () => form.removeEventListener('submit', handler);
      if ('requestIdleCallback' in window) {
        requestIdleCallback(cleanup);
      } else {
        setTimeout(cleanup, 0);
      }
    }
    if (this.#debounceHandle) clearTimeout(this.#debounceHandle);
  }

  attributeChangedCallback(name) {
    if (name === 'schema-src' && this.isConnected) {
      this.#loadSchema();
    }
  }

  get indent() {
    const value = Number(this.getAttribute('indent'));
    return Number.isFinite(value) && value >= 0 ? value : 2;
  }

  get value() {
    return this.#textarea?.value ?? '';
  }

  set value(next) {
    if (!this.#textarea) return;
    this.#textarea.value = next;
    this.format({ silent: true });
    this.#updateHighlight();
    this.validate();
  }

  #onInput = () => {
    this.#updateHighlight();
    if (this.#debounceHandle) clearTimeout(this.#debounceHandle);
    this.#debounceHandle = setTimeout(() => this.validate(), 400);
  };

  #onBlur = () => {
    this.format();
  };

  #onScroll = () => {
    const highlightEl = this.#highlightCode.parentElement;
    highlightEl.scrollTop = this.#textarea.scrollTop;
    highlightEl.scrollLeft = this.#textarea.scrollLeft;
  };

  #updateHighlight() {
    if (!this.#highlightCode || !this.#textarea) return;
    this.#highlightCode.innerHTML = highlightJson(this.#textarea.value);
  }

  async #loadSchema() {
    const src = this.getAttribute('schema-src');
    const inline = this.querySelector('script[type="application/schema+json"]');

    let schema = null;
    try {
      if (src) {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`Schema konnte nicht geladen werden (${response.status})`);
        schema = await response.json();
      } else if (inline) {
        schema = JSON.parse(inline.textContent);
      }
    } catch (error) {
      this.#setStatus(`Schema-Fehler: ${error.message}`, 'error');
      return;
    }

    if (schema) {
      this.#validator = new Validator(schema);
      this.validate();
    }
  }

  /** Pretty-print den aktuellen Inhalt. Bei silent:true keine Fehleranzeige bei Syntaxfehlern. */
  format({ silent = false } = {}) {
    if (!this.#textarea) return false;
    const raw = this.#textarea.value.trim();
    if (!raw) return true;
    try {
      const parsed = JSON.parse(raw);
      this.#textarea.value = prettyPrintJson(parsed, this.indent);
      this.#updateHighlight();
      this.validate();
      return true;
    } catch {
      if (!silent) this.validate(); // zeigt den Syntaxfehler konsistent über die Fehlerliste an
      return false;
    }
  }

  /** Komprimiert den Inhalt auf eine Zeile (Speicherformat). */
  minify() {
    if (!this.#textarea) return false;
    const raw = this.#textarea.value.trim();
    if (!raw) return true;
    try {
      const parsed = JSON.parse(raw);
      this.#textarea.value = JSON.stringify(parsed);
      this.#updateHighlight();
      this.#reflectValidity(true);
      this.#setStatus('Komprimiert.', 'valid');
      this.dispatchEvent(new CustomEvent('json-editor:minified', { detail: { value: this.#textarea.value } }));
      return true;
    } catch (error) {
      this.#reflectValidity(false);
      this.#setStatus(`JSON-Syntaxfehler: ${error.message}`, 'error');
      return false;
    }
  }

  /** Validiert Syntax + Schema, aktualisiert Fehlerliste/[invalid] + is-valid/is-invalid, gibt boolean zurück. */
  validate() {
    if (!this.#textarea) return true;
    const raw = this.#textarea.value.trim();
    this.#clearErrors();

    if (!raw) {
      this.#reflectValidity(true, { neutral: true });
      this.#setStatus('');
      return true;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      this.#reflectValidity(false);
      this.#renderErrors([`Syntaxfehler: ${error.message}`]);
      this.dispatchEvent(new CustomEvent('json-editor:invalid', { detail: { errors: [error.message] } }));
      return false;
    }

    if (!this.#validator) {
      this.#reflectValidity(true);
      this.#setStatus('Kein Schema geladen.', 'valid');
      return true;
    }

    const result = this.#validator.validate(parsed);
    if (result.valid) {
      this.#reflectValidity(true);
      this.#setStatus('', 'valid');
      this.dispatchEvent(new CustomEvent('json-editor:valid', { detail: { value: parsed } }));
      return true;
    }

    const messages = result.errors.map((error) => `${error.instanceLocation || '/'}: ${error.error}`);
    this.#reflectValidity(false);
    this.#renderErrors(messages);
    this.dispatchEvent(new CustomEvent('json-editor:invalid', { detail: { errors: messages } }));
    return false;
  }

  #handleFormSubmit(event) {
    if (event.target !== this.#form) return; // Guard: nur das eigene Formular
    const valid = this.validate();
    if (!valid) {
      event.preventDefault();
      this.#textarea.focus();
      return;
    }
    this.minify();
  }

  /**
   * Spiegelt den Validitätsstatus sowohl intern ([invalid]-Attribut fürs
   * Shadow-Stylesheet) als auch nach außen (is-valid/is-invalid-Klassen auf
   * dem Host, damit die Component sich in Bootstraps .was-validated-Fluss
   * einfügt). Bei neutral:true (z.B. leeres Feld) werden beide Klassen entfernt.
   */
  #reflectValidity(valid, { neutral = false } = {}) {
    this.toggleAttribute('invalid', !valid);
    if (neutral) {
      this.classList.remove('is-valid', 'is-invalid');
      return;
    }
    this.classList.toggle('is-valid', valid);
    this.classList.toggle('is-invalid', !valid);
  }

  #clearErrors() {
    this.#errorsEl.replaceChildren();
  }

  #renderErrors(messages) {
    this.#errorsEl.replaceChildren(
        ...messages.map((message) => {
          const li = document.createElement('li');
          li.textContent = message;
          return li;
        })
    );
    this.#setStatus('', 'error');
  }

  /**
   * state: null (neutral, kein Icon) | 'valid' (grünes Bootstrap-Häkchen) |
   * 'error' (rotes Bootstrap-Ausrufezeichen). Das Icon ersetzt das Wort
   * "Gültig"/"Ungültig"; text ist optionale Zusatzinfo daneben (z.B. "Komprimiert.").
   */
  #setStatus(text, state = null) {
    this.#statusIconEl.innerHTML = state === 'valid' ? ICON_VALID : state === 'error' ? ICON_INVALID : '';
    if (state === 'valid') {
      this.#statusIconEl.setAttribute('role', 'img');
      this.#statusIconEl.setAttribute('aria-label', 'Gültig');
    } else if (state === 'error') {
      this.#statusIconEl.setAttribute('role', 'img');
      this.#statusIconEl.setAttribute('aria-label', 'Ungültig');
    } else {
      this.#statusIconEl.removeAttribute('role');
      this.#statusIconEl.removeAttribute('aria-label');
    }
    this.#statusTextEl.textContent = text;
    this.#statusEl.classList.toggle('status-ok', state === 'valid');
    this.#statusEl.classList.toggle('status-error', state === 'error');
  }
}

customElements.define('json-editor', Index);