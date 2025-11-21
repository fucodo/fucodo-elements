import '../dist/index';
import '../../spinner/dist/index';

export default {
  title: 'Components/Fundamentals/ClickIndicator/With spinner',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activeClass: { control: { type: 'text' } },
    duration: { control: { type: 'number' } },
    href: { control: { type: 'text' } },
    label: { control: { type: 'text' } },
    spinnerSize: { control: { type: 'number', min: 8, step: 1 } },
  },
};

// Inject minimal Bootstrap-inspired styles once per docs/session
function ensureBaseStyles() {
  const STYLE_ID = 'fucodo-clickindicator-demo-styles';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    /* Minimal Bootstrap-like button styles for demo */
    .btn { display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .375rem; transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out; }
    .btn-primary { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
    .btn-primary:hover { color: #fff; background-color: #0b5ed7; border-color: #0a58ca; }
    .btn:disabled, .btn.disabled { opacity: .65; }
    .sl-btn { display: inline-flex; gap: .5rem; align-items: center; }
    /* Loading state helper */
    .is-loading { pointer-events: none; opacity: .9; }
  `;
  document.head.appendChild(style);
}

// Ensure rules that toggle loading vs notLoading indicators for the provided activeClass
function ensureToggleStyles(activeClass) {
  const id = `fucodo-clickindicator-toggle-${activeClass}`;
  if (document.getElementById(id)) return;
  // Remove any previous toggle styles to avoid conflicts if the arg changes while interacting
  const prev = document.querySelector('style[id^="fucodo-clickindicator-toggle-"]');
  if (prev) prev.remove();
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    .loadingIndicator { display: none; }
    .notLoadingIndicator { display: inline-block; }
    .${activeClass} .loadingIndicator { display: inline-block; }
    .${activeClass} .notLoadingIndicator { display: none; }
  `;
  document.head.appendChild(style);
}

const Template = ({
  activeClass = 'is-loading',
  duration = 30000,
  href = '#',
  label = 'Bestätigen',
  spinnerSize = 12,
}) => {
  ensureBaseStyles();
  ensureToggleStyles(String(activeClass));

  const tpl = document.createElement('template');
  tpl.innerHTML = `
    <fucodo-loading-action active-class="${String(activeClass)}" duration="${Number(duration)}">
      <a class="btn btn-primary sl-btn sl-btn--constructive" href="${String(href)}">
        <span class="loadingIndicator"><span class="spinner-wrap" style="display:inline-flex; width:${Number(spinnerSize)}px; height:${Number(spinnerSize)}px; align-items:center; justify-content:center;"><fucodo-spinner size="${Number(spinnerSize)}"></fucodo-spinner></span></span>
        <span class="notLoadingIndicator">
          <span style="display:inline-block; width:16px; height:16px; fill:currentColor;">
            <?xml version="1.0"?>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16" style="display:block;">
              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
            </svg>
          </span>
        </span>
        <span>${String(label)}</span>
      </a>
    </fucodo-loading-action>
  `;
  return tpl.content.firstElementChild;
};

export const WithSpinner = Template.bind({});
WithSpinner.args = {
  activeClass: 'is-loading',
  duration: 30000,
  href: '#',
  label: 'Confirm',
  spinnerSize: 12,
};
