/**
 * fucodo-chart-roadmap.js
 *
 * Improved Gantt / Roadmap LitElement web component.
 *
 * Kept from original fucodo-chart-roadmap:
 *   • Grouped / swimlane rows with collapsible group headers
 *   • Custom bar colours per task or group
 *
 * Integrated from frappe/gantt lessons:
 *   • Multi view modes: Day | Week | Month | Quarter | Year
 *   • Built-in toolbar (view-mode switcher + "Today" button)
 *   • Today marker line
 *   • Drag-to-move bars
 *   • Drag-to-resize bars (right-edge handle)
 *   • Progress overlay inside bars
 *   • SVG dependency arrows (bezier)
 *   • Weekend column highlighting
 *   • Hover popup / tooltip
 *   • Scroll-to-today on load
 *   • on_date_change / on_progress_change event dispatch
 *
 * Usage
 * -----
 * <fucodo-chart-roadmap
 *   view-mode="Month"
 *   today-button
 *   view-mode-select
 * ></fucodo-chart-roadmap>
 *
 * const el = document.querySelector('fucodo-chart-roadmap');
 * el.tasks = [
 *   { id:'1', name:'Research',  group:'Phase 1', start:'2025-01-06', end:'2025-01-20', progress:100, color:'#6366f1' },
 *   { id:'2', name:'Design',    group:'Phase 1', start:'2025-01-20', end:'2025-02-07', progress:60,  dependencies:['1'] },
 *   { id:'3', name:'Prototype', group:'Phase 2', start:'2025-02-10', end:'2025-03-14', progress:30,  dependencies:['2'] },
 * ];
 *
 * el.addEventListener('date-change',     e => console.log(e.detail));
 * el.addEventListener('progress-change', e => console.log(e.detail));
 * el.addEventListener('task-click',      e => console.log(e.detail));
 */

import style from './style.scss'
import { LitElement, html, css, svg, nothing, unsafeCSS } from 'lit';

// ─────────────────────────────────────────────────────────────────────────────
//  Date utilities
// ─────────────────────────────────────────────────────────────────────────────

const MS_DAY = 86_400_000;

function parseDate(str) {
    if (str instanceof Date) return new Date(str);
    const [y, m, d] = String(str).split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function addDays(d, n) {
    const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

function addMonths(d, n) {
    const r = new Date(d); r.setMonth(r.getMonth() + n); return r;
}

function diffDays(a, b) {
    return Math.round((b - a) / MS_DAY);
}

function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function startOfWeek(d) { // Monday
    const r = startOfDay(d);
    const day = r.getDay();
    r.setDate(r.getDate() - (day === 0 ? 6 : day - 1));
    return r;
}

function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

function startOfQuarter(d) {
    return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
}

function startOfYear(d) {
    return new Date(d.getFullYear(), 0, 1);
}

function endOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function daysInMonth(d) {
    return endOfMonth(d).getDate();
}

function isSameDay(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isWeekend(d) {
    const day = d.getDay();
    return day === 0 || day === 6;
}

function getISOWeek(d) {
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    return Math.ceil((((tmp - yearStart) / MS_DAY) + 1) / 7);
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const QUARTERS = ['Q1','Q2','Q3','Q4'];

// ─────────────────────────────────────────────────────────────────────────────
//  View mode configuration
// ─────────────────────────────────────────────────────────────────────────────

const VIEW_MODES = ['Day', 'Week', 'Month', 'Quarter', 'Year'];

/**
 * colWidth   : default px width of one lower-unit column
 * padBefore  : columns of padding before first task
 * padAfter   : columns of padding after last task
 */
const VIEW_DEF = {
    Day: {
        colWidth: 38,
        padBefore: 7,
        padAfter: 14,
        /** Returns array of {date} for each column (lower unit) */
        columns(start, end) {
            const cols = [];
            let d = startOfDay(start);
            while (d <= end) { cols.push({ date: d }); d = addDays(d, 1); }
            return cols;
        },
        /** Upper-header spans: [{ label, colSpan }] */
        upperSpans(cols) {
            return _groupByFn(cols, c => `${c.date.getFullYear()}-${c.date.getMonth()}`,
                c => `${MONTHS_SHORT[c.date.getMonth()]} ${c.date.getFullYear()}`);
        },
        lowerLabel: c => String(c.date.getDate()),
        isWeekend: c => isWeekend(c.date),
        ganttStart: d => addDays(startOfDay(d), -7),
        ganttEnd:   d => addDays(startOfDay(d), 14),
    },
    Week: {
        colWidth: 120,
        padBefore: 2,
        padAfter: 4,
        columns(start, end) {
            const cols = [];
            let d = startOfWeek(start);
            while (d <= end) { cols.push({ date: d }); d = addDays(d, 7); }
            return cols;
        },
        upperSpans(cols) {
            return _groupByFn(cols, c => `${c.date.getFullYear()}-${c.date.getMonth()}`,
                c => `${MONTHS_SHORT[c.date.getMonth()]} ${c.date.getFullYear()}`);
        },
        lowerLabel: c => `W${getISOWeek(c.date)}`,
        isWeekend: () => false,
        ganttStart: d => addDays(startOfWeek(d), -14),
        ganttEnd:   d => addDays(startOfWeek(d), 28),
    },
    Month: {
        colWidth: 100,
        padBefore: 1,
        padAfter: 2,
        columns(start, end) {
            const cols = [];
            let d = startOfMonth(start);
            while (d <= end) { cols.push({ date: d, days: daysInMonth(d) }); d = addMonths(d, 1); }
            return cols;
        },
        upperSpans(cols) {
            return _groupByFn(cols, c => c.date.getFullYear(),
                c => String(c.date.getFullYear()));
        },
        lowerLabel: c => MONTHS_SHORT[c.date.getMonth()],
        isWeekend: () => false,
        ganttStart: d => startOfMonth(addMonths(d, -1)),
        ganttEnd:   d => startOfMonth(addMonths(d, 2)),
    },
    Quarter: {
        colWidth: 140,
        padBefore: 1,
        padAfter: 2,
        columns(start, end) {
            const cols = [];
            let d = startOfQuarter(start);
            while (d <= end) {
                const qIdx = Math.floor(d.getMonth() / 3);
                cols.push({ date: d, days: diffDays(d, addMonths(d, 3)) });
                d = addMonths(d, 3);
            }
            return cols;
        },
        upperSpans(cols) {
            return _groupByFn(cols, c => c.date.getFullYear(),
                c => String(c.date.getFullYear()));
        },
        lowerLabel: c => QUARTERS[Math.floor(c.date.getMonth() / 3)],
        isWeekend: () => false,
        ganttStart: d => startOfQuarter(addMonths(d, -3)),
        ganttEnd:   d => startOfQuarter(addMonths(d, 6)),
    },
    Year: {
        colWidth: 100,
        padBefore: 1,
        padAfter: 2,
        columns(start, end) {
            const cols = [];
            let d = startOfYear(start);
            while (d <= end) { cols.push({ date: d, days: diffDays(d, startOfYear(addMonths(d, 12))) }); d = new Date(d.getFullYear() + 1, 0, 1); }
            return cols;
        },
        upperSpans(cols) {
            const decade = c => `${Math.floor(c.date.getFullYear() / 10) * 10}s`;
            return _groupByFn(cols, decade, decade);
        },
        lowerLabel: c => String(c.date.getFullYear()),
        isWeekend: () => false,
        ganttStart: d => new Date(d.getFullYear() - 1, 0, 1),
        ganttEnd:   d => new Date(d.getFullYear() + 2, 0, 1),
    },
};

/** Group consecutive columns by key, returning [{label, colSpan}] */
function _groupByFn(cols, keyFn, labelFn) {
    const spans = [];
    for (const col of cols) {
        const key = keyFn(col);
        if (spans.length && spans[spans.length - 1].key === key) {
            spans[spans.length - 1].colSpan++;
        } else {
            spans.push({ key, label: labelFn(col), colSpan: 1 });
        }
    }
    return spans;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Default colour palette (used if task has no colour)
// ─────────────────────────────────────────────────────────────────────────────

const PALETTE = [
    '#6366f1','#22d3ee','#f59e0b','#10b981','#f43f5e',
    '#a855f7','#3b82f6','#fb923c','#84cc16','#ec4899',
];

// ─────────────────────────────────────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────────────────────────────────────

export class FucodoChartRoadmap extends LitElement {

    // ── Public properties ────────────────────────────────────────────────────

    static properties = {
        tasks:             { type: Array },
        viewMode:          { type: String, attribute: 'view-mode', reflect: true },
        rowHeight:         { type: Number, attribute: 'row-height' },
        barPadding:        { type: Number, attribute: 'bar-padding' },
        headerHeight:      { type: Number, attribute: 'header-height' },
        groupHeaderHeight: { type: Number, attribute: 'group-header-height' },
        sidebarWidth:      { type: Number, attribute: 'sidebar-width' },
        readonly:          { type: Boolean },
        todayButton:       { type: Boolean, attribute: 'today-button' },
        viewModeSelect:    { type: Boolean, attribute: 'view-mode-select' },
        /** Comma-separated ISO dates to highlight as holidays */
        holidays:          { type: String },
        /** Whether to show progress drag handle */
        progressDraggable: { type: Boolean, attribute: 'progress-draggable' },
        /** Radius of the task bar corners (in pixels) */
        barCornerRadius:   { type: Number, attribute: 'bar-corner-radius' },
        /** Curve radius of arrows connecting dependencies */
        arrowCurve:        { type: Number, attribute: 'arrow-curve' },
    };

    // ── Styles ───────────────────────────────────────────────────────────────

    static styles = typeof style === 'string' ? unsafeCSS(style) : style;

    // ── Lifecycle ────────────────────────────────────────────────────────────

    constructor() {
        super();
        this.tasks             = [];
        this.viewMode          = 'Month';
        this.rowHeight         = 44;
        this.barPadding        = 9;
        this.headerHeight      = 60;
        this.groupHeaderHeight = 34;
        this.sidebarWidth      = 240;
        this.readonly          = false;
        this.todayButton       = true;
        this.viewModeSelect    = true;
        this.holidays          = '';
        this.progressDraggable = false;
        this.barCornerRadius   = 3;
        this.arrowCurve        = 5;

        this._collapsedGroups  = new Set();
        this._tooltip          = null;   // { task, x, y }
        this._dragState        = null;   // active drag info
        this._headerScrollLeft = 0;
    }

    updated(changed) {
        if (changed.has('tasks') || changed.has('viewMode')) {
            this._scheduleScrollToToday();
        }
    }

    _scheduleScrollToToday() {
        requestAnimationFrame(() => this._scrollToToday(false));
    }

    // ── Derived data ─────────────────────────────────────────────────────────

    get _vdef() { return VIEW_DEF[this.viewMode] || VIEW_DEF.Month; }

    get _holidaySet() {
        if (!this.holidays) return new Set();
        return new Set(this.holidays.split(',').map(s => s.trim()));
    }

    /** Parse tasks, assign y-positions and palette colours */
    get _processedTasks() {
        const tasksArr = this.tasks || [];
        const groups = new Map();
        const colourMap = new Map();
        let colourIdx = 0;

        if (!Array.isArray(tasksArr)) {
            console.warn('FucodoChartRoadmap: tasks is not an array', tasksArr);
            return { rows: [], taskMap: new Map() };
        }

        for (const t of tasksArr) {
            const g = t.group || '';
            if (!groups.has(g)) groups.set(g, []);
            groups.get(g).push(t);
            if (!colourMap.has(g)) colourMap.set(g, PALETTE[colourIdx++ % PALETTE.length]);
        }

        const rows   = [];
        const taskMap = new Map();
        let y = 0;

        for (const [group, gtasks] of groups) {
            const collapsed = this._collapsedGroups.has(group);

            rows.push({ type: 'group', group, y, collapsed });
            y += this.groupHeaderHeight;

            if (!collapsed) {
                for (const t of gtasks) {
                    const start = parseDate(t.start);
                    const end   = parseDate(t.end || t.start);
                    const colour = t.color || colourMap.get(group);
                    const proc = { ...t, _start: start, _end: end, _colour: colour, _y: y, _group: group };
                    rows.push({ type: 'task', task: proc, y });
                    taskMap.set(t.id, proc);
                    y += this.rowHeight;
                }
            }
        }

        return { rows, taskMap };
    }

    /** Compute date range for the gantt chart */
    get _dateRange() {
        const tasksArr = this.tasks || [];
        if (!Array.isArray(tasksArr) || !tasksArr.length) {
            const today = new Date();
            return { min: today, max: today };
        }
        const all = tasksArr.flatMap(t => [parseDate(t.start), parseDate(t.end || t.start)]);
        return {
            min: new Date(Math.min(...all)),
            max: new Date(Math.max(...all)),
        };
    }

    get _ganttStart() {
        return this._vdef.ganttStart(this._dateRange.min);
    }
    get _ganttEnd() {
        return this._vdef.ganttEnd(this._dateRange.max);
    }

    get _columns() {
        return this._vdef.columns(this._ganttStart, this._ganttEnd);
    }

    get _upperSpans() {
        return this._vdef.upperSpans(this._columns);
    }

    /** Convert a date to an SVG x coordinate */
    _dateToX(date) {
        const col0 = this._columns[0];
        if (!col0) return 0;
        // Compute cumulative pixel positions for each column
        if (!this.__colCache || this.__colCache.viewMode !== this.viewMode || this.__colCache.ganttStart !== this._ganttStart.getTime()) {
            this._buildColCache();
        }
        // Binary-search / lookup
        const days = diffDays(this._ganttStart, date);
        return days * this.__pixelsPerDay;
    }

    _buildColCache() {
        const vdef = this._vdef;
        const cols = this._columns;
        if (!cols.length) { this.__pixelsPerDay = 1; return; }

        // For simple step-based modes (Day, Week) pixelsPerDay is constant
        const totalDays = diffDays(this._ganttStart, this._ganttEnd) || 1;
        const totalPx   = cols.length * vdef.colWidth;
        this.__pixelsPerDay = totalPx / totalDays;
        this.__colCache = { viewMode: this.viewMode, ganttStart: this._ganttStart.getTime() };
    }

    get _svgWidth() {
        return this._columns.length * (this._vdef.colWidth);
    }

    get _svgBodyHeight() {
        const { rows } = this._processedTasks;
        if (!rows.length) return 120;
        const last = rows[rows.length - 1];
        return last.y + (last.type === 'group' ? this.groupHeaderHeight : this.rowHeight) + 20;
    }

    // ── Rendering ────────────────────────────────────────────────────────────

    render() {
        const { rows, taskMap } = this._processedTasks;
        const sidebarW = this.sidebarWidth;
        const headerH  = this.headerHeight;
        const svgW     = this._svgWidth;
        const svgH     = this._svgBodyHeight;

        this._buildColCache(); // ensure cache is warm

        return html`
      ${this._renderToolbar()}

      <div class="gantt-wrap">
        <!-- ── Sidebar ── -->
        <div class="sidebar" style="width:${sidebarW}px">
          <div class="sidebar-header" style="height:${headerH}px">
            <span>Task</span>
          </div>
          <div class="sidebar-rows" id="sidebar-rows">
            <svg width="${sidebarW}" height="${svgH}" id="sidebar-svg">
              ${rows.map(r => this._renderSidebarRow(r, sidebarW))}
            </svg>
          </div>
        </div>

        <!-- ── Chart ── -->
        <div class="chart-area">
          <!-- Sticky header (we handle scroll sync via JS) -->
          <div class="chart-header-wrap" style="height:${headerH}px; overflow:hidden">
            <svg id="header-svg"
                 width="${svgW}"
                 height="${headerH}"
                 style="position:relative">
              ${this._renderHeader()}
            </svg>
          </div>

          <!-- Scrollable body -->
          <div class="chart-scroll"
               id="chart-scroll"
               @scroll="${this._onScroll}"
               @pointermove="${this._onPointerMove}"
               @pointerup="${this._onPointerUp}"
               @pointercancel="${this._onPointerUp}">
            <svg id="body-svg"
                 width="${svgW}"
                 height="${svgH}"
                 @pointerdown="${this._onPointerDown}">
              <defs>${this._renderDefs(taskMap)}</defs>
              ${this._renderGrid(rows, svgW, svgH)}
              ${this._renderRowBackgrounds(rows, svgW)}
              ${this._renderBars(rows)}
              ${this._renderArrows(taskMap)}
              ${this._renderTodayLine(svgH)}
            </svg>
          </div>
        </div>
      </div>

      ${this._renderTooltip()}
    `;
    }

    // ── Toolbar ──────────────────────────────────────────────────────────────

    _renderToolbar() {
        if (!this.viewModeSelect && !this.todayButton) return nothing;
        return html`
      <div class="toolbar">
        ${this.viewModeSelect ? VIEW_MODES.map(m => html`
          <button class="vm-btn ${this.viewMode === m ? 'active' : ''}"
                  @click="${() => this._setViewMode(m)}">${m}</button>
        `) : nothing}
        ${this.todayButton ? html`
          <button class="today-btn" @click="${() => this._scrollToToday(true)}">Today ↗</button>
        ` : nothing}
      </div>
    `;
    }

    // ── Sidebar rows ─────────────────────────────────────────────────────────

    _renderSidebarRow(row, w) {
        const hg = this.groupHeaderHeight;
        const rh = this.rowHeight;

        if (row.type === 'group') {
            const collapsed = this._collapsedGroups.has(row.group);
            const cx = 12, cy = row.y + hg / 2;
            const sz = 5;
            // Chevron: ›  if collapsed, ˅ if expanded
            const chevron = collapsed
                ? `M${cx - sz / 2},${cy - sz} L${cx + sz / 2},${cy} L${cx - sz / 2},${cy + sz}`
                : `M${cx - sz},${cy - sz / 2} L${cx},${cy + sz / 2} L${cx + sz},${cy - sz / 2}`;

            return svg`
        <rect class="group-header-row"
              x="0" y="${row.y}" width="${w}" height="${hg}"
              @click="${() => this._toggleGroup(row.group)}" />
        <polyline class="group-chevron" points="${chevron.replace(/M|L/g,'').replace(/ /g,',')}"
                  @click="${() => this._toggleGroup(row.group)}" />
        <text class="group-label" x="28" y="${row.y + hg / 2 + 1}"
              dominant-baseline="middle"
              @click="${() => this._toggleGroup(row.group)}">
          ${row.group || 'Ungrouped'}
        </text>
      `;
        }

        const t = row.task;
        const dots = (s, max) => s.length > max ? s.slice(0, max - 1) + '…' : s;
        return svg`
      <rect class="task-row-bg" fill="transparent"
            x="0" y="${row.y}" width="${w}" height="${rh}" />
      <text class="task-label" x="20" y="${row.y + rh / 2}">
        ${dots(t.name, 28)}
      </text>
    `;
    }

    // ── Header ───────────────────────────────────────────────────────────────

    _renderHeader() {
        const vdef    = this._vdef;
        const cols    = this._columns;
        const colW    = vdef.colWidth;
        const headerH = this.headerHeight;
        const upperH  = Math.round(headerH * 0.42);
        const lowerH  = headerH - upperH;

        const upperSpans = this._upperSpans;

        // Upper row
        const upperItems = [];
        let ux = 0;
        for (const span of upperSpans) {
            upperItems.push(svg`
        <text class="header-upper-text"
              x="${ux + span.colSpan * colW / 2}"
              y="${upperH / 2 + 1}"
              text-anchor="middle"
              dominant-baseline="middle">
          ${span.label}
        </text>
        <line class="header-sep"
              x1="${ux + span.colSpan * colW}" y1="0"
              x2="${ux + span.colSpan * colW}" y2="${upperH}" />
      `);
            ux += span.colSpan * colW;
        }

        // Divider
        const divider = svg`
      <line class="header-sep" x1="0" y1="${upperH}" x2="${cols.length * colW}" y2="${upperH}" />
    `;

        // Lower row
        const lowerItems = cols.map((col, i) => {
            const x = i * colW;
            const isToday = isSameDay(col.date, new Date());
            return svg`
        <text class="header-lower-text"
              x="${x + colW / 2}"
              y="${upperH + lowerH / 2 + 1}"
              text-anchor="middle"
              dominant-baseline="middle"
              fill="${isToday ? 'var(--fc-today-line)' : 'var(--fc-text-dim)'}">
          ${vdef.lowerLabel(col)}
        </text>
        <line class="header-sep"
              x1="${x + colW}" y1="${upperH}"
              x2="${x + colW}" y2="${headerH}" />
      `;
        });

        return svg`${upperItems}${divider}${lowerItems}`;
    }

    // ── SVG defs (clip paths for bar labels) ─────────────────────────────────

    _renderDefs(taskMap) {
        return svg`
      <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4"
              markerWidth="6" markerHeight="6" orient="auto">
        <path class="dep-arrowhead" d="M0,0 L0,8 L8,4 z" />
      </marker>
    `;
    }

    // ── Grid (column backgrounds, today highlight, weekend) ──────────────────

    _renderGrid(rows, svgW, svgH) {
        const vdef     = this._vdef;
        const cols     = this._columns;
        const colW     = vdef.colWidth;
        const today    = new Date();
        const holidays = this._holidaySet;

        const colBgs = cols.map((col, i) => {
            const x    = i * colW;
            const fd   = formatDate(col.date);
            const isT  = isSameDay(col.date, today);
            const isWE = vdef.isWeekend(col);
            const isH  = holidays.has(fd);

            if (isT)  return svg`<rect class="today-col"   x="${x}" y="0" width="${colW}" height="${svgH}" />`;
            if (isH)  return svg`<rect class="holiday-col" x="${x}" y="0" width="${colW}" height="${svgH}" />`;
            if (isWE) return svg`<rect class="weekend-col" x="${x}" y="0" width="${colW}" height="${svgH}" />`;
            return nothing;
        });

        // Vertical grid lines
        const vLines = cols.map((col, i) => {
            const x = (i + 1) * colW;
            return svg`<line stroke="var(--fc-border)" stroke-width="0.5"
                       x1="${x}" y1="0" x2="${x}" y2="${svgH}" />`;
        });

        // Horizontal grid lines (per row)
        const hLines = rows.map(r => {
            const h = r.type === 'group' ? this.groupHeaderHeight : this.rowHeight;
            const y = r.y + h;
            return svg`<line stroke="var(--fc-border)" stroke-width="0.5"
                       x1="0" y1="${y}" x2="${svgW}" y2="${y}" />`;
        });

        return svg`${colBgs}${vLines}${hLines}`;
    }

    // ── Row backgrounds (for hover highlight) ────────────────────────────────

    _renderRowBackgrounds(rows, svgW) {
        return rows.map(r => {
            if (r.type === 'group') {
                return svg`<rect fill="var(--fc-group-bg)"
                         x="0" y="${r.y}" width="${svgW}" height="${this.groupHeaderHeight}" />`;
            }
            return svg`<rect class="task-row-bg" fill="transparent"
                       x="0" y="${r.y}" width="${svgW}" height="${this.rowHeight}" />`;
        });
    }

    // ── Bars ─────────────────────────────────────────────────────────────────

    _renderBars(rows) {
        const out = [];
        for (const row of rows) {
            if (row.type !== 'task') continue;
            out.push(this._renderBar(row.task));
        }
        return out;
    }

    _renderBar(t) {
        // Use a fallback for bar height if CSS variable is not yet available
        const barH   = 22;
        const rx     = this.barCornerRadius;
        const rowH   = this.rowHeight;
        const pad    = this.barPadding;

        const x      = this._dateToX(t._start);
        const xEnd   = this._dateToX(addDays(t._end, 1));
        const w      = Math.max(xEnd - x, 4);
        const y      = t._y + (rowH - barH) / 2;

        const progress   = Math.min(100, Math.max(0, t.progress || 0));
        const progressW  = w * (progress / 100);

        const colour     = t._colour || '#6366f1';
        const colourDark = _darken(colour, 0.25);

        const labelX   = x + 6;
        const clipW    = w - 10;
        const handleW  = Math.min(8, w * 0.15);

        const dots = (s, approxChars) =>
            s.length > approxChars ? s.slice(0, approxChars - 1) + '…' : s;

        return svg`
      <g class="bar-group ${this.readonly ? 'readonly' : ''}"
         data-task-id="${t.id}"
         @pointerenter="${(e) => this._showTooltip(e, t)}"
         @pointerleave="${() => this._hideTooltip()}"
         @click="${(e) => this._onBarClick(e, t)}">

        <!-- Background bar -->
        <rect class="bar-bg"
              x="${x}" y="${y}" width="${w}" height="${barH}"
              rx="${rx}" ry="${rx}"
              fill="${colour}" />

        <!-- Progress fill -->
        ${progress > 0 ? svg`
          <rect class="bar-progress"
                x="${x}" y="${y}" width="${progressW}" height="${barH}"
                rx="${rx}" ry="${rx}"
                fill="${colourDark}" />
        ` : nothing}

        <!-- Progress pill clip right -->
        ${progress > 0 && progress < 100 ? svg`
          <rect x="${x + progressW - rx}" y="${y}" width="${rx}" height="${barH}"
                fill="${colourDark}" opacity="0.38" />
        ` : nothing}

        <!-- Bar label -->
        ${w > 30 ? svg`
          <text class="bar-label"
                x="${labelX}" y="${y + barH / 2}"
                clip-path="url(#clip-${t.id})">
            ${dots(t.name, Math.floor(clipW / 6.5))}
          </text>
          <clipPath id="clip-${t.id}">
            <rect x="${x + 4}" y="${y}" width="${Math.max(0, w - 14)}" height="${barH}" />
          </clipPath>
        ` : nothing}

        <!-- Resize handle (right edge) — only when not readonly -->
        ${!this.readonly ? svg`
          <rect class="resize-handle"
                data-task-id="${t.id}" data-action="resize-end"
                x="${x + w - handleW}" y="${y}"
                width="${handleW}" height="${barH}"
                fill="transparent"
                rx="${rx}" />
        ` : nothing}

        <!-- Progress drag handle — optional -->
        ${this.progressDraggable && !this.readonly ? svg`
          <circle class="resize-handle-progress"
                  data-task-id="${t.id}" data-action="progress"
                  cx="${x + progressW}" cy="${y + barH}"
                  r="5"
                  fill="${colour}"
                  stroke="#fff" stroke-width="1.5" />
        ` : nothing}
      </g>
    `;
    }

    // ── Dependency arrows ─────────────────────────────────────────────────────

    _renderArrows(taskMap) {
        const barH = 22;
        const out  = [];

        for (const t of (this.tasks || [])) {
            if (!t.dependencies?.length) continue;
            const to = taskMap.get(t.id);
            if (!to) continue;

            const toX  = this._dateToX(to._start);
            const toY  = to._y + (this.rowHeight - barH) / 2 + barH / 2;

            for (const depId of t.dependencies) {
                const from = taskMap.get(depId);
                if (!from) continue;

                const fromX = this._dateToX(addDays(from._end, 1));
                const fromY = from._y + (this.rowHeight - barH) / 2 + barH / 2;

                const curve = this.arrowCurve;
                const path  = `M ${fromX} ${fromY} 
                               L ${fromX + curve} ${fromY} 
                               C ${fromX + curve * 2} ${fromY} ${toX - curve * 2} ${toY} ${toX - curve} ${toY} 
                               L ${toX} ${toY}`;

                out.push(svg`
          <path class="dep-arrow"
                d="${path}"
                marker-end="url(#arr)" />
        `);
            }
        }
        return out;
    }

    // ── Today line ────────────────────────────────────────────────────────────

    _renderTodayLine(svgH) {
        const today = new Date();
        if (today < this._ganttStart || today > this._ganttEnd) return nothing;
        const x = this._dateToX(today);
        return svg`
      <line class="today-line" x1="${x}" y1="0" x2="${x}" y2="${svgH}" />
      <text class="today-label" x="${x + 4}" y="10">today</text>
    `;
    }

    // ── Tooltip ──────────────────────────────────────────────────────────────

    _renderTooltip() {
        if (!this._tooltip) return nothing;
        const { task, x, y } = this._tooltip;
        const prog = Math.round(task.progress || 0);
        const dur  = diffDays(task._start, addDays(task._end, 1));

        return html`
      <div class="tooltip"
           style="left:${x}px; top:${y}px">
        <div class="tooltip-title">${task.name}</div>
        <div class="tooltip-row"><span>Start</span><span>${formatDate(task._start)}</span></div>
        <div class="tooltip-row"><span>End</span>  <span>${formatDate(task._end)}</span></div>
        <div class="tooltip-row"><span>Duration</span><span>${dur}d</span></div>
        ${task.group ? html`<div class="tooltip-row"><span>Group</span><span>${task.group}</span></div>` : nothing}
        <div class="tooltip-progress-bar">
          <div class="tooltip-progress-fill" style="width:${prog}%"></div>
        </div>
        <div class="tooltip-row" style="margin-top:4px"><span>Progress</span><span>${prog}%</span></div>
      </div>
    `;
    }

    // ── Events ───────────────────────────────────────────────────────────────

    _onScroll(e) {
        const sl = e.target.scrollLeft;
        const st = e.target.scrollTop;
        // Sync header
        const headerSvg = this.shadowRoot.getElementById('header-svg');
        if (headerSvg) headerSvg.style.transform = `translateX(-${sl}px)`;
        // Sync sidebar
        const sidebarRows = this.shadowRoot.getElementById('sidebar-rows');
        if (sidebarRows) sidebarRows.scrollTop = st;
    }

    _onPointerDown(e) {
        if (this.readonly) return;
        const bar = e.target.closest('[data-task-id]');
        if (!bar) return;

        const taskId = bar.dataset.taskId;
        const action = bar.dataset.action || 'move';
        const { taskMap } = this._processedTasks;
        const task = taskMap.get(taskId);
        if (!task) return;

        e.preventDefault();
        const scrollEl = this.shadowRoot.getElementById('chart-scroll');
        const scrollLeft = scrollEl ? scrollEl.scrollLeft : 0;

        this._dragState = {
            task,
            action,
            startClientX:  e.clientX,
            startScrollX:  scrollLeft,
            origStart:     new Date(task._start),
            origEnd:       new Date(task._end),
            origProgress:  task.progress || 0,
            pixelsPerDay:  this.__pixelsPerDay,
        };
        // Capture pointer so we get move/up even outside element
        this.shadowRoot.getElementById('body-svg')?.setPointerCapture(e.pointerId);
    }

    _onPointerMove(e) {
        if (!this._dragState) return;
        e.preventDefault();

        const { task, action, startClientX, pixelsPerDay, origStart, origEnd, origProgress } = this._dragState;
        const dx = e.clientX - startClientX;
        const deltaDays = Math.round(dx / pixelsPerDay);

        if (action === 'move') {
            task._start = addDays(origStart, deltaDays);
            task._end   = addDays(origEnd,   deltaDays);
            // Also update the source task so events show correct dates
            const src = (this.tasks || []).find(t => t.id === task.id);
            if (src) { src.start = formatDate(task._start); src.end = formatDate(task._end); }

        } else if (action === 'resize-end') {
            const newEnd = addDays(origEnd, deltaDays);
            if (newEnd >= task._start) {
                task._end = newEnd;
                const src = (this.tasks || []).find(t => t.id === task.id);
                if (src) src.end = formatDate(task._end);
            }

        } else if (action === 'progress') {
            const barW     = this._dateToX(addDays(task._end, 1)) - this._dateToX(task._start);
            const barX     = this._dateToX(task._start);
            const scrollEl = this.shadowRoot.getElementById('chart-scroll');
            const relX     = e.clientX - this.getBoundingClientRect().left + (scrollEl?.scrollLeft || 0) - this.sidebarWidth;
            const prog      = Math.min(100, Math.max(0, Math.round(((relX - barX) / barW) * 100)));
            task.progress = prog;
            const src = (this.tasks || []).find(t => t.id === task.id);
            if (src) src.progress = prog;
        }

        this.requestUpdate();
    }

    _onPointerUp(e) {
        if (!this._dragState) return;
        const { task, action, origStart, origEnd, origProgress } = this._dragState;
        this._dragState = null;

        const changed = action === 'progress'
            ? origProgress !== task.progress
            : origStart.getTime() !== task._start.getTime() || origEnd.getTime() !== task._end.getTime();

        if (changed) {
            if (action === 'progress') {
                this.dispatchEvent(new CustomEvent('progress-change', {
                    bubbles: true, composed: true,
                    detail: { task, progress: task.progress },
                }));
            } else {
                this.dispatchEvent(new CustomEvent('date-change', {
                    bubbles: true, composed: true,
                    detail: { task, start: formatDate(task._start), end: formatDate(task._end) },
                }));
            }
        }
        this.requestUpdate();
    }

    _onBarClick(e, task) {
        if (this._dragState) return;
        this.dispatchEvent(new CustomEvent('task-click', {
            bubbles: true, composed: true,
            detail: { task },
        }));
    }

    _showTooltip(e, task) {
        if (this._dragState) return;
        const rect = this.getBoundingClientRect();
        this._tooltip = {
            task,
            x: e.clientX - rect.left + 16,
            y: e.clientY - rect.top  + 16,
        };
        this.requestUpdate();
    }

    _hideTooltip() {
        if (this._tooltip) { this._tooltip = null; this.requestUpdate(); }
    }

    _toggleGroup(group) {
        if (this._collapsedGroups.has(group)) {
            this._collapsedGroups.delete(group);
        } else {
            this._collapsedGroups.add(group);
        }
        this.requestUpdate();
    }

    _setViewMode(mode) {
        this.viewMode = mode;
        this.__colCache = null; // bust cache
        this._scheduleScrollToToday();
    }

    _scrollToToday(smooth = true) {
        const today = new Date();
        const scrollEl = this.shadowRoot?.getElementById('chart-scroll');
        if (!scrollEl) return;
        this._buildColCache();
        const x = this._dateToX(today);
        const visibleW = scrollEl.clientWidth;
        scrollEl.scrollTo({
            left: Math.max(0, x - visibleW / 2),
            behavior: smooth ? 'smooth' : 'instant',
        });
    }
}

// ─────────────────────────────────────────────────────────────────────────────
//  Colour utility
// ─────────────────────────────────────────────────────────────────────────────

function _darken(hex, amount) {
    const num = parseInt(hex.replace('#',''), 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6,'0')}`;
}

// ─────────────────────────────────────────────────────────────────────────────
//  Register
// ─────────────────────────────────────────────────────────────────────────────

customElements.define('fucodo-chart-roadmap', FucodoChartRoadmap);