import '../packages/spinner/dist/index';

export default {
  title: 'Components/Spinner',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: { control: { type: 'number', min: 8, step: 1 } },
    enabled: { control: { type: 'boolean' } },
    color: { control: { type: 'color' } },
  },
};

export const Default = () => {
  const wrapper = document.createElement('main');

  wrapper.innerHTML = `
    <fucodo-spinner enabled="1">
  `;

  return wrapper;
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

export const Small = Template.bind({});
Small.args = {
  size: 16,
  enabled: true,
};

export const Medium = Template.bind({});
Medium.args = {
  size: 32,
  enabled: true,
};

export const LargeRedEnabled = Template.bind({});
LargeRedEnabled.args = {
  size: 100,
  enabled: true,
  color: 'red',
};

export const LargeRedDisabled = Template.bind({});
LargeRedDisabled.args = {
  size: 100,
  enabled: false,
  color: 'red',
};