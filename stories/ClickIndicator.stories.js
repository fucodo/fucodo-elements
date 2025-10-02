import '../packages/clickindicator/dist/index';

export default {
  title: 'Components/ClickIndicator',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    activeClass: { control: { type: 'text' } },
    duration: { control: { type: 'number' } },
    event: { control: { type: 'text' } },
  },
};

const Template = ({ activeClass = 'is-loading', duration = 2500, event = 'action-finished' }) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <fucodo-loading-action
      active-class="is-loading"
      duration="2500"
      event="action-finished"
    >
      <button class="btn btn-primary">Speichern</button>
    </fucodo-loading-action>
  `;
  const el = wrapper.querySelectorAll('fucodo-loading-action').item(0);
  el.setAttribute('active-class', String(activeClass));
  el.setAttribute('duration', Number(duration));
  el.setAttribute('event', String(event));
  return el;
};

export const Default = Template.bind({});
Default.args = {  };
