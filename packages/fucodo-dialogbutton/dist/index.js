(() => {
  // packages/fucodo-dialogbutton/index.js
  var index = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `

      <slot></slot>
    `;
      this.dialog = this.shadowRoot.querySelector("dialog");
      this.shadowRoot.querySelector("slot").addEventListener("click", () => this.loadAndShow());
    }
    async cleanup() {
      this.dialog.close();
      if (this.removeDialog) {
        document.body.removeChild(this.dialog);
      }
    }
    async loadAndShow() {
      const url = this.getAttribute("url");
      const selector = this.getAttribute("selector");
      const dialogSelector = this.getAttribute("dialogId");
      this.removeDialog = false;
      if (!url || !selector) {
        console.warn("<fucodo-dialogbutton> requires both `url` and `selector` attributes.");
        return;
      }
      if (dialogSelector) {
        this.dialog = document.getElementById(dialogSelector);
      }
      if (!dialogSelector || !this.dialog) {
        this.dialog = document.createElement("dialog");
        this.dialog.classList.add("card");
        this.dialog.setAttribute("style", "height :fit-content!important");
        document.body.appendChild(this.dialog);
        this.removeDialog = true;
      }
      this.dialog.showModal();
      this.dialog.innerHTML = '<div><button part="close-button" aria-label="Close" class="btn-close float-end"></button></div><div part="content">Loading ...</div>';
      this.contentContainer = this.dialog.querySelector('[part="content"]');
      this.dialog.querySelector('[part="close-button"]').addEventListener("click", () => this.dialog.close());
      this.dialog.addEventListener("close", () => this.cleanup());
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1e4);
        const response = await fetch(url, {
          signal: controller.signal,
          // Add cache control to prevent caching issues
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          }
        });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const selected = doc.querySelector(selector);
        if (!selected) {
          throw new Error(`Selector "${selector}" not found in fetched content.`);
        }
        this.contentContainer.innerHTML = selected.innerHTML;
      } catch (err) {
        console.error("fucodo-dialogbutton error:", err);
        this.contentContainer.innerHTML = `<p>Error loading content: ${err.message}</p>`;
      }
    }
  };
  customElements.define("fucodo-dialogbutton", index);
})();
