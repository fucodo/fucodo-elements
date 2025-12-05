(() => {
  // packages/fucodo-progress-circle/style.scss
  var style_default = `@charset "UTF-8";
:host {
  /* fallback size: inherits from the element's font-size (1em) */
  font-size: 120px; /* optional default */
}

.c100 {
  /* priority: attribute \u2192 outside CSS \u2192 fallback */
  --size: 1em; /* fallback if no attribute & no external CSS vars */
  --percent: 0;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  position: relative;
  --track-color: #ccc;
  --indicator-color: #307bbb;
  --bg-color: #f5f5f5;
  background: radial-gradient(farthest-side, var(--bg-color) 79%, transparent 80%) center/100% 100% no-repeat, conic-gradient(var(--indicator-color) calc(var(--percent) * 1%), var(--track-color) 0);
}

.c100 > span {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--track-color);
  white-space: nowrap;
  z-index: 1;
  transition: all 0.2s ease;
  font-size: calc(var(--size) * 0.18);
}

.c100:hover > span {
  font-size: calc(var(--size) * 0.25);
  color: var(--indicator-color);
}

/* inner elements kept for compatibility (not visually active) */
.slice, .bar, .fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

/* themes */
.c100.green {
  --indicator-color: #4db53c;
}

.c100.orange {
  --indicator-color: #dd9d22;
}

.c100.dark {
  --track-color: #777;
  --bg-color: #666;
  --indicator-color: #c6ff00;
}

.c100.green.dark {
  --indicator-color: #5fd400;
}

.c100.orange.dark {
  --indicator-color: #e08833;
}`;

  // packages/fucodo-progress-circle/index.js
  var CircleProgress = class extends HTMLElement {
    static get observedAttributes() {
      return ["percent", "size", "class", "color", "title", "text"];
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._render();
    }
    attributeChangedCallback() {
      this._render();
    }
    _render() {
      const percentAttr = this.getAttribute("percent") || "0";
      const percent = Math.max(0, Math.min(100, parseInt(percentAttr, 10)));
      const extraClass = this.getAttribute("class") || "";
      const color = this.getAttribute("color") || "";
      const title = this.getAttribute("title") || "";
      const text = this.getAttribute("text") ?? `${percent}%`;
      const sizeAttr = this.getAttribute("size");
      const sizeStyle = sizeAttr ? `--size: ${sizeAttr}px;` : ``;
      const wrapperClass = `c100 ${extraClass} ${color}`.trim();
      this.shadowRoot.innerHTML = `
      <style>
        ${style_default}
      </style>

      <div class="${wrapperClass}"
           style="--percent:${percent}; ${sizeStyle}"
           title="${title}">
        <span>${text}</span>
        <div class="slice"><div class="bar"></div><div class="fill"></div></div>
      </div>
    `;
    }
  };
  customElements.define("fucodo-progress-circle", CircleProgress);
})();
