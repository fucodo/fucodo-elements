import style from './style.scss';

class FucodoSteps extends HTMLElement {
    static styles = style;

    static get observedAttributes() {
        return ['current', 'mode'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.addEventListener('click', (event) => {
            const bubbleButton = event.target.closest('.step-bubble');
            const step = event.target.closest('.step');

            if (bubbleButton && step) {
                const isOpen = step.classList.toggle('step--popover-open');

                this.shadowRoot.querySelectorAll('.step.step--popover-open').forEach((el) => {
                    if (el !== step) el.classList.remove('step--popover-open');
                });
                this.shadowRoot.querySelectorAll('.step-bubble[aria-expanded="true"]').forEach(btn => {
                    if (btn !== bubbleButton) btn.setAttribute('aria-expanded', 'false');
                });

                bubbleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            } else {
                this.shadowRoot.querySelectorAll('.step.step--popover-open').forEach((el) => {
                    el.classList.remove('step--popover-open');
                });
                this.shadowRoot.querySelectorAll('.step-bubble[aria-expanded="true"]').forEach(btn => {
                    btn.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    connectedCallback() { this.render(); }

    attributeChangedCallback() { this.render(); }

    get current() {
        const val = parseInt(this.getAttribute('current'), 10);
        return Number.isNaN(val) ? 0 : val;
    }

    get mode() {
        return this.getAttribute('mode') || 'full';
    }

    render() {
        const list = this.querySelector('ul, ol');
        if (!list) return;

        const items = [...list.children].filter(el => el.tagName === 'LI');
        list.style.display = 'none';

        const currentIndex = this.current;

        this.shadowRoot.innerHTML = `
            <style>${style}</style>

            <div class="steps-wrapper ${this.mode === 'bubble' ? 'steps-wrapper--bubble' : 'steps-wrapper--full'}"></div>
        `;

        const wrapper = this.shadowRoot.querySelector('.steps-wrapper');

        items.forEach((item, index) => {
            const step = document.createElement('div');
            step.classList.add('step');

            let filler = 'X';
            if (index < currentIndex) {
                step.classList.add('step--done');
                filler = '✔';
            } else if (index === currentIndex) {
                step.classList.add('step--active');
                filler = '?';
            }

            if (this.mode === 'bubble') {
                const bubble = document.createElement('button');
                bubble.className = 'step-bubble';
                bubble.innerHTML = filler;

                const pop = document.createElement('div');
                pop.className = 'step-bubble__popover';
                pop.innerHTML = item.innerHTML.trim();

                step.append(bubble, pop);
            } else {
                const content = document.createElement('span');
                content.innerHTML = item.innerHTML.trim();
                step.append(content);
            }

            wrapper.appendChild(step);
        });
    }
}

customElements.define('fucodo-progress-steps', FucodoSteps);