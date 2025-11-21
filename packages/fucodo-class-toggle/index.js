class ClassToggle extends HTMLElement {
    static get observedAttributes() {
        return ['target', 'toggle-class'];
    }

    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    connectedCallback() {
        // No Shadow DOM -> slot content stays in the light DOM
        this.addEventListener('click', this._onClick);

        // Optional: make it keyboard-focusable if no focusable child
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
    }

    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }

    get targetSelector() {
        return this.getAttribute('target');
    }

    set targetSelector(value) {
        this.setAttribute('target', value);
    }

    get toggleClass() {
        return this.getAttribute('toggle-class') || 'is-active';
    }

    set toggleClass(value) {
        this.setAttribute('toggle-class', value);
    }

    _onClick(event) {
        // If the trigger is a link or button, prevent default navigation/submit
        const tag = event.target.tagName;
        if (tag === 'A' || tag === 'BUTTON') {
            event.preventDefault();
        }

        this._toggleTargets();
    }

    _toggleTargets() {
        const selector = this.targetSelector;
        const className = this.toggleClass;

        if (!selector || !className) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.classList.toggle(className));
    }
}

customElements.define('fucodo-class-toggle', ClassToggle);
