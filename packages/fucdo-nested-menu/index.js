import style from './style.scss';

class FucdoNestedMenu extends HTMLElement {
  static get observedAttributes() {
    return ['data-menu', 'trigger'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.path = [];
    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <dialog aria-label="Navigation menu">
        <button class="close" type="button" aria-label="Close menu">×</button>
        <div class="panels"></div>
      </dialog>
    `;
    this.dialog = this.shadowRoot.querySelector('dialog');
    this.panels = this.shadowRoot.querySelector('.panels');
    this.shadowRoot.querySelector('.close').addEventListener('click', () => this.dialog.close());
    this.dialog.addEventListener('click', event => {
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
    const trigger = this.getAttribute('trigger');
    this.triggerElements = trigger ? [...document.querySelectorAll(trigger)] : [];
    this._openMenu = () => {
      this.path = [];
      this._render();
      this.dialog.showModal();
    };
    this.triggerElements.forEach(element => element.addEventListener('click', this._openMenu));
  }

  _unbindTrigger() {
    this.triggerElements?.forEach(element => element.removeEventListener('click', this._openMenu));
    this.triggerElements = [];
  }

  _getMenu() {
    try {
      const menu = JSON.parse(this.getAttribute('data-menu') || '[]');
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
      const panel = document.createElement('nav');
      panel.className = 'panel';
      panel.setAttribute('aria-label', level ? 'Submenu' : 'Main menu');
      if (level) {
        const back = document.createElement('button');
        back.className = 'back';
        back.type = 'button';
        back.textContent = '← Back';
        back.addEventListener('click', () => {
          this.path = this.path.slice(0, -1);
          this._render();
        });
        panel.append(back);
      }

      items.forEach((item, index) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;
        const element = document.createElement(item.link && !hasChildren ? 'a' : 'button');
        element.className = 'item';
        element.textContent = item.title || '';
        if (element instanceof HTMLAnchorElement) {
          element.href = item.link;
          if (item.target) element.target = item.target;
        } else {
          element.type = 'button';
          if (hasChildren) {
            element.setAttribute('aria-haspopup', 'true');
            element.addEventListener('click', () => {
              this.path = [...this.path.slice(0, level), index];
              this._render();
            });
          } else if (item.link) {
            element.addEventListener('click', () => { window.location.href = item.link; });
          }
        }
        panel.append(element);
      });
      this.panels.append(panel);
    });
  }
}

if (!customElements.get('fucdo-nested-menu')) {
  customElements.define('fucdo-nested-menu', FucdoNestedMenu);
}
