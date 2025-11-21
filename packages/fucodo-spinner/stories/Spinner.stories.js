import '../dist/index';

export default {
  title: 'Components/Fundamentals/fucodo-spinner',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'number', min: 8, step: 1 } },
    enabled: { control: { type: 'boolean' } },
    color: { control: { type: 'color' } },
  },
};

const Template = ({ size = 16, enabled = true, color }) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <fucodo-spinner enabled="1">
  `;
  const el = wrapper.querySelectorAll('fucodo-spinner').item(0);
  el.setAttribute('size', String(size));
  el.setAttribute('enabled', enabled ? '1' : '0');
  if (color) el.setAttribute('color', color);
  return el;
};

export const Default = Template.bind({});
Default.args = { size: 32, enabled: true };
