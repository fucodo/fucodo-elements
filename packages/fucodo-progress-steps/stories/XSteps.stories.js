import '../dist/index.js';

export default {
  title: 'Elements/Steps/XSteps',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Progress/steps Web Component. Provide a list of steps via a slotted <ul>/<ol>. Supports modes "full" and "bubble" and the CSS var --bubble-size.',
      },
    },
  },
  argTypes: {
    current: {
      control: { type: 'number', min: 0 },
      description: 'Zero-based index of the current step.',
      table: { category: 'attributes' },
    },
    mode: {
      control: { type: 'select' },
      options: ['full', 'bubble'],
      description: 'Render mode: full list items or bubble timeline.',
      table: { category: 'attributes' },
    },
    bubbleSize: {
      control: { type: 'text' },
      description: 'CSS size for --bubble-size in bubble mode (e.g., 2rem, 48px).',
      table: { category: 'styles' },
    },
  },
};

const StepsMarkup = () => `
  <ul>
    <li>
      <span style="display:inline-block; width:16px; height:16px; fill:currentColor;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="display:block;">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
          <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
        </svg>
      </span>
      Vorlage laden und füllen
    </li>
    <li>… Daten prüfen</li>
    <li>… Nutzer anlegen</li>
  </ul>
`;

const Template = ({ current, mode, bubbleSize }) => {
  const host = document.createElement('div');
  host.style.minWidth = '720px';

  const styleAttr = bubbleSize ? ` style="--bubble-size: ${bubbleSize};"` : '';

  host.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" crossorigin="anonymous">
    <fucodo-progress-steps current="${Number.isFinite(current) ? current : 0}" mode="${mode}"${styleAttr}>
      ${StepsMarkup()}
    </fucodo-progress-steps>
  `;

  return host;
};

export const Full = Template.bind({});
Full.args = {
  current: 1,
  mode: 'full',
  bubbleSize: '32px',
};

export const Bubble = Template.bind({});
Bubble.args = {
  current: 1,
  mode: 'bubble',
  bubbleSize: '4rem',
};
