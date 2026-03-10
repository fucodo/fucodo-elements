(() => {
  // packages/fucodo-tabs/index.js
  var FucodoTabs = class extends HTMLElement {
    connectedCallback() {
      this._nav = this.querySelector(".nav-tabs");
      if (!this._nav) return;
      this._links = Array.from(this._nav.querySelectorAll('[data-bs-toggle="tab"]'));
      if (!this._links.length) return;
      const titles = this._links.map((l) => (l.textContent || "").trim()).filter(Boolean).join("|");
      const salt = this.getAttribute("key") || location.pathname;
      const key = "|" + this.getAttribute("state-key") || "";
      this._storageKey = "fucodo-tabs:" + this._hash(`${titles}|${salt}${key}`);
      this._onShown = (ev) => {
        const btn = ev.target;
        const targetSel = btn.getAttribute("data-bs-target") || btn.getAttribute("href");
        if (targetSel) localStorage.setItem(this._storageKey, targetSel);
      };
      this._links.forEach((l) => l.addEventListener("shown.bs.tab", this._onShown));
      if (!localStorage.getItem(this._storageKey)) {
        const currentActive = this._links.find((l) => l.classList.contains("active")) || this._links[0];
        const sel = currentActive?.getAttribute("data-bs-target") || currentActive?.getAttribute("href");
        if (sel) localStorage.setItem(this._storageKey, sel);
      }
      this._restore();
      this._markInvalidTabs();
    }
    disconnectedCallback() {
      this._links?.forEach((l) => l.removeEventListener("shown.bs.tab", this._onShown));
    }
    _markInvalidTabs() {
      this._links?.forEach((l) => l.classList.remove("text-bg-danger"));
      this._links?.forEach(
        (l) => {
          l.classList.remove("text-bg-danger");
          let ref = document.querySelector(l.getAttribute("data-bs-target"));
          if (!ref) {
            return;
          }
          if (ref.querySelectorAll(".is-invalid").length > 0) {
            l.classList.add("text-bg-danger");
          }
        }
      );
    }
    _restore() {
      const saved = localStorage.getItem(this._storageKey);
      if (!saved) return;
      const btn = this._links.find((l) => {
        const sel = l.getAttribute("data-bs-target") || l.getAttribute("href");
        return sel === saved;
      });
      if (!btn) return;
      if (window.bootstrap?.Tab) {
        const tab = bootstrap.Tab.getOrCreateInstance(btn);
        tab.show();
      } else {
        this._activateManually(btn, saved);
      }
    }
    _activateManually(btn, paneSelector) {
      this._links.forEach((l) => {
        l.classList.toggle("active", l === btn);
        l.setAttribute("aria-selected", l === btn ? "true" : "false");
        if (l !== btn) l.setAttribute("tabindex", "-1");
        else l.removeAttribute("tabindex");
      });
      const panes = this.querySelectorAll(".tab-pane");
      panes.forEach((p) => p.classList.remove("active", "show"));
      const pane = this.querySelector(paneSelector);
      if (pane) pane.classList.add("active", "show");
    }
    // Schneller, deterministischer Hash (djb2/xor-Variante), als Hex-String
    _hash(str) {
      let h = 5381;
      for (let i = 0; i < str.length; i++) {
        h = (h << 5) + h ^ str.charCodeAt(i);
      }
      return (h >>> 0).toString(16);
    }
  };
  customElements.define("fucodo-tabs", FucodoTabs);
})();
