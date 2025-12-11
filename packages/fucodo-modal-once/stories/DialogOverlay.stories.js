import '../dist/index';

export default {
  title: 'Components/fucodo-modal-once',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
      buttonText: { control: { type: 'text' } },
      autoOpen: { control: { type: 'boolean' } },
      cookieName: { control: { type: 'text' } },
      cookieDays: { control: { type: 'number', min: 0, step: 1 } },
  },
};

// Inject minimal Bootstrap-inspired styles once per docs/session
function ensureBaseStyles() {
  const STYLE_ID = 'fucodo-dialogoverlay-demo-styles';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* Minimal Bootstrap-like button styles for demo */
    .btn { display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .375rem; transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out; }
    .btn-primary { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
    .btn-primary:hover { color: #fff; background-color: #0b5ed7; border-color: #0a58ca; }
    .btn:disabled, .btn.disabled { opacity: .65; }
    .dialog-overlay::backdrop {
      background: rgba(0,0,0,.5);
      border: 0;
      border-radius: .5rem;
      padding: 0;
    }
  `;
  document.head.appendChild(style);
}

// Return only the component element markup via a template, avoiding inline <style> in story output
const Template = ({
  buttonText = 'close',
  autoOpen = true,
  cookieName = '',
  cookieDays = 0,
}) => {
  ensureBaseStyles();

  const autoVal = autoOpen ? '1' : '0';
  const cookieNameAttr = cookieName ? ` data-cookie-name="${String(cookieName)}"` : '';
  const cookieDaysAttr = Number(cookieDays) ? ` data-cookie-days="${Number(cookieDays)}"` : '';

  const tpl = document.createElement('template');
  tpl.innerHTML = `
    <fucodo-modal-once data-auto-open="${autoVal}"${cookieNameAttr}${cookieDaysAttr}>
      <dialog class="dialog-overlay">
        <form method="dialog">
          <button value="close" class="dialog-close-btn btn btn-primary">${String(buttonText)}</button>
        </form>
        <div class="dialog-content">
            Overlay shown once
        </div>
      </dialog>
    </fucodo-modal-once>
  `;
  return tpl.content.firstElementChild;
};

export const Default = Template.bind({});
Default.args = {
  buttonText: 'close',
  autoOpen: true,
  cookieName: '',
  cookieDays: 0,
};
