class CheckToggle extends HTMLElement {
    static get observedAttributes() {
        return ['target'];
    }

    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
    }

    connectedCallback() {
        // No Shadow DOM → default slot content stays in light DOM
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', this._onKeyDown);

        // Make component focusable if not already
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }

        // Optional ARIA role to act like a button
        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'button');
        }
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
        this.removeEventListener('keydown', this._onKeyDown);
    }

    get targetSelector() {
        return this.getAttribute('target');
    }

    set targetSelector(value) {
        this.setAttribute('target', value);
    }

    _onClick(event) {
        // If the trigger is a button or link, prevent default action
        const tag = event.target.tagName;
        if (tag === 'A' || tag === 'BUTTON') {
            event.preventDefault();
        }

        this._toggleInputs();
    }

    _onKeyDown(event) {
        // Space or Enter should also trigger toggling
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            this._toggleInputs();
        }
    }

    _toggleInputs() {
        const selector = this.targetSelector;
        if (!selector) return;

        const elements = document.querySelectorAll(selector);

        elements.forEach(el => {
            if (!(el instanceof HTMLInputElement)) return;

            const type = el.type;
            if (type !== 'checkbox' && type !== 'radio') return;

            // Toggle checked state
            el.checked = !el.checked;

            // Fire a change event so listeners are notified
            const changeEvent = new Event('change', { bubbles: true });
            el.dispatchEvent(changeEvent);
        });
    }
}

customElements.define('fucodo-checkbox-toggle', CheckToggle);
