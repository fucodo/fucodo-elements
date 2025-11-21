(() => {
  // packages/fucodo-modal-once/style.scss
  var style_default = `.dialog-overlay::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

.dialog-overlay {
  border: 0;
  border-radius: 0.5rem;
  padding: 0;
}

.dialog-content {
  padding: 1rem;
}

.dialog-close-btn {
  display: inline-block;
  margin: 1rem;
  margin-top: 0.75rem;
  margin-right: 1.5rem;
  float: right;
}`;

  // packages/fucodo-modal-once/index.js
  var ModalOnce = class extends HTMLElement {
    constructor() {
      super();
      this.styleEl = document.createElement("style");
      this.styleEl.textContent = style_default;
      this.appendChild(this.styleEl);
    }
    connectedCallback() {
      this.cookieName = this.getAttribute("data-cookie-name") || "overlay_shown_" + (this.closest("[data-ce-uid]")?.dataset.ceUid || "global");
      this.cookieDays = parseInt(this.getAttribute("data-cookie-days") || "0", 10);
      this.autoOpen = this.getAttribute("data-auto-open") === "1";
      this.dialog = this.querySelector("dialog");
      if (!this.dialog) {
        console.warn("[dialog-overlay] <dialog> nicht gefunden.");
        return;
      }
      if (!this._hasCookie(this.cookieName) && this.autoOpen) {
        this._open();
      }
      this.dialog.addEventListener("close", () => {
        this._setCookie(this.cookieName, "1", this.cookieDays);
      });
      this.addEventListener("click", (ev) => {
        const target = ev.target;
        if (target && target.matches("[data-close], .dialog-close-btn")) {
          try {
            this.dialog.close();
          } catch (e) {
          }
        }
      });
    }
    _open() {
      if (typeof this.dialog.showModal === "function") {
        try {
          this.dialog.showModal();
        } catch (e) {
          this.dialog.setAttribute("open", "");
        }
      } else {
        this.dialog.setAttribute("open", "");
      }
    }
    _setCookie(name, value, days) {
      if (parseInt(days) === 0) {
        return;
      }
      const d = /* @__PURE__ */ new Date();
      d.setTime(d.getTime() + days * 24 * 60 * 60 * 1e3);
      const expires = "expires=" + d.toUTCString();
      const secure = location.protocol === "https:" ? "; Secure" : "";
      const cookieString = name + "=" + encodeURIComponent(value) + ";" + expires + "; path=/; SameSite=Lax" + secure;
      document.cookie = cookieString;
    }
    _hasCookie(name) {
      return document.cookie.split(";").map((v) => v.trim()).some((c) => c.startsWith(name + "="));
    }
  };
  customElements.define("fucodo-modal-once", ModalOnce);
})();
