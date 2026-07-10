# fucodo-json-fetch

`fucodo-json-fetch` is a web component that fetches JSON data from a specified source and dispatches it to its children components, specifically designed to work with `fucodo-json-render`.

## Features

- **Declarative Fetching**: Fetch data just by setting the `src` attribute.
- **Nesting Support**: Fully safe nesting of multiple fetchers. Each fetcher only communicates with its direct `fucodo-json-render` descendants, ignoring those nested within another `fucodo-json-fetch`.
- **Event-based**: Dispatches `json-data` on success and `json-error` on failure to target children.

## Installation

```html
<script type="module" src="https://unpkg.com/@fucodo/fucodo-json-fetch/index.js"></script>
```

## Usage

### Basic Usage

Combine it with `fucodo-json-render` to display fetched data.

```html
<fucodo-json-fetch src="https://api.example.com/data.json">
  <fucodo-json-render>
    <template>
      <ul>
        {{#each items}}
          <li>{{this.name}}</li>
        {{/each}}
      </ul>
    </template>
  </fucodo-json-render>
</fucodo-json-fetch>
```

### Nested Usage

You can nest fetchers safely. The inner fetcher's data stays isolated to its own renderer, and vice-versa.

```html
<fucodo-json-fetch src="/outer.json">
  <fucodo-json-render>
    <template>
      <h1>{{items.title}}</h1>
    </template>
  </fucodo-json-render>

  <fucodo-json-fetch src="/inner.json">
    <fucodo-json-render>
      <template>
        <p>{{items.description}}</p>
      </template>
    </fucodo-json-render>
  </fucodo-json-fetch>
</fucodo-json-fetch>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `src`     | The URL of the JSON resource to fetch. |

## Events Dispatched to Children

The component finds all `fucodo-json-render` descendants and dispatches the following custom events to them (if they belong to this fetcher):

- `json-data`: Dispatched when data is successfully fetched. `event.detail.data` contains the JSON response.
- `json-error`: Dispatched when the fetch fails. `event.detail.error` contains the error object.
