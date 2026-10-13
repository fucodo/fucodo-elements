/**
 * <fucodo-confirm-action> – wraps any clickable element (button, link, submit, …),
 * intercepts the click and asks for confirmation in a <fucodo-confirm-dialog>.
 * Only after confirmation is the original click replayed, so links navigate,
 * forms submit and existing click handlers run as usual.
 *
 * Attributes (on the host):
 *   dialog-title     Heading of the dialog
 *   message          Body text (plain text, line breaks preserved)
 *   confirm-label    Label of the confirm button
 *   cancel-label     Label of the cancel button
 *   close-label      aria-label of the × button
 *   variant          success (default, green) | danger (red) | neutral (dark grey)
 *   confirm-value    If set, the user must type exactly this value to enable "confirm"
 *   value-label      Prompt above the input, "{value}" is replaced by the required value
 *   trigger          CSS selector restricting which inner elements are intercepted
 *   static-backdrop  Clicking the backdrop does not close the dialog
 *   disabled         Pass clicks through without asking
 *
 * Per-trigger overrides (useful when wrapping a whole list/table):
 *   data-confirm-title, data-confirm-message, data-confirm-label,
 *   data-confirm-cancel-label, data-confirm-variant, data-confirm-value,
 *   data-confirm-value-label
 *
 * Slots:
 *   (default)  The wrapped element(s)
 *   body       Optional rich body content, replaces the plain message
 *
 * Events (dispatched on the host, bubbling, scoped to this instance):
 *   fucodo-confirm-action:open     cancelable – preventDefault() skips the dialog and drops the click
 *   fucodo-confirm-action:confirm  cancelable – preventDefault() prevents replaying the original click
 *   fucodo-confirm-action:cancel
 *   detail: { trigger, config }   (config may be modified in an "open" listener)
 *
 * Programmatic use (like window.confirm, but async):
 *   const ok = await ConfirmAction.confirm({ title, message, confirmValue, variant });
 */
import { ConfirmDialog, DIALOG_PARTS, confirmedBy, replayClick, snapshotClick } from './confirm-dialog.js';
import hostStyle from './host.scss';

const INTERACTIVE = [
  'a[href]',
  'button',
  'input[type="submit"]',
  'input[type="button"]',
  'input[type="image"]',
  'input[type="reset"]',
  '[role="button"]',
].join(',');

const DEFAULTS = Object.freeze({
  title: 'Bitte bestätigen',
  message: 'Soll diese Aktion wirklich ausgeführt werden?',
  confirmLabel: 'Bestätigen',
  cancelLabel: 'Abbrechen',
  variant: 'success',
});

const template = document.createElement('template');
template.innerHTML = /* html */ `
<style>${hostStyle}</style>
<slot></slot>
<${ConfirmDialog.tagName} exportparts="${DIALOG_PARTS}"><slot name="body" slot="body"></slot></${ConfirmDialog.tagName}>
`;

export class ConfirmAction extends HTMLElement {
  /** @type {ConfirmDialog} */ #dialog;
  #pending = null;
  #bypass = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#dialog = root.querySelector(ConfirmDialog.tagName);
  }

  connectedCallback() {
    // Capture phase on the host runs before any listener on the wrapped element.
    this.addEventListener('click', this.#onClick, { capture: true });
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#onClick, { capture: true });
  }

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', Boolean(v)); }

  get isOpen() { return this.#dialog.open; }

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
    return ConfirmDialog.confirm({ ...DEFAULTS, ...options });
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
    if (path.includes(this.#dialog)) return null; // click inside our own dialog

    const hostIndex = path.indexOf(this);
    if (hostIndex <= 0) return null;

    // Light-DOM elements between the event target and the host (skips our <slot>).
    const lightRoot = this.getRootNode();
    const inside = path
      .slice(0, hostIndex)
      .filter((n) => n instanceof Element && n.getRootNode() === lightRoot);
    if (!inside.length) return null;

    const customSelector = this.getAttribute('trigger');
    const trigger = customSelector
      ? inside.find((el) => el.matches(customSelector))
      : inside.find((el) => el.matches(INTERACTIVE)) ?? inside.at(-1); // fallback: direct child

    if (!trigger) return null;
    if (trigger.matches(':disabled') || trigger.getAttribute('aria-disabled') === 'true') return null;
    return trigger;
  }

  #readConfig(trigger) {
    const ds = trigger?.dataset ?? {};
    const pick = (dataKey, attr, fallback) => ds[dataKey] ?? this.getAttribute(attr) ?? fallback;

    return {
      title: pick('confirmTitle', 'dialog-title', DEFAULTS.title),
      message: pick('confirmMessage', 'message', DEFAULTS.message),
      confirmLabel: pick('confirmLabel', 'confirm-label', DEFAULTS.confirmLabel),
      cancelLabel: pick('confirmCancelLabel', 'cancel-label', DEFAULTS.cancelLabel),
      closeLabel: this.getAttribute('close-label'),
      variant: pick('confirmVariant', 'variant', DEFAULTS.variant),
      confirmValue: pick('confirmValue', 'confirm-value', null) || null,
      valueLabel: pick('confirmValueLabel', 'value-label', null),
      staticBackdrop: this.hasAttribute('static-backdrop'),
    };
  }

  #run(trigger, clickSnapshot) {
    if (this.#pending) return this.#pending;

    const config = this.#readConfig(trigger);
    const openEvent = new CustomEvent(`${ConfirmAction.tagName}:open`, {
      bubbles: true,
      cancelable: true,
      detail: { trigger, config },
    });
    if (!this.dispatchEvent(openEvent)) return Promise.resolve(false);

    this.#pending = (async () => {
      const result = await this.#dialog.show(config);

      if (trigger?.isConnected) trigger.focus?.({ preventScroll: true });

      let replay = result && trigger;
      if (this.isConnected) {
        const ev = new CustomEvent(`${ConfirmAction.tagName}:${result ? 'confirm' : 'cancel'}`, {
          bubbles: true,
          cancelable: result,
          detail: { trigger, config },
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
    })().finally(() => { this.#pending = null; });

    return this.#pending;
  }

  static tagName = 'fucodo-confirm-action';
}

if (!customElements.get(ConfirmAction.tagName)) {
  customElements.define(ConfirmAction.tagName, ConfirmAction);
}

export default ConfirmAction;
