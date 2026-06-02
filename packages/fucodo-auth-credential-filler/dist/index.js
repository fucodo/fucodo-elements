(() => {
  // packages/fucodo-auth-credential-filler/style.scss
  var style_default = `:root {
  --cf-background: #1c1c1c;
  --cf-border-color: #3a3a3a;
  --cf-border-radius: 6px;
  --cf-shadow: 0 8px 28px rgba(0,0,0,0.6);
  --cf-max-height: 280px;
  --cf-z-index: 99999;
  --cf-font-family: inherit;
  --cf-font-size: 13px;
  --cf-text-color: #b8b4aa;
  --cf-group-bg: #161616;
  --cf-group-text: #555;
  --cf-group-border: #282828;
  --cf-item-hover-bg: #242424;
  --cf-item-hover-text: #c8f07a;
  --cf-item-desc-color: #4a4a4a;
  --cf-item-desc-hover-color: #7a9e45;
  --cf-item-desc-font-family: inherit;
  --cf-mark-color: #c8f07a;
  --cf-empty-color: #444;
}

.cf-dropdown {
  position: fixed;
  background: var(--cf-background);
  border: 1px solid var(--cf-border-color);
  border-radius: var(--cf-border-radius);
  box-shadow: var(--cf-shadow);
  overflow-y: auto;
  max-height: var(--cf-max-height);
  z-index: var(--cf-z-index);
  min-width: 180px;
  display: none;
  font-family: var(--cf-font-family);
  font-size: var(--cf-font-size);
}

.cf-dropdown.cf-open {
  display: block;
}

.cf-group-header {
  padding: 8px 12px 4px;
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--cf-group-text);
  background: var(--cf-group-bg);
  border-top: 1px solid var(--cf-group-border);
  user-select: none;
  pointer-events: none;
  position: sticky;
  top: 0;
}

.cf-group-header:first-child {
  border-top: none;
}

.cf-item {
  padding: 7px 12px 7px 16px;
  color: var(--cf-text-color);
  cursor: pointer;
  white-space: nowrap;
}

.cf-item:hover,
.cf-item.cf-active {
  background: var(--cf-item-hover-bg);
  color: var(--cf-item-hover-text);
}

.cf-item:hover .cf-item-desc,
.cf-item.cf-active .cf-item-desc {
  color: var(--cf-item-desc-hover-color);
}

.cf-item mark {
  background: transparent;
  color: var(--cf-mark-color);
  font-weight: 500;
}

.cf-item-desc {
  display: block;
  font-size: 11px;
  color: var(--cf-item-desc-color);
  margin-top: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--cf-item-desc-font-family);
  font-style: italic;
  letter-spacing: 0;
}

.cf-empty {
  padding: 10px 12px;
  color: var(--cf-empty-color);
  font-style: italic;
  user-select: none;
}`;

  // packages/fucodo-auth-credential-filler/index.js
  if (!document.getElementById("cf-styles")) {
    const s = document.createElement("style");
    s.id = "cf-styles";
    s.textContent = style_default;
    document.head.appendChild(s);
  }
  function buildGroups(credentials, groupKey) {
    const map = /* @__PURE__ */ new Map();
    const order = [];
    for (const c of credentials) {
      const g = groupKey && c[groupKey] != null ? String(c[groupKey]) : null;
      if (!map.has(g)) {
        map.set(g, []);
        order.push(g);
      }
      map.get(g).push(c);
    }
    return [...order.filter((k) => k !== null), ...order.includes(null) ? [null] : []].map((name) => ({ name, items: map.get(name) }));
  }
  function highlight(text, query) {
    if (!query) return document.createTextNode(text);
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return document.createTextNode(text);
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createTextNode(text.slice(0, idx)));
    const mark = document.createElement("mark");
    mark.textContent = text.slice(idx, idx + query.length);
    frag.appendChild(mark);
    frag.appendChild(document.createTextNode(text.slice(idx + query.length)));
    return frag;
  }
  var CredentialFiller = class extends HTMLElement {
    static get observedAttributes() {
      return [
        "url",
        "username-selector",
        "password-selector",
        "label-key",
        "username-key",
        "password-key",
        "group-key",
        "description-key",
        "position"
      ];
    }
    connectedCallback() {
      this._init();
    }
    attributeChangedCallback() {
      if (this.isConnected) this._init();
    }
    _cfg() {
      return {
        url: this.getAttribute("url"),
        usernameSelector: this.getAttribute("username-selector"),
        passwordSelector: this.getAttribute("password-selector"),
        labelKey: this.getAttribute("label-key") || "username",
        usernameKey: this.getAttribute("username-key") || "username",
        passwordKey: this.getAttribute("password-key") || "password",
        groupKey: this.getAttribute("group-key") || null,
        descriptionKey: this.getAttribute("description-key") || null,
        position: this.getAttribute("position") || "auto"
      };
    }
    _parseInlineDefault() {
      const child = this.querySelector('script[type="application/json"]');
      const raw = child ? child.textContent : this.textContent;
      const t = (raw || "").trim();
      if (!t) return null;
      try {
        const p = JSON.parse(t);
        return Array.isArray(p) ? p : null;
      } catch (e) {
        console.warn("[credential-filler] inline parse error:", e);
        return null;
      }
    }
    _apply(credentials, cfg, source) {
      const userField = document.querySelector(cfg.usernameSelector);
      if (!userField) {
        console.error("[credential-filler] username-selector not found:", cfg.usernameSelector);
        return;
      }
      this._cfg_cache = cfg;
      this._activeSource = source;
      this._map = new Map(credentials.map((c) => [String(c[cfg.labelKey] ?? ""), c]));
      this._groups = buildGroups(credentials, cfg.groupKey);
      if (!this._dd) {
        const dd = document.createElement("div");
        dd.className = "cf-dropdown";
        dd.setAttribute("role", "listbox");
        document.body.appendChild(dd);
        this._dd = dd;
        dd.addEventListener("mousedown", (e) => {
          const item = e.target.closest(".cf-item");
          if (!item) return;
          e.preventDefault();
          this._select(item.dataset.label, userField);
        });
      }
      if (this._dd.classList.contains("cf-open")) {
        this._render(userField.value);
      }
      if (this._wiredField !== userField) this._wire(userField);
      this.dispatchEvent(new CustomEvent("credential-filler:ready", {
        bubbles: true,
        detail: { count: credentials.length, source }
      }));
    }
    _wire(field) {
      ["focus", "input", "keydown", "blur"].forEach((ev, i) => {
        const h = [this._onFocus, this._onInput, this._onKey, this._onBlur][i];
        if (h) field.removeEventListener(ev, h);
      });
      field.setAttribute("autocomplete", "off");
      field.setAttribute("aria-autocomplete", "list");
      field.setAttribute("aria-haspopup", "listbox");
      this._onFocus = () => {
        this._render(field.value);
        this._reposition(field);
        this._dd.classList.add("cf-open");
      };
      this._onInput = () => {
        this._render(field.value);
        this._reposition(field);
        this._dd.classList.add("cf-open");
      };
      this._onBlur = () => setTimeout(() => this._close(), 150);
      this._onKey = (e) => {
        if (!this._dd.classList.contains("cf-open")) return;
        const items = [...this._dd.querySelectorAll(".cf-item")];
        const cur = this._dd.querySelector(".cf-item.cf-active");
        let idx = cur ? items.indexOf(cur) : -1;
        if (e.key === "ArrowDown") {
          e.preventDefault();
          this._setActive(items, Math.min(idx + 1, items.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          this._setActive(items, Math.max(idx - 1, 0));
        } else if (e.key === "Enter" && cur) {
          e.preventDefault();
          this._select(cur.dataset.label, field);
        } else if (e.key === "Escape") {
          this._close();
        }
      };
      field.addEventListener("focus", this._onFocus);
      field.addEventListener("input", this._onInput);
      field.addEventListener("keydown", this._onKey);
      field.addEventListener("blur", this._onBlur);
      this._wiredField = field;
    }
    _render(query = "") {
      const dd = this._dd;
      const cfg = this._cfg_cache;
      dd.innerHTML = "";
      const q = query.trim().toLowerCase();
      let visible = 0;
      for (const group of this._groups) {
        const filtered = group.items.filter(
          (c) => !q || String(c[cfg.labelKey] ?? "").toLowerCase().includes(q)
        );
        if (!filtered.length) continue;
        visible += filtered.length;
        if (group.name !== null) {
          const hdr = document.createElement("div");
          hdr.className = "cf-group-header";
          hdr.textContent = group.name;
          dd.appendChild(hdr);
        }
        for (const c of filtered) {
          const label = String(c[cfg.labelKey] ?? "");
          const item = document.createElement("div");
          item.className = "cf-item";
          item.setAttribute("role", "option");
          item.dataset.label = label;
          item.appendChild(highlight(label, q));
          if (cfg.descriptionKey && c[cfg.descriptionKey] != null) {
            const desc = document.createElement("span");
            desc.className = "cf-item-desc";
            desc.textContent = String(c[cfg.descriptionKey]);
            item.appendChild(desc);
          }
          dd.appendChild(item);
        }
      }
      if (!visible) {
        const empty = document.createElement("div");
        empty.className = "cf-empty";
        empty.textContent = "Keine Eintr\xE4ge gefunden";
        dd.appendChild(empty);
      }
    }
    _setActive(items, idx) {
      items.forEach((el) => el.classList.remove("cf-active"));
      if (items[idx]) {
        items[idx].classList.add("cf-active");
        items[idx].scrollIntoView({ block: "nearest" });
      }
    }
    _select(label, field) {
      const entry = this._map.get(label);
      if (!entry) return;
      const cfg = this._cfg_cache;
      field.value = label;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
      const pw = document.querySelector(cfg.passwordSelector);
      if (pw) {
        pw.value = String(entry[cfg.passwordKey] ?? "");
        pw.dispatchEvent(new Event("input", { bubbles: true }));
        pw.dispatchEvent(new Event("change", { bubbles: true }));
      }
      this._close();
      this.dispatchEvent(new CustomEvent("credential-filler:select", {
        bubbles: true,
        detail: { username: label, entry, source: this._activeSource }
      }));
    }
    _close() {
      if (this._dd) this._dd.classList.remove("cf-open");
    }
    _reposition(field) {
      const r = field.getBoundingClientRect();
      const dd = this._dd;
      const cfg = this._cfg_cache;
      const dropdownHeight = dd.offsetHeight || 280;
      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      const pos = cfg.position || "auto";
      let showAbove = false;
      if (pos === "top") {
        showAbove = true;
      } else if (pos === "bottom") {
        showAbove = false;
      } else {
        const hasIgnoreAttr = field.hasAttribute("data-1p-ignore") || field.hasAttribute("data-lpignore") || field.hasAttribute("data-bwignore");
        const isSensitiveField = field.type === "password" || field.name?.includes("user") || field.id?.includes("user") || field.autocomplete?.includes("username");
        const likelyHasManager = !hasIgnoreAttr && isSensitiveField;
        const has1PButton = !!document.querySelector("com-1password-button");
        const has1PAttr = field.hasAttribute("data-1p-ignore") === false && !!field.getAttribute("data-com-1password-filled");
        if ((likelyHasManager || has1PButton || has1PAttr || spaceBelow < dropdownHeight + 20) && spaceAbove > dropdownHeight) {
          showAbove = true;
        }
      }
      if (showAbove) {
        dd.style.top = r.top - dropdownHeight - 4 + "px";
      } else {
        dd.style.top = r.bottom + 4 + "px";
      }
      dd.style.left = r.left + "px";
      dd.style.width = r.width + "px";
    }
    async _init() {
      const cfg = this._cfg();
      if (!cfg.usernameSelector || !cfg.passwordSelector) return;
      const defaults = this._parseInlineDefault();
      if (defaults?.length) this._apply(defaults, cfg, "default");
      if (!cfg.url) return;
      let fetched;
      try {
        const resp = await fetch(cfg.url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        fetched = await resp.json();
        if (!Array.isArray(fetched)) throw new Error("Response is not a JSON array");
      } catch (e) {
        this.dispatchEvent(new CustomEvent("credential-filler:error", {
          bubbles: true,
          detail: { error: e, usingDefault: defaults !== null }
        }));
        console.warn("[credential-filler] fetch failed, keeping defaults:", e);
        return;
      }
      this._apply(fetched, cfg, "url");
    }
    disconnectedCallback() {
      if (this._dd) this._dd.remove();
      this._dd = null;
      const f = this._wiredField;
      if (f) {
        if (this._onFocus) f.removeEventListener("focus", this._onFocus);
        if (this._onInput) f.removeEventListener("input", this._onInput);
        if (this._onKey) f.removeEventListener("keydown", this._onKey);
        if (this._onBlur) f.removeEventListener("blur", this._onBlur);
      }
    }
  };
  customElements.define("fucodo-auth-credential-filler", CredentialFiller);
})();
