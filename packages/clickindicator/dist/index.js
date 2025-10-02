(() => {
  // packages/clickindicator/index.js
  var LoadingAction = class extends HTMLElement {
    static get observedAttributes() {
      return ["active-class", "duration", "event"];
    }
    get activeClass() {
      return this.getAttribute("active-class") || "is-loading";
    }
    get duration() {
      const n = Number(this.getAttribute("duration"));
      return Number.isFinite(n) && n >= 0 ? n : 2e3;
    }
    get eventName() {
      return this.getAttribute("event") || "loading-done";
    }
    connectedCallback() {
      this.trigger = this.firstElementChild;
      if (!this.trigger) {
        console.warn("<fucodo-loading-action> braucht ein Kindelement (Button/Link).");
        return;
      }
      this._onClick = (e) => {
        if (this._isDisabled(this.trigger)) {
          e.preventDefault();
          return;
        }
        if (this.trigger.tagName === "A") e.preventDefault();
        this._setDisabled(this.trigger, true);
        this.trigger.classList.add(this.activeClass);
        clearTimeout(this._t);
        this._t = setTimeout(() => {
          this.trigger.classList.remove(this.activeClass);
          this._setDisabled(this.trigger, false);
          this.dispatchEvent(new CustomEvent(this.eventName, {
            bubbles: true,
            detail: { trigger: this.trigger }
          }));
        }, this.duration);
      };
      this.trigger.addEventListener("click", this._onClick);
    }
    disconnectedCallback() {
      this.trigger?.removeEventListener("click", this._onClick);
      clearTimeout(this._t);
    }
    // Hilfsfunktionen für „disabled“ auch bei <a> etc.
    _isDisabled(el) {
      if (el.tagName === "BUTTON" || "disabled" in el) return !!el.disabled;
      return el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled");
    }
    _setDisabled(el, state) {
      if (el.tagName === "BUTTON" || "disabled" in el) {
        el.disabled = state;
      } else {
        el.setAttribute("aria-disabled", state ? "true" : "false");
        el.classList.toggle("disabled", state);
        if (state) el.setAttribute("data-disabled", "true");
        else el.removeAttribute("data-disabled");
      }
      el.toggleAttribute("aria-busy", state);
    }
  };
  customElements.define("fucodo-loading-action", LoadingAction);
})();
