/**
 * <fucodo-confirm-leave> – watches forms on the page and asks for confirmation before
 * the user leaves it with unsaved changes. Uses the shared <fucodo-confirm-dialog>.
 * Place one instance anywhere in the page.
 *
 * What is caught:
 *   - link clicks anywhere on the page (incl. dynamically added links)
 *   - form submits that are not whitelisted
 *   - scripted navigation (location.href = …, location.reload(), …) via the
 *     Navigation API, where the browser supports it
 *   - tab close / reload / address bar / cross-document back: browsers only
 *     allow their own native prompt here (beforeunload) – shown as fallback
 *
 * Dirty tracking:
 *   - every watched form gets a baseline of its field values; a form is dirty
 *     while any field differs from its baseline (reverting a change clears it)
 *   - forms and fields added later (MutationObserver) get their baseline when
 *     they appear, so prefilled values of dynamic rows don't count as changes
 *   - dirty forms get a `data-dirty` attribute (styling hook)
 *
 * Attributes (on the host):
 *   forms             CSS selector of the forms to watch (default: "form")
 *   allow             CSS selector of links/buttons that may always leave
 *   allow-submit      default whitelist selector for submit buttons of all forms
 *   dirty             force the dirty state (e.g. for state outside forms)
 *   disabled          turn the guard off
 *   no-native-prompt  don't register the beforeunload fallback
 *   dialog-title, message, confirm-label, cancel-label, close-label, variant,
 *   confirm-value, value-label, static-backdrop   → dialog texts/behaviour
 *
 * Per form / element:
 *   <form data-leave-allow-submit="button[name=save]">   whitelisted submit buttons
 *       (no whitelist anywhere → every submit counts as saving and is allowed;
 *        with a whitelist, a submit without submitter, e.g. requestSubmit(), asks)
 *   data-leave-allow    on a link or submit button: always allowed
 *   data-leave-ignore   on a field (or a container of fields): not tracked
 *
 * Even a whitelisted submit asks if *other* watched forms have unsaved changes.
 *
 * Events (dispatched on the host, bubbling):
 *   fucodo-confirm-leave:dirtychange   detail { dirty, forms }
 *   fucodo-confirm-leave:open          cancelable – preventDefault() skips the dialog and stays
 *   fucodo-confirm-leave:confirm       cancelable – preventDefault() stays on the page
 *   fucodo-confirm-leave:cancel
 *   detail of open/confirm/cancel: { kind: 'link'|'submit'|'navigate', target, url, forms, config }
 *
 * Methods / properties:
 *   markClean(form?)   take current values as new baseline (e.g. after an AJAX save)
 *   markDirty()        same as setting the `dirty` attribute
 *   dirtyFields(form?) fields that differ from their baseline
 *   isDirty, dirtyForms
 *
 * Not covered: same-document navigation (hash links, pushState routers) and
 * forms inside other components' shadow roots.
 */
import { ConfirmDialog, DIALOG_PARTS, confirmedBy, replayClick, snapshotClick } from 'fucodo.confirm/confirm-dialog.js';
import style from './style.scss';

const DEFAULTS = Object.freeze({
  title: 'Ungespeicherte Änderungen',
  message: 'Es gibt ungespeicherte Änderungen. Beim Verlassen der Seite gehen sie verloren.',
  confirmLabel: 'Seite verlassen',
  cancelLabel: 'Auf der Seite bleiben',
  variant: 'danger',
});

const SKIP_INPUT_TYPES = new Set(['submit', 'button', 'reset', 'image']);
const SKIP_TAGS = new Set(['FIELDSET', 'OUTPUT', 'OBJECT', 'BUTTON']);
const SAME_WINDOW_TARGETS = new Set(['', '_self', '_top', '_parent']);
/** User input that re-arms the guard if a confirmed/allowed navigation didn't leave the page. */
const REARM_EVENTS = ['pointerdown', 'keydown'];

const template = document.createElement('template');
template.innerHTML = /* html */ `
<style>${style}</style>
<${ConfirmDialog.tagName} exportparts="${DIALOG_PARTS}"><slot name="body" slot="body"></slot></${ConfirmDialog.tagName}>
`;

export class ConfirmLeave extends HTMLElement {
  static observedAttributes = ['forms', 'dirty', 'disabled', 'no-native-prompt'];

  /** @type {ConfirmDialog} */ #dialog;
  /** @type {Set<HTMLFormElement>} */ #forms = new Set();
  /** @type {WeakMap<Element, string>} */ #baselines = new WeakMap();
  /** @type {Set<HTMLFormElement>} */ #dirtyForms = new Set();
  #observer = null;
  #bypass = false;
  #leaving = false;
  #asking = false;
  #wasDirty = false;
  #nativePromptActive = false;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.append(template.content.cloneNode(true));
    this.#dialog = root.querySelector(ConfirmDialog.tagName);
  }

  connectedCallback() {
    document.addEventListener('click', this.#onClick, true);
    document.addEventListener('submit', this.#onSubmit, true);
    document.addEventListener('input', this.#onFieldEvent, true);
    document.addEventListener('change', this.#onFieldEvent, true);
    document.addEventListener('reset', this.#onReset, true);
    window.addEventListener('pageshow', this.#onPageShow);
    window.navigation?.addEventListener('navigate', this.#onNavigate);

    this.#observer = new MutationObserver(this.#onMutations);
    this.#observer.observe(document.documentElement, { childList: true, subtree: true });

    this.#scan(document);
    this.#update();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.#onClick, true);
    document.removeEventListener('submit', this.#onSubmit, true);
    document.removeEventListener('input', this.#onFieldEvent, true);
    document.removeEventListener('change', this.#onFieldEvent, true);
    document.removeEventListener('reset', this.#onReset, true);
    window.removeEventListener('pageshow', this.#onPageShow);
    this.#rearm();
    window.navigation?.removeEventListener('navigate', this.#onNavigate);
    this.#observer?.disconnect();
    this.#setNativePrompt(false);
    for (const form of this.#forms) form.removeAttribute('data-dirty');
    this.#forms.clear();
    this.#dirtyForms.clear();
  }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === 'forms') {
      for (const form of this.#forms) form.removeAttribute('data-dirty');
      this.#forms.clear();
      this.#scan(document);
    }
    this.#update();
  }

  // ---- public API ---------------------------------------------------------

  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { this.toggleAttribute('disabled', Boolean(v)); }

  get isDirty() {
    return !this.disabled && (this.hasAttribute('dirty') || this.#dirtyForms.size > 0);
  }

  get dirtyForms() {
    return [...this.#dirtyForms];
  }

  /** Fields whose value differs from their baseline (all dirty forms, or one form). */
  dirtyFields(form = null) {
    const forms = form ? [form] : this.dirtyForms;
    return forms.flatMap((f) => this.#fields(f).filter(
      (el) => this.#baselines.has(el) && this.#baselines.get(el) !== this.#serialize(el),
    ));
  }

  /** Take the current values as the new baseline (all forms, or one form). */
  markClean(form = null) {
    const forms = form ? [form] : [...this.#forms];
    for (const f of forms) this.#snapshot(f, true);
    if (!form) this.removeAttribute('dirty');
    this.#update();
  }

  markDirty() {
    this.setAttribute('dirty', '');
  }

  // ---- form tracking ------------------------------------------------------

  get #formSelector() {
    return this.getAttribute('forms') || 'form';
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
      return !el.closest('[data-leave-ignore]');
    });
  }

  #serialize(el) {
    if (el instanceof HTMLInputElement) {
      if (el.type === 'checkbox' || el.type === 'radio') return el.checked ? '1' : '0';
      if (el.type === 'file') return [...(el.files ?? [])].map((f) => `${f.name}:${f.size}`).join('|');
      return el.value;
    }
    if (el instanceof HTMLSelectElement) return [...el.options].map((o) => (o.selected ? '1' : '0')).join('');
    return 'value' in el ? String(el.value ?? '') : '';
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
      const dirty = form.isConnected && this.#isFormDirty(form);
      if (dirty) this.#dirtyForms.add(form);
      else this.#dirtyForms.delete(form);
      form.toggleAttribute('data-dirty', dirty);
    }

    const dirty = this.isDirty;
    // While a confirmed/allowed navigation is under way the native prompt must stay off.
    this.#setNativePrompt(dirty && !this.#leaving && !this.hasAttribute('no-native-prompt'));

    if (dirty !== this.#wasDirty) {
      this.#wasDirty = dirty;
      this.dispatchEvent(new CustomEvent(`${ConfirmLeave.tagName}:dirtychange`, {
        bubbles: true,
        detail: { dirty, forms: this.dirtyForms },
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
        this.#snapshot(form); // baselines for newly added fields
      }
    }
    this.#update();
  };

  #onFieldEvent = (event) => {
    const el = event.target;
    const form = el?.form ?? el?.closest?.('form');
    if (form && this.#forms.has(form)) this.#update();
  };

  #onReset = (event) => {
    if (this.#forms.has(event.target)) setTimeout(() => this.#update());
  };

  #onPageShow = (event) => {
    if (event.persisted) this.#rearm(); // restored from back/forward cache
  };

  // ---- native fallback ----------------------------------------------------

  #setNativePrompt(on) {
    if (on === this.#nativePromptActive) return;
    this.#nativePromptActive = on;
    // Only registered while dirty, so the page stays eligible for the bfcache otherwise.
    if (on) window.addEventListener('beforeunload', this.#onBeforeUnload);
    else window.removeEventListener('beforeunload', this.#onBeforeUnload);
  }

  #onBeforeUnload = (event) => {
    if (this.#leaving || this.#bypass) return;
    this.#update();
    if (!this.isDirty) return;
    event.preventDefault();
    event.returnValue = ''; // legacy browsers
  };

  // ---- interception -------------------------------------------------------

  #shouldGuard() {
    if (this.#bypass || this.#leaving || this.disabled) return false;
    this.#update(); // catch values changed by scripts without events
    return this.isDirty;
  }

  #isAllowed(el) {
    if (!el) return false;
    if (el.hasAttribute('data-leave-allow')) return true;
    const selector = this.getAttribute('allow');
    return Boolean(selector && el.matches(selector));
  }

  #onClick = (event) => {
    if (event.defaultPrevented || confirmedBy(event).has(this)) return;
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; // new tab/window

    const path = event.composedPath();
    const link = path.find((n) => n instanceof Element && n.matches('a[href], area[href]'));
    if (!link) return;

    // Another guard (e.g. <fucodo-confirm-action>) will ask first; its replayed click comes back here.
    if (path.some((n) => n !== this && typeof n?.interceptsClick === 'function' && n.interceptsClick(event))) return;

    if (!this.#shouldGuard()) return;
    if (link.hasAttribute('download')) return;

    const target = (link.getAttribute('target') ?? document.querySelector('base[target]')?.target ?? '').toLowerCase();
    if (!SAME_WINDOW_TARGETS.has(target)) return;

    if (this.#isAllowed(link)) {
      this.#allowLeave();
      return;
    }

    // In opaque contexts (srcdoc/blob previews, sandboxed iframes) the URL may not parse – still guard.
    const url = ConfirmLeave.#parseUrl(link.href);
    const rawHref = link.getAttribute('href') ?? '';
    if (/^(mailto|tel|sms|javascript):/i.test(rawHref)) return;
    if (url && !['http:', 'https:', 'file:', 'about:', 'blob:'].includes(url.protocol)) return;
    if (this.#isSameDocument(url, link)) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const snapshot = snapshotClick(event);
    this.#ask({ kind: 'link', target: link, url: url?.href ?? link.href }, () => {
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
    const rawHref = link.getAttribute('href') ?? '';
    if (rawHref.startsWith('#')) return true;
    if (!url) return false;
    const strip = (href) => href.split('#')[0];
    return strip(url.href) === strip(location.href) && url.hash !== '';
  }

  #submitAllowed(form, submitter) {
    if (this.#isAllowed(submitter)) return true;
    const whitelist = form.getAttribute('data-leave-allow-submit') ?? this.getAttribute('allow-submit');
    if (whitelist === null) return true; // no whitelist configured → every submit saves
    return Boolean(submitter && whitelist && submitter.matches(whitelist));
  }

  #onSubmit = (event) => {
    if (event.defaultPrevented) return;
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const submitter = event.submitter ?? null;

    const method = (submitter?.getAttribute('formmethod') ?? form.getAttribute('method') ?? '').toLowerCase();
    if (method === 'dialog') return;
    const target = (submitter?.getAttribute('formtarget') ?? form.getAttribute('target') ?? '').toLowerCase();
    if (!SAME_WINDOW_TARGETS.has(target)) return;

    if (!this.#shouldGuard()) return;

    const allowed = this.#submitAllowed(form, submitter);
    // Changes that would be lost: everything dirty except this form when it is being saved.
    const lost = this.dirtyForms.filter((f) => !(allowed && f === form));
    const forcedDirty = this.hasAttribute('dirty');

    if (allowed && lost.length === 0 && (!forcedDirty || this.#forms.has(form))) {
      this.#allowLeave();
      return;
    }

    event.preventDefault();
    event.stopImmediatePropagation();

    this.#ask({ kind: 'submit', target: form, submitter, url: form.action, forms: lost }, () => {
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

    // A POST we can't resubmit (form.submit() without a source element): leave it to beforeunload.
    const sourceForm = event.sourceElement instanceof HTMLFormElement ? event.sourceElement : null;
    if (event.formData && !sourceForm) return;

    event.preventDefault();

    const { navigationType, destination } = event;
    const state = (() => { try { return destination.getState(); } catch { return undefined; } })();

    this.#ask({ kind: 'navigate', target: sourceForm, url: destination.url, navigationType }, () => {
      if (sourceForm) sourceForm.submit();
      else if (navigationType === 'traverse') window.navigation.traverseTo(destination.key);
      else if (navigationType === 'reload') location.reload();
      else window.navigation.navigate(destination.url, { history: navigationType === 'replace' ? 'replace' : 'push', state });
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
      title: attr('dialog-title', DEFAULTS.title),
      message: attr('message', DEFAULTS.message),
      confirmLabel: attr('confirm-label', DEFAULTS.confirmLabel),
      cancelLabel: attr('cancel-label', DEFAULTS.cancelLabel),
      closeLabel: attr('close-label'),
      variant: attr('variant', DEFAULTS.variant),
      confirmValue: attr('confirm-value') || null,
      valueLabel: attr('value-label'),
      staticBackdrop: this.hasAttribute('static-backdrop'),
    };
  }

  async #ask(info, proceed) {
    if (this.#asking) return;
    const detail = { forms: this.dirtyForms, ...info, config: this.#readConfig() };

    const open = new CustomEvent(`${ConfirmLeave.tagName}:open`, { bubbles: true, cancelable: true, detail });
    if (!this.dispatchEvent(open)) return;

    this.#asking = true;
    let ok;
    try {
      ok = await this.#dialog.show(detail.config);
    } finally {
      this.#asking = false;
    }

    const focusTarget = info.kind === 'submit' ? info.submitter ?? info.target : info.target;
    if (focusTarget?.isConnected) focusTarget.focus?.({ preventScroll: true });

    const result = new CustomEvent(`${ConfirmLeave.tagName}:${ok ? 'confirm' : 'cancel'}`, {
      bubbles: true,
      cancelable: ok,
      detail,
    });
    if (!this.dispatchEvent(result) || !ok) return;

    this.#allowLeave();
    proceed();
  }

  static tagName = 'fucodo-confirm-leave';
}

if (!customElements.get(ConfirmLeave.tagName)) {
  customElements.define(ConfirmLeave.tagName, ConfirmLeave);
}

export default ConfirmLeave;
