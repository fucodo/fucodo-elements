# `<json-tree-editor>`

Progressive-Enhancement-Web-Component für JSON-`<textarea>`s: ein
schemagesteuerter Baum-/Tabelleneditor (Schlüssel | Wert | Typ | Aktionen).
Schwester-Komponente zu [`<json-editor>`](../fucodo-json-editor) mit derselben
Optik, denselben Custom-Property-Konventionen und derselben Bootstrap-Interop.

## Prinzip

- **Ohne JS:** Die `<textarea>` im Light DOM ist ein normales Formularfeld.
- **Mit JS:** Die Werte werden als Baum bearbeitet. Welche Felder angeboten
  werden und welches Eingabeelement ein Wert bekommt, ergibt sich aus dem
  JSON Schema – **das Schema ist Pflicht**. Fehlt es oder lässt es sich nicht
  laden, bleibt die `<textarea>` sichtbar und die Komponente zeigt den Fehler.

## Nutzung

```html
<json-tree-editor schema-src="/schemas/sso-applications.json">
  <textarea name="payload">[]</textarea>
</json-tree-editor>
```

Schema inline statt per Request:

```html
<json-tree-editor>
  <textarea name="payload">[]</textarea>
  <script type="application/schema+json">{ "type": "array", "items": { "type": "object" } }</script>
</json-tree-editor>
```

## Unterstützte Schema-Konstrukte

| Konstrukt | Verhalten in der UI |
|---|---|
| `type` (auch Arrays wie `["string", "null"]`) | Eingabeelement passend zum Typ; bei mehreren Typen Umschalter in der Typ-Spalte |
| `enum`, `const` | Auswahlliste; ein nicht erlaubter Wert erscheint als „(ungültig)“ |
| `format: uri`, `email` | passende `input`-Typen; alle Formate werden validiert |
| `properties`, `patternProperties`, `required` | Pflichtfelder mit `*`, nicht löschbar; fehlende Felder über „+ Eigenschaft hinzufügen“ |
| `additionalProperties` / `unevaluatedProperties` | `false` → keine freien Schlüssel, vorhandene fremde Schlüssel werden als „nicht erlaubt“ markiert |
| `items`, `prefixItems` (auch draft-07-Tupel) | Einträge hinzufügen, verschieben, duplizieren, entfernen |
| `$ref` / `$defs` / `definitions` (lokal) | aufgelöst |
| `allOf` | zusammengeführt |
| `if` / `then` / `else` | wird **anhand des aktuellen Werts** ausgewertet: ändert sich z.B. `type`, ändern sich die angebotenen Felder und Pflichtfelder sofort |
| `anyOf` / `oneOf` | passende Variante wird automatisch erkannt; Umschalter in der Typ-Spalte |
| `default`, `examples`, `minimum` | Vorbelegung neuer Werte bzw. Platzhalter |
| `title`, `description` | Tooltip am Schlüssel, `title` auch in der Feldauswahl |
| `x-summary: ["type", "domain"]` | Felder für die Kurzbeschreibung eines Objekts (optional) |

## Ungültige Zwischenstände

Eingaben dürfen zwischendurch ungültig sein – `6x` in einem `integer`-Feld wird
als String übernommen, statt verworfen zu werden. Ungültiges wird deutlich
markiert:

- die Zeile bekommt einen roten Rand links und einen roten Hintergrund, das Feld
  `aria-invalid`, und die Meldung steht (deutsch) direkt unter der Zeile,
- zugeklappte Knoten zeigen die Anzahl der Fehler darin,
- die Toolbar zeigt die Gesamtzahl, die Fehlerliste unten springt per Klick
  zur Zeile,
- bei fehlenden Pflichtfeldern bietet die Meldung „Fehlende Pflichtfelder
  ergänzen“ an (inkl. der Felder, die erst über `if`/`then` Pflicht werden).

Blockiert wird nur das Absenden des umgebenden Formulars (und die Komponente
springt zum ersten Fehler). Mit dem Attribut `allow-invalid` wird auch
ungültiger Inhalt abgeschickt. Beim Absenden wird das JSON minifiziert.

## Attribute

| Attribut | Beschreibung |
|---|---|
| `schema-src` | URL zu einem JSON Schema (per `fetch` geladen) |
| `indent` | Einrückung der JSON-Ansicht und der textarea (Default `2`) |
| `expand-depth` | bis zu welcher Ebene initial aufgeklappt wird (Default `1`) |
| `allow-invalid` | Formular auch mit ungültigem Inhalt absenden |

## API

| Member | Beschreibung |
|---|---|
| `.value` | get/set – geparster Wert (Kopie) |
| `.schema` | get/set – Schema-Objekt |
| `.mode` | `'tree'` \| `'json'` |
| `.validate()` | validiert sofort, gibt `boolean` zurück |
| `.expandAll()` / `.collapseAll()` | alles auf-/zuklappen |
| `.reveal(pointer)` | klappt bis zum JSON Pointer auf und fokussiert die Zeile |

## Events

Alle Events werden am `<json-tree-editor>`-Element ausgelöst (bubbeln) und sind
damit pro Instanz gescoped:

- `json-tree-editor:change` – `detail: { value }`
- `json-tree-editor:valid` – `detail: { value }`
- `json-tree-editor:invalid` – `detail: { errors: { pointer, message }[] }`

## JSON-Ansicht

Der Umschalter „JSON“ zeigt den Rohtext. Ist `<json-editor>` auf der Seite
registriert, wird er dafür verwendet (Highlighting + Validierung gegen dasselbe
Schema), sonst eine einfache `<textarea>`. Bei einem Syntaxfehler bleibt die
Komponente in der JSON-Ansicht, bis er behoben ist.

## Theming

CSS Custom Properties, analog zu `<json-editor>`:

`--json-tree-editor-max-height` (Default `32rem`), `--json-tree-editor-font`,
`--json-tree-editor-mono`, `--json-tree-editor-bg`, `--json-tree-editor-border`,
`--json-tree-editor-radius`, `--json-tree-editor-fg`, `--json-tree-editor-muted`,
`--json-tree-editor-error`, `--json-tree-editor-ok`,
`--json-tree-editor-focus-color`, `--json-tree-editor-focus-shadow`,
`--json-tree-editor-key`, `--json-tree-editor-indent`,
`--json-tree-editor-row-height`

Mit `class="form-control"` auf dem Host werden die Bootstrap-Variablen
übernommen und `is-valid`/`is-invalid` am Host gesetzt.

## Dateien

```
index.js             – die Component
schema-resolver.js   – effektives Schema pro Knoten ($ref, allOf, if/then/else, anyOf/oneOf), Defaults, Typkonvertierung
messages.js          – cfworker-Fehler → deutsche, zeilengenaue Meldungen
style.scss           – Shadow-DOM-Styles (css-text über den Monorepo-Build)
test/                – node:test, Resolver-Unit-Tests + Funktionstests der Komponente in jsdom
stories/             – Storybook
```

Tests: `npm test` (benötigt als devDependencies `esbuild`, `esbuild-sass-plugin`, `jsdom`).

## Grenzen

- Nur lokale `$ref` (`#/…`); externe Referenzen werden als „beliebig“ behandelt.
- `if`/`then`/`else` und `anyOf`/`oneOf` werden für die UI zusammengeführt
  (allOf-Semantik für `properties`/`required`). Die Validierung selbst läuft
  immer über `@cfworker/json-schema` gegen das vollständige Schema.
- `dependentRequired`/`dependentSchemas` werden validiert, beeinflussen aber
  noch nicht die angebotenen Felder.
