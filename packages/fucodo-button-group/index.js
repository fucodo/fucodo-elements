import { LitElement, html, css } from 'lit';

export class FucodoButtonGroup extends LitElement {
    static properties = {
        label: {},
        _items: { state: true },
        _open: { state: true },
    };

    static styles = css`
        :host { display: block; --button-color: #0d6efd; --button-text-color: white; }
        slot { display: none; }
        .group { display: flex; flex-wrap: wrap; gap: var(--button-group-gap, .5rem); align-items: stretch; }
        .item { display: inline-flex; position: relative; max-width: 100%; }
        .item:has(.popup) { z-index: 1; }
        a, button { box-sizing: border-box; font: inherit; }
        .action, .toggle {
            display: inline-flex; align-items: center; justify-content: center;
            padding: .5rem 1rem; min-height: 2.75rem;
            border: 1px solid var(--button-color); border-radius: 0;
            background: var(--button-color); color: var(--button-text-color);
            text-decoration: none; cursor: pointer; overflow-wrap: anywhere;
        }
        .action { min-width: 0; }
        .toggle { flex-shrink: 0; padding-inline: .75rem; border-inline-start-color: currentColor; }
        .toggle::after { content: ''; border: .3em solid transparent; border-bottom: 0; border-top-color: currentColor; }
        .item > .action { border-start-start-radius: .375rem; border-end-start-radius: .375rem; }
        .item > .action:last-child, .item > .toggle { border-start-end-radius: .375rem; border-end-end-radius: .375rem; }
        .action:hover, .toggle:hover { filter: brightness(.9); }
        a:focus-visible, button:focus-visible { outline: 3px solid var(--button-focus-color, #80b7ff); outline-offset: 2px; z-index: 2; }
        .popup {
            position: absolute; inset-block-start: calc(100% + .25rem); inset-inline-end: 0;
            width: max-content; min-width: 100%; max-width: min(20rem, calc(100vw - 2rem));
            margin: 0; padding: .25rem; list-style: none; background: var(--button-menu-background, white);
            color: var(--button-menu-color, #212529); border: 1px solid #ccc; border-radius: .375rem;
            box-shadow: 0 .25rem .75rem #0002;
        }
        .popup a { display: block; padding: .5rem .75rem; color: inherit; text-decoration: none; overflow-wrap: anywhere; }
        .popup a:hover, .popup a:focus-visible { background: var(--button-menu-hover, #eee); }
        @media (max-width: 480px) { .popup { inset-inline-start: 0; inset-inline-end: auto; } }
    `;

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
        this._items = [...(list?.children ?? [])].filter(element => element.matches('li')).flatMap(item => {
            const link = item.querySelector(':scope > a');
            if (!link) return [];
            return [{ link, children: [...item.querySelectorAll(':scope > ul > li > a')] }];
        });
        this._open = -1;
    }

    _link(source, className) {
        // Clone DOM nodes rather than interpolating HTML; retain native link attributes and markup.
        const link = source.cloneNode(true);
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
                        ${this._link(item.link, 'action')}
                        ${item.children.length ? html`
                            <button type="button" class="toggle" part="toggle" id="toggle-${index}"
                                aria-label=${`More options for ${item.link.textContent.trim()}`}
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
