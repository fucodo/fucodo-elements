(() => {
  // packages/fucodo-checkbox-toggle/index.js
  var CheckToggle = class extends HTMLElement {
    static get observedAttributes() {
      return ["target"];
    }
    constructor() {
      super();
      this._onClick = this._onClick.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
    }
    connectedCallback() {
      this.addEventListener("click", this._onClick);
      this.addEventListener("keydown", this._onKeyDown);
      if (!this.hasAttribute("tabindex")) {
        this.setAttribute("tabindex", "0");
      }
      if (!this.hasAttribute("role")) {
        this.setAttribute("role", "button");
      }
    }
    disconnectedCallback() {
      this.removeEventListener("click", this._onClick);
      this.removeEventListener("keydown", this._onKeyDown);
    }
    get targetSelector() {
      return this.getAttribute("target");
    }
    set targetSelector(value) {
      this.setAttribute("target", value);
    }
    _onClick(event) {
      const tag = event.target.tagName;
      if (tag === "A" || tag === "BUTTON") {
        event.preventDefault();
      }
      this._toggleInputs();
    }
    _onKeyDown(event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        this._toggleInputs();
      }
    }
    _toggleInputs() {
      const selector = this.targetSelector;
      if (!selector) return;
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => {
        if (!(el instanceof HTMLInputElement)) return;
        const type = el.type;
        if (type !== "checkbox" && type !== "radio") return;
        el.checked = !el.checked;
        const changeEvent = new Event("change", { bubbles: true });
        el.dispatchEvent(changeEvent);
      });
    }
  };
  customElements.define("fucodo-checkbox-toggle", CheckToggle);
})();
