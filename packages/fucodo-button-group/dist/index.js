(() => {
  // node_modules/@lit/reactive-element/css-tag.js
  var t = globalThis;
  var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = /* @__PURE__ */ Symbol();
  var o = /* @__PURE__ */ new WeakMap();
  var n = class {
    constructor(t4, e5, o6) {
      if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t4, this.t = e5;
    }
    get styleSheet() {
      let t4 = this.o;
      const s4 = this.t;
      if (e && void 0 === t4) {
        const e5 = void 0 !== s4 && 1 === s4.length;
        e5 && (t4 = o.get(s4)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e5 && o.set(s4, t4));
      }
      return t4;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
  var S = (s4, o6) => {
    if (e) s4.adoptedStyleSheets = o6.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
    else for (const e5 of o6) {
      const o7 = document.createElement("style"), n5 = t.litNonce;
      void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e5.cssText, s4.appendChild(o7);
    }
  };
  var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
    let e5 = "";
    for (const s4 of t5.cssRules) e5 += s4.cssText;
    return r(e5);
  })(t4) : t4;

  // node_modules/@lit/reactive-element/reactive-element.js
  var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t4, s4) => t4;
  var u = { toAttribute(t4, s4) {
    switch (s4) {
      case Boolean:
        t4 = t4 ? l : null;
        break;
      case Object:
      case Array:
        t4 = null == t4 ? t4 : JSON.stringify(t4);
    }
    return t4;
  }, fromAttribute(t4, s4) {
    let i7 = t4;
    switch (s4) {
      case Boolean:
        i7 = null !== t4;
        break;
      case Number:
        i7 = null === t4 ? null : Number(t4);
        break;
      case Object:
      case Array:
        try {
          i7 = JSON.parse(t4);
        } catch (t5) {
          i7 = null;
        }
    }
    return i7;
  } };
  var f = (t4, s4) => !i2(t4, s4);
  var b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
  Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
  var y = class extends HTMLElement {
    static addInitializer(t4) {
      this._$Ei(), (this.l ??= []).push(t4);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t4, s4 = b) {
      if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t4) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t4, s4), !s4.noAccessor) {
        const i7 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t4, i7, s4);
        void 0 !== h3 && e2(this.prototype, t4, h3);
      }
    }
    static getPropertyDescriptor(t4, s4, i7) {
      const { get: e5, set: r4 } = h(this.prototype, t4) ?? { get() {
        return this[s4];
      }, set(t5) {
        this[s4] = t5;
      } };
      return { get: e5, set(s5) {
        const h3 = e5?.call(this);
        r4?.call(this, s5), this.requestUpdate(t4, h3, i7);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t4) {
      return this.elementProperties.get(t4) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties"))) return;
      const t4 = n2(this);
      t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t5 = this.properties, s4 = [...r2(t5), ...o2(t5)];
        for (const i7 of s4) this.createProperty(i7, t5[i7]);
      }
      const t4 = this[Symbol.metadata];
      if (null !== t4) {
        const s4 = litPropertyMetadata.get(t4);
        if (void 0 !== s4) for (const [t5, i7] of s4) this.elementProperties.set(t5, i7);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t5, s4] of this.elementProperties) {
        const i7 = this._$Eu(t5, s4);
        void 0 !== i7 && this._$Eh.set(i7, t5);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s4) {
      const i7 = [];
      if (Array.isArray(s4)) {
        const e5 = new Set(s4.flat(1 / 0).reverse());
        for (const s5 of e5) i7.unshift(c(s5));
      } else void 0 !== s4 && i7.push(c(s4));
      return i7;
    }
    static _$Eu(t4, s4) {
      const i7 = s4.attribute;
      return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
    }
    addController(t4) {
      (this._$EO ??= /* @__PURE__ */ new Set()).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
    }
    removeController(t4) {
      this._$EO?.delete(t4);
    }
    _$E_() {
      const t4 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
      for (const i7 of s4.keys()) this.hasOwnProperty(i7) && (t4.set(i7, this[i7]), delete this[i7]);
      t4.size > 0 && (this._$Ep = t4);
    }
    createRenderRoot() {
      const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t4, this.constructor.elementStyles), t4;
    }
    connectedCallback() {
      this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
    }
    enableUpdating(t4) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t4) => t4.hostDisconnected?.());
    }
    attributeChangedCallback(t4, s4, i7) {
      this._$AK(t4, i7);
    }
    _$ET(t4, s4) {
      const i7 = this.constructor.elementProperties.get(t4), e5 = this.constructor._$Eu(t4, i7);
      if (void 0 !== e5 && true === i7.reflect) {
        const h3 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s4, i7.type);
        this._$Em = t4, null == h3 ? this.removeAttribute(e5) : this.setAttribute(e5, h3), this._$Em = null;
      }
    }
    _$AK(t4, s4) {
      const i7 = this.constructor, e5 = i7._$Eh.get(t4);
      if (void 0 !== e5 && this._$Em !== e5) {
        const t5 = i7.getPropertyOptions(e5), h3 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
        this._$Em = e5;
        const r4 = h3.fromAttribute(s4, t5.type);
        this[e5] = r4 ?? this._$Ej?.get(e5) ?? r4, this._$Em = null;
      }
    }
    requestUpdate(t4, s4, i7, e5 = false, h3) {
      if (void 0 !== t4) {
        const r4 = this.constructor;
        if (false === e5 && (h3 = this[t4]), i7 ??= r4.getPropertyOptions(t4), !((i7.hasChanged ?? f)(h3, s4) || i7.useDefault && i7.reflect && h3 === this._$Ej?.get(t4) && !this.hasAttribute(r4._$Eu(t4, i7)))) return;
        this.C(t4, s4, i7);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t4, s4, { useDefault: i7, reflect: e5, wrapped: h3 }, r4) {
      i7 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t4) && (this._$Ej.set(t4, r4 ?? s4 ?? this[t4]), true !== h3 || void 0 !== r4) || (this._$AL.has(t4) || (this.hasUpdated || i7 || (s4 = void 0), this._$AL.set(t4, s4)), true === e5 && this._$Em !== t4 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t4));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t5) {
        Promise.reject(t5);
      }
      const t4 = this.scheduleUpdate();
      return null != t4 && await t4, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
          for (const [t6, s5] of this._$Ep) this[t6] = s5;
          this._$Ep = void 0;
        }
        const t5 = this.constructor.elementProperties;
        if (t5.size > 0) for (const [s5, i7] of t5) {
          const { wrapped: t6 } = i7, e5 = this[s5];
          true !== t6 || this._$AL.has(s5) || void 0 === e5 || this.C(s5, void 0, i7, e5);
        }
      }
      let t4 = false;
      const s4 = this._$AL;
      try {
        t4 = this.shouldUpdate(s4), t4 ? (this.willUpdate(s4), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s4)) : this._$EM();
      } catch (s5) {
        throw t4 = false, this._$EM(), s5;
      }
      t4 && this._$AE(s4);
    }
    willUpdate(t4) {
    }
    _$AE(t4) {
      this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
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
    shouldUpdate(t4) {
      return true;
    }
    update(t4) {
      this._$Eq &&= this._$Eq.forEach((t5) => this._$ET(t5, this[t5])), this._$EM();
    }
    updated(t4) {
    }
    firstUpdated(t4) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");

  // node_modules/lit-html/lit-html.js
  var t2 = globalThis;
  var i3 = (t4) => t4;
  var s2 = t2.trustedTypes;
  var e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
  var h2 = "$lit$";
  var o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var n3 = "?" + o3;
  var r3 = `<${n3}>`;
  var l2 = document;
  var c3 = () => l2.createComment("");
  var a2 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
  var u2 = Array.isArray;
  var d2 = (t4) => u2(t4) || "function" == typeof t4?.[Symbol.iterator];
  var f2 = "[ 	\n\f\r]";
  var v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var _ = /-->/g;
  var m = />/g;
  var p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var g = /'/g;
  var $ = /"/g;
  var y2 = /^(?:script|style|textarea|title)$/i;
  var x = (t4) => (i7, ...s4) => ({ _$litType$: t4, strings: i7, values: s4 });
  var b2 = x(1);
  var w = x(2);
  var T = x(3);
  var E = /* @__PURE__ */ Symbol.for("lit-noChange");
  var A = /* @__PURE__ */ Symbol.for("lit-nothing");
  var C = /* @__PURE__ */ new WeakMap();
  var P = l2.createTreeWalker(l2, 129);
  function V(t4, i7) {
    if (!u2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e3 ? e3.createHTML(i7) : i7;
  }
  var N = (t4, i7) => {
    const s4 = t4.length - 1, e5 = [];
    let n5, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c4 = v;
    for (let i8 = 0; i8 < s4; i8++) {
      const s5 = t4[i8];
      let a3, u3, d3 = -1, f3 = 0;
      for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
      const x2 = c4 === p2 && t4[i8 + 1].startsWith("/>") ? " " : "";
      l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e5.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i8 : x2);
    }
    return [V(t4, l3 + (t4[s4] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e5];
  };
  var S2 = class _S {
    constructor({ strings: t4, _$litType$: i7 }, e5) {
      let r4;
      this.parts = [];
      let l3 = 0, a3 = 0;
      const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = N(t4, i7);
      if (this.el = _S.createElement(f3, e5), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
        const t5 = this.el.content.firstChild;
        t5.replaceWith(...t5.childNodes);
      }
      for (; null !== (r4 = P.nextNode()) && d3.length < u3; ) {
        if (1 === r4.nodeType) {
          if (r4.hasAttributes()) for (const t5 of r4.getAttributeNames()) if (t5.endsWith(h2)) {
            const i8 = v2[a3++], s4 = r4.getAttribute(t5).split(o3), e6 = /([.?@])?(.*)/.exec(i8);
            d3.push({ type: 1, index: l3, name: e6[2], strings: s4, ctor: "." === e6[1] ? I : "?" === e6[1] ? L : "@" === e6[1] ? z : H }), r4.removeAttribute(t5);
          } else t5.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r4.removeAttribute(t5));
          if (y2.test(r4.tagName)) {
            const t5 = r4.textContent.split(o3), i8 = t5.length - 1;
            if (i8 > 0) {
              r4.textContent = s2 ? s2.emptyScript : "";
              for (let s4 = 0; s4 < i8; s4++) r4.append(t5[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
              r4.append(t5[i8], c3());
            }
          }
        } else if (8 === r4.nodeType) if (r4.data === n3) d3.push({ type: 2, index: l3 });
        else {
          let t5 = -1;
          for (; -1 !== (t5 = r4.data.indexOf(o3, t5 + 1)); ) d3.push({ type: 7, index: l3 }), t5 += o3.length - 1;
        }
        l3++;
      }
    }
    static createElement(t4, i7) {
      const s4 = l2.createElement("template");
      return s4.innerHTML = t4, s4;
    }
  };
  function M(t4, i7, s4 = t4, e5) {
    if (i7 === E) return i7;
    let h3 = void 0 !== e5 ? s4._$Co?.[e5] : s4._$Cl;
    const o6 = a2(i7) ? void 0 : i7._$litDirective$;
    return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t4), h3._$AT(t4, s4, e5)), void 0 !== e5 ? (s4._$Co ??= [])[e5] = h3 : s4._$Cl = h3), void 0 !== h3 && (i7 = M(t4, h3._$AS(t4, i7.values), h3, e5)), i7;
  }
  var R = class {
    constructor(t4, i7) {
      this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i7;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t4) {
      const { el: { content: i7 }, parts: s4 } = this._$AD, e5 = (t4?.creationScope ?? l2).importNode(i7, true);
      P.currentNode = e5;
      let h3 = P.nextNode(), o6 = 0, n5 = 0, r4 = s4[0];
      for (; void 0 !== r4; ) {
        if (o6 === r4.index) {
          let i8;
          2 === r4.type ? i8 = new k(h3, h3.nextSibling, this, t4) : 1 === r4.type ? i8 = new r4.ctor(h3, r4.name, r4.strings, this, t4) : 6 === r4.type && (i8 = new Z(h3, this, t4)), this._$AV.push(i8), r4 = s4[++n5];
        }
        o6 !== r4?.index && (h3 = P.nextNode(), o6++);
      }
      return P.currentNode = l2, e5;
    }
    p(t4) {
      let i7 = 0;
      for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t4, s4, i7), i7 += s4.strings.length - 2) : s4._$AI(t4[i7])), i7++;
    }
  };
  var k = class _k {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t4, i7, s4, e5) {
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t4, this._$AB = i7, this._$AM = s4, this.options = e5, this._$Cv = e5?.isConnected ?? true;
    }
    get parentNode() {
      let t4 = this._$AA.parentNode;
      const i7 = this._$AM;
      return void 0 !== i7 && 11 === t4?.nodeType && (t4 = i7.parentNode), t4;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t4, i7 = this) {
      t4 = M(this, t4, i7), a2(t4) ? t4 === A || null == t4 || "" === t4 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t4 !== this._$AH && t4 !== E && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : d2(t4) ? this.k(t4) : this._(t4);
    }
    O(t4) {
      return this._$AA.parentNode.insertBefore(t4, this._$AB);
    }
    T(t4) {
      this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
    }
    _(t4) {
      this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(l2.createTextNode(t4)), this._$AH = t4;
    }
    $(t4) {
      const { values: i7, _$litType$: s4 } = t4, e5 = "number" == typeof s4 ? this._$AC(t4) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
      if (this._$AH?._$AD === e5) this._$AH.p(i7);
      else {
        const t5 = new R(e5, this), s5 = t5.u(this.options);
        t5.p(i7), this.T(s5), this._$AH = t5;
      }
    }
    _$AC(t4) {
      let i7 = C.get(t4.strings);
      return void 0 === i7 && C.set(t4.strings, i7 = new S2(t4)), i7;
    }
    k(t4) {
      u2(this._$AH) || (this._$AH = [], this._$AR());
      const i7 = this._$AH;
      let s4, e5 = 0;
      for (const h3 of t4) e5 === i7.length ? i7.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i7[e5], s4._$AI(h3), e5++;
      e5 < i7.length && (this._$AR(s4 && s4._$AB.nextSibling, e5), i7.length = e5);
    }
    _$AR(t4 = this._$AA.nextSibling, s4) {
      for (this._$AP?.(false, true, s4); t4 !== this._$AB; ) {
        const s5 = i3(t4).nextSibling;
        i3(t4).remove(), t4 = s5;
      }
    }
    setConnected(t4) {
      void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
    }
  };
  var H = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t4, i7, s4, e5, h3) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t4, this.name = i7, this._$AM = e5, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
    }
    _$AI(t4, i7 = this, s4, e5) {
      const h3 = this.strings;
      let o6 = false;
      if (void 0 === h3) t4 = M(this, t4, i7, 0), o6 = !a2(t4) || t4 !== this._$AH && t4 !== E, o6 && (this._$AH = t4);
      else {
        const e6 = t4;
        let n5, r4;
        for (t4 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r4 = M(this, e6[s4 + n5], i7, n5), r4 === E && (r4 = this._$AH[n5]), o6 ||= !a2(r4) || r4 !== this._$AH[n5], r4 === A ? t4 = A : t4 !== A && (t4 += (r4 ?? "") + h3[n5 + 1]), this._$AH[n5] = r4;
      }
      o6 && !e5 && this.j(t4);
    }
    j(t4) {
      t4 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
    }
  };
  var I = class extends H {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t4) {
      this.element[this.name] = t4 === A ? void 0 : t4;
    }
  };
  var L = class extends H {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t4) {
      this.element.toggleAttribute(this.name, !!t4 && t4 !== A);
    }
  };
  var z = class extends H {
    constructor(t4, i7, s4, e5, h3) {
      super(t4, i7, s4, e5, h3), this.type = 5;
    }
    _$AI(t4, i7 = this) {
      if ((t4 = M(this, t4, i7, 0) ?? A) === E) return;
      const s4 = this._$AH, e5 = t4 === A && s4 !== A || t4.capture !== s4.capture || t4.once !== s4.once || t4.passive !== s4.passive, h3 = t4 !== A && (s4 === A || e5);
      e5 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
    }
    handleEvent(t4) {
      "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
    }
  };
  var Z = class {
    constructor(t4, i7, s4) {
      this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s4;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t4) {
      M(this, t4);
    }
  };
  var B = t2.litHtmlPolyfillSupport;
  B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.3");
  var D = (t4, i7, s4) => {
    const e5 = s4?.renderBefore ?? i7;
    let h3 = e5._$litPart$;
    if (void 0 === h3) {
      const t5 = s4?.renderBefore ?? null;
      e5._$litPart$ = h3 = new k(i7.insertBefore(c3(), t5), t5, void 0, s4 ?? {});
    }
    return h3._$AI(t4), h3;
  };

  // node_modules/lit-element/lit-element.js
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      const t4 = super.createRenderRoot();
      return this.renderOptions.renderBefore ??= t4.firstChild, t4;
    }
    update(t4) {
      const r4 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = D(r4, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return E;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
  var o4 = s3.litElementPolyfillSupport;
  o4?.({ LitElement: i4 });
  (s3.litElementVersions ??= []).push("4.2.2");

  // node_modules/lit-html/directive.js
  var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
  var e4 = (t4) => (...e5) => ({ _$litDirective$: t4, values: e5 });
  var i5 = class {
    constructor(t4) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t4, e5, i7) {
      this._$Ct = t4, this._$AM = e5, this._$Ci = i7;
    }
    _$AS(t4, e5) {
      return this.update(t4, e5);
    }
    update(t4, e5) {
      return this.render(...e5);
    }
  };

  // node_modules/lit-html/directives/style-map.js
  var n4 = "important";
  var i6 = " !" + n4;
  var o5 = e4(class extends i5 {
    constructor(t4) {
      if (super(t4), t4.type !== t3.ATTRIBUTE || "style" !== t4.name || t4.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
    }
    render(t4) {
      return Object.keys(t4).reduce((e5, r4) => {
        const s4 = t4[r4];
        return null == s4 ? e5 : e5 + `${r4 = r4.includes("-") ? r4 : r4.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s4};`;
      }, "");
    }
    update(e5, [r4]) {
      const { style: s4 } = e5.element;
      if (void 0 === this.ft) return this.ft = new Set(Object.keys(r4)), this.render(r4);
      for (const t4 of this.ft) null == r4[t4] && (this.ft.delete(t4), t4.includes("-") ? s4.removeProperty(t4) : s4[t4] = null);
      for (const t4 in r4) {
        const e6 = r4[t4];
        if (null != e6) {
          this.ft.add(t4);
          const r5 = "string" == typeof e6 && e6.endsWith(i6);
          t4.includes("-") || r5 ? s4.setProperty(t4, r5 ? e6.slice(0, -11) : e6, r5 ? n4 : "") : s4[t4] = e6;
        }
      }
      return E;
    }
  });

  // packages/fucodo-button-group/style.scss
  var style_default = `:host {
  display: block;
  container: button-group/inline-size;
  --button-color: #0d6efd;
  --button-text-color: white;
}

slot {
  display: none;
}

.group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--button-group-gap, 0.5rem);
  align-items: stretch;
}

.item {
  display: inline-flex;
  position: relative;
  max-width: 100%;
}

.item:has(.popup) {
  z-index: 1;
}

a, button {
  box-sizing: border-box;
  font: inherit;
  font-family: var(--button-font-family, inherit);
}

.action, .toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--button-padding-block, 0.5rem) var(--button-padding-inline, 1rem);
  min-height: var(--button-min-height, 2.75rem);
  font-size: var(--button-font-size, inherit);
  border: 1px solid var(--button-border-color, var(--button-color));
  border-radius: 0;
  background: var(--button-color);
  color: var(--button-text-color);
  text-decoration: none;
  cursor: pointer;
  overflow-wrap: anywhere;
}

.action {
  min-width: 0;
}

.toggle {
  flex-shrink: 0;
  padding-inline: var(--button-toggle-padding-inline, 0.75rem);
  border-inline-start-color: currentColor;
}

/* Align icons before the text, including span-wrapped labels. */
:is(.action, .menu-link, .action span, .menu-link span):has(> :is(svg, img, [data-font-icon])) {
  display: inline-flex;
  align-items: center;
  gap: var(--button-icon-gap, 0.5em);
}

:is(.action, .menu-link) :is(svg, img, [data-font-icon]) {
  flex-shrink: 0;
  order: -1;
}

:is(.action, .menu-link) :is(svg, img) {
  width: var(--button-icon-size, 1em);
  height: var(--button-icon-size, 1em);
  max-width: var(--button-icon-size, 1em);
  max-height: var(--button-icon-size, 1em);
  object-fit: contain;
}

[data-font-icon] {
  display: inline-grid;
  place-items: center;
  font-family: var(--button-icon-font-family, inherit);
  font-size: var(--button-icon-size, 1em);
  line-height: 1;
}

:is(.action, .menu-link) [data-font-icon] {
  width: 1em;
  height: 1em;
}

.toggle::after {
  content: "";
  border: 0.3em solid transparent;
  border-bottom: 0;
  border-top-color: currentColor;
}

.toggle.dropdown {
  gap: 0.75rem;
  padding-inline: var(--button-padding-inline, 1rem);
  border-inline-start-color: var(--button-border-color, var(--button-color));
}

.item > .action:has(svg, img, [data-font-icon]) {
  justify-content: flex-start;
}

.item > .action {
  border-start-start-radius: var(--button-radius, 0.375rem);
  border-end-start-radius: var(--button-radius, 0.375rem);
}

.item > .action:last-child, .item > .toggle {
  border-start-end-radius: var(--button-radius, 0.375rem);
  border-end-end-radius: var(--button-radius, 0.375rem);
}

.action:not(:disabled):hover, .toggle:hover {
  filter: brightness(0.9);
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

a:focus-visible, button:focus-visible {
  outline: 3px solid var(--button-focus-color, #80b7ff);
  outline-offset: 2px;
  z-index: 2;
}

.popup {
  position: absolute;
  inset-block-start: calc(100% + 0.25rem);
  inset-inline-end: 0;
  width: max-content;
  min-width: 100%;
  max-width: min(20rem, 100vw - 2rem);
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  background: var(--button-menu-background, white);
  color: var(--button-menu-color, #212529);
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.1333333333);
}

.popup a, .popup button {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  color: inherit;
  text-align: start;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.popup:has(.menu-link :is(svg, img, [data-font-icon])) .menu-link:not(:has(svg, img, [data-font-icon])) {
  padding-inline-start: calc(0.75rem + var(--button-icon-size, 1em) + var(--button-icon-gap, 0.5em));
}

.popup button {
  background: transparent;
  border: 0;
}

.popup a:hover, .popup a:focus-visible {
  background: var(--button-menu-hover, #eee);
}

@container button-group (max-width: 480px) {
  .group {
    display: block;
  }
  .item {
    width: 100%;
  }
  .item + .item {
    margin-block-start: var(--button-group-gap, 0.5rem);
  }
  .action {
    flex: 1;
  }
  .popup {
    inset-inline-start: 0;
    inset-inline-end: auto;
  }
}`;

  // packages/fucodo-button-group/index.js
  var FucodoButtonGroup = class extends i4 {
    static properties = {
      label: {},
      _items: { state: true },
      _open: { state: true }
    };
    static styles = r(style_default);
    constructor() {
      super();
      this.label = "Actions";
      this._items = [];
      this._open = -1;
      this._observer = new MutationObserver(() => this._readList());
      this._outsideClick = (event) => {
        if (!event.composedPath().includes(this)) this._open = -1;
      };
    }
    connectedCallback() {
      super.connectedCallback();
      this._observer.observe(this, { subtree: true, childList: true, characterData: true, attributes: true });
      this.ownerDocument.addEventListener("click", this._outsideClick);
      this._readList();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this._observer.disconnect();
      this.ownerDocument.removeEventListener("click", this._outsideClick);
    }
    _readList() {
      const lists = [...this.children].filter((element) => element.matches("ul:not([slot])"));
      this._items = lists.flatMap((list) => [...list.children].filter((element) => element.matches("li")).map((item) => {
        const submenu = item.querySelector(":scope > ul");
        return {
          ...this._entry(item),
          backgroundColor: item.style.backgroundColor,
          submenu,
          children: [...submenu?.children ?? []].filter((element) => element.matches("li")).map((child) => this._entry(child))
        };
      }));
      this._open = -1;
    }
    _entry(item) {
      const link = item.querySelector(":scope > a");
      const labelSource = (link ?? item).cloneNode(true);
      labelSource.querySelectorAll("ul").forEach((list) => list.remove());
      return { link, label: labelSource.textContent.trim(), labelNodes: [...labelSource.childNodes] };
    }
    _link(item, className) {
      if (!item.link) {
        return b2`<button type="button" disabled class=${className}
                part=${className === "action" ? "button" : "menu-link"}>${item.labelNodes}</button>`;
      }
      const link = item.link.cloneNode(true);
      link.removeAttribute("id");
      link.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      link.classList.add(className);
      link.setAttribute("part", className === "action" ? "button" : "menu-link");
      return link;
    }
    async _show(index, focus = false, last = false) {
      this._open = index;
      await this.updateComplete;
      if (focus) {
        const links = this.renderRoot.querySelectorAll(".popup a");
        links[last ? links.length - 1 : 0]?.focus();
      }
    }
    _close(restoreFocus = false) {
      const index = this._open;
      this._open = -1;
      if (restoreFocus) this.renderRoot.querySelector(`#toggle-${index}`)?.focus();
    }
    _toggleKey(event, index) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        this._show(index, true, event.key === "ArrowUp");
      }
    }
    _menuKey(event) {
      const links = [...this.renderRoot.querySelectorAll(".popup a")];
      const index = links.indexOf(event.target.closest("a"));
      let next;
      if (event.key === "ArrowDown") next = (index + 1) % links.length;
      if (event.key === "ArrowUp") next = (index - 1 + links.length) % links.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = links.length - 1;
      if (next !== void 0) {
        event.preventDefault();
        links[next]?.focus();
      }
    }
    render() {
      return b2`
            <slot @slotchange=${this._readList}></slot>
            <div class="group" part="group" role="group" aria-label=${this.label}
                @keydown=${(event) => {
        if (event.key === "Escape" && this._open !== -1) {
          event.preventDefault();
          this._close(true);
        }
      }}
                @focusout=${async () => {
        await Promise.resolve();
        if (!this.renderRoot.activeElement) this._close();
      }}>
                ${this._items.map((item, index) => {
        const dropdown = item.submenu && !item.link;
        return b2`
                    <div class="item" part="item" style=${o5({ "--button-color": item.backgroundColor || void 0 })}>
                        ${dropdown ? "" : this._link(item, "action")}
                        ${item.submenu ? b2`
                            <button type="button" class=${dropdown ? "action toggle dropdown" : "toggle"}
                                part=${dropdown ? "button toggle" : "toggle"} id="toggle-${index}"
                                aria-label=${dropdown ? item.label : `More options for ${item.label}`}
                                aria-expanded=${this._open === index}
                                aria-controls="menu-${index}"
                                @click=${() => this._open === index ? this._close() : this._show(index)}
                                @keydown=${(event) => this._toggleKey(event, index)}>${dropdown ? item.labelNodes : ""}</button>
                            ${this._open === index ? b2`
                                <ul class="popup" part="menu" id="menu-${index}" aria-labelledby="toggle-${index}"
                                    @keydown=${this._menuKey} @click=${() => this._close(true)}>
                                    ${item.children.map((link) => b2`<li>${this._link(link, "menu-link")}</li>`)}
                                </ul>
                            ` : b2`<ul id="menu-${index}" hidden></ul>`}
                        ` : ""}
                    </div>
                `;
      })}
            </div>
        `;
    }
  };
  customElements.define("fucodo-button-group", FucodoButtonGroup);
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
lit-html/directive.js:
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

lit-html/directives/style-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
