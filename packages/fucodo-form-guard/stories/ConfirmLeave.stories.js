import '../dist/index';
import 'fucodo.confirm/dist';

export default {
  title: 'Components/fucodo-form-guard',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    dialogTitle: { control: { type: 'text' } },
    message: { control: { type: 'text' } },
    confirmLabel: { control: { type: 'text' } },
    cancelLabel: { control: { type: 'text' } },
    variant: { control: { type: 'select' }, options: ['success', 'danger', 'neutral'] },
    staticBackdrop: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
};

// Inject minimal Bootstrap-inspired styles once per docs/session
function ensureBaseStyles() {
  const STYLE_ID = 'fucodo-form-guard-demo-styles';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .demo-guard { display: grid; gap: 1rem; max-width: 760px; }
    .demo-guard form { display: grid; gap: .5rem; padding: 1rem; border: 1px solid #dee2e6; border-radius: .5rem; }
    .demo-guard form[data-dirty] { border-color: #dc3545; box-shadow: inset 4px 0 0 #dc3545; }
    .demo-guard label { display: grid; gap: .25rem; }
    .demo-guard label.inline { display: flex; align-items: center; gap: .5rem; }
    .demo-guard input:not([type=checkbox]), .demo-guard select, .demo-guard textarea { font: inherit; padding: .375rem .75rem; border: 1px solid #ced4da; border-radius: .375rem; }
    .demo-guard .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
    .demo-guard .btn { display: inline-block; padding: .375rem .75rem; border-radius: .375rem; border: 1px solid #6c757d; background: #fff; color: #212529; text-decoration: none; cursor: pointer; font: inherit; line-height: 1.5; }
    .demo-guard .btn-success { background: #198754; border-color: #198754; color: #fff; }
    .demo-guard .btn-danger { background: #dc3545; border-color: #dc3545; color: #fff; }
    .demo-guard .hint { color: #6c757d; font-size: .875rem; margin: 0; }
    .demo-guard .status { margin: 0; padding: .5rem .75rem; border-radius: .375rem; background: #f8f9fa; }
    .demo-guard .status[data-dirty] { background: #f8d7da; color: #842029; }
    .demo-guard .demo-log { background: #f8f9fa; padding: .75rem; border-radius: .375rem; font-family: monospace; font-size: .85rem; white-space: pre-wrap; min-height: 1.5rem; }
  `;
  document.head.appendChild(style);
}

const attr = (name, value) => (value ? ` ${name}="${String(value).replace(/"/g, '&quot;')}"` : '');

let storyCount = 0;

// Text of the field's <label>, without the text of controls nested inside it (e.g. <option>s)
function fieldLabel(field) {
  const label = field.labels?.[0];
  if (!label) return '';
  const clone = label.cloneNode(true);
  clone.querySelectorAll('input, select, textarea, button').forEach((el) => el.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

/**
 * Wraps the demo markup with a status line and an event log.
 * `{guard}` in the markup is replaced by a story-unique selector value, so several
 * guards on the docs page only watch their own forms.
 * Navigation is logged instead of performed, to keep the demo inside the Storybook iframe.
 */
function render(html, setup = () => {}) {
  ensureBaseStyles();
  const id = `story-${++storyCount}`;
  const wrapper = document.createElement('div');
  wrapper.className = 'demo-guard';
  wrapper.innerHTML = `<p class="status">Keine ungespeicherten Änderungen</p>
    ${html.replaceAll('{guard}', id)}
    <div class="demo-log"></div>`;

  const guard = wrapper.querySelector('fucodo-confirm-leave');
  const status = wrapper.querySelector('.status');
  const logEl = wrapper.querySelector('.demo-log');
  const log = (msg) => { logEl.textContent += msg + '\n'; };

  guard.addEventListener('fucodo-confirm-leave:dirtychange', (e) => {
    status.toggleAttribute('data-dirty', e.detail.dirty);
    status.textContent = e.detail.dirty
      ? `Ungespeicherte Änderungen in ${e.detail.forms.length || 'keinem'} Formular(en)`
      : 'Keine ungespeicherten Änderungen';
    log('dirtychange: ' + e.detail.dirty);
  });
  // List affected forms (or, without data-title, their changed fields) in the dialog message
  guard.addEventListener('fucodo-confirm-leave:open', (e) => {
    const names = e.detail.forms.flatMap((f) => (
      f.dataset.title ? [f.dataset.title] : guard.dirtyFields(f).map(fieldLabel).filter(Boolean)
    ));
    if (names.length) e.detail.config.message += `\n\nBetroffen: ${names.join(', ')}`;
    log(`open (${e.detail.kind}) → ${e.detail.url}`);
  });
  guard.addEventListener('fucodo-confirm-leave:cancel', () => log('geblieben'));
  guard.addEventListener('fucodo-confirm-leave:confirm', () => log('verlassen'));

  // Links that got through all guards end up here
  wrapper.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented || link.getAttribute('href').startsWith('#')) return;
    e.preventDefault();
    log('navigiert zu ' + link.getAttribute('href'));
  });
  // Submits that got through the guard end up here
  wrapper.addEventListener('submit', (e) => {
    e.preventDefault();
    const label = e.submitter?.textContent.trim() || 'requestSubmit()';
    const title = e.target.dataset.title;
    log(`abgesendet${title ? ': ' + title : ''} (${label})`);
  });

  setup(wrapper, guard, log);
  return wrapper;
}

const Template = ({
  dialogTitle = '',
  message = '',
  confirmLabel = '',
  cancelLabel = '',
  variant = 'danger',
  staticBackdrop = false,
  disabled = false,
}) => render(
  `<fucodo-confirm-leave forms="form[data-guard='{guard}']" no-native-prompt${attr('dialog-title', dialogTitle)}${attr('message', message)}${attr('confirm-label', confirmLabel)}${attr('cancel-label', cancelLabel)}${attr('variant', variant)}${staticBackdrop ? ' static-backdrop' : ''}${disabled ? ' disabled' : ''}></fucodo-confirm-leave>

  <form data-guard="{guard}" data-title="Stammdaten" action="/stammdaten" data-leave-allow-submit="button[name=save]">
    <label>Name <input name="name" value="Kreisverband Dresden"></label>
    <label>Landesverband
      <select name="state"><option>Sachsen</option><option>Thüringen</option><option>Brandenburg</option></select>
    </label>
    <label class="inline"><input type="checkbox" name="active" checked> aktiv</label>
    <label>Filter (wird ignoriert) <input name="q" data-leave-ignore placeholder="tippen ändert nichts"></label>
    <div class="rows"></div>
    <div class="actions">
      <button type="button" class="btn" data-add-row>Feld dynamisch hinzufügen</button>
      <button class="btn btn-success" name="save" value="1">Speichern (erlaubt)</button>
      <button class="btn" name="preview" value="1">Vorschau (nicht erlaubt)</button>
      <button type="button" class="btn" data-ajax-save>Per AJAX speichern → markClean()</button>
    </div>
    <p class="hint">„Speichern“ steht auf der Whitelist und verlässt die Seite ohne Nachfrage.</p>
  </form>

  <div class="actions">
    <a class="btn" href="/seite-2">Link zu Seite 2</a>
    <a class="btn" href="/seite-3" data-leave-allow>Link mit data-leave-allow</a>
    <a class="btn" href="#abschnitt">Anker (bleibt auf der Seite)</a>
  </div>`,
  (wrapper, guard, log) => {
    const form = wrapper.querySelector('form');
    let rowCount = 0;
    wrapper.querySelector('[data-add-row]').addEventListener('click', () => {
      rowCount++;
      const label = document.createElement('label');
      label.innerHTML = `Zusatzfeld ${rowCount} <input name="extra${rowCount}" value="vorbelegt ${rowCount}">`;
      wrapper.querySelector('.rows').append(label);
    });
    wrapper.querySelector('[data-ajax-save]').addEventListener('click', () => {
      guard.markClean(form);
      log('Stammdaten per AJAX gespeichert');
    });
  },
);

export const Default = Template.bind({});
Default.args = {
  dialogTitle: 'Ungespeicherte Änderungen',
  message: 'Es gibt ungespeicherte Änderungen. Beim Verlassen der Seite gehen sie verloren.',
  confirmLabel: 'Seite verlassen',
  cancelLabel: 'Auf der Seite bleiben',
  variant: 'danger',
  staticBackdrop: false,
  disabled: false,
};

export const DynamicForms = () => render(
  `<fucodo-confirm-leave forms="form[data-guard='{guard}']" no-native-prompt></fucodo-confirm-leave>
  <div class="actions">
    <button type="button" class="btn" data-add-form>Formular hinzufügen</button>
    <a class="btn" href="/weiter">Seite verlassen</a>
  </div>
  <div class="forms" style="display: grid; gap: 1rem;"></div>
  <p class="hint">Neue Formulare werden automatisch überwacht. „Notiz speichern“ speichert per AJAX und ruft <code>markClean(form)</code> auf.</p>`,
  (wrapper, guard, log) => {
    let formCount = 0;
    wrapper.querySelector('[data-add-form]').addEventListener('click', () => {
      const nr = ++formCount;
      const form = document.createElement('form');
      form.dataset.guard = guard.getAttribute('forms').match(/'(.+)'/)[1];
      form.dataset.title = 'Notiz ' + nr;
      form.innerHTML = `<label>Notiz ${nr} <textarea name="note" rows="2"></textarea></label>
        <div class="actions"><button class="btn btn-success">Notiz speichern</button></div>`;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        guard.markClean(form);
        log(`Notiz ${nr} per AJAX gespeichert`);
      });
      wrapper.querySelector('.forms').append(form);
    });
  },
);
DynamicForms.storyName = 'Dynamically added forms';

export const WithConfirmAction = () => render(
  `<fucodo-confirm-leave forms="form[data-guard='{guard}']" no-native-prompt></fucodo-confirm-leave>
  <form data-guard="{guard}" data-title="Datensatz" action="/datensatz">
    <label>Bezeichnung <input name="title" value="Ändere mich"></label>
  </form>
  <div class="actions">
    <fucodo-confirm-action variant="danger" dialog-title="Datensatz löschen" message="Der Datensatz wird endgültig gelöscht." confirm-label="Löschen">
      <a class="btn btn-danger" href="/datensatz/loeschen">Löschen</a>
    </fucodo-confirm-action>
  </div>
  <p class="hint">Erst fragt <code>fucodo-confirm-action</code>, dann – bei ungespeicherten Änderungen – <code>fucodo-confirm-leave</code>.</p>`,
);
WithConfirmAction.storyName = 'Together with fucodo-confirm-action';

export const WithoutFormTitle = () => render(
  `<fucodo-confirm-leave forms="form[data-guard='{guard}']" no-native-prompt></fucodo-confirm-leave>
  <form data-guard="{guard}" action="/kontakt">
    <label>E-Mail <input name="email" type="email" value="info@example.org"></label>
    <label>Telefon <input name="phone" value="0351 123456"></label>
    <div class="actions"><button class="btn btn-success">Speichern</button></div>
  </form>
  <form data-guard="{guard}" action="/adresse">
    <label>Straße <input name="street" value="Musterstraße 1"></label>
    <label>Ort <input name="city" value="Dresden"></label>
    <input name="note" placeholder="Feld ohne Label">
    <div class="actions"><button class="btn btn-success">Speichern</button></div>
  </form>
  <div class="actions">
    <a class="btn" href="/weiter">Seite verlassen</a>
  </div>
  <p class="hint">Ohne <code>data-title</code> listet der Dialog die Labels der geänderten Felder auf.
    Felder ohne Label werden übersprungen – ist nur „Feld ohne Label“ geändert, entfällt der Hinweis ganz.
    Ohne Whitelist gilt jeder Submit als Speichern – außer das jeweils andere Formular hat ebenfalls Änderungen.</p>`,
);
WithoutFormTitle.storyName = 'Forms without data-title';
