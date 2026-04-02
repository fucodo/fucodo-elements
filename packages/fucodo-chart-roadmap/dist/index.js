(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // packages/fucodo-chart-roadmap/roadmap.connector.js
  var require_roadmap_connector = __commonJS({
    "packages/fucodo-chart-roadmap/roadmap.connector.js"() {
      var RoadmapConnector = class _RoadmapConnector extends HTMLElement {
        static get observedAttributes() {
          return ["x1", "y1", "x2", "y2", "end", "corner-radius", "stroke-width", "color"];
        }
        static STYLE_ID = "roadmap-connector-styles";
        connectedCallback() {
          this.render();
        }
        attributeChangedCallback() {
          this.render();
        }
        numberAttr(name, fallback = 0) {
          const value = Number(this.getAttribute(name));
          return Number.isFinite(value) ? value : fallback;
        }
        ensureStyles() {
          if (this.querySelector(`#${_RoadmapConnector.STYLE_ID}`)) {
            return;
          }
          const style = document.createElement("style");
          style.id = _RoadmapConnector.STYLE_ID;
          style.textContent = `
      roadmap-connector {
        z-index: 99999999;
        position: absolute;
        pointer-events: none;
        display: block;
        overflow: visible;
      }
      .roadmap-connector-root {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .roadmap-connector-segment,
      .roadmap-connector-corner {
        position: absolute;
        box-sizing: border-box;
      }
      
      .roadmap-connector-arrow {
        position: absolute;
        box-sizing: border-box;
        transform: translateX(-100%) rotate(180deg);
      }

      .roadmap-connector-segment--horizontal,
      .roadmap-connector-segment--vertical {
        background: var(--connector-color, #6c757d);
      }

      .roadmap-connector-corner {
        background: transparent;
      }
      .roadmap-connector-corner--left-to-bottom {
        transform: translateX(calc(-50% + 1px)) translateY(-1px);
        border-top-right-radius: 10px;
        border-top: var(--stroke-border, 3px solid red);
        border-right: var(--stroke-border, 3px solid red);
      }
      .roadmap-connector-corner--left-to-top {
        transform: translateX(calc(-50% + 1px)) translateY(1px);
        border-bottom-right-radius: 10px;
        border-bottom: var(--stroke-border, 3px solid red);
        border-right: var(--stroke-border, 3px solid red);
      }
      .roadmap-connector-corner--top-to-right {
        transform: translateX(calc(50% - 1px)) translateY(1px);
        border-bottom-left-radius: 10px;
        border-bottom: var(--stroke-border, 3px solid red);
        border-left: var(--stroke-border, 3px solid red);
        
      }
      .roadmap-connector-corner--bottom-to-right {
        transform: translateX(calc(50% - 1px)) translateY(-1px);
        border-top-left-radius: 10px;
        border-top: var(--stroke-border, 3px solid red);
        border-left: var(--stroke-border, 3px solid red);
      }
    `;
          this.prepend(style);
        }
        render() {
          const x1 = this.numberAttr("x1");
          const y1 = this.numberAttr("y1");
          const x2 = this.numberAttr("x2");
          const y2 = this.numberAttr("y2");
          const end = this.getAttribute("end") || "arrow";
          const cornerRadius = this.numberAttr("corner-radius", 10);
          const strokeWidth = this.numberAttr("stroke-width", 2);
          const color = this.getAttribute("color") || "#6c757d";
          const left = Math.min(x1, x2);
          const top = Math.min(y1, y2);
          const width = Math.max(1, Math.abs(x2 - x1));
          const height = Math.max(1, Math.abs(y2 - y1));
          const localX1 = x1 - left;
          const localY1 = y1 - top;
          const localX2 = x2 - left;
          const localY2 = y2 - top;
          const downward = localY2 >= localY1;
          const midX = Math.max(
            cornerRadius,
            Math.min(
              width - cornerRadius,
              localX1 + Math.max(24, (localX2 - localX1) / 2)
            )
          );
          const startWidth = Math.max(0, midX - localX1 - cornerRadius);
          const endWidth = Math.max(0, localX2 - midX - cornerRadius);
          const verticalTop = downward ? localY1 + cornerRadius : localY2 + cornerRadius;
          const verticalHeight = Math.max(0, Math.abs(localY2 - localY1) - cornerRadius * 2);
          const firstCornerTop = downward ? localY1 : localY1 - cornerRadius * 2;
          const secondCornerTop = downward ? localY2 - cornerRadius * 2 : localY2;
          const arrowHtml = end === "arrow" ? `
        <div
          class="roadmap-connector-arrow"
          style="
            left:${localX2 - 1}px;
            top:${localY2 - 4}px;
            width:8px;
            height:8px;
            background:${color};
            clip-path:polygon(0 50%, 100% 0, 100% 100%);
          "
        ></div>
      ` : "";
          this.setAttribute("aria-hidden", "true");
          this.style.left = `${left}px`;
          this.style.top = `${top}px`;
          this.style.width = `${width}px`;
          this.style.height = `${height}px`;
          let firstCornerClass = "roadmap-connector-corner--left-to-top";
          if (downward) {
            firstCornerClass = "roadmap-connector-corner--left-to-bottom";
          }
          let secondCornerClass = "roadmap-connector-corner--bottom-to-right";
          if (downward) {
            secondCornerClass = "roadmap-connector-corner--top-to-right";
          }
          let dynamicStyles = `
            --connector-color:${color};
            --stroke-width:${strokeWidth}px;
            --stroke-border: ${strokeWidth}px solid ${color};
        `;
          this.innerHTML = `
      <div id="roadmap-connector-root" class="roadmap-connector-root" style="${dynamicStyles}">
        <div
          class="roadmap-connector-segment roadmap-connector-segment--horizontal"
          style="
            left:${localX1}px;
            top:${localY1 - strokeWidth / 2}px;
            width:${startWidth}px;
            height:${strokeWidth}px;
          "
        ></div>

        <div
          class="roadmap-connector-segment roadmap-connector-segment--vertical"
          style="
            left:${midX - strokeWidth / 2}px;
            top:${verticalTop}px;
            width:${strokeWidth}px;
            height:${verticalHeight}px;
          "
        ></div>

        <div
          class="roadmap-connector-segment roadmap-connector-segment--horizontal"
          style="
            left:${midX + cornerRadius}px;
            top:${localY2 - strokeWidth / 2}px;
            width:${endWidth}px;
            height:${strokeWidth}px;
          "
        ></div>

        <div
          class="roadmap-connector-corner ${firstCornerClass}"
          style="
            left:${midX - cornerRadius}px;
            top:${firstCornerTop}px;
            width:${cornerRadius * 2}px;
            height:${cornerRadius * 2}px;
          "
        ></div>

        <div
          class="roadmap-connector-corner ${secondCornerClass}"
          style="
            left:${midX - cornerRadius}px;
            top:${secondCornerTop}px;
            width:${cornerRadius * 2}px;
            height:${cornerRadius * 2}px;
          "
        ></div>

        ${arrowHtml}
      </div>
    `;
          this.ensureStyles();
        }
      };
      customElements.define("roadmap-connector", RoadmapConnector);
    }
  });

  // packages/fucodo-chart-roadmap/index.js
  var connector = __toESM(require_roadmap_connector());

  // packages/fucodo-chart-roadmap/style.scss
  var style_default = `@charset "UTF-8";
:host {
  display: block;
}

.roadmap-chart {
  position: relative;
  font-family: Arial, sans-serif;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  overflow: auto;
  background: #fff;
}

.roadmap-connection-layer {
  inset: 0;
  pointer-events: none;
}

.roadmap-validation,
.roadmap-grid-header,
.roadmap-grid-row {
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
  align-items: stretch;
}

.roadmap-grid-header > div:nth-child(-n+2),
.roadmap-grid-row > div:nth-child(-n+2) {
  position: sticky;
  z-index: 10;
  background: inherit;
}

.roadmap-grid-header > div:nth-of-type(1),
.roadmap-grid-row > div:nth-of-type(1) {
  left: 0;
  width: 220px;
  min-width: 220px;
}

.roadmap-grid-header > div:nth-of-type(2),
.roadmap-grid-row > div:nth-of-type(2) {
  left: 220px;
  width: 220px;
  min-width: 220px;
}

.roadmap-grid-header {
  background: #f7f7f7;
  font-weight: 700;
  border-bottom: 1px solid #ddd;
}

.roadmap-grid-header > div,
.roadmap-grid-row > div {
  padding: 0.5rem;
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
  width: auto;
  min-width: fit-content;
}

.roadmap-group-title {
  padding: 12px 16px;
  font-weight: 700;
  background: #f1f3f5;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  list-style: none;
  user-select: none;
  position: sticky;
  left: 0;
  width: fit-content;
  min-width: 100%;
  box-sizing: border-box;
  z-index: 11;
}

.roadmap-group-title-inner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: sticky;
  left: 16px;
}

.roadmap-group-toggle {
  width: 14px;
  min-width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.roadmap-group-toggle::before {
  content: "\u25B8";
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
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
}

.roadmap-week-backgrounds {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  z-index: -1;
}

.roadmap-week-bg {
  flex: 0 0 100px;
  border-right: 1px solid #eee;
  box-sizing: border-box;
}

.roadmap-week-bg.is-current {
  background: rgba(40, 167, 69, 0.1);
}

.roadmap-axis-labels {
  display: grid;
  font-size: 12px;
  color: #666;
  height: 100%;
}

.roadmap-axis-labels > div {
  padding: 8px 4px;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.roadmap-timeline-cell {
  position: relative;
  min-height: 2rem;
  display: flex;
  align-items: center;
  padding: 0;
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
}`;

  // packages/fucodo-chart-roadmap/index.js
  var RoadmapChart = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.treeData = [];
      this.flatItems = [];
      this.itemIndex = /* @__PURE__ */ new Map();
      this.validationErrors = [];
      this.loading = false;
      this.error = null;
      this._eventsBound = false;
      this._resizeHandler = null;
    }
    static get observedAttributes() {
      return ["src", "data-json", "week-colors"];
    }
    connectedCallback() {
      this.initialize();
    }
    disconnectedCallback() {
      if (this._resizeHandler) {
        window.removeEventListener("resize", this._resizeHandler);
        this._resizeHandler = null;
      }
      this._eventsBound = false;
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (!this.isConnected || oldValue === newValue) return;
      if (name === "src" || name === "data-json" || name === "week-colors") {
        this.initialize();
      }
    }
    async initialize() {
      this.error = null;
      this.loading = false;
      this.validationErrors = [];
      const attrData = this.getAttributeJsonData();
      const inlineData = this.getInlineJsonData();
      const src = this.getAttribute("src");
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
      this.itemIndex = /* @__PURE__ */ new Map();
      this.render();
      this.afterRender();
    }
    afterRender() {
      this.bindEvents();
      this.renderConnectors();
    }
    getAttributeJsonData() {
      const raw = this.getAttribute("data-json");
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          this.error = "data-json must be a JSON array.";
          return null;
        }
        return parsed;
      } catch {
        this.error = "data-json contains invalid JSON.";
        return null;
      }
    }
    getInlineJsonData() {
      const script = this.querySelector('script[type="application/json"]');
      if (!script) return null;
      try {
        const parsed = JSON.parse(script.textContent.trim());
        if (!Array.isArray(parsed)) {
          this.error = "Inline JSON must be an array.";
          return null;
        }
        return parsed;
      } catch {
        this.error = "Inline JSON is invalid.";
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
          method: "GET",
          headers: { Accept: "application/json" }
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        const json = await response.json();
        if (!Array.isArray(json)) {
          throw new Error("The API response must be a JSON array.");
        }
        this.setTreeData(json);
      } catch (error) {
        this.error = error.message || "Error while loading roadmap data.";
        this.treeData = [];
        this.flatItems = [];
        this.itemIndex = /* @__PURE__ */ new Map();
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
      return node && typeof node.topic === "string";
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
      const id = item.id ?? "";
      const topic = item.topic ?? "";
      const owner = item.owner ?? "";
      const assignees = Array.isArray(item.assignees) ? item.assignees.map((v) => String(v).trim()).filter(Boolean) : [];
      const link = item.link ?? "";
      const column = item.column ?? "";
      const progress = this.parseProgress(item.progress ?? 0);
      const start = this.parseDate(item.startDate ?? "");
      const end = this.parseDate(item.endDate ?? "");
      const dependsOn = Array.isArray(item.dependsOn) ? item.dependsOn.map((v) => String(v).trim()).filter(Boolean) : [];
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
      this.itemIndex = /* @__PURE__ */ new Map();
      for (const item of this.flatItems) {
        if (!this.itemIndex.has(item.id)) {
          this.itemIndex.set(item.id, item);
        }
      }
    }
    validateDependencies() {
      this.validationErrors = [];
      const seen = /* @__PURE__ */ new Set();
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
      if (typeof value === "string") {
        value = value.replace("%", "").replace(",", ".").trim();
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
        parsedDate = /* @__PURE__ */ new Date(`${normalized}T00:00:00`);
      } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalized)) {
        const [day, month, year] = normalized.split(".");
        parsedDate = /* @__PURE__ */ new Date(`${year}-${month}-${day}T00:00:00`);
      } else {
        parsedDate = new Date(normalized);
      }
      if (Number.isNaN(parsedDate.getTime())) {
        return null;
      }
      return parsedDate;
    }
    formatDate(date) {
      return new Intl.DateTimeFormat("de-DE").format(date);
    }
    formatPeople(item) {
      const parts = [];
      if (item.owner) parts.push(`${item.owner}`);
      if (item.assignees.length) parts.push(`${item.assignees.join(", ")}`);
      return parts.length ? parts.join(" | ") : "-";
    }
    isBlocked(item) {
      return item.dependsOn.some((depId) => {
        const dep = this.itemIndex.get(depId);
        return dep && dep.progress < 100;
      });
    }
    escapeHtml(value) {
      return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
    }
    escapeAttr(value) {
      return this.escapeHtml(value);
    }
    getDateRange() {
      if (!this.flatItems.length) return null;
      const starts = this.flatItems.map((item) => item.start.getTime());
      const ends = this.flatItems.map((item) => item.end.getTime());
      return {
        min: new Date(Math.min(...starts)),
        max: new Date(Math.max(...ends))
      };
    }
    calculatePosition(item, minTime, totalDuration) {
      const startOffset = item.start.getTime() - minTime;
      const duration = item.end.getTime() - item.start.getTime();
      return {
        left: startOffset / totalDuration * 100,
        width: Math.max(duration / totalDuration * 100, 2)
      };
    }
    createAxisLabels(minTime, totalDuration, steps = 8) {
      const labels = [];
      for (let i = 0; i < steps; i++) {
        const current = new Date(minTime + totalDuration / (steps - 1) * i);
        labels.push(`<div>${this.escapeHtml(this.formatDate(current))}</div>`);
      }
      return labels.join("");
    }
    renderValidationErrors() {
      if (!this.validationErrors.length) return "";
      return `
      <div class="roadmap-validation">
        <div class="roadmap-validation-title">Validation warnings</div>
        <ul>
          ${this.validationErrors.map((msg) => `<li>${this.escapeHtml(msg)}</li>`).join("")}
        </ul>
      </div>
    `;
    }
    renderItemRow(item, minTime, totalDuration, gridBackgrounds = "") {
      const { left, width } = this.calculatePosition(item, minTime, totalDuration);
      const dependsOnText = item.dependsOn.length ? item.dependsOn.join(", ") : "-";
      const blocked = this.isBlocked(item);
      const peopleText = this.formatPeople(item);
      return `
      <div
        class="roadmap-grid-row ${blocked ? "is-blocked" : ""}"
        data-item-id="${this.escapeAttr(item.id)}"
        role="button"
        tabindex="0"
        title="${this.escapeHtml(item.id)} | ${this.escapeHtml(item.topic)} | ${this.escapeHtml(item.column || "-")} | ${this.escapeHtml(peopleText)} | ${this.escapeHtml(dependsOnText)}"
      >
        <div>
            ${this.escapeHtml(item.topic)}<br>
            <small>
                ${item.link ? `<a href="${this.escapeAttr(item.link)}" target="_blank" rel="noopener noreferrer">${this.escapeHtml(item.id)}</a>` : this.escapeHtml(item.id)}
            </small>
        </div>
        <div class="roadmap-people-cell">${this.escapeHtml(peopleText)}</div>
        <div class="roadmap-timeline-cell">
          <div class="roadmap-week-backgrounds">${gridBackgrounds}</div>
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
                ${this.escapeHtml(this.formatDate(item.start))} \u2013 ${this.escapeHtml(this.formatDate(item.end))}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }
    renderNodes(nodes, minTime, totalDuration, level = 0, gridBackgrounds = "") {
      return (nodes || []).map((node) => {
        if (this.isGroupNode(node)) {
          const groupName = node.name ?? "Unnamed group";
          const marginLeft = level * 20;
          const childrenHtml = this.renderNodes(node.children, minTime, totalDuration, level + 1, gridBackgrounds);
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
          if (!item) return "";
          return this.renderItemRow(item, minTime, totalDuration, gridBackgrounds);
        }
        return "";
      }).join("");
    }
    getWeekNumber(date) {
      const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 864e5 + 1) / 7);
    }
    getWeeksInRange(minTime, maxTime) {
      const weeks = [];
      let current = new Date(minTime);
      const day = current.getDay();
      const diff = current.getDate() - (day === 0 ? 6 : day - 1);
      current.setDate(diff);
      current.setHours(0, 0, 0, 0);
      const end = new Date(maxTime);
      const lastDay = end.getDay();
      const lastDiff = end.getDate() + (lastDay === 0 ? 0 : 7 - lastDay);
      end.setDate(lastDiff);
      end.setHours(23, 59, 59, 999);
      const weekColors = this.getWeekColors();
      while (current <= end) {
        const weekStart = new Date(current);
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        const weekNum = this.getWeekNumber(current);
        const yearNum = current.getFullYear();
        const colorKey = `${yearNum}-W${weekNum}`;
        const bgColor = weekColors[colorKey] || weekColors[`W${weekNum}`] || null;
        weeks.push({
          start: weekStart,
          end: weekEnd,
          year: yearNum,
          week: weekNum,
          bgColor
        });
        current.setDate(current.getDate() + 7);
      }
      return weeks;
    }
    getWeekColors() {
      const attr = this.getAttribute("week-colors");
      if (!attr) return {};
      try {
        return JSON.parse(attr);
      } catch {
        return {};
      }
    }
    render() {
      const styleString = `
      <style>
        ${style_default}
      </style>
    `;
      if (this.loading) {
        this.shadowRoot.innerHTML = `${styleString}<div class="roadmap-chart"><div class="roadmap-loading">Loading roadmap data\u2026</div></div>`;
        return;
      }
      if (this.error) {
        this.shadowRoot.innerHTML = `${styleString}<div class="roadmap-chart"><div class="roadmap-error">Error: ${this.escapeHtml(this.error)}</div></div>`;
        return;
      }
      if (!this.treeData.length || !this.flatItems.length) {
        this.shadowRoot.innerHTML = `${styleString}<div class="roadmap-chart"><div class="roadmap-empty">No roadmap data available.</div></div>`;
        return;
      }
      const range = this.getDateRange();
      if (!range) {
        this.shadowRoot.innerHTML = `${styleString}<div class="roadmap-chart"><div class="roadmap-empty">No valid roadmap data available.</div></div>`;
        return;
      }
      const weeks = this.getWeeksInRange(range.min.getTime(), range.max.getTime());
      const minTime = weeks[0].start.getTime();
      const maxTime = weeks[weeks.length - 1].end.getTime();
      const totalDuration = maxTime - minTime;
      const weekWidth = 100;
      const timelineWidth = weeks.length * weekWidth;
      const now = /* @__PURE__ */ new Date();
      const axisLabels = weeks.map((w) => {
        const isCurrent = now >= w.start && now <= w.end;
        const startDateStr = this.formatDate(w.start);
        const endDateStr = this.formatDate(w.end);
        return `<div class="${isCurrent ? "is-current" : ""}" title="${this.escapeAttr(startDateStr)} \u2013 ${this.escapeAttr(endDateStr)}">W${w.week}<br><small>${startDateStr.slice(0, 5)}</small></div>`;
      }).join("");
      const weekBackgrounds = weeks.map((w) => {
        const isCurrent = now >= w.start && now <= w.end;
        const bgColor = w.bgColor ? `background-color: ${w.bgColor};` : "";
        const startDateStr = this.formatDate(w.start);
        const endDateStr = this.formatDate(w.end);
        return `<div class="roadmap-week-bg ${isCurrent ? "is-current" : ""}" style="${bgColor}" title="${this.escapeAttr(startDateStr)} \u2013 ${this.escapeAttr(endDateStr)}"></div>`;
      }).join("");
      const gridBackgrounds = weeks.map((w) => {
        const isCurrent = now >= w.start && now <= w.end;
        const bgColor = w.bgColor ? `background-color: ${w.bgColor}; opacity: 0.1;` : "";
        const startDateStr = this.formatDate(w.start);
        const endDateStr = this.formatDate(w.end);
        return `<div class="roadmap-week-bg ${isCurrent ? "is-current" : ""}" style="${bgColor}" title="${this.escapeAttr(startDateStr)} \u2013 ${this.escapeAttr(endDateStr)}"></div>`;
      }).join("");
      const contentHtml = this.renderNodes(this.treeData, minTime, totalDuration, 0, gridBackgrounds);
      const validationHtml = this.renderValidationErrors();
      this.shadowRoot.innerHTML = `
      ${styleString}
      <style>
        .roadmap-grid-header, .roadmap-grid-row {
            grid-template-columns: 220px 220px ${timelineWidth}px;
        }
        .roadmap-axis-labels {
            grid-template-columns: repeat(${weeks.length}, ${weekWidth}px);
        }
      </style>
      <div class="roadmap-chart">
        <div class="roadmap-connection-layer" id="connection-layer" aria-hidden="true"></div>
        ${validationHtml}
        <div class="roadmap-grid-header">
          <div>Topic</div>
          <div>People</div>
          <div class="roadmap-axis-cell">
            <div class="roadmap-week-backgrounds">${weekBackgrounds}</div>
            <div class="roadmap-axis-labels">${axisLabels}</div>
          </div>
        </div>
        ${contentHtml}
      </div>
    `;
    }
    bindEvents() {
      if (this._eventsBound) return;
      this.shadowRoot.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link) return;
        const row = event.target.closest(".roadmap-grid-row[data-item-id]");
        if (!row) return;
        this.emitItemClick(row.dataset.itemId);
      });
      this.shadowRoot.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const row = event.target.closest(".roadmap-grid-row[data-item-id]");
        if (!row) return;
        event.preventDefault();
        this.emitItemClick(row.dataset.itemId);
      });
      this.shadowRoot.addEventListener("toggle", (event) => {
        const details = event.target;
        if (!details.matches || !details.matches("details.roadmap-group")) return;
        requestAnimationFrame(() => this.renderConnectors());
      }, true);
      this._resizeHandler = () => this.renderConnectors();
      window.addEventListener("resize", this._resizeHandler, { passive: true });
      this._eventsBound = true;
    }
    emitItemClick(itemId) {
      const item = this.itemIndex.get(itemId);
      if (!item) return;
      this.dispatchEvent(new CustomEvent("roadmap-item-click", {
        bubbles: true,
        composed: true,
        detail: { item }
      }));
    }
    renderConnectors() {
      const layer = this.shadowRoot.getElementById("connection-layer");
      const chart = this.shadowRoot.querySelector(".roadmap-chart");
      if (!layer || !chart) return;
      layer.innerHTML = "";
      const chartRect = chart.getBoundingClientRect();
      for (const item of this.flatItems) {
        if (!item.dependsOn.length) continue;
        const toRow = this.shadowRoot.querySelector(`.roadmap-grid-row[data-item-id="${CSS.escape(item.id)}"]`);
        const toBar = toRow?.querySelector(`[data-bar-item-id="${CSS.escape(item.id)}"]`);
        if (!toRow || !toBar || toRow.offsetParent === null) continue;
        const toRect = toBar.getBoundingClientRect();
        const x2 = toRect.left - chartRect.left;
        const y2 = toRect.top + toRect.height / 2 - chartRect.top;
        for (const depId of item.dependsOn) {
          const fromRow = this.shadowRoot.querySelector(`.roadmap-grid-row[data-item-id="${CSS.escape(depId)}"]`);
          const fromBar = fromRow?.querySelector(`[data-bar-item-id="${CSS.escape(depId)}"]`);
          if (!fromRow || !fromBar || fromRow.offsetParent === null) continue;
          const fromRect = fromBar.getBoundingClientRect();
          const x1 = fromRect.right - chartRect.left;
          const y1 = fromRect.top + fromRect.height / 2 - chartRect.top;
          const connector2 = document.createElement("roadmap-connector");
          connector2.setAttribute("x1", `${x1}`);
          connector2.setAttribute("y1", `${y1}`);
          connector2.setAttribute("x2", `${x2}`);
          connector2.setAttribute("y2", `${y2}`);
          connector2.setAttribute("end", "arrow");
          connector2.setAttribute("corner-radius", "10");
          connector2.setAttribute("stroke-width", "2");
          connector2.setAttribute("color", "#6c757d");
          layer.appendChild(connector2);
        }
      }
    }
  };
  customElements.define("roadmap-chart", RoadmapChart);
})();
