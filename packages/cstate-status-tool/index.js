import CStateBuildService from "./c-state-build-service.js";
import {html, css, LitElement} from "https://esm.sh/lit-element";
import {customElement, property} from "https://esm.sh/lit@3.2.1/decorators.js";

export class CstateStatusTool extends LitElement {
    static properties = {
        base: { type: String },              // c-state index.json URL
        defaultDetails: { type: String },    // Markdown-Template für Beschreibung
        selectedSystems: { type: Array },
        incidentType: { type: String },
        dateTime: { type: String },
        title: { type: String },
        details: { type: String },
        pin: { type: Boolean },
        _titleTouched: { type: Boolean, state: true },
        _pinTouched: { type: Boolean, state: true },
        systems: { type: Array, state: true },
        _systemsError: { type: String, state: true },
        _systemsLoading: { type: Boolean, state: true },
    };

    constructor() {
        super();
        this.base = "";
        this.defaultDetails = "";

        // Datum & Uhrzeit = Jetzt (lokal)
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.dateTime = now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

        this.selectedSystems = [];
        this.incidentType = "";
        this.title = "";
        this.details = "";
        this.pin = true;

        this._titleTouched = false;
        this._pinTouched = false;

        this.systems = [];
        this._systemsError = "";
        this._systemsLoading = false;
    }

    // Kein Shadow DOM, damit Bootstrap greift
    createRenderRoot() {
        return this;
    }

    updated(changedProps) {
        if (changedProps.has("base")) {
            this._loadSystemsFromCstate();
        }

        if (changedProps.has("defaultDetails")) {
            if (this.defaultDetails) {
                this._applyDetailsTemplate();
                this._syncExternalFields();
            }
        }
    }

    async _loadSystemsFromCstate() {
        this._systemsError = "";
        this._systemsLoading = true;
        this.systems = [];

        if (!this.base) {
            this._systemsError = "Kein c-state-Basis-URI konfiguriert.";
            this._systemsLoading = false;
            return;
        }

        try {
            const url = this.base;
            let json = null;

            if (url.startsWith("{")) {
                // we assume json here
                json = JSON.parse(url);
            } else {
                // othwise we try an url
                const resp = await fetch(url, { credentials: "omit" });

                if (!resp.ok) {
                    throw new Error(`HTTP ${resp.status}`);
                }

                json = await resp.json();
            }

            console.log(json);

            if (!Array.isArray(json.systems)) {
                throw new Error('index.json enthält kein "systems"-Array');
            }

            this.systems = json.systems
                .filter((s) => typeof s?.name === "string" && s.name.trim() !== "")
                .map((s, idx) => ({
                    id: idx,
                    name: s.name,
                    label: s.name,
                }));

            this._systemsLoading = false;
        } catch (err) {
            console.error("Fehler beim Laden der Systeme von c-state:", err);
            this._systemsError =
                "Die Liste der Dienste konnte nicht von der Statusseite geladen werden. Bitte prüfen Sie den Basis-URI oder versuchen Sie es später erneut.";
            this._systemsLoading = false;
        }
    }

    // ----- Helfer für Datum / Typ / Signatur / Template -----------------------

    get incidentLabel() {
        switch (this.incidentType) {
            case "maintenance":
                return "Wartung";
            case "outage":
                return "Ausfall";
            case "interruption":
                return "Störung";
            default:
                return "";
        }
    }

    _parseDateTime() {
        if (!this.dateTime) return null;
        const [datePart, timePart] = this.dateTime.split("T");
        if (!datePart) return null;
        const [yyyy, mm, dd] = datePart.split("-");
        const [hh = "00", mi = "00"] = (timePart || "").split(":");
        return { yyyy, mm, dd, hh, mi };
    }

    _formatDateTimeHuman(dtStr = this.dateTime) {
        if (!dtStr) return "";
        const [datePart, timePart] = dtStr.split("T");
        if (!datePart) return "";
        const [yyyy, mm, dd] = datePart.split("-");
        const timeShort = timePart ? timePart.substring(0, 5) : "";
        return `${dd}.${mm}.${yyyy}${timeShort ? `, ${timeShort} Uhr` : ""}`;
    }

    _buildSignature() {
        const human = this._formatDateTimeHuman();
        if (!human) return "";
        return `Stand: ${human}`;
    }

    _templateContext() {
        const dt = this._parseDateTime();
        const date = dt ? `${dt.dd}.${dt.mm}.${dt.yyyy}` : "";
        const time = dt ? `${dt.hh}:${dt.mi} Uhr` : "";
        const datetime = this._formatDateTimeHuman();
        const type = this.incidentLabel;
        const systems = this.selectedSystems.join(", ");
        const stand = this._buildSignature();

        return { date, time, datetime, type, systems, stand };
    }

    _applyTemplate(str) {
        if (!str) return "";
        const ctx = this._templateContext();
        let out = str;

        out = out.replace(/\{\{DATE\}\}/g, ctx.date);
        out = out.replace(/\{\{TIME\}\}/g, ctx.time);
        out = out.replace(/\{\{DATETIME\}\}/g, ctx.datetime);
        out = out.replace(/\{\{TYPE\}\}/g, ctx.type);
        out = out.replace(/\{\{SYSTEMS\}\}/g, ctx.systems);
        out = out.replace(/\{\{STAND\}\}/g, ctx.stand);

        return out;
    }

    _applyDetailsTemplate() {
        if (!this.defaultDetails) {
            return;
        }

        let details = this._applyTemplate(this.defaultDetails);

        // Wenn der Template-Text kein {{STAND}} enthält, Signatur anhängen
        if (!/\{\{STAND\}\}/.test(this.defaultDetails)) {
            const signature = this._buildSignature();
            if (signature) {
                if (details.trim().length > 0) {
                    details = `${details.trim()}\n\n_${signature}_`;
                } else {
                    details = `_${signature}_`;
                }
            }
        }

        this.details = details;
    }

    // ----- Slots / äußere Felder synchronisieren -----------------------------

    _syncExternalFields() {
        // textarea o.ä. mit slot="details-field"
        const detailsNode = this.querySelector('[slot="details-field"]');
        if (detailsNode && "value" in detailsNode) {
            const titleRaw = this.title ?? '-';
            const dateTime = this.dateTime;
            const messageDetails = this.details;
            const incidentType = this.incidentType;
            const isPinned = this.pin;
            const affectedSystemsNodes = this.selectedSystems;
            let markdown = CStateBuildService.build({
                titleRaw,
                dateTime,
                messageDetails,
                incidentType,
                isPinned,
                affectedSystemsNodes
            });
            detailsNode.value = markdown || "";
        }

        // input o.ä. mit slot="filename-field"
        const filenameNode = this.querySelector('[slot="filename-field"]');
        if (filenameNode && "value" in filenameNode) {
            filenameNode.value = this._buildFilename();
        }
    }

    // ----- Titel / Pin / Systems / Events ------------------------------------

    _updateTitleFromSelection() {
        if (this._titleTouched) return;

        const systemsPart = this.selectedSystems.join("/");
        const incidentPart = this.incidentLabel;
        const datePart = this._formatDateTimeHuman(this.dateTime);

        let newTitle = "";
        if (systemsPart) newTitle += `${systemsPart}: `;
        if (incidentPart) newTitle += incidentPart;
        if (datePart) newTitle += ` (${datePart})`;

        this.title = newTitle.trim();
    }

    _maybeUpdateDetailsFromTemplate() {
        if (this.defaultDetails) {
            this._applyDetailsTemplate();
        }
        this._syncExternalFields();
    }

    _onSystemChange(e, systemName) {
        const checked = e.target.checked;
        if (checked) {
            if (!this.selectedSystems.includes(systemName)) {
                this.selectedSystems = [...this.selectedSystems, systemName];
            }
        } else {
            this.selectedSystems = this.selectedSystems.filter((s) => s !== systemName);
        }
        this._updateTitleFromSelection();
        this._maybeUpdateDetailsFromTemplate();
    }

    _onIncidentTypeChange(e) {
        this.incidentType = e.target.value;

        // Automatische Pin-Empfehlung, solange User Pin nicht selbst geändert hat
        if (!this._pinTouched) {
            switch (this.incidentType) {
                case "maintenance":
                    this.pin = true;
                    break;
                case "outage":
                    this.pin = true;
                    break;
                case "interruption":
                    this.pin = true;
                    break;
                default:
                    this.pin = true;
            }
        }

        this._updateTitleFromSelection();
        this._maybeUpdateDetailsFromTemplate();
    }

    _onDateTimeChange(e) {
        this.dateTime = e.target.value;
        this._updateTitleFromSelection();
        this._maybeUpdateDetailsFromTemplate();
    }

    _onTitleInput(e) {
        this.title = e.target.value;
        this._titleTouched = true;
        this._syncExternalFields();
    }

    _onDetailsChange(e) {
        // Nutzer-Eingabe überschreibt details,
        // aber bei der nächsten meta-Änderung wird wieder das komplette Template gerendert.
        this.details = e.target.value;
        this._syncExternalFields();
    }

    _onPinChange(e) {
        this.pin = e.target.checked;
        this._pinTouched = true;
    }

    // ----- Dateiname für c-state ---------------------------------------------

    _slugify(str) {
        if (!str) return "incident";
        let s = str.toLowerCase();

        // einfache Umlaute-Ersetzung
        s = s.replace(/ä/g, "ae")
            .replace(/ö/g, "oe")
            .replace(/ü/g, "ue")
            .replace(/ß/g, "ss");

        s = s.replace(/[^a-z0-9]+/g, "-");
        s = s.replace(/^-+|-+$/g, "");
        if (!s) s = "incident";
        if (s.length > 60) s = s.slice(0, 60);
        return s;
    }

    _buildFilename() {
        const dt = this._parseDateTime();
        const today = new Date();
        let yyyy, mm, dd;

        if (dt) {
            ({ yyyy, mm, dd } = dt);
        } else {
            const y = today.getFullYear();
            const m = String(today.getMonth() + 1).padStart(2, "0");
            const d = String(today.getDate()).padStart(2, "0");
            yyyy = String(y);
            mm = m;
            dd = d;
        }

        const slug = this._slugify(this.title);
        return `${yyyy}-${mm}-${dd}-${slug}.md`;
    }

    _onSubmit(e) {
        e.preventDefault();
        const filename = this._buildFilename();

        // Vor dem Event die äußeren Felder aktualisieren
        this._syncExternalFields();

        const payload = {
            base: this.base,
            title: this.title,
            dateTime: this.dateTime,
            incidentType: this.incidentType,
            pin: this.pin,
            systems: this.selectedSystems,
            details: this.details,
            filename, // fertiger Dateiname für c-state
        };

        this.dispatchEvent(
            new CustomEvent("incident-submit", {
                detail: payload,
                bubbles: true,
                composed: true,
            }),
        );
    }

    // ----- Systems / Hilfetext -----------------------------------------------

    _displayBase() {
        const raw = (this.base || "").replace(/\/+$/, "");
        if (raw.length <= 300) return raw;
        return raw.slice(0, 297) + "...";
    }

    renderSystemsFieldset() {
        if (this._systemsLoading) {
            return html`<div class="form-text">
        Dienste werden von der Statusseite geladen…
      </div>`;
        }

        if (this._systemsError) {
            return html`
        <div class="alert alert-warning" role="alert">
          ${this._systemsError}
        </div>
      `;
        }

        if (!this.systems.length) {
            return html`
        <div class="form-text">
          Keine Dienste gefunden. Bitte prüfen Sie den c-state-Basis-URI oder die index.json-Konfiguration.
        </div>
      `;
        }

        const baseDisplay = this._displayBase();

        return html`
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4">
        ${this.systems.map(
            (system) => html`
            <div class="col mb-2">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="affectedSystem${system.id}"
                  .checked=${this.selectedSystems.includes(system.name)}
                  @change=${(e) => this._onSystemChange(e, system.name)}
                />
                <label class="form-check-label" for="affectedSystem${system.id}">
                  ${system.label}
                </label>
              </div>
            </div>
          `,
        )}
      </div>
      <div id="affectedSystemsHelp" class="form-text">
        Die Diensteliste wird direkt aus
        <code>${baseDisplay}</code>
        gelesen (Feld <code>systems[].name</code>). Weitere Anpassungen können Sie bei Bedarf im Repository vornehmen.
      </div>
    `;
    }

    // ----- Render ------------------------------------------------------------

    render() {
        return html`
          <!-- INCIDENT TYPE als Radio-Toggle-Buttons -->
          <label class="form-label">Art der Meldung/des Vorfalls:</label>
          <fieldset id="incidentTypeRadioGroup" class="mb-3">
            <div
              class="btn-group mb-2"
              role="group"
              aria-label="Art der Meldung/des Vorfalls"
            >
              <!-- Wartung – primary -->
              <input
                type="radio"
                class="btn-check"
                name="incidentTypeRadio"
                id="maintenance"
                value="maintenance"
                autocomplete="off"
                @change=${this._onIncidentTypeChange}
                ?checked=${this.incidentType === "maintenance"}
                required
              />
              <label class="btn btn-outline-primary" for="maintenance">
                Wartungsinfo (Zukunft)
              </label>

              <!-- Ausfall – warning -->
              <input
                type="radio"
                class="btn-check"
                name="incidentTypeRadio"
                id="outage"
                value="outage"
                autocomplete="off"
                @change=${this._onIncidentTypeChange}
                ?checked=${this.incidentType === "outage"}
                required
              />
              <label class="btn btn-outline-warning" for="outage">
                Ausfall/Down
              </label>

              <!-- Störung – danger -->
              <input
                type="radio"
                class="btn-check"
                name="incidentTypeRadio"
                id="interruption"
                value="interruption"
                autocomplete="off"
                @change=${this._onIncidentTypeChange}
                ?checked=${this.incidentType === "interruption"}
                required
              />
              <label class="btn btn-outline-danger" for="interruption">
                Störung
              </label>
            </div>

            <div id="incidentTypeRadioGroupHelp" class="form-text">
              Wartung ist informativ (<code>informational: true</code>), Ausfall=rot, Störung=gelb im Status.
            </div>
          </fieldset>

          <!-- PIN -->
          <label for="pinCheck" class="form-label">Meldung oben anpinnen?</label>
          <fieldset id="pinCheck" class="mb-3">
            <div class="card mb-3">
              <div class="card-body">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="pinBoolean"
                    ?checked=${this.pin}
                    @change=${this._onPinChange}
                  />
                  <label class="form-check-label" for="pinBoolean">
                    Ja, setze <code>pin: true</code>
                  </label>
                </div>
                <div id="pinHelp" class="form-text">
                  Nur in Ausnahmefällen deaktivieren (z.B. verspätet angelegte Meldungen zu bereits erledigten
                  Ereignissen).
                </div>
              </div>
            </div>
          </fieldset>

          <!-- SYSTEMS (CHECKBOXES) BEFORE TITLE -->
          <label for="affectedSystems" class="form-label">Betroffene Dienste:</label>
          <fieldset id="affectedSystems" class="mb-3">
            <div class="card mb-3">
              <div class="card-body">
                ${this.renderSystemsFieldset()}
              </div>
            </div>
          </fieldset>

          <!-- TITLE -->
          <div class="mb-3">
            <label for="title" class="form-label">Titel</label>
            <input
              type="text"
              class="form-control"
              name="title"
              id="title"
              maxlength="95"
              .value=${this.title}
              @input=${this._onTitleInput}
              required
            />
            <div id="titleHelp" class="form-text">
              Muster:
              <code>&lt;Dienstname(n)/Systembestandteil(e)&gt;: &lt;Ereignis&gt; (TT.MM.JJJJ, ggf. Zeitraum)</code>
              <br />
              Solange der Titel nicht manuell geändert wurde, wird er automatisch aus ausgewählten Diensten,
              Vorfall-Typ und Datum/Uhrzeit generiert.
            </div>
          </div>

          <!-- DATE & TIME -->
          <div class="row">
            <div class="col-12 col-md-4 mb-3">
              <label for="datetime" class="form-label">Datum &amp; Uhrzeit</label>
              <input
                id="datetime"
                name="dateTime"
                type="datetime-local"
                class="form-control"
                .value=${this.dateTime}
                @change=${this._onDateTimeChange}
                required
              />
              <div id="dateHelp" class="form-text">
                Ab wann besteht der Vorfall? / Wann beginnt die Wartung?
              </div>
            </div>
          </div>

          <!-- DESCRIPTION -->
          <div class="mb-3">
            <label for="details" class="form-label">Meldungstext / Beschreibung:</label>
            <textarea
              class="form-control"
              id="details"
              rows="5"
              placeholder="Details zur Meldung hier…"
              .value=${this.details}
              @input=${this._onDetailsChange}
              required
            ></textarea>
            <div id="messageHelp" class="form-text">
              Formatierung mit
              <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank">Markdown</a> möglich.
              Für einen neuen Absatz bitte eine Leerzeile eingeben.
              <br />
              Unterstützte Platzhalter im Default-Text:
              <code>{{DATE}}</code>,
              <code>{{TIME}}</code>,
              <code>{{DATETIME}}</code>,
              <code>{{TYPE}}</code>,
              <code>{{SYSTEMS}}</code>,
              <code>{{STAND}}</code>.
            </div>
          </div>
        </div>
      </div>

      <!-- Slots für externe Hidden-Felder (Progressive Enhancement) -->
      <slot name="details-field"></slot>
      <slot name="filename-field"></slot>
    `;
    }
}

customElements.define("cstate-status-tool", CstateStatusTool);
