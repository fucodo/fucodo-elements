(() => {
  // packages/clickindicator/index.js
  (() => {
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
        this.loadingIndicator = this.querySelector(".loadingIndicator");
        this.notLoadingIndicator = this.querySelector(".notLoadingIndicator");
        if (!this.trigger) {
          console.error("<fucodo-loading-action> needs a first child as the trigger (button/link).");
          return;
        }
        if (this.loadingIndicator) {
          this.loadingIndicator.style.display = "none";
        }
        this._onHostClick = this._onHostClick.bind(this);
        this._onTriggerClick = this._onTriggerClick.bind(this);
        this.addEventListener("click", this._onHostClick);
        this.trigger.addEventListener("click", this._onTriggerClick);
      }
      disconnectedCallback() {
        this.removeEventListener("click", this._onHostClick);
        this.trigger?.removeEventListener("click", this._onTriggerClick);
        clearTimeout(this._t);
      }
      _onHostClick(e) {
        if (!this.trigger) return;
        if (e.target === this.trigger || this.trigger.contains(e.target)) return;
        if (this._isDisabled(this.trigger)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        this.trigger.click();
      }
      _onTriggerClick(e) {
        if (this._isDisabled(this.trigger)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        requestAnimationFrame(() => this._startLoadingCycle());
      }
      _startLoadingCycle() {
        if (this._isDisabled(this.trigger)) return;
        this._setDisabled(this.trigger, true);
        clearTimeout(this._t);
        this._t = setTimeout(() => {
          this._setDisabled(this.trigger, false);
          this.dispatchEvent(new CustomEvent(this.eventName, {
            bubbles: true,
            detail: { trigger: this.trigger }
          }));
        }, this.duration);
      }
      // helpers
      _isDisabled(el) {
        if ("disabled" in el) return !!el.disabled;
        return el.getAttribute("aria-disabled") === "true" || el.hasAttribute("data-disabled");
      }
      _setDisabled(el, state) {
        if (this.loadingIndicator) {
          if (state) {
            this.loadingIndicator.style.display = "";
          } else {
            this.loadingIndicator.style.display = "none";
          }
        }
        if (this.notLoadingIndicator) {
          if (state) {
            this.notLoadingIndicator.style.display = "none";
          } else {
            this.notLoadingIndicator.style.display = "";
          }
        }
        if ("disabled" in el) {
          el.disabled = state;
        } else {
          el.setAttribute("aria-disabled", state ? "true" : "false");
          el.classList.toggle("disabled", state);
          if (state) {
            this.trigger.classList.add(this.activeClass);
            el.setAttribute("data-disabled", "true");
          } else {
            this.trigger.classList.remove(this.activeClass);
            el.removeAttribute("data-disabled");
          }
        }
        el.toggleAttribute("aria-busy", state);
      }
    };
    customElements.define("fucodo-loading-action", LoadingAction);
  })();
})();
