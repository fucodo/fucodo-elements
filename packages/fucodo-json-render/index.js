import Handlebars from 'handlebars';

class JsonRender extends HTMLElement {
  #template = null;

  connectedCallback() {
    const templateEl = this.querySelector('template');
    if (templateEl) {
      this.#template = Handlebars.compile(templateEl.innerHTML);
      templateEl.remove();
    }

    this.addEventListener('json-data', (e) => this.#render(e.detail.data));
    this.addEventListener('json-error', (e) => this.#renderError(e.detail.error));
  }

  #render(data) {
    if (!this.#template) return;
    this.innerHTML = this.#template({ items: data });
  }

  #renderError(err) {
    this.innerHTML = `<p class="error">Failed to load data.</p>`;
  }
}

customElements.define('fucodo-json-render', JsonRender);