import style from './style.scss';

class ProgressBar extends HTMLElement {
    static get observedAttributes() {
        return ['percent', 'size', 'class', 'color', 'title', 'text', 'total-steps', 'steps-solved'];
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
        let percentAttr = 0;
        if (this.hasAttribute('percent')) {
            percentAttr = this.getAttribute('percent') || '0';
        }
        if (this.hasAttribute('total-steps') && this.hasAttribute('steps-solved')) {
            percentAttr = parseInt(parseFloat(this.getAttribute('steps-solved')) / parseFloat(this.getAttribute('total-steps')) * 100);
        }

        const percent = Math.max(0, Math.min(100, parseInt(percentAttr, 10)));

        const extraClass = this.getAttribute('class') || '';
        const color = this.getAttribute('color') || '';
        const title = this.getAttribute('title') || '';
        const text = this.getAttribute('text') ?? `${percent}%`;

        // size attribute → CSS variable
        // handles both int (pixels) and CSS value with unit
        const sizeAttr = this.getAttribute('size');
        let sizeStyle = '';
        if (sizeAttr) {
            if (/^\d+$/.test(sizeAttr)) {
                sizeStyle = `--size: ${sizeAttr}px;`;
            } else {
                sizeStyle = `--size: ${sizeAttr};`;
            }
        }

        const wrapperClass = `fucodo-progress-bar-container ${extraClass} ${color}`.trim();

        this.shadowRoot.innerHTML = `
      <style>
        ${style}
      </style>

      <div class="${wrapperClass}"
           style="--percent:${percent}; ${sizeStyle}"
           title="${title}">
        <div class="fucodo-progress-bar-fill"></div>
        <div class="fucodo-progress-bar-text">${text}</div>
      </div>
    `;
    }
}

customElements.define('fucodo-progress-bar', ProgressBar);
