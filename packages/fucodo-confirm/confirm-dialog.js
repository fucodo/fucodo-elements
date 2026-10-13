/**
 * <fucodo-confirm-dialog> – shared Bootstrap-like confirmation dialog.
 * Used by <fucodo-confirm-action> and <fucodo-confirm-leave>, but works on its own as well.
 *
 *   const ok = await dialogElement.show({
 *     title, message, confirmLabel, cancelLabel, closeLabel,
 *     variant,         // success (default, green) | danger (red) | neutral (dark grey)
 *     confirmValue,    // user must type exactly this value before confirming
 *     valueLabel,      // prompt above the input, "{value}" is replaced
 *     staticBackdrop,  // backdrop click does not close
 *   });
 *
 *   const ok = await ConfirmDialog.confirm({...});   // temporary element, async window.confirm
 *
 * Slot "body": rich content that replaces the plain message.
 * Parts: see DIALOG_PARTS (forward them with exportparts when nesting).
 *
 * Layout: bottom sheet below 576px viewport width, centred modal above.
 * Buttons: split left/right, stacked full-width when the dialog is ≤ 480px wide.
 */
import style from './style.scss';

export const DIALOG_PARTS =
  'dialog, content, header, title, close, body, message, label, input, footer, cancel-button, confirm-button';

export const VARIANTS = Object.freeze(['success', 'danger', 'neutral']);

export const DEFAULTS = Object.freeze({
  title: 'Bitte bestätigen',
  message: 'Soll diese Aktion wirklich ausgeführt werden?',
  confirmLabel: 'Bestätigen',
  cancelLabel: 'Abbrechen',
  closeLabel: 'Schließen',
  variant: 'success',
  confirmValue: null,
  valueLabel: 'Zur Bestätigung bitte {value} eingeben:',
  staticBackdrop: false,
});

/*
 * Replay bookkeeping shared by the components.
 * When a component replays a click after the user confirmed, it records which
 * components have already confirmed that interaction. Each component skips
 * events it has already confirmed, so chained guards (e.g. <fucodo-confirm-action>
 * inside a page watched by <fucodo-confirm-leave>) ask exactly once each.
 * Stored on globalThis so separately bundled packages share the same map.
 */
const CONFIRMATIONS_KEY = Symbol.for('fucodo-confirm.confirmations');
const confirmations = (globalThis[CONFIRMATIONS_KEY] ??= new WeakMap());

/** @returns {Set<object>} components that already confirmed this event */
export function confirmedBy(event) {
  return confirmations.get(event) ?? new Set();
}

/** Record that `tokens` (component instances) confirmed this event. */
export function markConfirmed(event, tokens) {
  confirmations.set(event, new Set(tokens));
}

/** Re-dispatch a click on `target`, carrying over confirmations. */
export function replayClick(target, originalEvent, token) {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    composed: true,
    view: window,
    ctrlKey: originalEvent?.ctrlKey ?? false,
    shiftKey: originalEvent?.shiftKey ?? false,
    altKey: originalEvent?.altKey ?? false,
    metaKey: originalEvent?.metaKey ?? false,
    button: originalEvent?.button ?? 0,
    detail: originalEvent?.detail ?? 1,
  });
  markConfirmed(event, [...(originalEvent?.tokens ?? confirmedBy(originalEvent ?? {})), token]);
  // A synthetic click still runs activation behaviour (navigation, form submit, …).
  return target.dispatchEvent(event);
}

/** Snapshot of the parts of a click event needed to replay it later. */
export function snapshotClick(event) {
  return {
    ctrlKey: event.ctrlKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    metaKey: event.metaKey,
    button: event.button,
    detail: event.detail,
    tokens: [...confirmedBy(event)],
  };
}

const template = document.createElement('template');
template.innerHTML = /* html */ `
<style>${style}</style>

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

export class ConfirmDialog extends HTMLElement {
  /** @type {HTMLDialogElement} */ #dialog;
  #els;
  #config = null;
  #resolve = null;
  #pending = null;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));

    this.#dialog = root.querySelector('dialog');
    this.#els = {
      form: root.querySelector('form'),
      title: root.querySelector('.title'),
      close: root.querySelector('.btn-close'),
      message: root.querySelector('.message'),
      bodySlot: root.querySelector('slot[name="body"]'),
      valueCheck: root.querySelector('.value-check'),
      label: root.querySelector('.label'),
      input: root.querySelector('.input'),
      cancel: root.querySelector('[part="cancel-button"]'),
      confirm: root.querySelector('[part="confirm-button"]'),
    };

    this.#els.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.#isValid()) this.#finish(true);
    });
    root.querySelectorAll('[data-action="cancel"]').forEach((btn) =>
      btn.addEventListener('click', () => this.#finish(false)),
    );
    this.#els.input.addEventListener('input', () => this.#updateConfirmState());

    // Escape key
    this.#dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      this.#finish(false);
    });
    // Backdrop click (the form fills the dialog, so target === dialog means backdrop)
    this.#dialog.addEventListener('click', (e) => {
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

    const config = ConfirmDialog.normalize(options);
    this.#config = config;
    this.#render(config);

    this.#pending = new Promise((resolve) => { this.#resolve = resolve; });
    this.#dialog.showModal();

    // Required value → focus the input; otherwise focus "cancel" (safe default)
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
      if (value !== undefined && value !== null && key in DEFAULTS) config[key] = value;
    }
    if (!VARIANTS.includes(config.variant)) config.variant = DEFAULTS.variant;
    config.confirmValue = config.confirmValue ? String(config.confirmValue) : null;
    config.staticBackdrop = Boolean(config.staticBackdrop);
    return config;
  }

  /** Programmatic window.confirm replacement. */
  static confirm(options = {}) {
    const el = document.createElement(ConfirmDialog.tagName);
    document.body.append(el);
    return el.show(options).finally(() => {
      // let the closing transition finish before removing the element
      setTimeout(() => el.remove(), 350);
    });
  }

  #hasBodyContent() {
    return this.#els.bodySlot
      .assignedNodes({ flatten: true })
      .some((n) => n.nodeType === Node.ELEMENT_NODE || n.textContent.trim() !== '');
  }

  #render(config) {
    const { title, message, valueCheck, label, input, cancel, confirm, close } = this.#els;

    title.textContent = config.title;
    message.textContent = config.message;
    message.hidden = this.#hasBodyContent();
    close.setAttribute('aria-label', config.closeLabel);
    cancel.textContent = config.cancelLabel;
    confirm.textContent = config.confirmLabel;
    confirm.dataset.variant = config.variant;

    input.value = '';
    valueCheck.hidden = !config.confirmValue;
    if (config.confirmValue) {
      // Build "… {value} …" without innerHTML to stay XSS-safe.
      const [before, ...rest] = String(config.valueLabel).split('{value}');
      const code = document.createElement('code');
      code.textContent = config.confirmValue;
      label.replaceChildren(before, ...(rest.length ? [code, rest.join(config.confirmValue)] : [' ', code]));
      input.setAttribute('placeholder', config.confirmValue);
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
    this.#els.input.value = '';
    resolve(result);
  }

  static tagName = 'fucodo-confirm-dialog';
}

if (!customElements.get(ConfirmDialog.tagName)) {
  customElements.define(ConfirmDialog.tagName, ConfirmDialog);
}

export default ConfirmDialog;
