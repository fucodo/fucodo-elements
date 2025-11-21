(() => {
  // packages/fucodo-class-toggle/index.js
  var ClassToggle = class extends HTMLElement {
    static get observedAttributes() {
      return ["target", "toggle-class"];
    }
    constructor() {
      super();
      this._onClick = this._onClick.bind(this);
    }
    connectedCallback() {
      this.addEventListener("click", this._onClick);
      if (!this.hasAttribute("tabindex")) {
        this.setAttribute("tabindex", "0");
      }
    }
    disconnectedCallback() {
      this.removeEventListener("click", this._onClick);
    }
    get targetSelector() {
      return this.getAttribute("target");
    }
    set targetSelector(value) {
      this.setAttribute("target", value);
    }
    get toggleClass() {
      return this.getAttribute("toggle-class") || "is-active";
    }
    set toggleClass(value) {
      this.setAttribute("toggle-class", value);
    }
    _onClick(event) {
      const tag = event.target.tagName;
      if (tag === "A" || tag === "BUTTON") {
        event.preventDefault();
      }
      this._toggleTargets();
    }
    _toggleTargets() {
      const selector = this.targetSelector;
      const className = this.toggleClass;
      if (!selector || !className) return;
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.classList.toggle(className));
    }
  };
  customElements.define("fucodo-class-toggle", ClassToggle);
})();
