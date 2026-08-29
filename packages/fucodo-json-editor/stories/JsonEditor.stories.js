import '../dist/index.js';

const BOOTSTRAP_CSS =
  'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';

/** Schema used by the inline stories – same shape as /schemas/person.schema.json. */
const PERSON_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['name', 'role'],
  properties: {
    name: { type: 'string', minLength: 1 },
    role: { type: 'string', enum: ['Developer', 'Support', 'Lead'] },
  },
  additionalProperties: false,
};

/** Builds a `<script type="application/schema+json">` child for a given schema object. */
const inlineSchema = (schema = PERSON_SCHEMA) =>
  `<script type="application/schema+json">${JSON.stringify(schema, null, 2)}<\/script>`;

const wrap = (html) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = html;
  return wrapper;
};

export default {
  title: 'Apps/Editors/JSON',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Progressive enhancement for a JSON `<textarea>`: syntax highlighting, JSON Schema validation, pretty-print on blur and minified JSON on submit. Without JavaScript the plain `<textarea>` keeps working.',
      },
    },
  },
};

/**
 * Primary story: schema inline (no request), inside a form, with a log of the
 * component events and the value that would actually be submitted.
 */
export const Default = () => {
  const wrapper = wrap(`
    <form id="demo-form">
      <json-editor>
        <textarea name="payload" rows="8">{"name": "Kay", "role": "Developer"}</textarea>
        ${inlineSchema()}
      </json-editor>
      <button type="submit">Save</button>
    </form>
    <h3>Submitted value (minified)</h3>
    <pre id="output"><em>nothing submitted yet</em></pre>
    <h3>Events</h3>
    <pre id="events"><em>waiting…</em></pre>
    <style>
      json-editor { display: block; margin-bottom: 1rem; }
      pre { background: #f6f8fa; padding: .5rem; border-radius: 4px; overflow-x: auto; }
      h3 { font-size: .9rem; margin-bottom: .25rem; }
    </style>
  `);

  const form = wrapper.querySelector('#demo-form');
  const editor = wrapper.querySelector('json-editor');
  const events = wrapper.querySelector('#events');
  const log = (line) => {
    if (events.querySelector('em')) events.textContent = '';
    events.textContent += `${line}\n`;
    events.scrollTop = events.scrollHeight;
  };

  editor.addEventListener('json-editor:valid', (event) =>
    log(`json-editor:valid ${JSON.stringify(event.detail.value)}`)
  );
  editor.addEventListener('json-editor:invalid', (event) =>
    log(`json-editor:invalid ${event.detail.errors.join(' | ')}`)
  );
  editor.addEventListener('json-editor:minified', () => log('json-editor:minified'));

  // The component minifies (or blocks) on submit in its own handler, which is
  // registered on connect and therefore runs after this one – so read the
  // payload once the event has finished propagating.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setTimeout(() => {
      wrapper.querySelector('#output').textContent = editor.hasAttribute('invalid')
        ? 'Submit blocked – fix the errors above.'
        : new FormData(form).get('payload');
    });
  });

  return wrapper;
};
Default.parameters = {
  docs: {
    description: {
      story:
        'Type invalid JSON or an unknown `role` to see live validation. Leaving the field pretty-prints it, submitting minifies it – a schema violation blocks the submit.',
    },
  },
};

/**
 * The same schema, but fetched via `schema-src`. The file lives in
 * `stories/public/schemas/` – Storybook serves that directory at the site root.
 */
export const SchemaFromUrl = () =>
  wrap(`
    <json-editor schema-src="/schemas/person.schema.json">
      <textarea name="payload" rows="8">{"name": "Kay", "role": "Lead"}</textarea>
    </json-editor>
  `);
SchemaFromUrl.parameters = {
  docs: {
    description: {
      story:
        'Schema loaded over the network from `/schemas/person.schema.json` (served from `stories/public/`). A failing request is reported in the toolbar status instead of silently validating nothing.',
    },
  },
};

/** Content that parses but violates the schema – renders the error list on load. */
export const InvalidValue = () =>
  wrap(`
    <json-editor>
      <textarea name="payload" rows="8">{"name": "", "role": "Astronaut", "extra": true}</textarea>
      ${inlineSchema()}
    </json-editor>
  `);
InvalidValue.parameters = {
  docs: {
    description: {
      story:
        'Three violations at once: empty `name`, `role` outside the enum and an additional property. Each schema error is listed below the editor and the host gets the `is-invalid` class.',
    },
  },
};

/** Pretty-print depth is controlled by the `indent` attribute (default `2`). */
export const CustomIndent = () =>
  wrap(`
    <json-editor indent="4">
      <textarea name="payload" rows="10">{"name":"Kay","role":"Support","tags":["a","b"]}</textarea>
    </json-editor>
  `);
CustomIndent.parameters = {
  docs: {
    description: {
      story:
        'No schema is attached here, so only syntax is validated. The minified input is pretty-printed with four spaces on connect.',
    },
  },
};

/**
 * With `class="form-control"` the component picks up the Bootstrap CSS variables
 * and mirrors `is-valid` / `is-invalid` onto the host.
 */
export const WithBootstrap = () =>
  wrap(`
    <link rel="stylesheet" href="${BOOTSTRAP_CSS}" crossorigin="anonymous">
    <form class="was-validated">
      <label class="form-label" for="payload-bs">Person</label>
      <json-editor class="form-control" schema-src="/schemas/person.schema.json">
        <textarea id="payload-bs" name="payload-bs" rows="8">{"name": "Kay", "role": "Lead"}</textarea>
      </json-editor>
      <button type="submit" class="btn btn-primary mt-3">Save</button>
    </form>
  `);
WithBootstrap.parameters = {
  docs: {
    description: {
      story:
        'Bootstrap interop: the shadow styles read `--bs-*` variables, so the editor matches a native `<textarea class="form-control">`, including focus ring and valid/invalid colouring.',
    },
  },
};

/** All colours and metrics are CSS custom properties – here a dark theme. */
export const Theming = () =>
  wrap(`
    <json-editor class="dark">
      <textarea name="payload" rows="8">{"name":"Kay","role":"Developer","active":true,"score":42,"nickname":null}</textarea>
      ${inlineSchema()}
    </json-editor>
    <style>
      json-editor.dark {
        --json-editor-height: 12rem;
        --json-editor-bg: #0d1117;
        --json-editor-border: #30363d;
        --json-editor-radius: 8px;
        --json-editor-fg: #c9d1d9;
        --json-editor-key: #79c0ff;
        --json-editor-string: #a5d6ff;
        --json-editor-number: #ffa657;
        --json-editor-keyword: #ff7b72;
        --json-editor-punct: #8b949e;
        --json-editor-ok: #3fb950;
        --json-editor-error: #f85149;
      }
    </style>
  `);
Theming.parameters = {
  docs: {
    description: {
      story:
        'Custom properties inherit through the shadow boundary, so themes are set on the host element – no `::part` needed.',
    },
  },
};
