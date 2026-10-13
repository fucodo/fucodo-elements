import '../dist/index';

export default {
  title: 'Components/fucodo-confirm',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    dialogTitle: { control: { type: 'text' } },
    message: { control: { type: 'text' } },
    confirmLabel: { control: { type: 'text' } },
    cancelLabel: { control: { type: 'text' } },
    variant: { control: { type: 'select' }, options: ['success', 'danger', 'neutral'] },
    confirmValue: { control: { type: 'text' } },
    valueLabel: { control: { type: 'text' } },
    staticBackdrop: { control: { type: 'boolean' } },
    disabled: { control: { type: 'boolean' } },
  },
};

// Inject minimal Bootstrap-inspired styles once per docs/session
function ensureBaseStyles() {
  const STYLE_ID = 'fucodo-confirm-demo-styles';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .btn { display: inline-block; padding: .375rem .75rem; border-radius: .375rem; border: 1px solid #6c757d; background: #fff; color: #212529; text-decoration: none; cursor: pointer; font: inherit; line-height: 1.5; }
    .btn-danger { background: #dc3545; border-color: #dc3545; color: #fff; }
    .btn-success { background: #198754; border-color: #198754; color: #fff; }
    .demo-log { margin-top: 1rem; background: #f8f9fa; padding: .75rem; border-radius: .375rem; font-family: monospace; font-size: .85rem; white-space: pre-wrap; min-height: 1.5rem; }
    .demo-list { padding-left: 1.25rem; }
    .demo-list li { margin-bottom: .5rem; }
  `;
  document.head.appendChild(style);
}

// Wrap the demo markup together with a small event log
function render(html, setup = () => {}) {
  ensureBaseStyles();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `${html}<div class="demo-log"></div>`;
  const logEl = wrapper.querySelector('.demo-log');
  const log = (msg) => { logEl.textContent += msg + '\n'; };
  setup(wrapper, log);
  return wrapper;
}

// Keep the demos inside the Storybook iframe: log links instead of following them
function logNavigation(wrapper, log) {
  wrapper.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link || e.defaultPrevented) return;
    e.preventDefault();
    log('navigiert zu ' + link.getAttribute('href'));
  });
}

const attr = (name, value) => (value ? ` ${name}="${String(value).replace(/"/g, '&quot;')}"` : '');

const Template = ({
  dialogTitle = '',
  message = '',
  confirmLabel = '',
  cancelLabel = '',
  variant = 'success',
  confirmValue = '',
  valueLabel = '',
  staticBackdrop = false,
  disabled = false,
}) => render(
  `<fucodo-confirm-action${attr('dialog-title', dialogTitle)}${attr('message', message)}${attr('confirm-label', confirmLabel)}${attr('cancel-label', cancelLabel)}${attr('variant', variant)}${attr('confirm-value', confirmValue)}${attr('value-label', valueLabel)}${staticBackdrop ? ' static-backdrop' : ''}${disabled ? ' disabled' : ''}>
    <a class="btn" href="/weiter">Weiter</a>
  </fucodo-confirm-action>`,
  (wrapper, log) => {
    logNavigation(wrapper, log);
    wrapper.addEventListener('fucodo-confirm-action:cancel', () => log('abgebrochen'));
  },
);

export const Default = Template.bind({});
Default.args = {
  dialogTitle: 'Bitte bestätigen',
  message: 'Wirklich zur nächsten Seite wechseln?',
  confirmLabel: 'Bestätigen',
  cancelLabel: 'Abbrechen',
  variant: 'success',
  confirmValue: '',
  valueLabel: '',
  staticBackdrop: false,
  disabled: false,
};

export const FormSubmit = () => render(
  `<form action="/speichern">
    <fucodo-confirm-action dialog-title="Speichern?" message="Die Änderungen werden sofort veröffentlicht." confirm-label="Veröffentlichen">
      <button class="btn btn-success" type="submit">Speichern</button>
    </fucodo-confirm-action>
  </form>`,
  (wrapper, log) => {
    wrapper.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      log('Formular abgesendet');
    });
  },
);
FormSubmit.storyName = 'Form submit';

export const TypeToConfirm = () => render(
  `<fucodo-confirm-action
    variant="danger"
    dialog-title="Repository löschen"
    message="Diese Aktion kann nicht rückgängig gemacht werden. Alle Issues, Wikis und Merge Requests gehen verloren."
    confirm-value="fucodo/fucodo-elements"
    value-label="Zum Bestätigen bitte {value} eingeben:"
    confirm-label="Ich verstehe, Repository löschen"
    static-backdrop>
    <button class="btn btn-danger" type="button">Repository löschen</button>
  </fucodo-confirm-action>`,
  (wrapper, log) => {
    wrapper.querySelector('button').addEventListener('click', () => log('onclick: Repository gelöscht'));
  },
);
TypeToConfirm.storyName = 'Type value to confirm';

export const PerTriggerOverrides = () => render(
  `<fucodo-confirm-action variant="danger" dialog-title="Eintrag löschen" confirm-label="Löschen" trigger="[data-delete]">
    <ul class="demo-list">
      <li>Kreisverband Dresden
        <button class="btn" data-delete data-id="1" data-confirm-message="„Kreisverband Dresden“ löschen?">Löschen</button></li>
      <li>Landesverband Sachsen
        <button class="btn" data-delete data-id="2" data-confirm-message="„Landesverband Sachsen“ löschen?" data-confirm-value="Sachsen">Löschen</button></li>
      <li>Dieser Link wird <em>nicht</em> abgefangen: <a href="/frei">frei</a></li>
    </ul>
  </fucodo-confirm-action>`,
  (wrapper, log) => {
    logNavigation(wrapper, log);
    wrapper.addEventListener('fucodo-confirm-action:confirm', (e) => log('Löschen bestätigt für id=' + e.detail.trigger.dataset.id));
    wrapper.addEventListener('fucodo-confirm-action:cancel', () => log('abgebrochen'));
  },
);
PerTriggerOverrides.storyName = 'List with per-trigger overrides';

export const RichBodyAndAjax = () => render(
  `<fucodo-confirm-action variant="neutral" dialog-title="Cache leeren">
    <div slot="body">
      <p>Folgende Caches werden geleert:</p>
      <ul><li>Seiten-Cache</li><li>Bild-Cache</li></ul>
    </div>
    <a class="btn" href="/cache/flush">Cache leeren</a>
  </fucodo-confirm-action>`,
  (wrapper, log) => {
    logNavigation(wrapper, log);
    // Prevent replaying the link click and do something else instead
    wrapper.addEventListener('fucodo-confirm-action:confirm', (e) => {
      e.preventDefault();
      log('Cache per fetch() geleert (kein Seitenwechsel)');
    });
  },
);
RichBodyAndAjax.storyName = 'Rich body slot + AJAX instead of click';

export const Programmatic = () => render(
  `<button class="btn" type="button">ConfirmAction.confirm()</button>`,
  (wrapper, log) => {
    wrapper.querySelector('button').addEventListener('click', async () => {
      const ConfirmAction = customElements.get('fucodo-confirm-action');
      const ok = await ConfirmAction.confirm({
        title: 'Programmatische Abfrage',
        message: 'Weiter?',
        confirmValue: 'ja',
        variant: 'success',
      });
      log('ConfirmAction.confirm() → ' + ok);
    });
  },
);
Programmatic.storyName = 'Programmatic (async window.confirm)';
