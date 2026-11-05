import { LitElement, html, unsafeCSS } from 'lit';
import style from './style.scss';

export class FucodoButtonGroup extends LitElement {
    static properties = {
        label: {},
        _items: { state: true },
        _open: { state: true },
    };

    static styles = unsafeCSS(style);

    constructor() {
        super();
        this.label = 'Actions';
        this._items = [];
        this._open = -1;
        this._observer = new MutationObserver(() => this._readList());
        this._outsideClick = event => {
            if (!event.composedPath().includes(this)) this._open = -1;
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this._observer.observe(this, { subtree: true, childList: true, characterData: true, attributes: true });
        this.ownerDocument.addEventListener('click', this._outsideClick);
        this._readList();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._observer.disconnect();
        this.ownerDocument.removeEventListener('click', this._outsideClick);
    }

    _readList() {
        const list = [...this.children].find(element => element.matches('ul:not([slot])'));
        this._items = [...(list?.children ?? [])].filter(element => element.matches('li')).map(item => ({
            ...this._entry(item),
            children: [...item.querySelectorAll(':scope > ul > li')].map(child => this._entry(child)),
        }));
        this._open = -1;
    }

    _entry(item) {
        const link = item.querySelector(':scope > a');
        const labelSource = (link ?? item).cloneNode(true);
        labelSource.querySelectorAll('ul').forEach(list => list.remove());
        return { link, label: labelSource.textContent.trim() };
    }

    _link(item, className) {
        if (!item.link?.getAttribute('href')?.trim()) {
            return html`<button type="button" disabled class=${className}
                part=${className === 'action' ? 'button' : 'menu-link'}>${item.label}</button>`;
        }
        // Clone DOM nodes rather than interpolating HTML; retain native link attributes and markup.
        const link = item.link.cloneNode(true);
        link.removeAttribute('id');
        link.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
        link.classList.add(className);
        link.setAttribute('part', className === 'action' ? 'button' : 'menu-link');
        return link;
    }

    async _show(index, focus = false, last = false) {
        this._open = index;
        await this.updateComplete;
        if (focus) {
            const links = this.renderRoot.querySelectorAll('.popup a');
            links[last ? links.length - 1 : 0]?.focus();
        }
    }

    _close(restoreFocus = false) {
        const index = this._open;
        this._open = -1;
        if (restoreFocus) this.renderRoot.querySelector(`#toggle-${index}`)?.focus();
    }

    _toggleKey(event, index) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            this._show(index, true, event.key === 'ArrowUp');
        }
    }

    _menuKey(event) {
        const links = [...this.renderRoot.querySelectorAll('.popup a')];
        const index = links.indexOf(event.target.closest('a'));
        let next;
        if (event.key === 'ArrowDown') next = (index + 1) % links.length;
        if (event.key === 'ArrowUp') next = (index - 1 + links.length) % links.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = links.length - 1;
        if (next !== undefined) {
            event.preventDefault();
            links[next]?.focus();
        }
    }

    render() {
        return html`
            <slot @slotchange=${this._readList}></slot>
            <div class="group" part="group" role="group" aria-label=${this.label}
                @keydown=${event => {
                    if (event.key === 'Escape' && this._open !== -1) {
                        event.preventDefault();
                        this._close(true);
                    }
                }}
                @focusout=${async () => {
                    await Promise.resolve();
                    if (!this.renderRoot.activeElement) this._close();
                }}>
                ${this._items.map((item, index) => html`
                    <div class="item" part="item">
                        ${this._link(item, 'action')}
                        ${item.children.length ? html`
                            <button type="button" class="toggle" part="toggle" id="toggle-${index}"
                                aria-label=${`More options for ${item.label}`}
                                aria-expanded=${this._open === index}
                                aria-controls="menu-${index}"
                                @click=${() => this._open === index ? this._close() : this._show(index)}
                                @keydown=${event => this._toggleKey(event, index)}></button>
                            ${this._open === index ? html`
                                <ul class="popup" part="menu" id="menu-${index}" aria-labelledby="toggle-${index}"
                                    @keydown=${this._menuKey} @click=${() => this._close(true)}>
                                    ${item.children.map(link => html`<li>${this._link(link, 'menu-link')}</li>`)}
                                </ul>
                            ` : html`<ul id="menu-${index}" hidden></ul>`}
                        ` : ''}
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('fucodo-button-group', FucodoButtonGroup);
