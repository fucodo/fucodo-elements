(() => {
  // packages/fucodo-progress-bar/style.scss
  var style_default = `:host {
  display: block;
  width: 100%;
  font-family: inherit;
}

.fucodo-progress-bar-container {
  --size: 100%;
  --percent: 0;
  --track-color: #ccc;
  --indicator-color: #307bbb;
  --bg-color: #f5f5f5;
  --height: 20px;
  width: var(--size);
  height: var(--height);
  background-color: var(--track-color);
  border-radius: calc(var(--height) / 2);
  position: relative;
  overflow: hidden;
}

.fucodo-progress-bar-fill {
  height: 100%;
  width: calc(var(--percent) * 1%);
  background-color: var(--indicator-color);
  transition: width 0.3s ease;
}

.fucodo-progress-bar-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: calc(var(--height) * 0.7);
  pointer-events: none;
}

/* themes */
.fucodo-progress-bar-container.green {
  --indicator-color: #4db53c;
}

.fucodo-progress-bar-container.orange {
  --indicator-color: #dd9d22;
}

.fucodo-progress-bar-container.dark {
  --track-color: #777;
  --bg-color: #666;
  --indicator-color: #c6ff00;
}

.fucodo-progress-bar-container.green.dark {
  --indicator-color: #5fd400;
}

.fucodo-progress-bar-container.orange.dark {
  --indicator-color: #e08833;
}`;

  // packages/fucodo-progress-bar/index.js
  var ProgressBar = class extends HTMLElement {
    static get observedAttributes() {
      return ["percent", "size", "class", "color", "title", "text", "total-steps", "steps-solved"];
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
      let percentAttr = 0;
      if (this.hasAttribute("percent")) {
        percentAttr = this.getAttribute("percent") || "0";
      }
      if (this.hasAttribute("total-steps") && this.hasAttribute("steps-solved")) {
        percentAttr = parseInt(parseFloat(this.getAttribute("steps-solved")) / parseFloat(this.getAttribute("total-steps")) * 100);
      }
      const percent = Math.max(0, Math.min(100, parseInt(percentAttr, 10)));
      const extraClass = this.getAttribute("class") || "";
      const color = this.getAttribute("color") || "";
      const title = this.getAttribute("title") || "";
      const text = this.getAttribute("text") ?? `${percent}%`;
      const sizeAttr = this.getAttribute("size");
      let sizeStyle = "";
      if (sizeAttr) {
        if (/^\d+$/.test(sizeAttr)) {
          sizeStyle = `--size: ${sizeAttr}px;`;
        } else {
          sizeStyle = `--size: ${sizeAttr};`;
        }
      }
      const wrapperClass = `fucodo-progress-bar-container ${extraClass} ${color}`.trim();
      this.shadowRoot.innerHTML = `
      <style>
        ${style_default}
      </style>

      <div class="${wrapperClass}"
           style="--percent:${percent}; ${sizeStyle}"
           title="${title}">
        <div class="fucodo-progress-bar-fill"></div>
        <div class="fucodo-progress-bar-text">${text}</div>
      </div>
    `;
    }
  };
  customElements.define("fucodo-progress-bar", ProgressBar);
})();
