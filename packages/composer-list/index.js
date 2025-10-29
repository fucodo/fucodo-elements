class PackagistList extends HTMLElement {
    static get observedAttributes() {
        return ['vendor', 'type', 'q', 'per-page', 'page', 'sort'];
    }

    constructor() {
        super();
        this._state = {
            vendor: '',
            type: '',
            q: '',
            page: 1,
            perPage: 15,
            sort: 'downloads', // downloads | favers | (fallback: relevance)
            loading: false,
            error: null,
            total: 0,
            results: []
        };

        // Root-Container (kein Shadow DOM)
        this.container = document.createElement('div');
        this.container.className = 'packagist-list';
        this.appendChild(this.container);

        // Event Delegation für Pagination
        this.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-pl-action]');
            if (!btn) return;
            const action = btn.getAttribute('data-pl-action');
            if (action === 'prev' && this._state.page > 1) {
                this._state.page -= 1;
                this.setAttribute('page', String(this._state.page));
            } else if (action === 'next') {
                const maxPage = Math.max(1, Math.ceil(this._state.total / this._state.perPage));
                if (this._state.page < maxPage) {
                    this._state.page += 1;
                    this.setAttribute('page', String(this._state.page));
                }
            } else if (action === 'reload') {
                this._fetchAndRender();
            }
        });
    }

    connectedCallback() {
        // Initiale Attribute einlesen
        this._syncFromAttributes();
        this._fetchAndRender();
    }

    attributeChangedCallback() {
        this._syncFromAttributes();
        this._fetchAndRender();
    }

    _syncFromAttributes() {
        const attr = (name, fallback = '') => this.getAttribute(name) ?? fallback;
        const num = (name, fallback) => {
            const v = this.getAttribute(name);
            const n = v ? parseInt(v, 10) : fallback;
            return Number.isFinite(n) && n > 0 ? n : fallback;
        };

        this._state.vendor = attr('vendor', '').trim();
        this._state.type = attr('type', '').trim();
        this._state.q = attr('q', '').trim();
        this._state.page = num('page', 1);
        this._state.perPage = num('per-page', 15);
        const sort = attr('sort', 'downloads').trim().toLowerCase();
        this._state.sort = ['downloads', 'favers', 'relevance'].includes(sort) ? sort : 'downloads';
    }

    async _fetchAndRender() {
        // UI: Ladezustand
        this._state.loading = true;
        this._state.error = null;
        this._render();

        try {
            const {vendor, type, q, page, perPage, sort} = this._state;

            // Packagist Such-API:
            // Basis: https://repo.packagist.org/search.json
            // Parameter: q (Freitext), type (package type), page (1-basiert), per_page (optional)
            // Sortierung client-seitig (downloads/favers), da Server-Relevanz default ist.
            const params = new URLSearchParams();
            // Eingrenzung auf Vendor im Suchbegriff: "vendor/" verbessert die Relevanz für Anbieter
            // Zusätzlich Freitext q vom Attribut zusammenführen.
            const queryParts = [];
            if (vendor) {
                queryParts.push(`${vendor}/`);
            }
            if (q) queryParts.push(q);
            params.set('q', queryParts.join(' ').trim());
            if (type) params.set('type', type);
            if (page) params.set('page', String(page));
            if (perPage) params.set('per_page', String(perPage));

            const url = `https://packagist.org/search.json?${params.toString()}`;
            const resp = await fetch(url, {headers: {'Accept': 'application/json'}});
            if (!resp.ok) throw new Error(`HTTP ${resp.status} beim Laden von Packagist`);

            const data = await resp.json();
            // data.results: Array von Paketen
            // data.total: Gesamtanzahl
            let results = Array.isArray(data.results) ? data.results : [];
            const total = Number.isFinite(data.total) ? data.total : results.length;

            // Clientseitige Sortierung (falls gewünscht)
            if (sort === 'downloads') {
                results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
            } else if (sort === 'favers') {
                results.sort((a, b) => (b.favers || 0) - (a.favers || 0));
            } // 'relevance' lässt Serverreihenfolge bestehen

            this._state.results = results;
            this._state.total = total;
            this._state.loading = false;
            this._render();
        } catch (err) {
            this._state.loading = false;
            this._state.error = (err && err.message) ? err.message : String(err);
            this._render();
        }
    }

    _render() {
        const {loading, error, results, total, page, perPage, vendor, type, q, sort} = this._state;

        const header = `
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div>
          <strong>Vendor:</strong> ${vendor || '—'}
          &nbsp;•&nbsp; <strong>Type:</strong> ${type || '—'}
          ${q ? `&nbsp;•&nbsp; <strong>Query:</strong> ${this._escape(q)}` : ''}
          &nbsp;•&nbsp; <strong>Sort:</strong> ${sort}
        </div>
        <div>
          <button class="btn btn-sm btn-outline-secondary" data-pl-action="reload" aria-label="Reload">Neu laden</button>
        </div>
      </div>
    `;

        const status = loading
            ? `<div class="alert alert-info py-2 mb-3" role="status">Lade Pakete von Packagist…</div>`
            : error
                ? `<div class="alert alert-danger py-2 mb-3">Fehler: ${this._escape(error)}</div>`
                : `<div class="small text-muted mb-2">${total} Treffer · Seite ${page} von ${Math.max(1, Math.ceil(total / perPage))}</div>`;

        const list = results.map(item => this._renderItem(item)).join('') || (!loading && !error
            ? `<div class="alert alert-warning py-2">Keine Pakete gefunden.</div>`
            : '');

        const pager = this._renderPager(total, page, perPage);

        this.container.innerHTML = `
      ${header}
      ${status}
      <div class="list-group mb-3">
        ${list}
      </div>
      ${pager}
      <style>
        .packagist-list .list-group-item h5 {
          margin: 0 0 .25rem 0;
          font-size: 1rem;
        }
        .packagist-list code {
          white-space: nowrap;
        }
      </style>
    `;
    }

    _renderItem(pkg) {
        // Erwartete Felder aus Packagist-Suche:
        // name, description, repository, url (packagist detail), downloads, favers, abandoned?
        const name = pkg.name || '';
        const description = pkg.description || '';
        const url = pkg.url || `https://packagist.org/packages/${encodeURIComponent(name)}`;
        const repo = pkg.repository || '';
        const downloads = pkg.downloads ?? 0;
        const favers = pkg.favers ?? 0;
        const abandoned = pkg.abandoned ? `<span class="badge bg-danger ms-2">abandoned</span>` : '';

        return `
      <a href="${this._escape(url)}" target="_blank" rel="noopener" class="list-group-item list-group-item-action">
        <h5>
          <code>${this._escape(name)}</code>
          ${abandoned}
        </h5>
        <div class="small mb-1">${this._escape(description)}</div>
        <div class="d-flex flex-wrap gap-3 small text-muted">
          ${repo ? `<span>Repo: <a href="${this._escape(repo)}" target="_blank" rel="noopener">${this._escape(repo)}</a></span>` : ''}
          <span>Downloads: ${this._formatNumber(downloads)}</span>
          <span>Favers: ${this._formatNumber(favers)}</span>
        </div>
      </a>
    `;
    }

    _renderPager(total, page, perPage) {
        if (!Number.isFinite(total) || total <= 0) return '';
        const maxPage = Math.max(1, Math.ceil(total / perPage));
        if (maxPage <= 1) return '';

        return `
      <nav aria-label="Packagist pagination">
        <ul class="pagination mb-0">
          <li class="page-item ${page <= 1 ? 'disabled' : ''}">
            <button class="page-link" data-pl-action="prev" ${page <= 1 ? 'tabindex="-1" aria-disabled="true"' : ''}>Zurück</button>
          </li>
          <li class="page-item disabled">
            <span class="page-link">Seite ${page} / ${maxPage}</span>
          </li>
          <li class="page-item ${page >= maxPage ? 'disabled' : ''}">
            <button class="page-link" data-pl-action="next" ${page >= maxPage ? 'tabindex="-1" aria-disabled="true"' : ''}>Weiter</button>
          </li>
        </ul>
      </nav>
    `;
    }

    _escape(s) {
        return String(s)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    _formatNumber(n) {
        try {
            return new Intl.NumberFormat(undefined, {maximumFractionDigits: 0}).format(n);
        } catch {
            return String(n);
        }
    }
}

customElements.define('fucodo-composer-list', PackagistList);
