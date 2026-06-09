import styles from './style.scss';

class CollapsibleTable extends HTMLElement {
    // ─── Lifecycle ────────────────────────────────────────────────────────────

    connectedCallback() {
        this._injectStyles();
        this._buildGroupRows();
        this._bindEvents();
    }

    // ─── Style injection (scoped to the host element) ─────────────────────────

    _injectStyles() {
        if (this.querySelector('style[data-ct]')) return;

        const style = document.createElement('style');
        style.setAttribute('data-ct', '');
        style.textContent = styles.toString();
        this.prepend(style);
    }

    // ─── Build group header rows ───────────────────────────────────────────────

    _buildGroupRows() {
        const groups = this.querySelectorAll('tbody[data-group]');

        groups.forEach(tbody => {
            const label    = tbody.getAttribute('data-group');
            const attr     = tbody.getAttribute('data-open');
            const isOpen   = attr === 'true';                       // default: closed
            const dataRows = [...tbody.querySelectorAll('tr')];
            const colCount = this._colCount();

            // Mark existing rows
            dataRows.forEach(r => r.classList.add('ct-data-row'));

            // Build header row
            const headerRow = document.createElement('tr');
            headerRow.classList.add('ct-group-header');
            headerRow.setAttribute('role', 'button');
            headerRow.setAttribute('tabindex', '0');
            headerRow.setAttribute('aria-expanded', String(isOpen));
            headerRow.setAttribute('data-target', label);

            const td = document.createElement('td');
            td.setAttribute('colspan', colCount);
            td.innerHTML = `
        <span class="ct-inner">
          <span class="ct-chevron" aria-hidden="true">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 2L7 5L3 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span class="ct-label">${label}</span>
          <span class="ct-count">${dataRows.length}</span>
        </span>
      `;

            headerRow.appendChild(td);
            tbody.insertBefore(headerRow, tbody.firstChild);

            // Apply initial state
            if (!isOpen) {
                dataRows.forEach(r => r.classList.add('ct-hidden'));
                headerRow.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ─── Events ───────────────────────────────────────────────────────────────

    _bindEvents() {
        this.addEventListener('click', e => {
            const header = e.target.closest('.ct-group-header');
            if (header) this._toggle(header);
        });

        this.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                const header = e.target.closest('.ct-group-header');
                if (header) { e.preventDefault(); this._toggle(header); }
            }
        });
    }

    _toggle(headerRow) {
        const isOpen = headerRow.getAttribute('aria-expanded') === 'true';
        const tbody  = headerRow.closest('tbody');
        const rows   = [...tbody.querySelectorAll('.ct-data-row')];

        rows.forEach(r => r.classList.toggle('ct-hidden', isOpen));
        headerRow.setAttribute('aria-expanded', String(!isOpen));

        // Dispatch custom event
        this.dispatchEvent(new CustomEvent('ct-toggle', {
            bubbles: true,
            detail: { group: tbody.getAttribute('data-group'), open: !isOpen }
        }));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    _colCount() {
        const firstRow = this.querySelector('thead tr') || this.querySelector('tr');
        return firstRow ? firstRow.children.length : 1;
    }
}

customElements.define('fucodo-table-collapsible', CollapsibleTable);
