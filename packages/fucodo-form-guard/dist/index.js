(() => {
  // packages/fucodo-confirm/style.scss
  var style_default = `:host {
  display: contents;
}

dialog {
  --_bg: var(--fucodo-confirm-bg, var(--bs-body-bg, #fff));
  --_color: var(--fucodo-confirm-color, var(--bs-body-color, #212529));
  --_border: var(--fucodo-confirm-border-color, var(--bs-border-color, #dee2e6));
  --_radius: var(--fucodo-confirm-radius, var(--bs-border-radius-lg, .5rem));
  --_btn-radius: var(--bs-border-radius, .375rem);
  --_focus-ring: var(--fucodo-confirm-focus-ring, 0 0 0 .25rem rgba(13, 110, 253, .25));
  /* Mobile (default): bottom sheet, slides up from the bottom edge */
  --_off: translateY(100%);
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  max-height: calc(100dvh - 1rem);
  margin: auto 0 0;
  padding: 0;
  border: 1px solid var(--bs-border-color-translucent, rgba(0, 0, 0, 0.175));
  border-bottom: 0;
  border-radius: var(--_radius) var(--_radius) 0 0;
  overflow-y: auto;
  background: var(--_bg);
  color: var(--_color);
  font-family: var(--fucodo-confirm-font, inherit);
  font-size: 1rem;
  line-height: 1.5;
  box-shadow: var(--fucodo-confirm-shadow, none);
  opacity: 0;
  transform: var(--_off);
  transition: opacity 0.15s linear, transform 0.3s ease-out, overlay 0.3s allow-discrete, display 0.3s allow-discrete;
}

/* Desktop: centred modal with Bootstrap's ".modal.fade" slide-in from above */
@media (min-width: 576px) {
  dialog {
    --_off: translateY(-50px);
    width: calc(100% - 3.5rem);
    max-width: var(--fucodo-confirm-width, 500px);
    max-height: calc(100dvh - 3.5rem);
    margin: auto;
    border-bottom: 1px solid var(--bs-border-color-translucent, rgba(0, 0, 0, 0.175));
    border-radius: var(--_radius);
  }
}
dialog[open] {
  opacity: 1;
  transform: none;
}

@starting-style {
  dialog[open] {
    opacity: 0;
    transform: var(--_off);
  }
}
dialog::backdrop {
  background: rgba(0, 0, 0, 0);
  transition: background 0.15s linear, overlay 0.3s allow-discrete, display 0.3s allow-discrete;
}

dialog[open]::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

@starting-style {
  dialog[open]::backdrop {
    background: rgba(0, 0, 0, 0);
  }
}
@media (prefers-reduced-motion: reduce) {
  dialog, dialog::backdrop {
    transition: none;
  }
}
*, *::before, *::after {
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--_border);
}

.title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.5;
}

.btn-close {
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  padding: 0.25em;
  margin: -0.5rem -0.5rem -0.5rem auto;
  border: 0;
  border-radius: var(--_btn-radius);
  background: transparent no-repeat center/1em auto;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e");
  filter: var(--bs-btn-close-white-filter, none);
  opacity: 0.5;
  cursor: pointer;
}

.btn-close:hover {
  opacity: 0.75;
}

.btn-close:focus-visible {
  outline: 0;
  box-shadow: var(--_focus-ring);
  opacity: 1;
}

.body {
  padding: 1rem;
}

.message {
  margin: 0;
  white-space: pre-line;
}

.message:empty, .message[hidden] {
  display: none;
}

::slotted([slot=body]) {
  margin: 0;
}

.value-check {
  margin-top: 1rem;
}

.value-check[hidden] {
  display: none;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
}

.label code {
  font-family: var(--bs-font-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace);
  font-size: 0.875em;
  font-weight: 600;
  color: var(--bs-code-color, #d63384);
  word-break: break-all;
}

.input {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font: inherit;
  color: var(--_color);
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: var(--_btn-radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input:focus {
  outline: 0;
  border-color: var(--fucodo-confirm-focus-border, #86b7fe);
  box-shadow: var(--_focus-ring);
}

.footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem;
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
  border-top: 1px solid var(--_border);
}

/* Narrow dialog: stack the buttons full-width */
dialog {
  container: fucodo-confirm-dialog/inline-size;
}

@container fucodo-confirm-dialog (max-width: 480px) {
  .footer {
    flex-direction: column;
    align-items: stretch;
  }
  .footer .btn {
    display: block;
    width: 100%;
  }
}
.btn {
  --_btn-bg: var(--bs-success, #198754);
  --_btn-color: #fff;
  display: inline-block;
  padding: 0.375rem 0.75rem;
  font: inherit;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  color: var(--_btn-color);
  background: var(--_btn-bg);
  border: 1px solid var(--_btn-bg);
  border-radius: var(--_btn-radius);
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--_btn-bg) 85%, #000);
  border-color: color-mix(in srgb, var(--_btn-bg) 80%, #000);
}

.btn:focus-visible {
  outline: 0;
  box-shadow: 0 0 0 0.25rem color-mix(in srgb, var(--_btn-bg) 50%, transparent);
}

.btn:disabled {
  opacity: 0.65;
  cursor: default;
  pointer-events: none;
}

/* confirm button variants */
.btn[data-variant=success] {
  --_btn-bg: var(--fucodo-confirm-success, var(--bs-success, #198754));
}

.btn[data-variant=danger] {
  --_btn-bg: var(--fucodo-confirm-danger, var(--bs-danger, #dc3545));
}

.btn[data-variant=neutral] {
  --_btn-bg: var(--fucodo-confirm-neutral, var(--bs-dark, #212529));
}

/* cancel button */
.btn[data-variant=cancel] {
  --_btn-bg: var(--fucodo-confirm-cancel, var(--bs-secondary, #6c757d));
}`;

  // packages/fucodo-confirm/confirm-dialog.js
  var DIALOG_PARTS = "dialog, content, header, title, close, body, message, label, input, footer, cancel-button, confirm-button";
  var VARIANTS = Object.freeze(["success", "danger", "neutral"]);
  var DEFAULTS = Object.freeze({
    title: "Bitte best\xE4tigen",
    message: "Soll diese Aktion wirklich ausgef\xFChrt werden?",
    confirmLabel: "Best\xE4tigen",
    cancelLabel: "Abbrechen",
    closeLabel: "Schlie\xDFen",
    variant: "success",
    confirmValue: null,
    valueLabel: "Zur Best\xE4tigung bitte {value} eingeben:",
    staticBackdrop: false
  });
  var CONFIRMATIONS_KEY = /* @__PURE__ */ Symbol.for("fucodo-confirm.confirmations");
  var confirmations = globalThis[CONFIRMATIONS_KEY] ??= /* @__PURE__ */ new WeakMap();
  function confirmedBy(event) {
    return confirmations.get(event) ?? /* @__PURE__ */ new Set();
  }
  function markConfirmed(event, tokens) {
    confirmations.set(event, new Set(tokens));
  }
  function replayClick(target, originalEvent, token) {
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window,
      ctrlKey: originalEvent?.ctrlKey ?? false,
      shiftKey: originalEvent?.shiftKey ?? false,
      altKey: originalEvent?.altKey ?? false,
      metaKey: originalEvent?.metaKey ?? false,
      button: originalEvent?.button ?? 0,
      detail: originalEvent?.detail ?? 1
    });
    markConfirmed(event, [...originalEvent?.tokens ?? confirmedBy(originalEvent ?? {}), token]);
    return target.dispatchEvent(event);
  }
  function snapshotClick(event) {
    return {
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      metaKey: event.metaKey,
      button: event.button,
      detail: event.detail,
      tokens: [...confirmedBy(event)]
    };
  }
  var template = document.createElement("template");
  template.innerHTML = /* html */
  `
<style>${style_default}</style>

<dialog part="dialog" role="alertdialog" aria-modal="true" aria-labelledby="title" aria-describedby="body">
  <form part="content" class="content" novalidate>
    <header part="header" class="header">
      <h5 id="title" part="title" class="title"></h5>
      <button type="button" part="close" class="btn-close" data-action="cancel"></button>
    </header>
    <div id="body" part="body" class="body">
      <p part="message" class="message"></p>
      <slot name="body"></slot>
      <div class="value-check" hidden>
        <label for="value-input" part="label" class="label"></label>
        <input id="value-input" part="input" class="input" type="text"
               autocomplete="off" autocapitalize="off" spellcheck="false">
      </div>
    </div>
    <footer part="footer" class="footer">
      <button type="button" part="cancel-button" class="btn" data-variant="cancel" data-action="cancel"></button>
      <button type="submit" part="confirm-button" class="btn" data-action="confirm"></button>
    </footer>
  </form>
</dialog>
`;
  var ConfirmDialog = class _ConfirmDialog extends HTMLElement {
    /** @type {HTMLDialogElement} */
    #dialog;
    #els;
    #config = null;
    #resolve = null;
    #pending = null;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.append(template.content.cloneNode(true));
      this.#dialog = root.querySelector("dialog");
      this.#els = {
        form: root.querySelector("form"),
        title: root.querySelector(".title"),
        close: root.querySelector(".btn-close"),
        message: root.querySelector(".message"),
        bodySlot: root.querySelector('slot[name="body"]'),
        valueCheck: root.querySelector(".value-check"),
        label: root.querySelector(".label"),
        input: root.querySelector(".input"),
        cancel: root.querySelector('[part="cancel-button"]'),
        confirm: root.querySelector('[part="confirm-button"]')
      };
      this.#els.form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.#isValid()) this.#finish(true);
      });
      root.querySelectorAll('[data-action="cancel"]').forEach(
        (btn) => btn.addEventListener("click", () => this.#finish(false))
      );
      this.#els.input.addEventListener("input", () => this.#updateConfirmState());
      this.#dialog.addEventListener("cancel", (e) => {
        e.preventDefault();
        this.#finish(false);
      });
      this.#dialog.addEventListener("click", (e) => {
        if (e.target === this.#dialog && !this.#config?.staticBackdrop) this.#finish(false);
      });
    }
    disconnectedCallback() {
      this.#finish(false);
    }
    get open() {
      return this.#dialog.open;
    }
    /**
     * Show the dialog. Resolves true (confirmed) or false (cancelled/closed).
     * While open, further calls return the same pending promise.
     * @returns {Promise<boolean>}
     */
    show(options = {}) {
      if (this.#resolve) return this.#pending;
      const config = _ConfirmDialog.normalize(options);
      this.#config = config;
      this.#render(config);
      this.#pending = new Promise((resolve) => {
        this.#resolve = resolve;
      });
      this.#dialog.showModal();
      (config.confirmValue ? this.#els.input : this.#els.cancel).focus();
      return this.#pending;
    }
    /** Close programmatically. */
    close(result = false) {
      this.#finish(Boolean(result));
    }
    /** Merge options with defaults, dropping null/undefined and invalid variants. */
    static normalize(options = {}) {
      const config = { ...DEFAULTS };
      for (const [key, value] of Object.entries(options)) {
        if (value !== void 0 && value !== null && key in DEFAULTS) config[key] = value;
      }
      if (!VARIANTS.includes(config.variant)) config.variant = DEFAULTS.variant;
      config.confirmValue = config.confirmValue ? String(config.confirmValue) : null;
      config.staticBackdrop = Boolean(config.staticBackdrop);
      return config;
    }
    /** Programmatic window.confirm replacement. */
    static confirm(options = {}) {
      const el = document.createElement(_ConfirmDialog.tagName);
      document.body.append(el);
      return el.show(options).finally(() => {
        setTimeout(() => el.remove(), 350);
      });
    }
    #hasBodyContent() {
      return this.#els.bodySlot.assignedNodes({ flatten: true }).some((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim() !== "");
    }
    #render(config) {
      const { title, message, valueCheck, label, input, cancel, confirm, close } = this.#els;
      title.textContent = config.title;
      message.textContent = config.message;
      message.hidden = this.#hasBodyContent();
      close.setAttribute("aria-label", config.closeLabel);
      cancel.textContent = config.cancelLabel;
      confirm.textContent = config.confirmLabel;
      confirm.dataset.variant = config.variant;
      input.value = "";
      valueCheck.hidden = !config.confirmValue;
      if (config.confirmValue) {
        const [before, ...rest] = String(config.valueLabel).split("{value}");
        const code = document.createElement("code");
        code.textContent = config.confirmValue;
        label.replaceChildren(before, ...rest.length ? [code, rest.join(config.confirmValue)] : [" ", code]);
        input.setAttribute("placeholder", config.confirmValue);
      }
      this.#updateConfirmState();
    }
    #isValid() {
      const expected = this.#config?.confirmValue;
      return !expected || this.#els.input.value === expected;
    }
    #updateConfirmState() {
      this.#els.confirm.disabled = !this.#isValid();
    }
    #finish(result) {
      if (!this.#resolve) return;
      const resolve = this.#resolve;
      this.#resolve = this.#pending = null;
      if (this.#dialog.open) this.#dialog.close();
      this.#els.input.value = "";
      resolve(result);
    }
    static tagName = "fucodo-confirm-dialog";
  };
  if (!customElements.get(ConfirmDialog.tagName)) {
    customElements.define(ConfirmDialog.tagName, ConfirmDialog);
  }

  // packages/fucodo-form-guard/style.scss
  var style_default2 = `:host {
  display: contents;
}`;

  // packages/fucodo-form-guard/confirm-leave.js
  var DEFAULTS2 = Object.freeze({
    title: "Ungespeicherte \xC4nderungen",
    message: "Es gibt ungespeicherte \xC4nderungen. Beim Verlassen der Seite gehen sie verloren.",
    confirmLabel: "Seite verlassen",
    cancelLabel: "Auf der Seite bleiben",
    variant: "danger"
  });
  var SKIP_INPUT_TYPES = /* @__PURE__ */ new Set(["submit", "button", "reset", "image"]);
  var SKIP_TAGS = /* @__PURE__ */ new Set(["FIELDSET", "OUTPUT", "OBJECT", "BUTTON"]);
  var SAME_WINDOW_TARGETS = /* @__PURE__ */ new Set(["", "_self", "_top", "_parent"]);
  var REARM_EVENTS = ["pointerdown", "keydown"];
  var template2 = document.createElement("template");
  template2.innerHTML = /* html */
  `
<style>${style_default2}</style>
<${ConfirmDialog.tagName} exportparts="${DIALOG_PARTS}"><slot name="body" slot="body"></slot></${ConfirmDialog.tagName}>
`;
  var ConfirmLeave = class _ConfirmLeave extends HTMLElement {
    static observedAttributes = ["forms", "dirty", "disabled", "no-native-prompt"];
    /** @type {ConfirmDialog} */
    #dialog;
    /** @type {Set<HTMLFormElement>} */
    #forms = /* @__PURE__ */ new Set();
    /** @type {WeakMap<Element, string>} */
    #baselines = /* @__PURE__ */ new WeakMap();
    /** @type {Set<HTMLFormElement>} */
    #dirtyForms = /* @__PURE__ */ new Set();
    #observer = null;
    #bypass = false;
    #leaving = false;
    #asking = false;
    #wasDirty = false;
    #nativePromptActive = false;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.append(template2.content.cloneNode(true));
      this.#dialog = root.querySelector(ConfirmDialog.tagName);
    }
    connectedCallback() {
      document.addEventListener("click", this.#onClick, true);
      document.addEventListener("submit", this.#onSubmit, true);
      document.addEventListener("input", this.#onFieldEvent, true);
      document.addEventListener("change", this.#onFieldEvent, true);
      document.addEventListener("reset", this.#onReset, true);
      window.addEventListener("pageshow", this.#onPageShow);
      window.navigation?.addEventListener("navigate", this.#onNavigate);
      this.#observer = new MutationObserver(this.#onMutations);
      this.#observer.observe(document.documentElement, { childList: true, subtree: true });
      this.#scan(document);
      this.#update();
    }
    disconnectedCallback() {
      document.removeEventListener("click", this.#onClick, true);
      document.removeEventListener("submit", this.#onSubmit, true);
      document.removeEventListener("input", this.#onFieldEvent, true);
      document.removeEventListener("change", this.#onFieldEvent, true);
      document.removeEventListener("reset", this.#onReset, true);
      window.removeEventListener("pageshow", this.#onPageShow);
      this.#rearm();
      window.navigation?.removeEventListener("navigate", this.#onNavigate);
      this.#observer?.disconnect();
      this.#setNativePrompt(false);
      for (const form of this.#forms) form.removeAttribute("data-dirty");
      this.#forms.clear();
      this.#dirtyForms.clear();
    }
    attributeChangedCallback(name) {
      if (!this.isConnected) return;
      if (name === "forms") {
        for (const form of this.#forms) form.removeAttribute("data-dirty");
        this.#forms.clear();
        this.#scan(document);
      }
      this.#update();
    }
    // ---- public API ---------------------------------------------------------
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(v) {
      this.toggleAttribute("disabled", Boolean(v));
    }
    get isDirty() {
      return !this.disabled && (this.hasAttribute("dirty") || this.#dirtyForms.size > 0);
    }
    get dirtyForms() {
      return [...this.#dirtyForms];
    }
    /** Fields whose value differs from their baseline (all dirty forms, or one form). */
    dirtyFields(form = null) {
      const forms = form ? [form] : this.dirtyForms;
      return forms.flatMap((f) => this.#fields(f).filter(
        (el) => this.#baselines.has(el) && this.#baselines.get(el) !== this.#serialize(el)
      ));
    }
    /** Take the current values as the new baseline (all forms, or one form). */
    markClean(form = null) {
      const forms = form ? [form] : [...this.#forms];
      for (const f of forms) this.#snapshot(f, true);
      if (!form) this.removeAttribute("dirty");
      this.#update();
    }
    markDirty() {
      this.setAttribute("dirty", "");
    }
    // ---- form tracking ------------------------------------------------------
    get #formSelector() {
      return this.getAttribute("forms") || "form";
    }
    #scan(root) {
      const selector = this.#formSelector;
      const candidates = [];
      if (root instanceof HTMLFormElement && root.matches(selector)) candidates.push(root);
      root.querySelectorAll?.(selector).forEach((f) => candidates.push(f));
      for (const form of candidates) {
        if (!(form instanceof HTMLFormElement) || this.#forms.has(form)) continue;
        this.#forms.add(form);
        this.#snapshot(form);
      }
    }
    #fields(form) {
      return [...form.elements].filter((el) => {
        if (SKIP_TAGS.has(el.tagName)) return false;
        if (el instanceof HTMLInputElement && SKIP_INPUT_TYPES.has(el.type)) return false;
        return !el.closest("[data-leave-ignore]");
      });
    }
    #serialize(el) {
      if (el instanceof HTMLInputElement) {
        if (el.type === "checkbox" || el.type === "radio") return el.checked ? "1" : "0";
        if (el.type === "file") return [...el.files ?? []].map((f) => `${f.name}:${f.size}`).join("|");
        return el.value;
      }
      if (el instanceof HTMLSelectElement) return [...el.options].map((o) => o.selected ? "1" : "0").join("");
      return "value" in el ? String(el.value ?? "") : "";
    }
    /** Record baselines for fields that don't have one yet (or all, if forced). */
    #snapshot(form, force = false) {
      for (const el of this.#fields(form)) {
        if (force || !this.#baselines.has(el)) this.#baselines.set(el, this.#serialize(el));
      }
    }
    #isFormDirty(form) {
      let dirty = false;
      for (const el of this.#fields(form)) {
        if (!this.#baselines.has(el)) {
          this.#baselines.set(el, this.#serialize(el));
          continue;
        }
        if (this.#baselines.get(el) !== this.#serialize(el)) dirty = true;
      }
      return dirty;
    }
    #update() {
      for (const form of this.#forms) {
        const dirty2 = form.isConnected && this.#isFormDirty(form);
        if (dirty2) this.#dirtyForms.add(form);
        else this.#dirtyForms.delete(form);
        form.toggleAttribute("data-dirty", dirty2);
      }
      const dirty = this.isDirty;
      this.#setNativePrompt(dirty && !this.#leaving && !this.hasAttribute("no-native-prompt"));
      if (dirty !== this.#wasDirty) {
        this.#wasDirty = dirty;
        this.dispatchEvent(new CustomEvent(`${_ConfirmLeave.tagName}:dirtychange`, {
          bubbles: true,
          detail: { dirty, forms: this.dirtyForms }
        }));
      }
    }
    #onMutations = (records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) this.#scan(node);
        }
      }
      for (const form of this.#forms) {
        if (!form.isConnected) {
          this.#forms.delete(form);
          this.#dirtyForms.delete(form);
        } else {
          this.#snapshot(form);
        }
      }
      this.#update();
    };
    #onFieldEvent = (event) => {
      const el = event.target;
      const form = el?.form ?? el?.closest?.("form");
      if (form && this.#forms.has(form)) this.#update();
    };
    #onReset = (event) => {
      if (this.#forms.has(event.target)) setTimeout(() => this.#update());
    };
    #onPageShow = (event) => {
      if (event.persisted) this.#rearm();
    };
    // ---- native fallback ----------------------------------------------------
    #setNativePrompt(on) {
      if (on === this.#nativePromptActive) return;
      this.#nativePromptActive = on;
      if (on) window.addEventListener("beforeunload", this.#onBeforeUnload);
      else window.removeEventListener("beforeunload", this.#onBeforeUnload);
    }
    #onBeforeUnload = (event) => {
      if (this.#leaving || this.#bypass) return;
      this.#update();
      if (!this.isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    // ---- interception -------------------------------------------------------
    #shouldGuard() {
      if (this.#bypass || this.#leaving || this.disabled) return false;
      this.#update();
      return this.isDirty;
    }
    #isAllowed(el) {
      if (!el) return false;
      if (el.hasAttribute("data-leave-allow")) return true;
      const selector = this.getAttribute("allow");
      return Boolean(selector && el.matches(selector));
    }
    #onClick = (event) => {
      if (event.defaultPrevented || confirmedBy(event).has(this)) return;
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const path = event.composedPath();
      const link = path.find((n) => n instanceof Element && n.matches("a[href], area[href]"));
      if (!link) return;
      if (path.some((n) => n !== this && typeof n?.interceptsClick === "function" && n.interceptsClick(event))) return;
      if (!this.#shouldGuard()) return;
      if (link.hasAttribute("download")) return;
      const target = (link.getAttribute("target") ?? document.querySelector("base[target]")?.target ?? "").toLowerCase();
      if (!SAME_WINDOW_TARGETS.has(target)) return;
      if (this.#isAllowed(link)) {
        this.#allowLeave();
        return;
      }
      const url = _ConfirmLeave.#parseUrl(link.href);
      const rawHref = link.getAttribute("href") ?? "";
      if (/^(mailto|tel|sms|javascript):/i.test(rawHref)) return;
      if (url && !["http:", "https:", "file:", "about:", "blob:"].includes(url.protocol)) return;
      if (this.#isSameDocument(url, link)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const snapshot = snapshotClick(event);
      this.#ask({ kind: "link", target: link, url: url?.href ?? link.href }, () => {
        this.#bypass = true;
        try {
          replayClick(link, snapshot, this);
        } finally {
          this.#bypass = false;
        }
      });
    };
    static #parseUrl(href) {
      try {
        return new URL(href);
      } catch {
        return null;
      }
    }
    #isSameDocument(url, link) {
      const rawHref = link.getAttribute("href") ?? "";
      if (rawHref.startsWith("#")) return true;
      if (!url) return false;
      const strip = (href) => href.split("#")[0];
      return strip(url.href) === strip(location.href) && url.hash !== "";
    }
    #submitAllowed(form, submitter) {
      if (this.#isAllowed(submitter)) return true;
      const whitelist = form.getAttribute("data-leave-allow-submit") ?? this.getAttribute("allow-submit");
      if (whitelist === null) return true;
      return Boolean(submitter && whitelist && submitter.matches(whitelist));
    }
    #onSubmit = (event) => {
      if (event.defaultPrevented) return;
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const submitter = event.submitter ?? null;
      const method = (submitter?.getAttribute("formmethod") ?? form.getAttribute("method") ?? "").toLowerCase();
      if (method === "dialog") return;
      const target = (submitter?.getAttribute("formtarget") ?? form.getAttribute("target") ?? "").toLowerCase();
      if (!SAME_WINDOW_TARGETS.has(target)) return;
      if (!this.#shouldGuard()) return;
      const allowed = this.#submitAllowed(form, submitter);
      const lost = this.dirtyForms.filter((f) => !(allowed && f === form));
      const forcedDirty = this.hasAttribute("dirty");
      if (allowed && lost.length === 0 && (!forcedDirty || this.#forms.has(form))) {
        this.#allowLeave();
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
      this.#ask({ kind: "submit", target: form, submitter, url: form.action, forms: lost }, () => {
        this.#bypass = true;
        try {
          if (submitter?.isConnected && submitter.form === form) form.requestSubmit(submitter);
          else form.requestSubmit();
        } finally {
          this.#bypass = false;
        }
      });
    };
    #onNavigate = (event) => {
      if (!event.cancelable || event.hashChange || event.downloadRequest != null) return;
      if (event.destination?.sameDocument) return;
      if (!this.#shouldGuard()) return;
      const sourceForm = event.sourceElement instanceof HTMLFormElement ? event.sourceElement : null;
      if (event.formData && !sourceForm) return;
      event.preventDefault();
      const { navigationType, destination } = event;
      const state = (() => {
        try {
          return destination.getState();
        } catch {
          return void 0;
        }
      })();
      this.#ask({ kind: "navigate", target: sourceForm, url: destination.url, navigationType }, () => {
        if (sourceForm) sourceForm.submit();
        else if (navigationType === "traverse") window.navigation.traverseTo(destination.key);
        else if (navigationType === "reload") location.reload();
        else window.navigation.navigate(destination.url, { history: navigationType === "replace" ? "replace" : "push", state });
      });
    };
    // ---- dialog -------------------------------------------------------------
    /**
     * The user confirmed (or the action is whitelisted): let the navigation through
     * and switch the native beforeunload fallback off, so no second prompt appears –
     * however long the browser takes to start unloading.
     * If the page is still here afterwards (download, 204, AJAX save), the guard
     * re-arms on the next user interaction or when the page comes back from bfcache.
     */
    #allowLeave() {
      if (!this.#leaving) {
        for (const type of REARM_EVENTS) window.addEventListener(type, this.#rearm, true);
      }
      this.#leaving = true;
      this.#setNativePrompt(false);
    }
    #rearm = () => {
      if (!this.#leaving) return;
      this.#leaving = false;
      for (const type of REARM_EVENTS) window.removeEventListener(type, this.#rearm, true);
      if (this.isConnected) this.#update();
    };
    #readConfig() {
      const attr = (name, fallback = null) => this.getAttribute(name) ?? fallback;
      return {
        title: attr("dialog-title", DEFAULTS2.title),
        message: attr("message", DEFAULTS2.message),
        confirmLabel: attr("confirm-label", DEFAULTS2.confirmLabel),
        cancelLabel: attr("cancel-label", DEFAULTS2.cancelLabel),
        closeLabel: attr("close-label"),
        variant: attr("variant", DEFAULTS2.variant),
        confirmValue: attr("confirm-value") || null,
        valueLabel: attr("value-label"),
        staticBackdrop: this.hasAttribute("static-backdrop")
      };
    }
    async #ask(info, proceed) {
      if (this.#asking) return;
      const detail = { forms: this.dirtyForms, ...info, config: this.#readConfig() };
      const open = new CustomEvent(`${_ConfirmLeave.tagName}:open`, { bubbles: true, cancelable: true, detail });
      if (!this.dispatchEvent(open)) return;
      this.#asking = true;
      let ok;
      try {
        ok = await this.#dialog.show(detail.config);
      } finally {
        this.#asking = false;
      }
      const focusTarget = info.kind === "submit" ? info.submitter ?? info.target : info.target;
      if (focusTarget?.isConnected) focusTarget.focus?.({ preventScroll: true });
      const result = new CustomEvent(`${_ConfirmLeave.tagName}:${ok ? "confirm" : "cancel"}`, {
        bubbles: true,
        cancelable: ok,
        detail
      });
      if (!this.dispatchEvent(result) || !ok) return;
      this.#allowLeave();
      proceed();
    }
    static tagName = "fucodo-confirm-leave";
  };
  if (!customElements.get(ConfirmLeave.tagName)) {
    customElements.define(ConfirmLeave.tagName, ConfirmLeave);
  }
  var confirm_leave_default = ConfirmLeave;
})();
