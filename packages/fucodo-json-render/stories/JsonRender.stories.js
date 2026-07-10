import '../dist/index.js';

export default {
  title: 'Data/JsonRender',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Renders JSON data using Handlebars templates. It reacts to json-data and json-error events.',
      },
    },
  },
};

export const ManualTrigger = () => {
  const host = document.createElement('div');
  host.innerHTML = `
    <fucodo-json-render id="renderer">
      <template>
        <div style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
          <h3>{{items.title}}</h3>
          <p>{{items.content}}</p>
        </div>
      </template>
    </fucodo-json-render>
    <div style="margin-top: 1rem;">
      <button id="successBtn" class="btn btn-primary">Simulate Success</button>
      <button id="errorBtn" class="btn btn-danger">Simulate Error</button>
    </div>
  `;

  const renderer = host.querySelector('#renderer');
  
  host.querySelector('#successBtn').addEventListener('click', () => {
    renderer.dispatchEvent(new CustomEvent('json-data', {
      detail: { data: { title: 'Success!', content: 'Data was successfully rendered via Handlebars.' } }
    }));
  });

  host.querySelector('#errorBtn').addEventListener('click', () => {
    renderer.dispatchEvent(new CustomEvent('json-error', {
      detail: { error: new Error('Simulated error') }
    }));
  });

  return host;
};
ManualTrigger.parameters = {
  docs: {
    description: {
      story: 'Demonstrates how the renderer responds to manual events. In typical usage, these events are sent by fucodo-json-fetch.',
    },
  },
};
