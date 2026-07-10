# fucodo-json-render

`fucodo-json-render` is a web component that renders JSON data using a Handlebars template. It is designed to be used as a child of `fucodo-json-fetch` or any component that dispatches `json-data` events.

## Features

- **Handlebars Templates**: Use the powerful Handlebars templating engine directly in your HTML.
- **Declarative Rendering**: Define your template inside a `<template>` tag within the component.
- **Auto-cleaning**: The source `<template>` tag is removed from the DOM after compilation to keep it clean.
- **Error Handling**: Built-in support for displaying error states when a `json-error` event is received.

## Installation

```html
<script type="module" src="https://unpkg.com/@fucodo/fucodo-json-render/index.js"></script>
```

Note: This component requires Handlebars as a dependency.

## Usage

Place a `<template>` tag inside `fucodo-json-render`. The data received via the `json-data` event will be available in the template.

**Important**: The received data is wrapped in an object as `{ items: data }` before being passed to the Handlebars template.

```html
<fucodo-json-render>
  <template>
    <h2>User Profile</h2>
    <p>Name: {{items.name}}</p>
    <p>Email: {{items.email}}</p>
  </template>
</fucodo-json-render>
```

If the data is an array:

```html
<fucodo-json-render>
  <template>
    <ul>
      {{#each items}}
        <li>{{this.title}}</li>
      {{/each}}
    </ul>
  </template>
</fucodo-json-render>
```

## Events Listened To

- `json-data`: Updates the component's inner HTML by rendering the template with `event.detail.data`.
- `json-error`: Displays a "Failed to load data" error message.
