import style from './style.scss'

class ModalOnce extends HTMLElement {
    constructor() {
        super();
        this.styleEl = document.createElement('style');
        this.styleEl.textContent = style;
        this.appendChild(this.styleEl);
    }

  connectedCallback() {
    this.cookieName = this.getAttribute('data-cookie-name') || ('overlay_shown_' + (this.closest('[data-ce-uid]')?.dataset.ceUid || 'global'));
    this.cookieDays = parseInt(this.getAttribute('data-cookie-days') || '0', 10);
    this.autoOpen   = this.getAttribute('data-auto-open') === '1';

    this.dialog = this.querySelector('dialog');
    if (!this.dialog) {
      console.warn('[dialog-overlay] <dialog> nicht gefunden.');
      return;
    }

    if (!this._hasCookie(this.cookieName) && this.autoOpen) {
      this._open();
    }

    this.dialog.addEventListener('close', () => {
      this._setCookie(this.cookieName, '1', this.cookieDays);
    });

    this.addEventListener('click', (ev) => {
      const target = ev.target;
      if (target && target.matches('[data-close], .dialog-close-btn')) {
        try { this.dialog.close(); } catch (e) { /* ignore */ }
      }
    });
  }

  _open() {
    if (typeof this.dialog.showModal === 'function') {
      try { this.dialog.showModal(); } catch (e) { this.dialog.setAttribute('open', ''); }
    } else {
      this.dialog.setAttribute('open', '');
    }
  }

  _setCookie(name, value, days) {
    if (parseInt(days) === 0) {
      return;
    }
    const d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    const expires = "expires=" + d.toUTCString();
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    const cookieString = name + "=" + encodeURIComponent(value) + ";" + expires + "; path=/; SameSite=Lax" + secure;
    document.cookie = cookieString;
  }

  _hasCookie(name) {
    return document.cookie.split(';').map(v => v.trim()).some(c => c.startsWith(name + '='));
  }
}
customElements.define('fucodo-modal-once', ModalOnce);
