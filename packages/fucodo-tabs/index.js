class FucodoTabs extends HTMLElement {
  connectedCallback() {
    // Finde die Tab-Navigation innerhalb des Elements
    this._nav = this.querySelector('.nav-tabs');
    if (!this._nav) return;

    // Alle Tab-Trigger (Buttons/Links mit data-bs-toggle="tab")
    this._links = Array.from(this._nav.querySelectorAll('[data-bs-toggle="tab"]'));
    if (!this._links.length) return;

    // Hash über Tab-Titel + Pfad + optionales key-Attribut bilden
    const titles = this._links.map(l => (l.textContent || '').trim()).filter(Boolean).join('|');
    const salt = this.getAttribute('key') || location.pathname;
    const key = "|" + this.getAttribute('state-key') || '';
    this._storageKey = 'fucodo-tabs:' + this._hash(`${titles}|${salt}${key}`);

    // Listener: bei jedem Tab-Wechsel Ziel speichern
    this._onShown = (ev) => {
      const btn = ev.target;
      const targetSel = btn.getAttribute('data-bs-target') || btn.getAttribute('href');
      if (targetSel) localStorage.setItem(this._storageKey, targetSel);
    };
    this._links.forEach(l => l.addEventListener('shown.bs.tab', this._onShown));

    // Falls noch nichts gespeichert ist, aktuellen aktiven Tab initial speichern
    if (!localStorage.getItem(this._storageKey)) {
      const currentActive = this._links.find(l => l.classList.contains('active')) || this._links[0];
      const sel = currentActive?.getAttribute('data-bs-target') || currentActive?.getAttribute('href');
      if (sel) localStorage.setItem(this._storageKey, sel);
    }

    // Gespeicherten Tab wiederherstellen
    this._restore();
    this._markInvalidTabs();
  }

  disconnectedCallback() {
    this._links?.forEach(l => l.removeEventListener('shown.bs.tab', this._onShown));
  }

  _markInvalidTabs() {
    this._links?.forEach(l => l.classList.remove('text-bg-danger'));
    this._links?.forEach(
      l => {
        l.classList.remove('text-bg-danger');
        let ref = document.querySelector(l.getAttribute('data-bs-target'));
        if (!ref) {
          return;
        }
        if (ref.querySelectorAll('.is-invalid').length > 0) {
          l.classList.add('text-bg-danger');
        }
      }
    );
  }
  _restore() {
    const saved = localStorage.getItem(this._storageKey);
    if (!saved) return;

    const btn = this._links.find(l => {
      const sel = l.getAttribute('data-bs-target') || l.getAttribute('href');
      return sel === saved;
    });
    if (!btn) return;

    // Mit Bootstrap-API, falls vorhanden
    if (window.bootstrap?.Tab) {
      const tab = bootstrap.Tab.getOrCreateInstance(btn);
      tab.show();
    } else {
      // Fallback ohne Bootstrap JS: Klassen manuell setzen
      this._activateManually(btn, saved);
    }
  }

  _activateManually(btn, paneSelector) {
    // Nav-Status
    this._links.forEach(l => {
      l.classList.toggle('active', l === btn);
      l.setAttribute('aria-selected', l === btn ? 'true' : 'false');
      if (l !== btn) l.setAttribute('tabindex', '-1');
      else l.removeAttribute('tabindex');
    });

    // Pane-Status
    const panes = this.querySelectorAll('.tab-pane');
    panes.forEach(p => p.classList.remove('active', 'show'));
    const pane = this.querySelector(paneSelector);
    if (pane) pane.classList.add('active', 'show');
  }

  // Schneller, deterministischer Hash (djb2/xor-Variante), als Hex-String
  _hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) ^ str.charCodeAt(i);
    }
    return (h >>> 0).toString(16);
  }
}

customElements.define('fucodo-tabs', FucodoTabs);
