# `<json-editor>`

Progressive-Enhancement-Web-Component für JSON-`<textarea>`s: Syntax-Highlighting,
JSON-Schema-Validierung, Pretty-Print beim Verlassen des Felds, komprimiertes
JSON beim Speichern.

## Prinzip

- **Ohne JS:** Die `<textarea>` im Light DOM ist ein ganz normales Formularfeld
  und funktioniert wie gewohnt (auch bei `no-js`-Browsern, Bots, oder bei
  Fehlern beim Laden des Custom-Element-Moduls).
- **Mit JS:** Ein `<pre>`-Overlay im Shadow DOM liegt exakt über der
  `<textarea>` (Text der Textarea ist transparent, nur der Caret ist
  sichtbar) und zeigt farbig hervorgehobenes JSON. Dazu: Live-Validierung
  gegen ein JSON-Schema, Fehlerliste, `blur` → Pretty-Print, `submit` des
  umschließenden `<form>` → Minify + Validitätsprüfung.

## Installation

```bash
npm install @4viewture/json-editor @cfworker/json-schema
```

```js
import '@4viewture/json-editor';
```

`@cfworker/json-schema` ist ein `dependency`, wird also automatisch mit
installiert. Der Import in `src/json-editor.js` ist ein bare specifier – für
den Einsatz mit Bundler (Vite/esbuild/webpack) reicht das direkt. Für eine
bundlerlose Demo im Browser eine **Import Map** verwenden (siehe
`demo/demo.html`).

## Nutzung

```html
<json-editor schema-src="/schemas/person.json">
  <textarea name="payload">{"name":"Kay"}</textarea>
</json-editor>
```

Schema inline statt per Request:

```html
<json-editor>
  <textarea name="payload">{"name":"Kay"}</textarea>
  <script type="application/schema+json">
    { "type": "object", "required": ["name"] }
  </script>
</json-editor>
```

## Attribute

| Attribut      | Beschreibung                                      |
|---------------|----------------------------------------------------|
| `schema-src`  | URL zu einem JSON-Schema (per `fetch` geladen)     |
| `indent`      | Einrückungstiefe für Pretty-Print (Default: `2`)   |

## API

| Member          | Beschreibung                                          |
|-----------------|--------------------------------------------------------|
| `.value`        | get/set – Rohwert der textarea                        |
| `.format()`     | Pretty-print (zeilenumbrüche + Einrückung)             |
| `.minify()`     | Komprimiert auf eine Zeile                              |
| `.validate()`   | Erzwingt sofortige Validierung, gibt `boolean` zurück   |

## Events

Alle Events werden direkt am `<json-editor>`-Element ausgelöst (bubbeln),
sind also automatisch pro Instanz gescoped:

- `json-editor:valid` – `detail: { value }`
- `json-editor:invalid` – `detail: { errors: string[] }`
- `json-editor:minified` – `detail: { value }`

## Theming

CSS Custom Properties:

- Layout: `--json-editor-height` (Default `16rem`), `--json-editor-font`,
  `--json-editor-border`, `--json-editor-radius`
- Status: `--json-editor-fg`, `--json-editor-error`, `--json-editor-ok`
- Syntax-Highlighting: `--json-editor-key`, `--json-editor-string`,
  `--json-editor-number`, `--json-editor-keyword`, `--json-editor-punct`

## Hinweis zum Highlighting

Das Overlay-Verfahren (transparente `<textarea>` über farbigem `<pre>`)
erfordert, dass `<pre>` und `<textarea>` exakt dieselben Box-Metriken haben
(Padding, Border, Font, Line-Height) – das ist in der Component über einen
gemeinsamen CSS-Regelblock sichergestellt. Manuelles Resizing der `<textarea>`
ist deshalb deaktiviert (`resize: none`); die Höhe wird stattdessen über
`--json-editor-height` gesteuert.

Der Tokenizer in `src/highlight-json.js` ist ein reiner Regex-Lexer (kein
`eval`, kein Parser) und daher auch für unvollständiges/ungültiges JSON
während des Tippens robust. Aller Text wird vor dem Einfügen ins `innerHTML`
escaped.

## Dateien

```
package.json
src/json-editor.js       – die Component
src/highlight-json.js    – Tokenizer fürs Syntax-Highlighting (isoliert testbar)
demo/demo.html            – Beispiel mit Import Map
demo/person.schema.json  – Beispiel-Schema
LICENSE                    – MIT (Copyright-Platzhalter anpassen)
```
