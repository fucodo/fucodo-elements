import '../dist/index';

export default {
  title: 'Components/fucodo-class-toggle',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    target: { control: { type: 'text' }, description: 'CSS selector for elements whose class should be toggled' },
    toggleClass: { control: { type: 'text' }, description: 'Class name to toggle on the target elements (maps to toggle-class attribute)' },
    label: { control: { type: 'text' }, description: 'Inner text/content of the toggle element' },
  },
};

const Template = ({ target = '.demo-targets .box', toggleClass = 'is-active', label = 'Toggle class' }) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <style>
      .demo-targets { display: grid; grid-template-columns: repeat(3, 80px); gap: 10px; margin-top: 12px; }
      .box { width: 80px; height: 60px; border-radius: 6px; border: 1px solid #ccc; background: #f7f7f7; display:flex; align-items:center; justify-content:center; font-size: 12px; color:#666; }
      .box.is-active { background: #0d6efd22; border-color: #0d6efd; color: #0d6efd; }
    </style>
    <section class="demo">
      <div class="mb-2">
        <fucodo-class-toggle data-toggle>Toggle</fucodo-class-toggle>
      </div>
      <div class="demo-targets">
        <div class="box">A</div>
        <div class="box">B</div>
        <div class="box">C</div>
      </div>
    </section>
  `;

  const toggleEl = wrapper.querySelector('[data-toggle]');
  if (toggleEl) {
    toggleEl.setAttribute('target', target);
    if (toggleClass) toggleEl.setAttribute('toggle-class', toggleClass);
    toggleEl.textContent = label || 'Toggle';
  }

  return wrapper;
};

export const Default = Template.bind({});
Default.args = {
  target: '.demo-targets .box',
  toggleClass: 'is-active',
  label: 'Toggle highlight',
};
