import '../dist/index';

export default {
  title: 'Form/fucodo-checkbox-toggle',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    target: { control: { type: 'text' }, description: 'CSS selector for inputs to toggle' },
    label: { control: { type: 'text' }, description: 'Inner text/content of the toggle element' },
  },
};

const Template = ({ target = '.demo-group input[type="checkbox"]', label = 'Toggle checkboxes' }) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <section class="demo">
      <div class="mb-2">
        <fucodo-checkbox-toggle data-toggle>Toggle</fucodo-checkbox-toggle>
      </div>
      <fieldset class="demo-group" style="display:inline-block; text-align:left; padding:12px; border:1px solid #ddd; border-radius:6px;">
        <legend style="font-size:0.9rem; padding:0 6px;">Example checkboxes</legend>
        <label style="display:block; margin:4px 0;"><input type="checkbox" name="features" value="a"> Feature A</label>
        <label style="display:block; margin:4px 0;"><input type="checkbox" name="features" value="b"> Feature B</label>
        <label style="display:block; margin:4px 0;"><input type="checkbox" name="features" value="c"> Feature C</label>
      </fieldset>
    </section>
  `;

  const toggle = wrapper.querySelector('[data-toggle]');
  if (toggle) {
    toggle.setAttribute('target', target);
    toggle.textContent = label || 'Toggle';
  }

  return wrapper;
};

export const Default = Template.bind({});
Default.args = {
  target: '.demo-group input[type="checkbox"]',
  label: 'Toggle all checkboxes',
};
