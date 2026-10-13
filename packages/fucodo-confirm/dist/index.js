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

  // packages/fucodo-confirm/host.scss
  var host_default = `:host {
  display: contents;
}`;

  // packages/fucodo-confirm/confirm-action.js
  var INTERACTIVE = [
    "a[href]",
    "button",
    'input[type="submit"]',
    'input[type="button"]',
    'input[type="image"]',
    'input[type="reset"]',
    '[role="button"]'
  ].join(",");
  var DEFAULTS2 = Object.freeze({
    title: "Bitte best\xE4tigen",
    message: "Soll diese Aktion wirklich ausgef\xFChrt werden?",
    confirmLabel: "Best\xE4tigen",
    cancelLabel: "Abbrechen",
    variant: "success"
  });
  var template2 = document.createElement("template");
  template2.innerHTML = /* html */
  `
<style>${host_default}</style>
<slot></slot>
<${ConfirmDialog.tagName} exportparts="${DIALOG_PARTS}"><slot name="body" slot="body"></slot></${ConfirmDialog.tagName}>
`;
  var ConfirmAction = class _ConfirmAction extends HTMLElement {
    /** @type {ConfirmDialog} */
    #dialog;
    #pending = null;
    #bypass = false;
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.append(template2.content.cloneNode(true));
      this.#dialog = root.querySelector(ConfirmDialog.tagName);
    }
    connectedCallback() {
      this.addEventListener("click", this.#onClick, { capture: true });
    }
    disconnectedCallback() {
      this.removeEventListener("click", this.#onClick, { capture: true });
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(v) {
      this.toggleAttribute("disabled", Boolean(v));
    }
    get isOpen() {
      return this.#dialog.open;
    }
    /**
     * Open the dialog manually. Resolves with true/false.
     * If a trigger element is passed, its click is replayed on confirmation.
     * @param {Element|null} trigger
     * @returns {Promise<boolean>}
     */
    open(trigger = null) {
      return this.#run(trigger, null);
    }
    /**
     * Whether this instance would intercept the given click.
     * Lets other guards (e.g. <fucodo-confirm-leave>) defer to it so it asks first.
     */
    interceptsClick(event) {
      return !this.#bypass && !this.disabled && !confirmedBy(event).has(this) && Boolean(this.#findTrigger(event));
    }
    /** Programmatic window.confirm replacement. */
    static confirm(options = {}) {
      return ConfirmDialog.confirm({ ...DEFAULTS2, ...options });
    }
    #onClick = (event) => {
      if (!this.interceptsClick(event)) return;
      const trigger = this.#findTrigger(event);
      event.preventDefault();
      event.stopImmediatePropagation();
      this.#run(trigger, snapshotClick(event));
    };
    #findTrigger(event) {
      const path = event.composedPath();
      if (path.includes(this.#dialog)) return null;
      const hostIndex = path.indexOf(this);
      if (hostIndex <= 0) return null;
      const lightRoot = this.getRootNode();
      const inside = path.slice(0, hostIndex).filter((n) => n instanceof Element && n.getRootNode() === lightRoot);
      if (!inside.length) return null;
      const customSelector = this.getAttribute("trigger");
      const trigger = customSelector ? inside.find((el) => el.matches(customSelector)) : inside.find((el) => el.matches(INTERACTIVE)) ?? inside.at(-1);
      if (!trigger) return null;
      if (trigger.matches(":disabled") || trigger.getAttribute("aria-disabled") === "true") return null;
      return trigger;
    }
    #readConfig(trigger) {
      const ds = trigger?.dataset ?? {};
      const pick = (dataKey, attr, fallback) => ds[dataKey] ?? this.getAttribute(attr) ?? fallback;
      return {
        title: pick("confirmTitle", "dialog-title", DEFAULTS2.title),
        message: pick("confirmMessage", "message", DEFAULTS2.message),
        confirmLabel: pick("confirmLabel", "confirm-label", DEFAULTS2.confirmLabel),
        cancelLabel: pick("confirmCancelLabel", "cancel-label", DEFAULTS2.cancelLabel),
        closeLabel: this.getAttribute("close-label"),
        variant: pick("confirmVariant", "variant", DEFAULTS2.variant),
        confirmValue: pick("confirmValue", "confirm-value", null) || null,
        valueLabel: pick("confirmValueLabel", "value-label", null),
        staticBackdrop: this.hasAttribute("static-backdrop")
      };
    }
    #run(trigger, clickSnapshot) {
      if (this.#pending) return this.#pending;
      const config = this.#readConfig(trigger);
      const openEvent = new CustomEvent(`${_ConfirmAction.tagName}:open`, {
        bubbles: true,
        cancelable: true,
        detail: { trigger, config }
      });
      if (!this.dispatchEvent(openEvent)) return Promise.resolve(false);
      this.#pending = (async () => {
        const result = await this.#dialog.show(config);
        if (trigger?.isConnected) trigger.focus?.({ preventScroll: true });
        let replay = result && trigger;
        if (this.isConnected) {
          const ev = new CustomEvent(`${_ConfirmAction.tagName}:${result ? "confirm" : "cancel"}`, {
            bubbles: true,
            cancelable: result,
            detail: { trigger, config }
          });
          if (!this.dispatchEvent(ev)) replay = false;
        }
        if (replay && trigger.isConnected) {
          this.#bypass = true;
          try {
            replayClick(trigger, clickSnapshot, this);
          } finally {
            this.#bypass = false;
          }
        }
        return result;
      })().finally(() => {
        this.#pending = null;
      });
      return this.#pending;
    }
    static tagName = "fucodo-confirm-action";
  };
  if (!customElements.get(ConfirmAction.tagName)) {
    customElements.define(ConfirmAction.tagName, ConfirmAction);
  }
  var confirm_action_default = ConfirmAction;
})();
