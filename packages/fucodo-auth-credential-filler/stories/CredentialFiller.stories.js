import '../dist/index.js';

export default {
  title: 'Auth/CredentialFiller',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible Web Component that loads credentials from a URL and/or uses inline JSON defaults. It provides a searchable dropdown to fill username and password fields.',
      },
    },
  },
  argTypes: {
    jsonData: {
      control: 'object',
      description: 'The credential data array (inline defaults).',
    },
    url: {
      control: 'text',
      description: 'External URL to fetch credential data from.',
    },
    groupKey: {
      control: 'text',
      description: 'JSON property for grouping.',
    },
    descriptionKey: {
      control: 'text',
      description: 'JSON property for the description.',
    },
  },
};

const Template = (args) => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="max-width: 400px; margin-bottom: 20px;">
      <div style="margin-bottom: 1rem;">
        <label style="display: block; font-size: 12px; margin-bottom: 4px;">Username</label>
        <input type="text" id="sb-user" placeholder="Type or click..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
      </div>
      <div>
        <label style="display: block; font-size: 12px; margin-bottom: 4px;">Password</label>
        <input type="password" id="sb-pass" placeholder="Password will be filled" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
      </div>
    </div>
    <div id="sb-status" style="font-size: 12px; color: #666; font-family: monospace;">Waiting for events...</div>
  `;

  const filler = document.createElement('fucodo-auth-credential-filler');
  filler.setAttribute('username-selector', '#sb-user');
  filler.setAttribute('password-selector', '#sb-pass');
  
  if (args.url) {
    filler.setAttribute('url', args.url);
  }
  if (args.groupKey) {
    filler.setAttribute('group-key', args.groupKey);
  }
  if (args.descriptionKey) {
    filler.setAttribute('description-key', args.descriptionKey);
  }

  if (args.jsonData) {
    const script = document.createElement('script');
    script.type = 'application/json';
    script.textContent = JSON.stringify(args.jsonData);
    filler.appendChild(script);
  }

  const status = container.querySelector('#sb-status');
  filler.addEventListener('credential-filler:ready', (e) => {
    status.textContent = `Ready: ${e.detail.count} items loaded from ${e.detail.source}`;
  });
  filler.addEventListener('credential-filler:select', (e) => {
    status.textContent = `Selected: ${e.detail.username}`;
  });
  filler.addEventListener('credential-filler:error', (e) => {
    status.textContent = `Error: ${e.detail.error.message}`;
    status.style.color = 'red';
  });

  container.appendChild(filler);
  return container;
};

const defaultData = [
  { username: "alice@example.com", password: "password123", group: "Admins", description: "System Administrator" },
  { username: "bob@example.com", password: "password456", group: "Admins", description: "Database Admin" },
  { username: "carol@example.com", password: "password789", group: "Editors", description: "Content Manager" },
  { username: "dave@example.com", password: "passwordabc", group: "Editors" },
  { username: "erin@example.com", password: "passworddef", group: "Viewers" }
];

export const Default = Template.bind({});
Default.args = {
  jsonData: defaultData,
  groupKey: 'group',
  descriptionKey: 'description',
};

export const RemoteData = Template.bind({});
// Mocking a URL is hard in storybook without a server, but we can use a data URL for testing
const mockUrl = 'data:application/json;base64,' + btoa(JSON.stringify([
  { username: "remote-user", password: "remote-password", group: "Remote" }
]));

RemoteData.args = {
  url: mockUrl,
  groupKey: 'group',
};

export const NoGroups = Template.bind({});
NoGroups.args = {
  jsonData: defaultData.map(({ group, ...rest }) => rest),
};
