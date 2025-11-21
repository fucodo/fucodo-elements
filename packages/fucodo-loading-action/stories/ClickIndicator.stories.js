import '../dist/index';

export default {
  title: 'Components/Fundamentals/fucodo-loading-action/Default',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activeClass: { control: { type: 'text' } },
    duration: { control: { type: 'number' } },
    event: { control: { type: 'text' } },
  },
};

// Minimal Bootstrap-inspired styles injected once for the demo look
function ensureBaseStyles() {
  const STYLE_ID = 'fucodo-clickindicator-demo-styles';
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .btn { display: inline-block; font-weight: 400; text-align: center; vertical-align: middle; user-select: none; border: 1px solid transparent; padding: .375rem .75rem; font-size: 1rem; line-height: 1.5; border-radius: .375rem; transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out; }
    .btn-primary { color: #fff; background-color: #0d6efd; border-color: #0d6efd; }
    .btn-primary:hover { color: #fff; background-color: #0b5ed7; border-color: #0a58ca; }
    .btn:disabled, .btn.disabled { opacity: .65; }
  `;
  document.head.appendChild(style);
}

// Return a real HTMLElement to avoid any editors rendering the template as literal text,
// while still using args directly in the markup (no extra attribute-setting calls).
const Template = ({ activeClass = 'is-loading', duration = 2500, event = 'action-finished' }) => {
  ensureBaseStyles();
  const tpl = document.createElement('template');
  tpl.innerHTML = `
    <fucodo-loading-action
      active-class="${String(activeClass)}"
      duration="${Number(duration)}"
      event="${String(event)}"
    >
      <button class="btn btn-primary">Speichern</button>
    </fucodo-loading-action>
  `;
  return tpl.content.firstElementChild;
};

export const Default = Template.bind({});
Default.args = {
  activeClass: 'is-loading',
  duration: 2500,
  event: 'action-finished',
};
