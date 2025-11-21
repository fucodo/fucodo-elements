(() => {
  // packages/fucodo-spinner/style.scss
  var style_default = `.loader {
  border: 5px solid #FFF;
  border-bottom-color: #FF3D00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: loader-rotation 1s linear infinite;
}

@keyframes loader-rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`;

  // packages/fucodo-spinner/index.js
  var SpinnerLoader = class extends HTMLElement {
    static get observedAttributes() {
      return ["enabled", "size", "color"];
    }
    static styles = style_default;
    constructor() {
      super();
      this.loaderEl = document.createElement("span");
      this.loaderEl.classList.add("loader");
      this.style.display = "inline-block";
      this.appendChild(this.loaderEl);
      this.styleEl = document.createElement("style");
      this.styleEl.textContent = style_default;
      this.appendChild(this.styleEl);
    }
    connectedCallback() {
      this._update();
    }
    attributeChangedCallback() {
      this._update();
    }
    _update() {
      let enabled = true;
      if (this.hasAttribute("enabled") === true) {
        enabled = this.getAttribute("enabled") === "1";
      }
      this.loaderEl.style.display = enabled ? "inline-block" : "none";
      let size = this.getAttribute("size");
      if (!size) {
        const lh = getComputedStyle(this).lineHeight;
        size = lh.endsWith("px") ? parseFloat(lh) : 16;
      }
      size = parseFloat(size);
      this.loaderEl.style.width = size + "px";
      this.loaderEl.style.height = size + "px";
      this.loaderEl.style.borderWidth = Math.max(2, Math.round(size / 10)) + "px";
      let color = this.getAttribute("color");
      if (!color) {
        color = getComputedStyle(this).color || "#FF3D00";
      }
      this.loaderEl.style.border = `${Math.max(2, Math.round(size / 10))}px solid transparent`;
      this.loaderEl.style.borderBottomColor = color;
      this.loaderEl.style.borderTopColor = "transparent";
      this.loaderEl.style.borderRightColor = "transparent";
      this.loaderEl.style.borderLeftColor = "transparent";
    }
  };
  customElements.define("fucodo-spinner", SpinnerLoader);
})();
