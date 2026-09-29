import '../dist/index.js';
// Registers <json-editor>, which the tree editor then uses for its JSON view
// (highlighting + validation against the same schema).
import '../../fucodo-json-editor/dist/index.js';

const BOOTSTRAP_CSS =
  'https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css';

/**
 * Schema for a list of SSO applications. Shows most of the supported
 * constructs: $defs/$ref, enum, formats, required, additionalProperties,
 * if/then/else depending on the current value, anyOf and x-summary.
 */
const APPLICATIONS_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'array',
  items: { $ref: '#/$defs/application' },
  $defs: {
    application: {
      type: 'object',
      title: 'Application',
      'x-summary': ['name', 'type'],
      required: ['name', 'type'],
      properties: {
        name: { type: 'string', title: 'Display name', minLength: 1, examples: ['Wiki'] },
        type: { type: 'string', title: 'Protocol', enum: ['oidc', 'saml'], default: 'oidc' },
        enabled: { type: 'boolean', title: 'Enabled', default: true },
        domain: { type: 'string', format: 'uri', title: 'Base URL', examples: ['https://wiki.example.com'] },
        contact: {
          title: 'Contact',
          anyOf: [
            { const: '', title: 'none' },
            { type: 'string', format: 'email', title: 'e-mail' },
          ],
        },
        tags: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
      allOf: [
        {
          if: { properties: { type: { const: 'oidc' } } },
          then: {
            required: ['clientId', 'redirectUris'],
            properties: {
              clientId: { type: 'string', title: 'Client ID', minLength: 3 },
              redirectUris: { type: 'array', minItems: 1, items: { type: 'string', format: 'uri' } },
            },
          },
          else: {
            required: ['entityId'],
            properties: {
              entityId: { type: 'string', format: 'uri', title: 'SAML entity ID' },
              signAssertions: { type: 'boolean', default: true },
            },
          },
        },
      ],
    },
  },
};

const APPLICATIONS = [
  {
    name: 'Wiki',
    type: 'oidc',
    enabled: true,
    domain: 'https://wiki.example.com',
    clientId: 'wiki-client',
    redirectUris: ['https://wiki.example.com/callback'],
  },
  {
    name: 'Payroll',
    type: 'saml',
    enabled: false,
    entityId: 'https://payroll.example.com/saml',
    signAssertions: true,
  },
];

/** Builds a `<script type="application/schema+json">` child for a given schema object. */
const inlineSchema = (schema = APPLICATIONS_SCHEMA) =>
  `<script type="application/schema+json">${JSON.stringify(schema, null, 2)}<\/script>`;

/** Textarea content – escaped so the JSON survives innerHTML. */
const json = (value) =>
  JSON.stringify(value).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const wrap = (html) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = html;
  return wrapper;
};

export default {
  title: 'Apps/Editors/JSON Tree',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Schema-driven tree/table editor (key | value | type | actions) as progressive enhancement for a JSON `<textarea>`. The JSON Schema is mandatory – without it the plain `<textarea>` stays visible.',
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
      <json-tree-editor>
        <textarea name="payload" rows="8">${json(APPLICATIONS)}</textarea>
        ${inlineSchema()}
      </json-tree-editor>
      <button type="submit">Save</button>
    </form>
    <h3>Submitted value (minified)</h3>
    <pre id="output"><em>nothing submitted yet</em></pre>
    <h3>Events</h3>
    <pre id="events"><em>waiting…</em></pre>
    <style>
      json-tree-editor { display: block; margin-bottom: 1rem; }
      pre { background: #f6f8fa; padding: .5rem; border-radius: 4px; overflow-x: auto; max-height: 12rem; }
      h3 { font-size: .9rem; margin-bottom: .25rem; }
    </style>
  `);

  const form = wrapper.querySelector('#demo-form');
  const editor = wrapper.querySelector('json-tree-editor');
  const events = wrapper.querySelector('#events');
  const log = (line) => {
    if (events.querySelector('em')) events.textContent = '';
    events.textContent += `${line}\n`;
    events.scrollTop = events.scrollHeight;
  };

  editor.addEventListener('json-tree-editor:change', (event) =>
    log(`json-tree-editor:change ${JSON.stringify(event.detail.value)}`)
  );
  editor.addEventListener('json-tree-editor:valid', () => log('json-tree-editor:valid'));
  editor.addEventListener('json-tree-editor:invalid', (event) =>
    log(`json-tree-editor:invalid ${event.detail.errors.map((e) => `${e.pointer || '/'}: ${e.message}`).join(' | ')}`)
  );

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
        'Switch the `type` of an entry between `oidc` and `saml` – the offered and required fields change immediately (`if`/`then`/`else`). Add entries, reorder, duplicate or remove them, and submit: invalid content blocks the submit and jumps to the first error, valid content is sent minified.',
    },
  },
};

/**
 * Schema fetched via `schema-src`. The file lives in `stories/public/schemas/` –
 * Storybook serves that directory at the site root.
 */
export const SchemaFromUrl = () =>
  wrap(`
    <json-tree-editor schema-src="/schemas/person.schema.json">
      <textarea name="payload" rows="6">{"name": "Kay", "role": "Lead"}</textarea>
    </json-tree-editor>
  `);
SchemaFromUrl.parameters = {
  docs: {
    description: {
      story:
        'Schema loaded over the network from `/schemas/person.schema.json` (served from `stories/public/`). `role` is an `enum` and therefore rendered as a select; both fields are required and cannot be removed.',
    },
  },
};

/** Content that parses but violates the schema – rows are marked on load. */
export const InvalidValue = () =>
  wrap(`
    <json-tree-editor expand-depth="2">
      <textarea name="payload" rows="6">${json([
        { name: '', type: 'oidc', clientId: 'x', domain: 'not a url', legacy: true },
        { name: 'Payroll', type: 'saml' },
      ])}</textarea>
      ${inlineSchema()}
    </json-tree-editor>
  `);
InvalidValue.parameters = {
  docs: {
    description: {
      story:
        'Empty `name`, too short `clientId`, invalid URL, a forbidden extra key and missing required fields (`redirectUris`, `entityId`). Each message sits right below its row, the error list at the bottom jumps to the row, and “Fehlende Pflichtfelder ergänzen” fills in the missing fields.',
    },
  },
};

/** `anyOf` variants and multi-type values get a switch in the type column. */
export const Variants = () =>
  wrap(`
    <json-tree-editor>
      <textarea name="payload" rows="6">${json({ port: 8080, fallback: null, contact: 'ops@example.com' })}</textarea>
      ${inlineSchema({
        type: 'object',
        properties: {
          port: { type: ['integer', 'string'], title: 'Port or named service', minimum: 1 },
          fallback: { type: ['string', 'null'], format: 'uri' },
          contact: {
            anyOf: [
              { const: '', title: 'none' },
              { type: 'string', format: 'email', title: 'e-mail' },
              { type: 'object', title: 'person', required: ['name'], properties: { name: { type: 'string' }, phone: { type: 'string' } } },
            ],
          },
        },
      })}
    </json-tree-editor>
  `);
Variants.parameters = {
  docs: {
    description: {
      story:
        'The matching `anyOf`/`oneOf` variant is detected automatically. Choosing another variant or type converts the value where possible and falls back to the variant default otherwise.',
    },
  },
};

/** Without a schema the component refuses to enhance and keeps the textarea usable. */
export const MissingSchema = () =>
  wrap(`
    <json-tree-editor>
      <textarea name="payload" rows="4">{"name": "Kay"}</textarea>
    </json-tree-editor>
  `);
MissingSchema.parameters = {
  docs: {
    description: {
      story:
        'The schema is mandatory. When it is missing or fails to load, a notice is shown and the original `<textarea>` stays visible and submittable.',
    },
  },
};

/** Broken JSON in the textarea opens the raw JSON view so it can be repaired. */
export const BrokenJson = () =>
  wrap(`
    <json-tree-editor>
      <textarea name="payload" rows="4">[{"name": "Wiki", "type": "oidc",}]</textarea>
      ${inlineSchema()}
    </json-tree-editor>
  `);
BrokenJson.parameters = {
  docs: {
    description: {
      story:
        'The trailing comma makes the content unparsable. The component stays in the JSON view (rendered with `<json-editor>` when it is registered) until the syntax error is fixed.',
    },
  },
};

/** `allow-invalid` lets the form submit even with schema violations. */
export const AllowInvalid = () => {
  const wrapper = wrap(`
    <form>
      <json-tree-editor allow-invalid>
        <textarea name="payload" rows="4">${json([{ name: 'Draft', type: 'oidc' }])}</textarea>
        ${inlineSchema()}
      </json-tree-editor>
      <button type="submit">Save draft</button>
    </form>
    <pre id="output"><em>nothing submitted yet</em></pre>
  `);
  const form = wrapper.querySelector('form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    setTimeout(() => {
      wrapper.querySelector('#output').textContent = new FormData(form).get('payload');
    });
  });
  return wrapper;
};
AllowInvalid.parameters = {
  docs: {
    description: {
      story:
        'Errors are still shown, but the submit is not blocked – useful for saving drafts. The value is minified either way.',
    },
  },
};

/** Driving the component through its JavaScript API. */
export const JavaScriptApi = () => {
  const wrapper = wrap(`
    <p>
      <button type="button" data-call="expandAll">expandAll()</button>
      <button type="button" data-call="collapseAll">collapseAll()</button>
      <button type="button" data-call="validate">validate()</button>
      <button type="button" data-call="reveal">reveal('/1/entityId')</button>
      <button type="button" data-call="mode">mode = 'json' / 'tree'</button>
      <button type="button" data-call="value">value = [ … ]</button>
    </p>
    <json-tree-editor expand-depth="0">
      <textarea name="payload">${json(APPLICATIONS)}</textarea>
      ${inlineSchema()}
    </json-tree-editor>
    <pre id="result"><em>click a button</em></pre>
  `);
  const editor = wrapper.querySelector('json-tree-editor');
  const result = wrapper.querySelector('#result');
  const calls = {
    expandAll: () => editor.expandAll(),
    collapseAll: () => editor.collapseAll(),
    validate: () => editor.validate(),
    reveal: () => editor.reveal('/1/entityId'),
    mode: () => (editor.mode = editor.mode === 'tree' ? 'json' : 'tree'),
    value: () => (editor.value = [{ name: 'New app', type: 'saml', entityId: 'https://new.example.com' }]),
  };
  wrapper.querySelector('p').addEventListener('click', (event) => {
    const call = event.target.closest('button')?.dataset.call;
    if (!call) return;
    const returned = calls[call]();
    result.textContent = `${call} → ${JSON.stringify(returned)}\n\n.value = ${JSON.stringify(editor.value, null, 2)}`;
  });
  return wrapper;
};
JavaScriptApi.parameters = {
  docs: {
    description: {
      story:
        'Starts fully collapsed via `expand-depth="0"`. `reveal()` expands down to a JSON Pointer and focuses the row.',
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
      <label class="form-label" for="payload-bs">Applications</label>
      <json-tree-editor class="form-control">
        <textarea id="payload-bs" name="payload-bs" rows="6">${json(APPLICATIONS)}</textarea>
        ${inlineSchema()}
      </json-tree-editor>
      <button type="submit" class="btn btn-primary mt-3">Save</button>
    </form>
  `);
WithBootstrap.parameters = {
  docs: {
    description: {
      story:
        'Bootstrap interop: the shadow styles read `--bs-*` variables, so the editor matches native form controls, including focus ring and valid/invalid colouring.',
    },
  },
};

/** All colours and metrics are CSS custom properties – here a dark theme. */
export const Theming = () =>
  wrap(`
    <json-tree-editor class="dark">
      <textarea name="payload" rows="6">${json(APPLICATIONS)}</textarea>
      ${inlineSchema()}
    </json-tree-editor>
    <style>
      json-tree-editor.dark {
        --json-tree-editor-max-height: 20rem;
        --json-tree-editor-bg: #0d1117;
        --json-tree-editor-border: #30363d;
        --json-tree-editor-radius: 8px;
        --json-tree-editor-fg: #c9d1d9;
        --json-tree-editor-muted: #8b949e;
        --json-tree-editor-key: #79c0ff;
        --json-tree-editor-ok: #3fb950;
        --json-tree-editor-error: #f85149;
        --json-tree-editor-focus-color: #58a6ff;
        --json-tree-editor-indent: 1.5rem;
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
