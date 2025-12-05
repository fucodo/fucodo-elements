import '../dist/index.js';

export default {
  title: 'Elements/Progress/CircleProgress',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Circular progress Web Component. Use attribute `percent` (0–100). Optional: `size` (px), `color` theme classes (e.g., "green", "orange", "dark"), `title` tooltip, and `text` center label.',
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
      control: { type: 'number', min: 40, step: 1 },
      description: 'Diameter in pixels (sets CSS var --size).',
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
      description: 'Text displayed in the center. Defaults to "{percent}%".',
      table: { category: 'attributes' },
    },
  },
};

const Template = ({ percent, size, color, extraClass, title, text, totalSteps, stepsSolved}) => {
  const host = document.createElement('div');
  host.style.minWidth = '220px';

  const safePercent = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 0;
  const sizeAttr = Number.isFinite(size) && size > 0 ? ` size="${size}"` : '';
  const colorAttr = color ? ` ${color}` : '';
  const classAttr = extraClass ? ` ${extraClass}` : '';
  const cls = (colorAttr + classAttr).trim();
  const classAttribute = cls ? ` class="${cls}"` : '';

  const titleAttr = title ? ` title="${title}"` : '';
  const textAttr = typeof text === 'string' && text.length ? ` text="${text}"` : '';

  const totalStepsAttr = totalSteps ? ` total-steps="${totalSteps}"` : '';
  const stepsSolvedAttr = stepsSolved ? ` steps-solved="${stepsSolved}"` : '';

  host.innerHTML = `
    <fucodo-progress-circle percent="${safePercent}"${sizeAttr}${classAttribute}${titleAttr}${textAttr}${totalStepsAttr}${stepsSolvedAttr}></fucodo-progress-circle>
  `;
  return host;
};

export const Basic = Template.bind({});
Basic.args = {
  percent: 80,
  size: 180,
  color: '',
  extraClass: '',
  title: 'Upload progress',
  text: '80%'
};

export const ThemedDark = Template.bind({});
ThemedDark.args = {
  percent: 65,
  size: 160,
  color: 'dark',
  extraClass: '',
  title: 'Processing…',
  text: ''
};

export const GreenLarge = Template.bind({});
GreenLarge.args = {
  percent: 42,
  size: 240,
  color: 'green',
  extraClass: '',
  title: 'Tasks completed',
  text: '42%'
};
