import '../dist/index';

export default {
  title: 'Components/Fundamentals/ClickIndicator',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activeClass: { control: { type: 'text' } },
    duration: { control: { type: 'number' } },
    event: { control: { type: 'text' } },
  },
};

// Return a real HTMLElement to avoid any editors rendering the template as literal text,
// while still using args directly in the markup (no extra attribute-setting calls).
const Template = ({ activeClass = 'is-loading', duration = 2500, event = 'action-finished' }) => {
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
