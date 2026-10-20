(() => {
  // packages/fucdo-nested-menu/style.scss
  var style_default = `:host {
  font: 600 1rem/1.4 Arial, sans-serif;
  color: #222;
}

dialog {
  position: fixed;
  inset: 5rem 0 0;
  width: 100%;
  max-width: none;
  height: calc(100% - 5rem);
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  overflow: auto;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.55);
}

.panels {
  display: flex;
  min-height: 100%;
}

.panel {
  box-sizing: border-box;
  flex: 0 0 min(30rem, 40vw);
  min-height: 100%;
  padding: 5rem 2rem 2rem;
  background: #fff;
}

.panel + .panel {
  background: #eaf2fc;
  color: #16345b;
}

.close {
  position: absolute;
  z-index: 1;
  top: 1rem;
  left: 24rem;
  border: 0;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
}

.item,
.back {
  display: block;
  width: 100%;
  padding: 0.75rem 0.5rem;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.item:hover,
.item:focus-visible {
  background: #eaf2fc;
  color: #2864b4;
}

.back {
  margin-bottom: 1rem;
}

@media (max-width: 700px) {
  dialog {
    inset: 0;
    height: 100%;
  }
  .panel {
    flex-basis: 100%;
  }
  .panel:not(:last-child) {
    display: none;
  }
  .close {
    left: auto;
    right: 1rem;
  }
}`;

  // packages/fucdo-nested-menu/index.js
  var FucdoNestedMenu = class extends HTMLElement {
    static get observedAttributes() {
      return ["data-menu", "trigger"];
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.path = [];
      this.shadowRoot.innerHTML = `
      <style>${style_default}</style>
      <dialog aria-label="Navigation menu">
        <button class="close" type="button" aria-label="Close menu">\xD7</button>
        <div class="panels"></div>
      </dialog>
    `;
      this.dialog = this.shadowRoot.querySelector("dialog");
      this.panels = this.shadowRoot.querySelector(".panels");
      this.shadowRoot.querySelector(".close").addEventListener("click", () => this.dialog.close());
      this.dialog.addEventListener("click", (event) => {
        if (event.target === this.dialog) this.dialog.close();
      });
    }
    connectedCallback() {
      this._bindTrigger();
      this._render();
    }
    disconnectedCallback() {
      this._unbindTrigger();
    }
    attributeChangedCallback() {
      if (this.isConnected) {
        this._bindTrigger();
        this._render();
      }
    }
    _bindTrigger() {
      this._unbindTrigger();
      const trigger = this.getAttribute("trigger");
      this.triggerElements = trigger ? [...document.querySelectorAll(trigger)] : [];
      this._openMenu = () => {
        this.path = [];
        this._render();
        this.dialog.showModal();
      };
      this.triggerElements.forEach((element) => element.addEventListener("click", this._openMenu));
    }
    _unbindTrigger() {
      this.triggerElements?.forEach((element) => element.removeEventListener("click", this._openMenu));
      this.triggerElements = [];
    }
    _getMenu() {
      try {
        const menu = JSON.parse(this.getAttribute("data-menu") || "[]");
        return Array.isArray(menu) ? menu : [];
      } catch {
        return [];
      }
    }
    _render() {
      const menu = this._getMenu();
      const levels = [menu];
      for (const index of this.path) {
        const item = levels.at(-1)?.[index];
        if (!item?.children?.length) break;
        levels.push(item.children);
      }
      this.panels.replaceChildren();
      levels.forEach((items, level) => {
        const panel = document.createElement("nav");
        panel.className = "panel";
        panel.setAttribute("aria-label", level ? "Submenu" : "Main menu");
        if (level) {
          const back = document.createElement("button");
          back.className = "back";
          back.type = "button";
          back.textContent = "\u2190 Back";
          back.addEventListener("click", () => {
            this.path = this.path.slice(0, -1);
            this._render();
          });
          panel.append(back);
        }
        items.forEach((item, index) => {
          const hasChildren = Array.isArray(item.children) && item.children.length > 0;
          const element = document.createElement(item.link && !hasChildren ? "a" : "button");
          element.className = "item";
          element.textContent = item.title || "";
          if (element instanceof HTMLAnchorElement) {
            element.href = item.link;
            if (item.target) element.target = item.target;
          } else {
            element.type = "button";
            if (hasChildren) {
              element.setAttribute("aria-haspopup", "true");
              element.addEventListener("click", () => {
                this.path = [...this.path.slice(0, level), index];
                this._render();
              });
            } else if (item.link) {
              element.addEventListener("click", () => {
                window.location.href = item.link;
              });
            }
          }
          panel.append(element);
        });
        this.panels.append(panel);
      });
    }
  };
  if (!customElements.get("fucdo-nested-menu")) {
    customElements.define("fucdo-nested-menu", FucdoNestedMenu);
  }
})();
