import * as connector from './roadmap.connector.js';

class RoadmapChart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.treeData = [];
        this.flatItems = [];
        this.itemIndex = new Map();
        this.validationErrors = [];
        this.loading = false;
        this.error = null;

        this._eventsBound = false;
        this._resizeHandler = null;
    }

    static get observedAttributes() {
        return ['src', 'data-json'];
    }

    connectedCallback() {
        this.initialize();
    }

    disconnectedCallback() {
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
        this._eventsBound = false;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this.isConnected || oldValue === newValue) return;
        if (name === 'src' || name === 'data-json') {
            this.initialize();
        }
    }

    async initialize() {
        this.error = null;
        this.loading = false;
        this.validationErrors = [];

        const attrData = this.getAttributeJsonData();
        const inlineData = this.getInlineJsonData();
        const src = this.getAttribute('src');

        if (Array.isArray(attrData)) {
            this.setTreeData(attrData);
            this.render();
            this.afterRender();
            return;
        }

        if (Array.isArray(inlineData)) {
            this.setTreeData(inlineData);
            this.render();
            this.afterRender();
            return;
        }

        if (src) {
            await this.loadData(src);
            return;
        }

        this.treeData = [];
        this.flatItems = [];
        this.itemIndex = new Map();
        this.render();
        this.afterRender();
    }

    afterRender() {
        this.bindEvents();
        this.renderConnectors();
    }

    getAttributeJsonData() {
        const raw = this.getAttribute('data-json');
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) {
                this.error = 'data-json must be a JSON array.';
                return null;
            }
            return parsed;
        } catch {
            this.error = 'data-json contains invalid JSON.';
            return null;
        }
    }

    getInlineJsonData() {
        const script = this.querySelector('script[type="application/json"]');
        if (!script) return null;

        try {
            const parsed = JSON.parse(script.textContent.trim());
            if (!Array.isArray(parsed)) {
                this.error = 'Inline JSON must be an array.';
                return null;
            }
            return parsed;
        } catch {
            this.error = 'Inline JSON is invalid.';
            return null;
        }
    }

    async loadData(url) {
        this.loading = true;
        this.error = null;
        this.validationErrors = [];
        this.render();

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`);
            }

            const json = await response.json();

            if (!Array.isArray(json)) {
                throw new Error('The API response must be a JSON array.');
            }

            this.setTreeData(json);
        } catch (error) {
            this.error = error.message || 'Error while loading roadmap data.';
            this.treeData = [];
            this.flatItems = [];
            this.itemIndex = new Map();
        } finally {
            this.loading = false;
            this.render();
            this.afterRender();
        }
    }

    setTreeData(data) {
        this.treeData = Array.isArray(data) ? data : [];
        this.flatItems = this.collectItems(this.treeData, []);
        this.buildItemIndex();
        this.validateDependencies();
    }

    isGroupNode(node) {
        return node && Array.isArray(node.children);
    }

    isItemNode(node) {
        return node && typeof node.topic === 'string';
    }

    collectItems(nodes, result = []) {
        for (const node of nodes || []) {
            if (this.isGroupNode(node)) {
                this.collectItems(node.children, result);
            } else if (this.isItemNode(node)) {
                const normalized = this.normalizeItem(node);
                if (normalized) result.push(normalized);
            }
        }
        return result;
    }

    normalizeItem(item) {
        if (!item) return null;

        const id = item.id ?? '';
        const topic = item.topic ?? '';
        const owner = item.owner ?? '';
        const assignees = Array.isArray(item.assignees)
            ? item.assignees.map(v => String(v).trim()).filter(Boolean)
            : [];
        const link = item.link ?? '';
        const column = item.column ?? '';
        const progress = this.parseProgress(item.progress ?? 0);
        const start = this.parseDate(item.startDate ?? '');
        const end = this.parseDate(item.endDate ?? '');
        const dependsOn = Array.isArray(item.dependsOn)
            ? item.dependsOn.map(v => String(v).trim()).filter(Boolean)
            : [];

        if (!id || !topic || !start || !end) {
            return null;
        }

        return {
            id,
            topic,
            owner,
            assignees,
            link,
            column,
            progress,
            start,
            end,
            dependsOn
        };
    }

    buildItemIndex() {
        this.itemIndex = new Map();
        for (const item of this.flatItems) {
            if (!this.itemIndex.has(item.id)) {
                this.itemIndex.set(item.id, item);
            }
        }
    }

    validateDependencies() {
        this.validationErrors = [];
        const seen = new Set();

        for (const item of this.flatItems) {
            if (seen.has(item.id)) {
                this.validationErrors.push(`Duplicate item id: ${item.id}`);
            }
            seen.add(item.id);
        }

        for (const item of this.flatItems) {
            for (const depId of item.dependsOn) {
                if (depId === item.id) {
                    this.validationErrors.push(`Item "${item.id}" must not depend on itself.`);
                }
                if (!this.itemIndex.has(depId)) {
                    this.validationErrors.push(`Item "${item.id}" depends on unknown item "${depId}".`);
                }
            }
        }
    }

    parseProgress(value) {
        if (typeof value === 'string') {
            value = value.replace('%', '').replace(',', '.').trim();
        }
        const number = Number(value);
        if (Number.isNaN(number)) return 0;
        return Math.max(0, Math.min(100, number));
    }

    parseDate(value) {
        if (!value) return null;

        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            return value;
        }

        const normalized = String(value).trim();
        let parsedDate;

        if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
            parsedDate = new Date(`${normalized}T00:00:00`);
        } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalized)) {
            const [day, month, year] = normalized.split('.');
            parsedDate = new Date(`${year}-${month}-${day}T00:00:00`);
        } else {
            parsedDate = new Date(normalized);
        }

        if (Number.isNaN(parsedDate.getTime())) {
            return null;
        }

        return parsedDate;
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('de-DE').format(date);
    }

    formatPeople(item) {
        const parts = [];
        if (item.owner) parts.push(`${item.owner}`);
        if (item.assignees.length) parts.push(`${item.assignees.join(', ')}`);
        return parts.length ? parts.join(' | ') : '-';
    }

    isBlocked(item) {
        return item.dependsOn.some(depId => {
            const dep = this.itemIndex.get(depId);
            return dep && dep.progress < 100;
        });
    }

    escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    escapeAttr(value) {
        return this.escapeHtml(value);
    }

    getDateRange() {
        if (!this.flatItems.length) return null;

        const starts = this.flatItems.map(item => item.start.getTime());
        const ends = this.flatItems.map(item => item.end.getTime());

        return {
            min: new Date(Math.min(...starts)),
            max: new Date(Math.max(...ends))
        };
    }

    calculatePosition(item, minTime, totalDuration) {
        const startOffset = item.start.getTime() - minTime;
        const duration = item.end.getTime() - item.start.getTime();

        return {
            left: (startOffset / totalDuration) * 100,
            width: Math.max((duration / totalDuration) * 100, 2)
        };
    }

    createAxisLabels(minTime, totalDuration, steps = 8) {
        const labels = [];

        for (let i = 0; i < steps; i++) {
            const current = new Date(minTime + (totalDuration / (steps - 1)) * i);
            labels.push(`<div>${this.escapeHtml(this.formatDate(current))}</div>`);
        }

        return labels.join('');
    }

    renderValidationErrors() {
        if (!this.validationErrors.length) return '';

        return `
      <div class="roadmap-validation">
        <div class="roadmap-validation-title">Validation warnings</div>
        <ul>
          ${this.validationErrors.map(msg => `<li>${this.escapeHtml(msg)}</li>`).join('')}
        </ul>
      </div>
    `;
    }

    renderItemRow(item, minTime, totalDuration) {
        const { left, width } = this.calculatePosition(item, minTime, totalDuration);
        const dependsOnText = item.dependsOn.length ? item.dependsOn.join(', ') : '-';
        const blocked = this.isBlocked(item);
        const peopleText = this.formatPeople(item);

        return `
      <div
        class="roadmap-grid-row ${blocked ? 'is-blocked' : ''}"
        data-item-id="${this.escapeAttr(item.id)}"
        role="button"
        tabindex="0"
      >
        <div>${this.escapeHtml(item.id)}</div>
        <div>${this.escapeHtml(item.topic)}</div>
        <div class="roadmap-people-cell">${this.escapeHtml(peopleText)}</div>
        <div class="roadmap-link">
          ${
            item.link
                ? `<a href="${this.escapeAttr(item.link)}" target="_blank" rel="noopener noreferrer">open</a>`
                : '-'
        }
        </div>
        <div>${this.escapeHtml(item.column || '-')}</div>
        <div>${this.escapeHtml(dependsOnText)}</div>
        <div class="roadmap-timeline-cell">
          <div class="roadmap-bar-wrap">
            <div
              class="roadmap-bar"
              data-bar-item-id="${this.escapeAttr(item.id)}"
              style="left:${left}%; width:${width}%;"
            >
              <div class="roadmap-progress" style="width:${item.progress}%;">
                ${this.escapeHtml(item.progress)}%
              </div>
              <div class="roadmap-dates">
                ${this.escapeHtml(this.formatDate(item.start))} – ${this.escapeHtml(this.formatDate(item.end))}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    renderNodes(nodes, minTime, totalDuration, level = 0) {
        return (nodes || []).map(node => {
            if (this.isGroupNode(node)) {
                const groupName = node.name ?? 'Unnamed group';
                const marginLeft = level * 20;
                const childrenHtml = this.renderNodes(node.children, minTime, totalDuration, level + 1);

                return `
          <details class="roadmap-group" open>
            <summary class="roadmap-group-title">
              <span class="roadmap-group-title-inner" style="margin-left:${marginLeft}px;">
                <span class="roadmap-group-toggle" aria-hidden="true"></span>
                <span class="roadmap-group-title-text">${this.escapeHtml(groupName)}</span>
              </span>
            </summary>
            <div class="roadmap-group-content">
              ${childrenHtml}
            </div>
          </details>
        `;
            }

            if (this.isItemNode(node)) {
                const item = this.normalizeItem(node);
                if (!item) return '';
                return this.renderItemRow(item, minTime, totalDuration);
            }

            return '';
        }).join('');
    }

    render() {
        const style = `
      <style>
        :host {
          display: block;
        }

        .roadmap-chart {
          position: relative;
          font-family: Arial, sans-serif;
          border: 1px solid #dcdcdc;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }

        .roadmap-connection-layer {
          inset: 0;
          pointer-events: none;
        }

        .roadmap-validation,
        .roadmap-grid-header,
        .roadmap-grid-row,
        .roadmap-group-title {
          position: relative;
          z-index: 4;
        }

        .roadmap-validation {
          padding: 12px 16px;
          border-bottom: 1px solid #e7c66a;
          background: #fff8db;
          color: #6b5300;
        }

        .roadmap-validation-title {
          font-weight: 700;
          margin-bottom: 6px;
        }

        .roadmap-validation ul {
          margin: 0;
          padding-left: 18px;
        }

        .roadmap-grid-header,
        .roadmap-grid-row {
          display: grid;
          grid-template-columns: 160px 220px 220px 180px 140px 220px minmax(500px, 1fr);
          align-items: stretch;
        }

        .roadmap-grid-header {
          background: #f7f7f7;
          font-weight: 700;
          border-bottom: 1px solid #ddd;
        }

        .roadmap-grid-header > div,
        .roadmap-grid-row > div {
          padding: 12px;
          border-right: 1px solid #eee;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .roadmap-grid-header > div:last-child,
        .roadmap-grid-row > div:last-child {
          border-right: 0;
        }

        .roadmap-grid-row {
          border-bottom: 1px solid #eee;
          background: #fff;
          cursor: pointer;
        }

        .roadmap-grid-row:hover {
          background: #f8fbff;
        }

        .roadmap-grid-row:focus {
          outline: 2px solid #0d6efd;
          outline-offset: -2px;
        }

        .roadmap-grid-row.is-blocked {
          background: #fff8e1;
        }

        .roadmap-people-cell {
          line-height: 1.4;
        }

        .roadmap-group {
          background: #fafafa;
          border-top: 1px solid #ddd;
        }

        .roadmap-group-title {
          padding: 12px 16px;
          font-weight: 700;
          background: #f1f3f5;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
          list-style: none;
          user-select: none;
        }

        .roadmap-group-title::-webkit-details-marker {
          display: none;
        }

        .roadmap-group-title::marker {
          content: "";
        }

        .roadmap-group-title-inner {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .roadmap-group-toggle {
          width: 14px;
          min-width: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .roadmap-group-toggle::before {
          content: "▸";
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .roadmap-group[open] > .roadmap-group-title .roadmap-group-toggle::before {
          transform: rotate(90deg);
        }

        .roadmap-link a {
          color: #0d6efd;
          text-decoration: none;
          position: relative;
          z-index: 6;
        }

        .roadmap-link a:hover {
          text-decoration: underline;
        }

        .roadmap-axis-cell {
          padding: 12px;
        }

        .roadmap-axis {
          position: relative;
          height: 24px;
          border-left: 1px solid #ddd;
          background: linear-gradient(to right, #f0f0f0 1px, transparent 1px);
          background-size: 12.5% 100%;
        }

        .roadmap-axis-labels {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          font-size: 12px;
          color: #666;
          margin-top: 6px;
        }

        .roadmap-timeline-cell {
          position: relative;
          min-height: 72px;
          display: flex;
          align-items: center;
        }

        .roadmap-bar-wrap {
          position: relative;
          width: 100%;
          height: 28px;
          background: #eef3f8;
          border-radius: 14px;
          overflow: visible;
        }

        .roadmap-bar {
          position: absolute;
          top: 0;
          height: 28px;
          border-radius: 14px;
          background: #c9d8e6;
          overflow: hidden;
          min-width: 24px;
          z-index: 5;
        }

        .roadmap-progress {
          height: 100%;
          background: #198754;
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          overflow: hidden;
        }

        .roadmap-dates {
          position: absolute;
          top: 34px;
          left: 0;
          font-size: 12px;
          color: #666;
          white-space: nowrap;
        }

        roadmap-connector {
          position: absolute;
          left: var(--connector-left);
          top: var(--connector-top);
          width: var(--connector-width);
          height: var(--connector-height);
          pointer-events: none;
          z-index: 99999;
          display: block;
        }

        .roadmap-loading,
        .roadmap-error,
        .roadmap-empty {
          padding: 16px;
        }

        .roadmap-error {
          color: #b42318;
        }
      </style>
    `;

        if (this.loading) {
            this.shadowRoot.innerHTML = `${style}<div class="roadmap-chart"><div class="roadmap-loading">Loading roadmap data…</div></div>`;
            return;
        }

        if (this.error) {
            this.shadowRoot.innerHTML = `${style}<div class="roadmap-chart"><div class="roadmap-error">Error: ${this.escapeHtml(this.error)}</div></div>`;
            return;
        }

        if (!this.treeData.length || !this.flatItems.length) {
            this.shadowRoot.innerHTML = `${style}<div class="roadmap-chart"><div class="roadmap-empty">No roadmap data available.</div></div>`;
            return;
        }

        const range = this.getDateRange();
        if (!range) {
            this.shadowRoot.innerHTML = `${style}<div class="roadmap-chart"><div class="roadmap-empty">No valid roadmap data available.</div></div>`;
            return;
        }

        const minTime = range.min.getTime();
        const maxTime = range.max.getTime();
        const totalDuration = Math.max(maxTime - minTime, 24 * 60 * 60 * 1000);
        const axisLabels = this.createAxisLabels(minTime, totalDuration, 8);
        const contentHtml = this.renderNodes(this.treeData, minTime, totalDuration, 0);
        const validationHtml = this.renderValidationErrors();

        this.shadowRoot.innerHTML = `
      ${style}
      <div class="roadmap-chart">
        <div class="roadmap-connection-layer" id="connection-layer" aria-hidden="true"></div>
        ${validationHtml}
        <div class="roadmap-grid-header">
          <div>ID</div>
          <div>Topic</div>
          <div>People</div>
          <div>Link</div>
          <div>Column</div>
          <div>Depends On</div>
          <div class="roadmap-axis-cell">
            <div class="roadmap-axis"></div>
            <div class="roadmap-axis-labels">${axisLabels}</div>
          </div>
        </div>
        ${contentHtml}
      </div>
    `;
    }

    bindEvents() {
        if (this._eventsBound) return;

        this.shadowRoot.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (link) return;

            const row = event.target.closest('.roadmap-grid-row[data-item-id]');
            if (!row) return;

            this.emitItemClick(row.dataset.itemId);
        });

        this.shadowRoot.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            const row = event.target.closest('.roadmap-grid-row[data-item-id]');
            if (!row) return;

            event.preventDefault();
            this.emitItemClick(row.dataset.itemId);
        });

        this.shadowRoot.addEventListener('toggle', (event) => {
            const details = event.target;
            if (!details.matches || !details.matches('details.roadmap-group')) return;

            requestAnimationFrame(() => this.renderConnectors());
        }, true);

        this._resizeHandler = () => this.renderConnectors();
        window.addEventListener('resize', this._resizeHandler, { passive: true });

        this._eventsBound = true;
    }

    emitItemClick(itemId) {
        const item = this.itemIndex.get(itemId);
        if (!item) return;

        this.dispatchEvent(new CustomEvent('roadmap-item-click', {
            bubbles: true,
            composed: true,
            detail: { item }
        }));
    }

    renderConnectors() {
        const layer = this.shadowRoot.getElementById('connection-layer');
        const chart = this.shadowRoot.querySelector('.roadmap-chart');

        if (!layer || !chart) return;

        layer.innerHTML = '';

        const chartRect = chart.getBoundingClientRect();

        for (const item of this.flatItems) {
            if (!item.dependsOn.length) continue;

            const toRow = this.shadowRoot.querySelector(`.roadmap-grid-row[data-item-id="${CSS.escape(item.id)}"]`);
            const toBar = toRow?.querySelector(`[data-bar-item-id="${CSS.escape(item.id)}"]`);

            if (!toRow || !toBar || toRow.offsetParent === null) continue;

            const toRect = toBar.getBoundingClientRect();
            const x2 = toRect.left - chartRect.left;
            const y2 = toRect.top + (toRect.height / 2) - chartRect.top;

            for (const depId of item.dependsOn) {
                const fromRow = this.shadowRoot.querySelector(`.roadmap-grid-row[data-item-id="${CSS.escape(depId)}"]`);
                const fromBar = fromRow?.querySelector(`[data-bar-item-id="${CSS.escape(depId)}"]`);

                if (!fromRow || !fromBar || fromRow.offsetParent === null) continue;

                const fromRect = fromBar.getBoundingClientRect();
                const x1 = fromRect.right - chartRect.left;
                const y1 = fromRect.top + (fromRect.height / 2) - chartRect.top;

                const connector = document.createElement('roadmap-connector');
                connector.setAttribute('x1', `${x1}`);
                connector.setAttribute('y1', `${y1}`);
                connector.setAttribute('x2', `${x2}`);
                connector.setAttribute('y2', `${y2}`);
                connector.setAttribute('end', 'arrow');
                connector.setAttribute('corner-radius', '10');
                connector.setAttribute('stroke-width', '2');
                connector.setAttribute('color', '#6c757d');

                layer.appendChild(connector);
            }
        }
    }
}

customElements.define('roadmap-chart', RoadmapChart);