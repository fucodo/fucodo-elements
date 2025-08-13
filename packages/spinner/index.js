import style from './style.scss'

class SpinnerLoader extends HTMLElement {
    static get observedAttributes() {
        return ['enabled', 'size', 'color'];
    }

    static styles = style;

    constructor() {
        super();
        this.loaderEl = document.createElement('span');
        this.loaderEl.classList.add('loader');
        this.style.display = 'inline-block';
        this.appendChild(this.loaderEl);
        this.styleEl = document.createElement('style');
        this.styleEl.textContent = style;
        this.appendChild(this.styleEl);
    }

    connectedCallback() {
        this._update();
    }

    attributeChangedCallback() {
        this._update();
    }

    _update() {
        let enabled = true;
        if (this.hasAttribute('enabled') === true) {
            enabled = this.getAttribute('enabled') === '1';
        }

        this.loaderEl.style.display = enabled ? 'inline-block' : 'none';

        // Size logic
        let size = this.getAttribute('size');
        if (!size) {
            const lh = getComputedStyle(this).lineHeight;
            size = lh.endsWith('px') ? parseFloat(lh) : 16;
        }
        size = parseFloat(size);
        this.loaderEl.style.width = size + 'px';
        this.loaderEl.style.height = size + 'px';
        this.loaderEl.style.borderWidth = Math.max(2, Math.round(size / 10)) + 'px';

        // Color logic
        let color = this.getAttribute('color');
        if (!color) {
            color = getComputedStyle(this).color || '#FF3D00';
        }
        this.loaderEl.style.border = `${Math.max(2, Math.round(size / 10))}px solid transparent`;
        this.loaderEl.style.borderBottomColor = color;
        this.loaderEl.style.borderTopColor = 'transparent';
        this.loaderEl.style.borderRightColor = 'transparent';
        this.loaderEl.style.borderLeftColor = 'transparent';
    }
}

customElements.define('fucodo-spinner', SpinnerLoader);