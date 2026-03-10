import '../dist/index.js';

export default {
  title: 'Components/Tabs/Simple',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Simple Tabs Web Component. Provide tab panels as slotted elements with a "title" attribute.',
      },
    },
  },
  argTypes: {
    activeIndex: {
      control: { type: 'number', min: 0 },
      description: 'Initial active tab index.',
    },
  },
};

const Template = ({ activeIndex }) => {
  const host = document.createElement('div');
  host.style.minWidth = '500px';

  host.innerHTML = `
    <fucodo-tabs-simple>
      <div title="Tab 1" ${activeIndex === 0 ? 'active' : ''}>
        <h3>Content 1</h3>
        <p>This is the content for the first tab.</p>
      </div>
      <div title="Tab 2" ${activeIndex === 1 ? 'active' : ''}>
        <h3>Content 2</h3>
        <p>This is the content for the second tab.</p>
      </div>
      <div title="Tab 3" ${activeIndex === 2 ? 'active' : ''}>
        <h3>Content 3</h3>
        <p>This is the content for the third tab.</p>
      </div>
    </fucodo-tabs-simple>
  `;

  return host;
};

export const Default = Template.bind({});
Default.args = {
  activeIndex: 0,
};

export const SecondTabActive = Template.bind({});
SecondTabActive.args = {
  activeIndex: 1,
};
