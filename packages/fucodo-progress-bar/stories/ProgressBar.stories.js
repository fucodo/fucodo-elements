import '../dist/index.js';

export default {
  title: 'Components/Progress/ProgressBar',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Horizontal progress bar Web Component. Use attribute `percent` (0–100). Optional: `size` (px or CSS unit), `color` theme classes (e.g., "green", "orange", "dark"), `title` tooltip, and `text` label.',
      },
    },
  },
  argTypes: {
    percent: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Progress in percent (0–100).',
      table: { category: 'attributes' },
    },
    totalSteps: {
        control: { type: 'number', step: 1 },
        description: 'maximum number of steps',
        table: { category: 'attributes' },
    },
    stepsSolved: {
        control: { type: 'number', step: 1 },
        description: 'steps solved',
        table: { category: 'attributes' },
    },
    size: {
      control: { type: 'text' },
      description: 'Width in pixels or CSS value (sets CSS var --size).',
      table: { category: 'attributes' },
    },
    color: {
      control: { type: 'select' },
      options: ['', 'green', 'orange', 'dark', 'green dark', 'orange dark'],
      description: 'Theme classes applied to the host (e.g., "green", "dark").',
      table: { category: 'attributes' },
    },
    extraClass: {
      control: { type: 'text' },
      description: 'Additional CSS classes for the component.',
      table: { category: 'attributes' },
    },
    title: {
      control: { type: 'text' },
      description: 'Tooltip (title attribute).',
      table: { category: 'attributes' },
    },
    text: {
      control: { type: 'text' },
      description: 'Text displayed on the bar. Defaults to "{percent}%".',
      table: { category: 'attributes' },
    },
  },
};

const Template = ({ percent, size, color, extraClass, title, text, totalSteps, stepsSolved}) => {
  const host = document.createElement('div');
  host.style.width = '500px';

  const safePercent = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
  const sizeAttr = size ? ` size="${size}"` : '';
  const colorAttr = color ? ` ${color}` : '';
  const classAttr = extraClass ? ` ${extraClass}` : '';
  const cls = (colorAttr + classAttr).trim();
  const classAttribute = cls ? ` class="${cls}"` : '';

  const titleAttr = title ? ` title="${title}"` : '';
  const textAttr = typeof text === 'string' && text.length ? ` text="${text}"` : '';

  const totalStepsAttr = totalSteps ? ` total-steps="${totalSteps}"` : '';
  const stepsSolvedAttr = stepsSolved ? ` steps-solved="${stepsSolved}"` : '';

  host.innerHTML = `
    <fucodo-progress-bar percent="${safePercent}"${sizeAttr}${classAttribute}${titleAttr}${textAttr}${totalStepsAttr}${stepsSolvedAttr}></fucodo-progress-bar>
  `;
  return host;
};

export const Basic = Template.bind({});
Basic.args = {
  percent: 80,
  size: '100%',
  color: '',
  extraClass: '',
  title: 'Upload progress',
  text: '80%'
};

export const FixedWidth = Template.bind({});
FixedWidth.args = {
  percent: 50,
  size: '300',
  color: 'orange',
  extraClass: '',
  title: 'Halfway there',
  text: '50%'
};

export const ThemedDark = Template.bind({});
ThemedDark.args = {
  percent: 65,
  size: '400px',
  color: 'dark',
  extraClass: '',
  title: 'Processing…',
  text: ''
};
