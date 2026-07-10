(() => {
  // packages/fucodo-json-fetch/index.js
  var JsonFetch = class extends HTMLElement {
    async connectedCallback() {
      const url = this.getAttribute("src");
      await customElements.whenDefined("fucodo-json-render");
      let data;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
      } catch (err) {
        console.error("json-fetch error:", err);
        this.#dispatchToChildren("json-error", { error: err });
        return;
      }
      this.#dispatchToChildren("json-data", { data });
    }
    #dispatchToChildren(eventName, detail) {
      this.querySelectorAll("fucodo-json-render").forEach((el) => {
        if (el.closest("fucodo-json-fetch") !== this) return;
        el.dispatchEvent(new CustomEvent(eventName, { detail }));
      });
    }
  };
  customElements.define("fucodo-json-fetch", JsonFetch);
})();
