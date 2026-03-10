(() => {
  // packages/fucodo-select/index.js
  var AjaxChoices = class extends HTMLElement {
    watchForMutations(select) {
      this.mutationObserver = new MutationObserver(
        (mutationList, observer) => {
          this.mutationObserver.disconnect();
          this.choices.refresh(true);
          if (select.hasAttribute("disabled")) {
            this.choices.disable();
          } else {
            this.choices.enable();
          }
          this.watchForMutations(select);
        }
      );
      this.mutationObserver.observe(select, { attributes: true, childList: true, subtree: true });
    }
    connectedCallback() {
      const select = this.querySelector("select");
      if (!select) return;
      const url = select.getAttribute("data-ajax--url");
      const cacheEnabled = select.getAttribute("data-ajax--cache") === "true";
      const cache = {};
      this.choices = new Choices(
        select,
        {
          removeItemButton: true,
          searchResultLimit: 10,
          classNames: {
            containerInner: "form-control"
          }
        }
      );
      this.watchForMutations(select);
      select.addEventListener("search", async (evt) => {
        const term = evt.detail.value;
        if (!term || !url) return;
        if (cacheEnabled && cache[term]) {
          choices.setChoices([], "value", "label", true);
          choices.setChoices(cache[term], "value", "label", false);
          return;
        }
        try {
          const query = encodeURIComponent(term);
          const response = await fetch(`${url}&q=${encodeURIComponent(query)}`);
          const data = await response.json();
          const newChoices = (data.results || data).map((item) => ({
            value: item.id,
            label: item.text
          }));
          if (cacheEnabled) cache[term] = newChoices;
          this.choices.setChoices([], "value", "label", true);
          this.choices.setChoices(newChoices, "value", "label", false);
          this.choices.enable();
        } catch (err) {
          console.error(err);
        }
      });
    }
  };
  customElements.define("fucodo-select", AjaxChoices);
})();
