(() => {
  // packages/fucodo-table-responsive/index.js
  var STYLE_ID = "responsive-table-wc-styles";
  var MOBILE_CLASS = "rt-mobile";
  var DESKTOP_CLASS = "rt-desktop";
  function parsePx(value) {
    if (value == null) return null;
    const s = String(value).trim();
    const m = s.match(/^(\d+(?:\.\d+)?)(px)?$/i);
    if (!m) return null;
    return Number(m[1]);
  }
  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
/* Scoped to the component tag (no Shadow DOM, but limited selectors) */
fucodo-table-responsive table.${DESKTOP_CLASS} {
  /* keep default table behavior; minimal safety */
  width: 100%;
  border-collapse: collapse;
}

/* Mobile/collapsed layout inspired by the data-label approach:
   td::before { content: attr(data-label) } */
fucodo-table-responsive table.${MOBILE_CLASS} {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

fucodo-table-responsive table.${MOBILE_CLASS} thead {
  /* Hide the header row while keeping it accessible-ish */
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

fucodo-table-responsive table.${MOBILE_CLASS} tr {
  display: block;
  margin: 0 0 1rem;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: .25rem;
  overflow: hidden;
}

fucodo-table-responsive table.${MOBILE_CLASS} td,
fucodo-table-responsive table.${MOBILE_CLASS} th {
  display: block;
  width: 100%;
}

fucodo-table-responsive table.${MOBILE_CLASS} td {
  display: flex;
  gap: .75rem;
  justify-content: space-between;
  padding: .5rem .75rem;
  border-bottom: 1px solid rgba(0,0,0,.08);
}

fucodo-table-responsive table.${MOBILE_CLASS} td:last-child {
  border-bottom: 0;
}

/* Key piece from the technique: read the data-label attribute */
fucodo-table-responsive table.${MOBILE_CLASS} td::before {
  content: attr(data-label);
  font-weight: 600;
  text-align: left;
  word-break: break-word;
}

fucodo-table-responsive table.${MOBILE_CLASS} td > * {
  /* keep cell content aligned nicely on the right */
  margin-left: auto;
}
`;
    document.head.appendChild(style);
  }
  function extractHeaderLabels(table) {
    let headerRow = table.tHead?.rows?.[0] || table.querySelector("thead tr") || table.rows?.[0] || null;
    if (!headerRow) return [];
    const labels = [];
    const cells = Array.from(headerRow.cells || []);
    for (const cell of cells) {
      const text = (cell.textContent || "").trim().replace(/\s+/g, " ");
      const span = Math.max(1, Number(cell.colSpan) || 1);
      for (let i = 0; i < span; i++) labels.push(text);
    }
    return labels;
  }
  function applyDataLabels(table) {
    const labels = extractHeaderLabels(table);
    if (!labels.length) return;
    const sections = [table.tBodies, [table.tFoot]].flat().filter(Boolean);
    const bodies = [];
    if (table.tBodies) bodies.push(...Array.from(table.tBodies));
    if (table.tFoot) bodies.push(table.tFoot);
    for (const body of bodies) {
      for (const row of Array.from(body.rows || [])) {
        let colIndex = 0;
        for (const cell of Array.from(row.cells || [])) {
          const tag = cell.tagName.toLowerCase();
          const span = Math.max(1, Number(cell.colSpan) || 1);
          if (tag === "td") {
            const label = labels[colIndex] ?? "";
            if (label) cell.setAttribute("data-label", label);
          }
          colIndex += span;
        }
      }
    }
  }
  function measureNaturalTableWidth(table) {
    const wrap = document.createElement("div");
    wrap.style.position = "absolute";
    wrap.style.left = "-99999px";
    wrap.style.top = "0";
    wrap.style.visibility = "hidden";
    wrap.style.pointerEvents = "none";
    wrap.style.width = "auto";
    const clone = table.cloneNode(true);
    clone.classList.remove(MOBILE_CLASS);
    clone.classList.add(DESKTOP_CLASS);
    clone.style.width = "max-content";
    clone.style.tableLayout = "auto";
    clone.style.maxWidth = "none";
    wrap.appendChild(clone);
    document.body.appendChild(wrap);
    const rect = clone.getBoundingClientRect();
    const width = Math.max(clone.scrollWidth, rect.width);
    document.body.removeChild(wrap);
    return Math.ceil(width);
  }
  var ResponsiveTable = class extends HTMLElement {
    static get observedAttributes() {
      return ["min-width"];
    }
    constructor() {
      super();
      this._table = null;
      this._resizeObserver = null;
      this._mutationObserver = null;
      this._autoMinWidth = null;
      this._scheduled = false;
    }
    connectedCallback() {
      ensureStyles();
      this._table = this.querySelector("table");
      if (!this._table) return;
      applyDataLabels(this._table);
      this._ensureMinWidth();
      this._updateMode();
      if ("ResizeObserver" in window) {
        this._resizeObserver = new ResizeObserver(() => this._updateMode());
        this._resizeObserver.observe(this);
      } else {
        window.addEventListener("resize", this._updateModeBound = () => this._updateMode());
      }
      this._mutationObserver = new MutationObserver(() => this._scheduleRefresh());
      this._mutationObserver.observe(this._table, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    disconnectedCallback() {
      this._resizeObserver?.disconnect();
      this._resizeObserver = null;
      if (this._updateModeBound) {
        window.removeEventListener("resize", this._updateModeBound);
        this._updateModeBound = null;
      }
      this._mutationObserver?.disconnect();
      this._mutationObserver = null;
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "min-width" && oldValue !== newValue) {
        this._autoMinWidth = null;
        this._ensureMinWidth();
        this._updateMode();
      }
    }
    _scheduleRefresh() {
      if (this._scheduled) return;
      this._scheduled = true;
      queueMicrotask(() => {
        this._scheduled = false;
        if (!this._table || !this.isConnected) return;
        applyDataLabels(this._table);
        if (parsePx(this.getAttribute("min-width")) == null) {
          this._autoMinWidth = null;
          this._ensureMinWidth();
        }
        this._updateMode();
      });
    }
    _ensureMinWidth() {
      if (!this._table) return;
      const configured = parsePx(this.getAttribute("min-width"));
      if (configured != null) {
        this._autoMinWidth = configured;
        return;
      }
      if (this._autoMinWidth == null) {
        this._autoMinWidth = measureNaturalTableWidth(this._table);
      }
    }
    _updateMode() {
      if (!this._table) return;
      const minWidth = this._autoMinWidth ?? parsePx(this.getAttribute("min-width")) ?? 0;
      const available = this.clientWidth || this.getBoundingClientRect().width || 0;
      console.log(this._table.width);
      const useMobile = available > 0 && minWidth > 0 ? available < minWidth : false;
      if (useMobile) {
        this._table.classList.add(MOBILE_CLASS);
        this._table.classList.remove(DESKTOP_CLASS);
      } else {
        this._table.classList.add(DESKTOP_CLASS);
        this._table.classList.remove(MOBILE_CLASS);
      }
    }
  };
  customElements.define("fucodo-table-responsive", ResponsiveTable);
})();
