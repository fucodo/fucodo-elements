(() => {
  // packages/fucodo-chart-roadmap-2/style.scss
  var style_default = `@charset "UTF-8";
:host {
  display: flex;
  flex-direction: column;
  font-family: "DM Mono", "IBM Plex Mono", "Fira Code", ui-monospace, monospace;
  font-size: 12px;
  /* \u2500\u2500 Theme tokens \u2500\u2500\u2500 */
  --fc-bg: #0d1117;
  --fc-surface: #161b22;
  --fc-border: #21262d;
  --fc-text: #c9d1d9;
  --fc-text-dim: #6e7681;
  --fc-accent: #58a6ff;
  --fc-accent-glow: rgba(88, 166, 255, 0.18);
  --fc-today-bg: rgba(88, 166, 255, 0.10);
  --fc-today-line: #58a6ff;
  --fc-weekend-bg: rgba(255, 255, 255, 0.015);
  --fc-holiday-bg: rgba(248, 113, 113, 0.08);
  --fc-group-bg: rgba(88, 166, 255, 0.05);
  --fc-group-text: #79c0ff;
  --fc-row-hover: rgba(255, 255, 255, 0.03);
  --fc-bar-h: 22px;
  --fc-bar-radius: 3px;
  --fc-progress-alpha: 0.38;
  --fc-arrow: rgba(139, 148, 158, 0.6);
  --fc-arrow-hover: #f0f6fc;
  color: var(--fc-text);
  background: var(--fc-bg);
  overflow: hidden;
}

/* \u2500\u2500 Toolbar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-border);
  flex-shrink: 0;
  flex-wrap: wrap;
}

.vm-btn {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--fc-border);
  background: transparent;
  color: var(--fc-text-dim);
  font: inherit;
  font-size: 11px;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.vm-btn:hover {
  background: var(--fc-accent-glow);
  color: var(--fc-text);
}

.vm-btn.active {
  background: var(--fc-accent-glow);
  border-color: var(--fc-accent);
  color: var(--fc-accent);
}

.today-btn {
  margin-left: auto;
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--fc-accent);
  background: var(--fc-accent-glow);
  color: var(--fc-accent);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.15s;
}

.today-btn:hover {
  background: rgba(88, 166, 255, 0.28);
}

/* \u2500\u2500 Layout \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.gantt-wrap {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

/* \u2500\u2500 Sidebar \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.sidebar {
  flex-shrink: 0;
  overflow: hidden;
  border-right: 1px solid var(--fc-border);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  flex-shrink: 0;
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-border);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 6px;
}

.sidebar-header span {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--fc-text-dim);
  text-transform: uppercase;
}

.sidebar-rows {
  flex: 1;
  overflow: hidden;
  background: var(--fc-bg);
}

/* \u2500\u2500 Chart area \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.chart-header-wrap {
  flex-shrink: 0;
  overflow: hidden;
  background: var(--fc-surface);
  border-bottom: 1px solid var(--fc-border);
}

.chart-scroll {
  flex: 1;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--fc-border) transparent;
}

.chart-scroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.chart-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.chart-scroll::-webkit-scrollbar-thumb {
  background: var(--fc-border);
  border-radius: 3px;
}

/* \u2500\u2500 SVG elements \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
svg {
  display: block;
  overflow: visible;
}

.group-header-row {
  fill: var(--fc-group-bg);
  cursor: pointer;
}

.group-header-row:hover {
  fill: rgba(88, 166, 255, 0.09);
}

.task-row-bg:hover {
  fill: var(--fc-row-hover);
}

.bar-group {
  cursor: grab;
}

.bar-group:active {
  cursor: grabbing;
}

.bar-group.readonly {
  cursor: default;
}

.bar-bg {
  rx: var(--fc-bar-radius, 3);
  transition: filter 0.1s;
}

.bar-group:hover .bar-bg {
  filter: brightness(1.18);
}

.bar-progress {
  opacity: var(--fc-progress-alpha, 0.38);
}

.resize-handle {
  cursor: ew-resize;
}

.resize-handle-progress {
  cursor: ew-resize;
}

.dep-arrow {
  fill: none;
  stroke: var(--fc-arrow);
  stroke-width: 1.5;
}

.dep-arrowhead {
  fill: var(--fc-arrow);
}

.today-col {
  fill: var(--fc-today-bg);
}

.today-line {
  stroke: var(--fc-today-line);
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
}

.today-label {
  fill: var(--fc-today-line);
  font-size: 10px;
  font-family: inherit;
}

.weekend-col {
  fill: var(--fc-weekend-bg);
}

.holiday-col {
  fill: var(--fc-holiday-bg);
}

.header-upper-text {
  fill: var(--fc-text-dim);
  font-size: 10px;
  font-family: inherit;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.header-lower-text {
  fill: var(--fc-text-dim);
  font-size: 11px;
  font-family: inherit;
}

.header-sep {
  stroke: var(--fc-border);
  stroke-width: 1;
}

.group-label {
  fill: var(--fc-group-text);
  font-size: 11px;
  font-family: inherit;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.group-chevron {
  fill: none;
  stroke: var(--fc-group-text);
  stroke-width: 1.5;
  stroke-linecap: round;
}

.task-label {
  fill: var(--fc-text);
  font-size: 11px;
  font-family: inherit;
  dominant-baseline: middle;
}

.bar-label {
  fill: #fff;
  font-size: 10px;
  font-family: inherit;
  dominant-baseline: middle;
  pointer-events: none;
}

/* \u2500\u2500 Tooltip \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
.tooltip {
  position: absolute;
  background: var(--fc-surface);
  border: 1px solid var(--fc-border);
  border-radius: 6px;
  padding: 10px 14px;
  pointer-events: none;
  z-index: 100;
  min-width: 170px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: opacity 0.1s;
}

.tooltip-title {
  font-size: 12px;
  color: var(--fc-text);
  margin-bottom: 6px;
  font-weight: 600;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 11px;
  color: var(--fc-text-dim);
  margin-bottom: 3px;
}

.tooltip-row span:last-child {
  color: var(--fc-text);
}

.tooltip-progress-bar {
  margin-top: 8px;
  height: 3px;
  background: var(--fc-border);
  border-radius: 2px;
  overflow: hidden;
}

.tooltip-progress-fill {
  height: 100%;
  background: var(--fc-accent);
  border-radius: 2px;
}`;

  // node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t3, e4, o5) {
      if (this._$cssResult$ = true, o5 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t3, this.t = e4;
    }
    get styleSheet() {
      let t3 = this.o;
      const s4 = this.t;
      if (e && void 0 === t3) {
        const e4 = void 0 !== s4 && 1 === s4.length;
        e4 && (t3 = o.get(s4)), void 0 === t3 && ((this.o = t3 = new CSSStyleSheet()).replaceSync(this.cssText), e4 && o.set(s4, t3));
      }
      return t3;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t3) => new n("string" == typeof t3 ? t3 : t3 + "", void 0, s);
  var S = (s4, o5) => {
    if (e) s4.adoptedStyleSheets = o5.map(((t3) => t3 instanceof CSSStyleSheet ? t3 : t3.styleSheet));
    else for (const e4 of o5) {
      const o6 = document.createElement("style"), n4 = t.litNonce;
      void 0 !== n4 && o6.setAttribute("nonce", n4), o6.textContent = e4.cssText, s4.appendChild(o6);
    }
  };
  var c = e ? (t3) => t3 : (t3) => t3 instanceof CSSStyleSheet ? ((t4) => {
    let e4 = "";
    for (const s4 of t4.cssRules) e4 += s4.cssText;
    return r(e4);
  })(t3) : t3;

  // node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t3, s4) => t3;
  var u = { toAttribute(t3, s4) {
    switch (s4) {
      case Boolean:
        t3 = t3 ? l : null;
        break;
      case Object:
      case Array:
        t3 = null == t3 ? t3 : JSON.stringify(t3);
    }
    return t3;
  }, fromAttribute(t3, s4) {
    let i5 = t3;
    switch (s4) {
      case Boolean:
        i5 = null !== t3;
        break;
      case Number:
        i5 = null === t3 ? null : Number(t3);
        break;
      case Object:
      case Array:
        try {
          i5 = JSON.parse(t3);
        } catch (t4) {
          i5 = null;
        }
    }
    return i5;
  } };
  var f = (t3, s4) => !i2(t3, s4);
  var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
  Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var y = class extends HTMLElement {
    static addInitializer(t3) {
      this._$Ei(), (this.l ??= []).push(t3);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t3, s4 = b) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t3) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t3, s4), !s4.noAccessor) {
        const i5 = Symbol(), h3 = this.getPropertyDescriptor(t3, i5, s4);
        void 0 !== h3 && e2(this.prototype, t3, h3);
      }
    }
    static getPropertyDescriptor(t3, s4, i5) {
      const { get: e4, set: r4 } = h(this.prototype, t3) ?? { get() {
        return this[s4];
      }, set(t4) {
        this[s4] = t4;
      } };
      return { get: e4, set(s5) {
        const h3 = e4?.call(this);
        r4?.call(this, s5), this.requestUpdate(t3, h3, i5);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t3) {
      return this.elementProperties.get(t3) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t3 = n2(this);
      t3.finalize(), void 0 !== t3.l && (this.l = [...t3.l]), this.elementProperties = new Map(t3.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t4 = this.properties, s4 = [...r2(t4), ...o2(t4)];
        for (const i5 of s4) this.createProperty(i5, t4[i5]);
      }
      const t3 = this[Symbol.metadata];
      if (null !== t3) {
        const s4 = litPropertyMetadata.get(t3);
        if (void 0 !== s4) for (const [t4, i5] of s4) this.elementProperties.set(t4, i5);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t4, s4] of this.elementProperties) {
        const i5 = this._$Eu(t4, s4);
        void 0 !== i5 && this._$Eh.set(i5, t4);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i5 = [];
      if (Array.isArray(s4)) {
        const e4 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e4) i5.unshift(c(s5));
      } else void 0 !== s4 && i5.push(c(s4));
      return i5;
    }
    static _$Eu(t3, s4) {
      const i5 = s4.attribute;
      return false === i5 ? void 0 : "string" == typeof i5 ? i5 : "string" == typeof t3 ? t3.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise(((t3) => this.enableUpdating = t3)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((t3) => t3(this)));
    }
    addController(t3) {
      (this._$EO ??= /* @__PURE__ */ new Set()).add(t3), void 0 !== this.renderRoot && this.isConnected && t3.hostConnected?.();
    }
    removeController(t3) {
      this._$EO?.delete(t3);
    }
    _$E_() {
      const t3 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i5 of s4.keys()) this.hasOwnProperty(i5) && (t3.set(i5, this[i5]), delete this[i5]);
      t3.size > 0 && (this._$Ep = t3);
    }
    createRenderRoot() {
      const t3 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t3, this.constructor.elementStyles), t3;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach(((t3) => t3.hostConnected?.()));
    }
    enableUpdating(t3) {
    }
    disconnectedCallback() {
      this._$EO?.forEach(((t3) => t3.hostDisconnected?.()));
    }
    attributeChangedCallback(t3, s4, i5) {
      this._$AK(t3, i5);
    }
    _$ET(t3, s4) {
      const i5 = this.constructor.elementProperties.get(t3), e4 = this.constructor._$Eu(t3, i5);
      if (void 0 !== e4 && true === i5.reflect) {
        const h3 = (void 0 !== i5.converter?.toAttribute ? i5.converter : u).toAttribute(s4, i5.type);
        this._$Em = t3, null == h3 ? this.removeAttribute(e4) : this.setAttribute(e4, h3), this._$Em = null;
      }
    }
    _$AK(t3, s4) {
      const i5 = this.constructor, e4 = i5._$Eh.get(t3);
      if (void 0 !== e4 && this._$Em !== e4) {
        const t4 = i5.getPropertyOptions(e4), h3 = "function" == typeof t4.converter ? { fromAttribute: t4.converter } : void 0 !== t4.converter?.fromAttribute ? t4.converter : u;
        this._$Em = e4;
        const r4 = h3.fromAttribute(s4, t4.type);
        this[e4] = r4 ?? this._$Ej?.get(e4) ?? r4, this._$Em = null;
      }
    }
    requestUpdate(t3, s4, i5) {
      if (void 0 !== t3) {
        const e4 = this.constructor, h3 = this[t3];
        if (i5 ??= e4.getPropertyOptions(t3), !((i5.hasChanged ?? f)(h3, s4) || i5.useDefault && i5.reflect && h3 === this._$Ej?.get(t3) && !this.hasAttribute(e4._$Eu(t3, i5)))) return;
        this.C(t3, s4, i5);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t3, s4, { useDefault: i5, reflect: e4, wrapped: h3 }, r4) {
      i5 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t3) && (this._$Ej.set(t3, r4 ?? s4 ?? this[t3]), true !== h3 || void 0 !== r4) || (this._$AL.has(t3) || (this.hasUpdated || i5 || (s4 = void 0), this._$AL.set(t3, s4)), true === e4 && this._$Em !== t3 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t3));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t4) {
        Promise.reject(t4);
      }
      const t3 = this.scheduleUpdate();
      return null != t3 && await t3, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t5, s5] of this._$Ep) this[t5] = s5;
          this._$Ep = void 0;
        }
        const t4 = this.constructor.elementProperties;
        if (t4.size > 0) for (const [s5, i5] of t4) {
          const { wrapped: t5 } = i5, e4 = this[s5];
          true !== t5 || this._$AL.has(s5) || void 0 === e4 || this.C(s5, void 0, i5, e4);
        }
      }
      let t3 = false;
      const s4 = this._$AL;
      try {
        t3 = this.shouldUpdate(s4), t3 ? (this.willUpdate(s4), this._$EO?.forEach(((t4) => t4.hostUpdate?.())), this.update(s4)) : this._$EM();
      } catch (s5) {
        throw t3 = false, this._$EM(), s5;
      }
      t3 && this._$AE(s4);
    }
    willUpdate(t3) {
    }
    _$AE(t3) {
      this._$EO?.forEach(((t4) => t4.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t3)), this.updated(t3);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t3) {
      return true;
    }
    update(t3) {
      this._$Eq &&= this._$Eq.forEach(((t4) => this._$ET(t4, this[t4]))), this._$EM();
    }
    updated(t3) {
    }
    firstUpdated(t3) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.1");

  // node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t3) => t3 }) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t3) => null === t3 || "object" != typeof t3 && "function" != typeof t3;
  var a2 = Array.isArray;
  var u2 = (t3) => a2(t3) || "function" == typeof t3?.[Symbol.iterator];
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t3) => (i5, ...s4) => ({ _$litType$: t3, strings: i5, values: s4 });
  var x = y2(1);
  var b2 = y2(2);
  var w = y2(3);
  var T = Symbol.for("lit-noChange");
  var E = Symbol.for("lit-nothing");
  var A = /* @__PURE__ */ new WeakMap();
  var C = r3.createTreeWalker(r3, 129);
  function P(t3, i5) {
    if (!a2(t3) || !t3.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== s2 ? s2.createHTML(i5) : i5;
  }
  var V = (t3, i5) => {
    const s4 = t3.length - 1, o5 = [];
    let r4, l3 = 2 === i5 ? "<svg>" : 3 === i5 ? "<math>" : "", c4 = f2;
    for (let i6 = 0; i6 < s4; i6++) {
      const s5 = t3[i6];
      let a3, u3, d3 = -1, y3 = 0;
      for (; y3 < s5.length && (c4.lastIndex = y3, u3 = c4.exec(s5), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r4 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r4 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r4 = void 0);
      const x2 = c4 === m && t3[i6 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === f2 ? s5 + n3 : d3 >= 0 ? (o5.push(a3), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (-2 === d3 ? i6 : x2);
    }
    return [P(t3, l3 + (t3[s4] || "<?>") + (2 === i5 ? "</svg>" : 3 === i5 ? "</math>" : "")), o5];
  };
  var N = class _N {
    constructor({ strings: t3, _$litType$: s4 }, n4) {
      let r4;
      this.parts = [];
      let c4 = 0, a3 = 0;
      const u3 = t3.length - 1, d3 = this.parts, [f3, v2] = V(t3, s4);
      if (this.el = _N.createElement(f3, n4), C.currentNode = this.el.content, 2 === s4 || 3 === s4) {
        const t4 = this.el.content.firstChild;
        t4.replaceWith(...t4.childNodes);
      }
      for (; null !== (r4 = C.nextNode()) && d3.length < u3; ) {
        if (1 === r4.nodeType) {
          if (r4.hasAttributes()) for (const t4 of r4.getAttributeNames()) if (t4.endsWith(e3)) {
            const i5 = v2[a3++], s5 = r4.getAttribute(t4).split(h2), e4 = /([.?@])?(.*)/.exec(i5);
            d3.push({ type: 1, index: c4, name: e4[2], strings: s5, ctor: "." === e4[1] ? H : "?" === e4[1] ? I : "@" === e4[1] ? L : k }), r4.removeAttribute(t4);
          } else t4.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r4.removeAttribute(t4));
          if ($.test(r4.tagName)) {
            const t4 = r4.textContent.split(h2), s5 = t4.length - 1;
            if (s5 > 0) {
              r4.textContent = i3 ? i3.emptyScript : "";
              for (let i5 = 0; i5 < s5; i5++) r4.append(t4[i5], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
              r4.append(t4[s5], l2());
            }
          }
        } else if (8 === r4.nodeType) if (r4.data === o3) d3.push({ type: 2, index: c4 });
        else {
          let t4 = -1;
          for (; -1 !== (t4 = r4.data.indexOf(h2, t4 + 1)); ) d3.push({ type: 7, index: c4 }), t4 += h2.length - 1;
        }
        c4++;
      }
    }
    static createElement(t3, i5) {
      const s4 = r3.createElement("template");
      return s4.innerHTML = t3, s4;
    }
  };
  function S2(t3, i5, s4 = t3, e4) {
    if (i5 === T) return i5;
    let h3 = void 0 !== e4 ? s4._$Co?.[e4] : s4._$Cl;
    const o5 = c3(i5) ? void 0 : i5._$litDirective$;
    return h3?.constructor !== o5 && (h3?._$AO?.(false), void 0 === o5 ? h3 = void 0 : (h3 = new o5(t3), h3._$AT(t3, s4, e4)), void 0 !== e4 ? (s4._$Co ??= [])[e4] = h3 : s4._$Cl = h3), void 0 !== h3 && (i5 = S2(t3, h3._$AS(t3, i5.values), h3, e4)), i5;
  }
  var M = class {
    constructor(t3, i5) {
      this._$AV = [], this._$AN = void 0, this._$AD = t3, this._$AM = i5;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t3) {
      const { el: { content: i5 }, parts: s4 } = this._$AD, e4 = (t3?.creationScope ?? r3).importNode(i5, true);
      C.currentNode = e4;
      let h3 = C.nextNode(), o5 = 0, n4 = 0, l3 = s4[0];
      for (; void 0 !== l3; ) {
        if (o5 === l3.index) {
          let i6;
          2 === l3.type ? i6 = new R(h3, h3.nextSibling, this, t3) : 1 === l3.type ? i6 = new l3.ctor(h3, l3.name, l3.strings, this, t3) : 6 === l3.type && (i6 = new z(h3, this, t3)), this._$AV.push(i6), l3 = s4[++n4];
        }
        o5 !== l3?.index && (h3 = C.nextNode(), o5++);
      }
      return C.currentNode = r3, e4;
    }
    p(t3) {
      let i5 = 0;
      for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t3, s4, i5), i5 += s4.strings.length - 2) : s4._$AI(t3[i5])), i5++;
    }
  };
  var R = class _R {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t3, i5, s4, e4) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t3, this._$AB = i5, this._$AM = s4, this.options = e4, this._$Cv = e4?.isConnected ?? true;
    }
    get parentNode() {
      let t3 = this._$AA.parentNode;
      const i5 = this._$AM;
      return void 0 !== i5 && 11 === t3?.nodeType && (t3 = i5.parentNode), t3;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t3, i5 = this) {
      t3 = S2(this, t3, i5), c3(t3) ? t3 === E || null == t3 || "" === t3 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t3 !== this._$AH && t3 !== T && this._(t3) : void 0 !== t3._$litType$ ? this.$(t3) : void 0 !== t3.nodeType ? this.T(t3) : u2(t3) ? this.k(t3) : this._(t3);
    }
    O(t3) {
      return this._$AA.parentNode.insertBefore(t3, this._$AB);
    }
    T(t3) {
      this._$AH !== t3 && (this._$AR(), this._$AH = this.O(t3));
    }
    _(t3) {
      this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t3 : this.T(r3.createTextNode(t3)), this._$AH = t3;
    }
    $(t3) {
      const { values: i5, _$litType$: s4 } = t3, e4 = "number" == typeof s4 ? this._$AC(t3) : (void 0 === s4.el && (s4.el = N.createElement(P(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e4) this._$AH.p(i5);
      else {
        const t4 = new M(e4, this), s5 = t4.u(this.options);
        t4.p(i5), this.T(s5), this._$AH = t4;
      }
    }
    _$AC(t3) {
      let i5 = A.get(t3.strings);
      return void 0 === i5 && A.set(t3.strings, i5 = new N(t3)), i5;
    }
    k(t3) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i5 = this._$AH;
      let s4, e4 = 0;
      for (const h3 of t3) e4 === i5.length ? i5.push(s4 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s4 = i5[e4], s4._$AI(h3), e4++;
      e4 < i5.length && (this._$AR(s4 && s4._$AB.nextSibling, e4), i5.length = e4);
    }
    _$AR(t3 = this._$AA.nextSibling, i5) {
      for (this._$AP?.(false, true, i5); t3 !== this._$AB; ) {
        const i6 = t3.nextSibling;
        t3.remove(), t3 = i6;
      }
    }
    setConnected(t3) {
      void 0 === this._$AM && (this._$Cv = t3, this._$AP?.(t3));
    }
  };
  var k = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t3, i5, s4, e4, h3) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t3, this.name = i5, this._$AM = e4, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = E;
    }
    _$AI(t3, i5 = this, s4, e4) {
      const h3 = this.strings;
      let o5 = false;
      if (void 0 === h3) t3 = S2(this, t3, i5, 0), o5 = !c3(t3) || t3 !== this._$AH && t3 !== T, o5 && (this._$AH = t3);
      else {
        const e5 = t3;
        let n4, r4;
        for (t3 = h3[0], n4 = 0; n4 < h3.length - 1; n4++) r4 = S2(this, e5[s4 + n4], i5, n4), r4 === T && (r4 = this._$AH[n4]), o5 ||= !c3(r4) || r4 !== this._$AH[n4], r4 === E ? t3 = E : t3 !== E && (t3 += (r4 ?? "") + h3[n4 + 1]), this._$AH[n4] = r4;
      }
      o5 && !e4 && this.j(t3);
    }
    j(t3) {
      t3 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t3 ?? "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t3) {
      this.element[this.name] = t3 === E ? void 0 : t3;
    }
  };
  var I = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t3) {
      this.element.toggleAttribute(this.name, !!t3 && t3 !== E);
    }
  };
  var L = class extends k {
    constructor(t3, i5, s4, e4, h3) {
      super(t3, i5, s4, e4, h3), this.type = 5;
    }
    _$AI(t3, i5 = this) {
      if ((t3 = S2(this, t3, i5, 0) ?? E) === T) return;
      const s4 = this._$AH, e4 = t3 === E && s4 !== E || t3.capture !== s4.capture || t3.once !== s4.once || t3.passive !== s4.passive, h3 = t3 !== E && (s4 === E || e4);
      e4 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t3), this._$AH = t3;
    }
    handleEvent(t3) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t3) : this._$AH.handleEvent(t3);
    }
  };
  var z = class {
    constructor(t3, i5, s4) {
      this.element = t3, this.type = 6, this._$AN = void 0, this._$AM = i5, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t3) {
      S2(this, t3);
    }
  };
  var j = t2.litHtmlPolyfillSupport;
  j?.(N, R), (t2.litHtmlVersions ??= []).push("3.3.1");
  var B = (t3, i5, s4) => {
    const e4 = s4?.renderBefore ?? i5;
    let h3 = e4._$litPart$;
    if (void 0 === h3) {
      const t4 = s4?.renderBefore ?? null;
      e4._$litPart$ = h3 = new R(i5.insertBefore(l2(), t4), t4, void 0, s4 ?? {});
    }
    return h3._$AI(t3), h3;
  };

  // node_modules/lit-element/lit-element.js
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t3 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t3.firstChild, t3;
    }
    update(t3) {
      const r4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t3), this._$Do = B(r4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return T;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
  var o4 = s3.litElementPolyfillSupport;
  o4?.({ LitElement: i4 });
  (s3.litElementVersions ??= []).push("4.2.1");

  // packages/fucodo-chart-roadmap-2/index.js
  var MS_DAY = 864e5;
  function parseDate(str) {
    if (str instanceof Date) return new Date(str);
    const [y3, m2, d3] = String(str).split("-").map(Number);
    return new Date(y3, m2 - 1, d3);
  }
  function formatDate(d3) {
    return `${d3.getFullYear()}-${String(d3.getMonth() + 1).padStart(2, "0")}-${String(d3.getDate()).padStart(2, "0")}`;
  }
  function addDays(d3, n4) {
    const r4 = new Date(d3);
    r4.setDate(r4.getDate() + n4);
    return r4;
  }
  function addMonths(d3, n4) {
    const r4 = new Date(d3);
    r4.setMonth(r4.getMonth() + n4);
    return r4;
  }
  function diffDays(a3, b3) {
    return Math.round((b3 - a3) / MS_DAY);
  }
  function startOfDay(d3) {
    return new Date(d3.getFullYear(), d3.getMonth(), d3.getDate());
  }
  function startOfWeek(d3) {
    const r4 = startOfDay(d3);
    const day = r4.getDay();
    r4.setDate(r4.getDate() - (day === 0 ? 6 : day - 1));
    return r4;
  }
  function startOfMonth(d3) {
    return new Date(d3.getFullYear(), d3.getMonth(), 1);
  }
  function startOfQuarter(d3) {
    return new Date(d3.getFullYear(), Math.floor(d3.getMonth() / 3) * 3, 1);
  }
  function startOfYear(d3) {
    return new Date(d3.getFullYear(), 0, 1);
  }
  function endOfMonth(d3) {
    return new Date(d3.getFullYear(), d3.getMonth() + 1, 0);
  }
  function daysInMonth(d3) {
    return endOfMonth(d3).getDate();
  }
  function isSameDay(a3, b3) {
    return a3.getFullYear() === b3.getFullYear() && a3.getMonth() === b3.getMonth() && a3.getDate() === b3.getDate();
  }
  function isWeekend(d3) {
    const day = d3.getDay();
    return day === 0 || day === 6;
  }
  function getISOWeek(d3) {
    const tmp = new Date(Date.UTC(d3.getFullYear(), d3.getMonth(), d3.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil(((tmp - yearStart) / MS_DAY + 1) / 7);
  }
  var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var QUARTERS = ["Q1", "Q2", "Q3", "Q4"];
  var VIEW_MODES = ["Day", "Week", "Month", "Quarter", "Year"];
  var VIEW_DEF = {
    Day: {
      colWidth: 38,
      padBefore: 7,
      padAfter: 14,
      /** Returns array of {date} for each column (lower unit) */
      columns(start, end) {
        const cols = [];
        let d3 = startOfDay(start);
        while (d3 <= end) {
          cols.push({ date: d3 });
          d3 = addDays(d3, 1);
        }
        return cols;
      },
      /** Upper-header spans: [{ label, colSpan }] */
      upperSpans(cols) {
        return _groupByFn(
          cols,
          (c4) => `${c4.date.getFullYear()}-${c4.date.getMonth()}`,
          (c4) => `${MONTHS_SHORT[c4.date.getMonth()]} ${c4.date.getFullYear()}`
        );
      },
      lowerLabel: (c4) => String(c4.date.getDate()),
      isWeekend: (c4) => isWeekend(c4.date),
      ganttStart: (d3) => addDays(startOfDay(d3), -7),
      ganttEnd: (d3) => addDays(startOfDay(d3), 14)
    },
    Week: {
      colWidth: 120,
      padBefore: 2,
      padAfter: 4,
      columns(start, end) {
        const cols = [];
        let d3 = startOfWeek(start);
        while (d3 <= end) {
          cols.push({ date: d3 });
          d3 = addDays(d3, 7);
        }
        return cols;
      },
      upperSpans(cols) {
        return _groupByFn(
          cols,
          (c4) => `${c4.date.getFullYear()}-${c4.date.getMonth()}`,
          (c4) => `${MONTHS_SHORT[c4.date.getMonth()]} ${c4.date.getFullYear()}`
        );
      },
      lowerLabel: (c4) => `W${getISOWeek(c4.date)}`,
      isWeekend: () => false,
      ganttStart: (d3) => addDays(startOfWeek(d3), -14),
      ganttEnd: (d3) => addDays(startOfWeek(d3), 28)
    },
    Month: {
      colWidth: 100,
      padBefore: 1,
      padAfter: 2,
      columns(start, end) {
        const cols = [];
        let d3 = startOfMonth(start);
        while (d3 <= end) {
          cols.push({ date: d3, days: daysInMonth(d3) });
          d3 = addMonths(d3, 1);
        }
        return cols;
      },
      upperSpans(cols) {
        return _groupByFn(
          cols,
          (c4) => c4.date.getFullYear(),
          (c4) => String(c4.date.getFullYear())
        );
      },
      lowerLabel: (c4) => MONTHS_SHORT[c4.date.getMonth()],
      isWeekend: () => false,
      ganttStart: (d3) => startOfMonth(addMonths(d3, -1)),
      ganttEnd: (d3) => startOfMonth(addMonths(d3, 2))
    },
    Quarter: {
      colWidth: 140,
      padBefore: 1,
      padAfter: 2,
      columns(start, end) {
        const cols = [];
        let d3 = startOfQuarter(start);
        while (d3 <= end) {
          const qIdx = Math.floor(d3.getMonth() / 3);
          cols.push({ date: d3, days: diffDays(d3, addMonths(d3, 3)) });
          d3 = addMonths(d3, 3);
        }
        return cols;
      },
      upperSpans(cols) {
        return _groupByFn(
          cols,
          (c4) => c4.date.getFullYear(),
          (c4) => String(c4.date.getFullYear())
        );
      },
      lowerLabel: (c4) => QUARTERS[Math.floor(c4.date.getMonth() / 3)],
      isWeekend: () => false,
      ganttStart: (d3) => startOfQuarter(addMonths(d3, -3)),
      ganttEnd: (d3) => startOfQuarter(addMonths(d3, 6))
    },
    Year: {
      colWidth: 100,
      padBefore: 1,
      padAfter: 2,
      columns(start, end) {
        const cols = [];
        let d3 = startOfYear(start);
        while (d3 <= end) {
          cols.push({ date: d3, days: diffDays(d3, startOfYear(addMonths(d3, 12))) });
          d3 = new Date(d3.getFullYear() + 1, 0, 1);
        }
        return cols;
      },
      upperSpans(cols) {
        const decade = (c4) => `${Math.floor(c4.date.getFullYear() / 10) * 10}s`;
        return _groupByFn(cols, decade, decade);
      },
      lowerLabel: (c4) => String(c4.date.getFullYear()),
      isWeekend: () => false,
      ganttStart: (d3) => new Date(d3.getFullYear() - 1, 0, 1),
      ganttEnd: (d3) => new Date(d3.getFullYear() + 2, 0, 1)
    }
  };
  function _groupByFn(cols, keyFn, labelFn) {
    const spans = [];
    for (const col of cols) {
      const key = keyFn(col);
      if (spans.length && spans[spans.length - 1].key === key) {
        spans[spans.length - 1].colSpan++;
      } else {
        spans.push({ key, label: labelFn(col), colSpan: 1 });
      }
    }
    return spans;
  }
  var PALETTE = [
    "#6366f1",
    "#22d3ee",
    "#f59e0b",
    "#10b981",
    "#f43f5e",
    "#a855f7",
    "#3b82f6",
    "#fb923c",
    "#84cc16",
    "#ec4899"
  ];
  var FucodoChartRoadmap = class extends i4 {
    // ── Public properties ────────────────────────────────────────────────────
    static properties = {
      tasks: { type: Array },
      viewMode: { type: String, attribute: "view-mode", reflect: true },
      rowHeight: { type: Number, attribute: "row-height" },
      barPadding: { type: Number, attribute: "bar-padding" },
      headerHeight: { type: Number, attribute: "header-height" },
      groupHeaderHeight: { type: Number, attribute: "group-header-height" },
      sidebarWidth: { type: Number, attribute: "sidebar-width" },
      readonly: { type: Boolean },
      todayButton: { type: Boolean, attribute: "today-button" },
      viewModeSelect: { type: Boolean, attribute: "view-mode-select" },
      /** Comma-separated ISO dates to highlight as holidays */
      holidays: { type: String },
      /** Whether to show progress drag handle */
      progressDraggable: { type: Boolean, attribute: "progress-draggable" },
      /** Radius of the task bar corners (in pixels) */
      barCornerRadius: { type: Number, attribute: "bar-corner-radius" },
      /** Curve radius of arrows connecting dependencies */
      arrowCurve: { type: Number, attribute: "arrow-curve" }
    };
    // ── Styles ───────────────────────────────────────────────────────────────
    static styles = typeof style_default === "string" ? r(style_default) : style_default;
    // ── Lifecycle ────────────────────────────────────────────────────────────
    constructor() {
      super();
      this.tasks = [];
      this.viewMode = "Month";
      this.rowHeight = 44;
      this.barPadding = 9;
      this.headerHeight = 60;
      this.groupHeaderHeight = 34;
      this.sidebarWidth = 240;
      this.readonly = false;
      this.todayButton = true;
      this.viewModeSelect = true;
      this.holidays = "";
      this.progressDraggable = false;
      this.barCornerRadius = 3;
      this.arrowCurve = 5;
      this._collapsedGroups = /* @__PURE__ */ new Set();
      this._tooltip = null;
      this._dragState = null;
      this._headerScrollLeft = 0;
    }
    updated(changed) {
      if (changed.has("tasks") || changed.has("viewMode")) {
        this._scheduleScrollToToday();
      }
    }
    _scheduleScrollToToday() {
      requestAnimationFrame(() => this._scrollToToday(false));
    }
    // ── Derived data ─────────────────────────────────────────────────────────
    get _vdef() {
      return VIEW_DEF[this.viewMode] || VIEW_DEF.Month;
    }
    get _holidaySet() {
      if (!this.holidays) return /* @__PURE__ */ new Set();
      return new Set(this.holidays.split(",").map((s4) => s4.trim()));
    }
    /** Parse tasks, assign y-positions and palette colours */
    get _processedTasks() {
      const tasksArr = this.tasks || [];
      const groups = /* @__PURE__ */ new Map();
      const colourMap = /* @__PURE__ */ new Map();
      let colourIdx = 0;
      if (!Array.isArray(tasksArr)) {
        console.warn("FucodoChartRoadmap: tasks is not an array", tasksArr);
        return { rows: [], taskMap: /* @__PURE__ */ new Map() };
      }
      for (const t3 of tasksArr) {
        const g2 = t3.group || "";
        if (!groups.has(g2)) groups.set(g2, []);
        groups.get(g2).push(t3);
        if (!colourMap.has(g2)) colourMap.set(g2, PALETTE[colourIdx++ % PALETTE.length]);
      }
      const rows = [];
      const taskMap = /* @__PURE__ */ new Map();
      let y3 = 0;
      for (const [group, gtasks] of groups) {
        const collapsed = this._collapsedGroups.has(group);
        rows.push({ type: "group", group, y: y3, collapsed });
        y3 += this.groupHeaderHeight;
        if (!collapsed) {
          for (const t3 of gtasks) {
            const start = parseDate(t3.start);
            const end = parseDate(t3.end || t3.start);
            const colour = t3.color || colourMap.get(group);
            const proc = { ...t3, _start: start, _end: end, _colour: colour, _y: y3, _group: group };
            rows.push({ type: "task", task: proc, y: y3 });
            taskMap.set(t3.id, proc);
            y3 += this.rowHeight;
          }
        }
      }
      return { rows, taskMap };
    }
    /** Compute date range for the gantt chart */
    get _dateRange() {
      const tasksArr = this.tasks || [];
      if (!Array.isArray(tasksArr) || !tasksArr.length) {
        const today = /* @__PURE__ */ new Date();
        return { min: today, max: today };
      }
      const all = tasksArr.flatMap((t3) => [parseDate(t3.start), parseDate(t3.end || t3.start)]);
      return {
        min: new Date(Math.min(...all)),
        max: new Date(Math.max(...all))
      };
    }
    get _ganttStart() {
      return this._vdef.ganttStart(this._dateRange.min);
    }
    get _ganttEnd() {
      return this._vdef.ganttEnd(this._dateRange.max);
    }
    get _columns() {
      return this._vdef.columns(this._ganttStart, this._ganttEnd);
    }
    get _upperSpans() {
      return this._vdef.upperSpans(this._columns);
    }
    /** Convert a date to an SVG x coordinate */
    _dateToX(date) {
      const col0 = this._columns[0];
      if (!col0) return 0;
      if (!this.__colCache || this.__colCache.viewMode !== this.viewMode || this.__colCache.ganttStart !== this._ganttStart.getTime()) {
        this._buildColCache();
      }
      const days = diffDays(this._ganttStart, date);
      return days * this.__pixelsPerDay;
    }
    _buildColCache() {
      const vdef = this._vdef;
      const cols = this._columns;
      if (!cols.length) {
        this.__pixelsPerDay = 1;
        return;
      }
      const totalDays = diffDays(this._ganttStart, this._ganttEnd) || 1;
      const totalPx = cols.length * vdef.colWidth;
      this.__pixelsPerDay = totalPx / totalDays;
      this.__colCache = { viewMode: this.viewMode, ganttStart: this._ganttStart.getTime() };
    }
    get _svgWidth() {
      return this._columns.length * this._vdef.colWidth;
    }
    get _svgBodyHeight() {
      const { rows } = this._processedTasks;
      if (!rows.length) return 120;
      const last = rows[rows.length - 1];
      return last.y + (last.type === "group" ? this.groupHeaderHeight : this.rowHeight) + 20;
    }
    // ── Rendering ────────────────────────────────────────────────────────────
    render() {
      const { rows, taskMap } = this._processedTasks;
      const sidebarW = this.sidebarWidth;
      const headerH = this.headerHeight;
      const svgW = this._svgWidth;
      const svgH = this._svgBodyHeight;
      this._buildColCache();
      return x`
      ${this._renderToolbar()}

      <div class="gantt-wrap">
        <!-- ── Sidebar ── -->
        <div class="sidebar" style="width:${sidebarW}px">
          <div class="sidebar-header" style="height:${headerH}px">
            <span>Task</span>
          </div>
          <div class="sidebar-rows" id="sidebar-rows">
            <svg width="${sidebarW}" height="${svgH}" id="sidebar-svg">
              ${rows.map((r4) => this._renderSidebarRow(r4, sidebarW))}
            </svg>
          </div>
        </div>

        <!-- ── Chart ── -->
        <div class="chart-area">
          <!-- Sticky header (we handle scroll sync via JS) -->
          <div class="chart-header-wrap" style="height:${headerH}px; overflow:hidden">
            <svg id="header-svg"
                 width="${svgW}"
                 height="${headerH}"
                 style="position:relative">
              ${this._renderHeader()}
            </svg>
          </div>

          <!-- Scrollable body -->
          <div class="chart-scroll"
               id="chart-scroll"
               @scroll="${this._onScroll}"
               @pointermove="${this._onPointerMove}"
               @pointerup="${this._onPointerUp}"
               @pointercancel="${this._onPointerUp}">
            <svg id="body-svg"
                 width="${svgW}"
                 height="${svgH}"
                 @pointerdown="${this._onPointerDown}">
              <defs>${this._renderDefs(taskMap)}</defs>
              ${this._renderGrid(rows, svgW, svgH)}
              ${this._renderRowBackgrounds(rows, svgW)}
              ${this._renderBars(rows)}
              ${this._renderArrows(taskMap)}
              ${this._renderTodayLine(svgH)}
            </svg>
          </div>
        </div>
      </div>

      ${this._renderTooltip()}
    `;
    }
    // ── Toolbar ──────────────────────────────────────────────────────────────
    _renderToolbar() {
      if (!this.viewModeSelect && !this.todayButton) return E;
      return x`
      <div class="toolbar">
        ${this.viewModeSelect ? VIEW_MODES.map((m2) => x`
          <button class="vm-btn ${this.viewMode === m2 ? "active" : ""}"
                  @click="${() => this._setViewMode(m2)}">${m2}</button>
        `) : E}
        ${this.todayButton ? x`
          <button class="today-btn" @click="${() => this._scrollToToday(true)}">Today ↗</button>
        ` : E}
      </div>
    `;
    }
    // ── Sidebar rows ─────────────────────────────────────────────────────────
    _renderSidebarRow(row, w2) {
      const hg = this.groupHeaderHeight;
      const rh = this.rowHeight;
      if (row.type === "group") {
        const collapsed = this._collapsedGroups.has(row.group);
        const cx = 12, cy = row.y + hg / 2;
        const sz = 5;
        const chevron = collapsed ? `M${cx - sz / 2},${cy - sz} L${cx + sz / 2},${cy} L${cx - sz / 2},${cy + sz}` : `M${cx - sz},${cy - sz / 2} L${cx},${cy + sz / 2} L${cx + sz},${cy - sz / 2}`;
        return b2`
        <rect class="group-header-row"
              x="0" y="${row.y}" width="${w2}" height="${hg}"
              @click="${() => this._toggleGroup(row.group)}" />
        <polyline class="group-chevron" points="${chevron.replace(/M|L/g, "").replace(/ /g, ",")}"
                  @click="${() => this._toggleGroup(row.group)}" />
        <text class="group-label" x="28" y="${row.y + hg / 2 + 1}"
              dominant-baseline="middle"
              @click="${() => this._toggleGroup(row.group)}">
          ${row.group || "Ungrouped"}
        </text>
      `;
      }
      const t3 = row.task;
      const dots = (s4, max) => s4.length > max ? s4.slice(0, max - 1) + "\u2026" : s4;
      return b2`
      <rect class="task-row-bg" fill="transparent"
            x="0" y="${row.y}" width="${w2}" height="${rh}" />
      <text class="task-label" x="20" y="${row.y + rh / 2}">
        ${dots(t3.name, 28)}
      </text>
    `;
    }
    // ── Header ───────────────────────────────────────────────────────────────
    _renderHeader() {
      const vdef = this._vdef;
      const cols = this._columns;
      const colW = vdef.colWidth;
      const headerH = this.headerHeight;
      const upperH = Math.round(headerH * 0.42);
      const lowerH = headerH - upperH;
      const upperSpans = this._upperSpans;
      const upperItems = [];
      let ux = 0;
      for (const span of upperSpans) {
        upperItems.push(b2`
        <text class="header-upper-text"
              x="${ux + span.colSpan * colW / 2}"
              y="${upperH / 2 + 1}"
              text-anchor="middle"
              dominant-baseline="middle">
          ${span.label}
        </text>
        <line class="header-sep"
              x1="${ux + span.colSpan * colW}" y1="0"
              x2="${ux + span.colSpan * colW}" y2="${upperH}" />
      `);
        ux += span.colSpan * colW;
      }
      const divider = b2`
      <line class="header-sep" x1="0" y1="${upperH}" x2="${cols.length * colW}" y2="${upperH}" />
    `;
      const lowerItems = cols.map((col, i5) => {
        const x2 = i5 * colW;
        const isToday = isSameDay(col.date, /* @__PURE__ */ new Date());
        return b2`
        <text class="header-lower-text"
              x="${x2 + colW / 2}"
              y="${upperH + lowerH / 2 + 1}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="${isToday ? "var(--fc-today-line)" : "var(--fc-text-dim)"}">
          ${vdef.lowerLabel(col)}
        </text>
        <line class="header-sep"
              x1="${x2 + colW}" y1="${upperH}"
              x2="${x2 + colW}" y2="${headerH}" />
      `;
      });
      return b2`${upperItems}${divider}${lowerItems}`;
    }
    // ── SVG defs (clip paths for bar labels) ─────────────────────────────────
    _renderDefs(taskMap) {
      return b2`
      <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4"
              markerWidth="6" markerHeight="6" orient="auto">
        <path class="dep-arrowhead" d="M0,0 L0,8 L8,4 z" />
      </marker>
    `;
    }
    // ── Grid (column backgrounds, today highlight, weekend) ──────────────────
    _renderGrid(rows, svgW, svgH) {
      const vdef = this._vdef;
      const cols = this._columns;
      const colW = vdef.colWidth;
      const today = /* @__PURE__ */ new Date();
      const holidays = this._holidaySet;
      const colBgs = cols.map((col, i5) => {
        const x2 = i5 * colW;
        const fd = formatDate(col.date);
        const isT = isSameDay(col.date, today);
        const isWE = vdef.isWeekend(col);
        const isH = holidays.has(fd);
        if (isT) return b2`<rect class="today-col"   x="${x2}" y="0" width="${colW}" height="${svgH}" />`;
        if (isH) return b2`<rect class="holiday-col" x="${x2}" y="0" width="${colW}" height="${svgH}" />`;
        if (isWE) return b2`<rect class="weekend-col" x="${x2}" y="0" width="${colW}" height="${svgH}" />`;
        return E;
      });
      const vLines = cols.map((col, i5) => {
        const x2 = (i5 + 1) * colW;
        return b2`<line stroke="var(--fc-border)" stroke-width="0.5"
                       x1="${x2}" y1="0" x2="${x2}" y2="${svgH}" />`;
      });
      const hLines = rows.map((r4) => {
        const h3 = r4.type === "group" ? this.groupHeaderHeight : this.rowHeight;
        const y3 = r4.y + h3;
        return b2`<line stroke="var(--fc-border)" stroke-width="0.5"
                       x1="0" y1="${y3}" x2="${svgW}" y2="${y3}" />`;
      });
      return b2`${colBgs}${vLines}${hLines}`;
    }
    // ── Row backgrounds (for hover highlight) ────────────────────────────────
    _renderRowBackgrounds(rows, svgW) {
      return rows.map((r4) => {
        if (r4.type === "group") {
          return b2`<rect fill="var(--fc-group-bg)"
                         x="0" y="${r4.y}" width="${svgW}" height="${this.groupHeaderHeight}" />`;
        }
        return b2`<rect class="task-row-bg" fill="transparent"
                       x="0" y="${r4.y}" width="${svgW}" height="${this.rowHeight}" />`;
      });
    }
    // ── Bars ─────────────────────────────────────────────────────────────────
    _renderBars(rows) {
      const out = [];
      for (const row of rows) {
        if (row.type !== "task") continue;
        out.push(this._renderBar(row.task));
      }
      return out;
    }
    _renderBar(t3) {
      const barH = 22;
      const rx = this.barCornerRadius;
      const rowH = this.rowHeight;
      const pad = this.barPadding;
      const x2 = this._dateToX(t3._start);
      const xEnd = this._dateToX(addDays(t3._end, 1));
      const w2 = Math.max(xEnd - x2, 4);
      const y3 = t3._y + (rowH - barH) / 2;
      const progress = Math.min(100, Math.max(0, t3.progress || 0));
      const progressW = w2 * (progress / 100);
      const colour = t3._colour || "#6366f1";
      const colourDark = _darken(colour, 0.25);
      const labelX = x2 + 6;
      const clipW = w2 - 10;
      const handleW = Math.min(8, w2 * 0.15);
      const dots = (s4, approxChars) => s4.length > approxChars ? s4.slice(0, approxChars - 1) + "\u2026" : s4;
      return b2`
      <g class="bar-group ${this.readonly ? "readonly" : ""}"
         data-task-id="${t3.id}"
         @pointerenter="${(e4) => this._showTooltip(e4, t3)}"
         @pointerleave="${() => this._hideTooltip()}"
         @click="${(e4) => this._onBarClick(e4, t3)}">

        <!-- Background bar -->
        <rect class="bar-bg"
              x="${x2}" y="${y3}" width="${w2}" height="${barH}"
              rx="${rx}" ry="${rx}"
              fill="${colour}" />

        <!-- Progress fill -->
        ${progress > 0 ? b2`
          <rect class="bar-progress"
                x="${x2}" y="${y3}" width="${progressW}" height="${barH}"
                rx="${rx}" ry="${rx}"
                fill="${colourDark}" />
        ` : E}

        <!-- Progress pill clip right -->
        ${progress > 0 && progress < 100 ? b2`
          <rect x="${x2 + progressW - rx}" y="${y3}" width="${rx}" height="${barH}"
                fill="${colourDark}" opacity="0.38" />
        ` : E}

        <!-- Bar label -->
        ${w2 > 30 ? b2`
          <text class="bar-label"
                x="${labelX}" y="${y3 + barH / 2}"
                clip-path="url(#clip-${t3.id})">
            ${dots(t3.name, Math.floor(clipW / 6.5))}
          </text>
          <clipPath id="clip-${t3.id}">
            <rect x="${x2 + 4}" y="${y3}" width="${Math.max(0, w2 - 14)}" height="${barH}" />
          </clipPath>
        ` : E}

        <!-- Resize handle (right edge) — only when not readonly -->
        ${!this.readonly ? b2`
          <rect class="resize-handle"
                data-task-id="${t3.id}" data-action="resize-end"
                x="${x2 + w2 - handleW}" y="${y3}"
                width="${handleW}" height="${barH}"
                fill="transparent"
                rx="${rx}" />
        ` : E}

        <!-- Progress drag handle — optional -->
        ${this.progressDraggable && !this.readonly ? b2`
          <circle class="resize-handle-progress"
                  data-task-id="${t3.id}" data-action="progress"
                  cx="${x2 + progressW}" cy="${y3 + barH}"
                  r="5"
                  fill="${colour}"
                  stroke="#fff" stroke-width="1.5" />
        ` : E}
      </g>
    `;
    }
    // ── Dependency arrows ─────────────────────────────────────────────────────
    _renderArrows(taskMap) {
      const barH = 22;
      const out = [];
      for (const t3 of this.tasks || []) {
        if (!t3.dependencies?.length) continue;
        const to = taskMap.get(t3.id);
        if (!to) continue;
        const toX = this._dateToX(to._start);
        const toY = to._y + (this.rowHeight - barH) / 2 + barH / 2;
        for (const depId of t3.dependencies) {
          const from = taskMap.get(depId);
          if (!from) continue;
          const fromX = this._dateToX(addDays(from._end, 1));
          const fromY = from._y + (this.rowHeight - barH) / 2 + barH / 2;
          const curve = this.arrowCurve;
          const path = `M ${fromX} ${fromY} 
                               L ${fromX + curve} ${fromY} 
                               C ${fromX + curve * 2} ${fromY} ${toX - curve * 2} ${toY} ${toX - curve} ${toY} 
                               L ${toX} ${toY}`;
          out.push(b2`
          <path class="dep-arrow"
                d="${path}"
                marker-end="url(#arr)" />
        `);
        }
      }
      return out;
    }
    // ── Today line ────────────────────────────────────────────────────────────
    _renderTodayLine(svgH) {
      const today = /* @__PURE__ */ new Date();
      if (today < this._ganttStart || today > this._ganttEnd) return E;
      const x2 = this._dateToX(today);
      return b2`
      <line class="today-line" x1="${x2}" y1="0" x2="${x2}" y2="${svgH}" />
      <text class="today-label" x="${x2 + 4}" y="10">today</text>
    `;
    }
    // ── Tooltip ──────────────────────────────────────────────────────────────
    _renderTooltip() {
      if (!this._tooltip) return E;
      const { task, x: x2, y: y3 } = this._tooltip;
      const prog = Math.round(task.progress || 0);
      const dur = diffDays(task._start, addDays(task._end, 1));
      return x`
      <div class="tooltip"
           style="left:${x2}px; top:${y3}px">
        <div class="tooltip-title">${task.name}</div>
        <div class="tooltip-row"><span>Start</span><span>${formatDate(task._start)}</span></div>
        <div class="tooltip-row"><span>End</span>  <span>${formatDate(task._end)}</span></div>
        <div class="tooltip-row"><span>Duration</span><span>${dur}d</span></div>
        ${task.group ? x`<div class="tooltip-row"><span>Group</span><span>${task.group}</span></div>` : E}
        <div class="tooltip-progress-bar">
          <div class="tooltip-progress-fill" style="width:${prog}%"></div>
        </div>
        <div class="tooltip-row" style="margin-top:4px"><span>Progress</span><span>${prog}%</span></div>
      </div>
    `;
    }
    // ── Events ───────────────────────────────────────────────────────────────
    _onScroll(e4) {
      const sl = e4.target.scrollLeft;
      const st = e4.target.scrollTop;
      const headerSvg = this.shadowRoot.getElementById("header-svg");
      if (headerSvg) headerSvg.style.transform = `translateX(-${sl}px)`;
      const sidebarRows = this.shadowRoot.getElementById("sidebar-rows");
      if (sidebarRows) sidebarRows.scrollTop = st;
    }
    _onPointerDown(e4) {
      if (this.readonly) return;
      const bar = e4.target.closest("[data-task-id]");
      if (!bar) return;
      const taskId = bar.dataset.taskId;
      const action = bar.dataset.action || "move";
      const { taskMap } = this._processedTasks;
      const task = taskMap.get(taskId);
      if (!task) return;
      e4.preventDefault();
      const scrollEl = this.shadowRoot.getElementById("chart-scroll");
      const scrollLeft = scrollEl ? scrollEl.scrollLeft : 0;
      this._dragState = {
        task,
        action,
        startClientX: e4.clientX,
        startScrollX: scrollLeft,
        origStart: new Date(task._start),
        origEnd: new Date(task._end),
        origProgress: task.progress || 0,
        pixelsPerDay: this.__pixelsPerDay
      };
      this.shadowRoot.getElementById("body-svg")?.setPointerCapture(e4.pointerId);
    }
    _onPointerMove(e4) {
      if (!this._dragState) return;
      e4.preventDefault();
      const { task, action, startClientX, pixelsPerDay, origStart, origEnd, origProgress } = this._dragState;
      const dx = e4.clientX - startClientX;
      const deltaDays = Math.round(dx / pixelsPerDay);
      if (action === "move") {
        task._start = addDays(origStart, deltaDays);
        task._end = addDays(origEnd, deltaDays);
        const src = (this.tasks || []).find((t3) => t3.id === task.id);
        if (src) {
          src.start = formatDate(task._start);
          src.end = formatDate(task._end);
        }
      } else if (action === "resize-end") {
        const newEnd = addDays(origEnd, deltaDays);
        if (newEnd >= task._start) {
          task._end = newEnd;
          const src = (this.tasks || []).find((t3) => t3.id === task.id);
          if (src) src.end = formatDate(task._end);
        }
      } else if (action === "progress") {
        const barW = this._dateToX(addDays(task._end, 1)) - this._dateToX(task._start);
        const barX = this._dateToX(task._start);
        const scrollEl = this.shadowRoot.getElementById("chart-scroll");
        const relX = e4.clientX - this.getBoundingClientRect().left + (scrollEl?.scrollLeft || 0) - this.sidebarWidth;
        const prog = Math.min(100, Math.max(0, Math.round((relX - barX) / barW * 100)));
        task.progress = prog;
        const src = (this.tasks || []).find((t3) => t3.id === task.id);
        if (src) src.progress = prog;
      }
      this.requestUpdate();
    }
    _onPointerUp(e4) {
      if (!this._dragState) return;
      const { task, action, origStart, origEnd, origProgress } = this._dragState;
      this._dragState = null;
      const changed = action === "progress" ? origProgress !== task.progress : origStart.getTime() !== task._start.getTime() || origEnd.getTime() !== task._end.getTime();
      if (changed) {
        if (action === "progress") {
          this.dispatchEvent(new CustomEvent("progress-change", {
            bubbles: true,
            composed: true,
            detail: { task, progress: task.progress }
          }));
        } else {
          this.dispatchEvent(new CustomEvent("date-change", {
            bubbles: true,
            composed: true,
            detail: { task, start: formatDate(task._start), end: formatDate(task._end) }
          }));
        }
      }
      this.requestUpdate();
    }
    _onBarClick(e4, task) {
      if (this._dragState) return;
      this.dispatchEvent(new CustomEvent("task-click", {
        bubbles: true,
        composed: true,
        detail: { task }
      }));
    }
    _showTooltip(e4, task) {
      if (this._dragState) return;
      const rect = this.getBoundingClientRect();
      this._tooltip = {
        task,
        x: e4.clientX - rect.left + 16,
        y: e4.clientY - rect.top + 16
      };
      this.requestUpdate();
    }
    _hideTooltip() {
      if (this._tooltip) {
        this._tooltip = null;
        this.requestUpdate();
      }
    }
    _toggleGroup(group) {
      if (this._collapsedGroups.has(group)) {
        this._collapsedGroups.delete(group);
      } else {
        this._collapsedGroups.add(group);
      }
      this.requestUpdate();
    }
    _setViewMode(mode) {
      this.viewMode = mode;
      this.__colCache = null;
      this._scheduleScrollToToday();
    }
    _scrollToToday(smooth = true) {
      const today = /* @__PURE__ */ new Date();
      const scrollEl = this.shadowRoot?.getElementById("chart-scroll");
      if (!scrollEl) return;
      this._buildColCache();
      const x2 = this._dateToX(today);
      const visibleW = scrollEl.clientWidth;
      scrollEl.scrollTo({
        left: Math.max(0, x2 - visibleW / 2),
        behavior: smooth ? "smooth" : "instant"
      });
    }
  };
  function _darken(hex, amount) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r4 = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g2 = Math.max(0, (num >> 8 & 255) - Math.round(255 * amount));
    const b3 = Math.max(0, (num & 255) - Math.round(255 * amount));
    return `#${(r4 << 16 | g2 << 8 | b3).toString(16).padStart(6, "0")}`;
  }
  customElements.define("fucodo-chart-roadmap", FucodoChartRoadmap);
})();
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
