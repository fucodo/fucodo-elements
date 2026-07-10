import '../dist/index.js';
import '../../fucodo-json-render/dist/index.js';

export default {
  title: 'Data/JsonFetch',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A combination of fucodo-json-fetch and fucodo-json-render to fetch and display JSON data.',
      },
    },
  },
};

const Template = ({ src, template }) => {
  const host = document.createElement('div');
  host.innerHTML = `
    <fucodo-json-fetch src="${src}">
      <fucodo-json-render>
        <template>${template}</template>
      </fucodo-json-render>
    </fucodo-json-fetch>
  `;
  return host;
};

export const Basic = Template.bind({});
Basic.args = {
  src: 'https://jsonplaceholder.typicode.com/users/1',
  template: `
    <div class="card" style="width: 18rem; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
      <h3>{{items.name}}</h3>
      <p>Email: {{items.email}}</p>
      <p>Company: {{items.company.name}}</p>
    </div>
  `,
};

export const List = Template.bind({});
List.args = {
  src: 'https://jsonplaceholder.typicode.com/users',
  template: `
    <ul style="border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
      {{#each items}}
        <li>{{this.name}} ({{this.email}})</li>
      {{/each}}
    </ul>
  `,
};

export const ErrorHandling = Template.bind({});
ErrorHandling.args = {
  src: 'https://jsonplaceholder.typicode.com/invalid-url',
  template: `<p>This should not be seen.</p>`,
};

export const Nested = () => {
  const host = document.createElement('div');
  host.innerHTML = `
    <div style="border: 2px solid blue; padding: 1rem; margin-bottom: 1rem;">
      <h2>Outer Fetcher (User 1)</h2>
      <fucodo-json-fetch src="https://jsonplaceholder.typicode.com/users/1">
        <fucodo-json-render>
          <template>
            <p><strong>Name:</strong> {{items.name}}</p>
          </template>
        </fucodo-json-render>

        <div style="border: 2px solid green; padding: 1rem; margin-top: 1rem;">
          <h3>Inner Fetcher (Posts of User 1)</h3>
          <fucodo-json-fetch src="https://jsonplaceholder.typicode.com/posts?userId=1">
            <fucodo-json-render>
              <template>
                <ul>
                  {{#each items}}
                    <li>{{this.title}}</li>
                  {{/each}}
                </ul>
              </template>
            </fucodo-json-render>
          </fucodo-json-fetch>
        </div>
      </fucodo-json-fetch>
    </div>
  `;
  return host;
};
Nested.parameters = {
  docs: {
    description: {
      story: 'Demonstrates nested fetchers. Each renderer only receives data from its closest fetcher ancestor.',
    },
  },
};
