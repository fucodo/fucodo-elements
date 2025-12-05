import style from './style.scss';

class CircleProgress extends HTMLElement {
    static get observedAttributes() {
        return ['percent', 'size', 'class', 'color', 'title', 'text'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._render();
    }

    attributeChangedCallback() {
        this._render();
    }

    _render() {
        const percentAttr = this.getAttribute('percent') || '0';
        const percent = Math.max(0, Math.min(100, parseInt(percentAttr, 10)));

        const extraClass = this.getAttribute('class') || '';
        const color = this.getAttribute('color') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') ?? `${percent}%`;

        // NEW: size attribute → CSS variable
        // falls back to font-size if not provided
        const sizeAttr = this.getAttribute('size');
        const sizeStyle = sizeAttr ? `--size: ${sizeAttr}px;` : ``;

        const wrapperClass = `c100 ${extraClass} ${color}`.trim();

        this.shadowRoot.innerHTML = `
      <style>
        ${style}
      </style>

      <div class="${wrapperClass}"
           style="--percent:${percent}; ${sizeStyle}"
           title="${title}">
        <span>${text}</span>
        <div class="slice"><div class="bar"></div><div class="fill"></div></div>
      </div>
    `;
    }
}

customElements.define('fucodo-progress-circle', CircleProgress);
