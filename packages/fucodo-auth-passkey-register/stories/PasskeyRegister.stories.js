// Storybook stories for <fucodo-auth-passkey-register>
// These stories demonstrate the component with default props and with mocked
// backend + WebAuthn so you can click through without a real server/device.

import '../dist/index.js';

export default {
  title: 'Auth/Passkey Register',
  parameters: {
    docs: {
      description: {
        component:
          'Registriert einen Passkey (WebAuthn) an einem angegebenen Endpoint. ' +
          'Die Komponente wird ausschließlich über die Attribute `endpoint`, `username` und optional `display-name` konfiguriert. ' +
          'Ohne gesetzte Pflicht-Attribute ist der Button deaktiviert. ' +
          'Die Story "Mit Mock-Server" überschreibt `fetch` und `navigator.credentials.create`, ' +
          'um die Registrierung ohne echten Server/Authenticator zu demonstrieren.'
      }
    }
  },
  argTypes: {
    endpoint: {
      control: 'text',
      description: 'Basis-URL deines Backends (z. B. https://example.com)',
      table: { category: 'attributes' },
    },
    username: {
      control: 'text',
      description: 'Eindeutiger Benutzername (Pflicht)',
      table: { category: 'attributes' },
    },
    displayName: {
      name: 'display-name',
      control: 'text',
      description: 'Anzeigename (optional). Fällt sonst auf `username` zurück.',
      table: { category: 'attributes' },
    }
  }
};

export const Default = {
  name: 'Standard',
  render: (args) => {
    const el = document.createElement('fucodo-auth-passkey-register');
    if (args.endpoint) el.setAttribute('endpoint', args.endpoint);
    if (args.username) el.setAttribute('username', args.username);
    if (args.displayName) el.setAttribute('display-name', args.displayName);
    el.style.maxWidth = '640px';
    return el;
  }
};

export const PreFilled = {
  name: 'Mit vorausgefüllten Attributen',
  args: {
    endpoint: 'https://example.com',
    username: 'j.doe',
    displayName: 'John Doe'
  },
  render: (args) => Default.render(args)
};

export const WithMockServer = {
  name: 'Mit Mock-Server & Mock-WebAuthn (klickbar)',
  args: {
    endpoint: 'https://mock.local',
    username: 'demo',
    displayName: 'Demo User'
  },
  render: (args) => {
    // Helper: small base64url util
    const bufFrom = (str) => {
      const bytes = new TextEncoder().encode(str);
      return bytes.buffer;
    };

    // Install fetch mock (scoped per story render)
    const realFetch = window.fetch?.bind(window);
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = (init.method || 'GET').toUpperCase();
      if (method === 'POST' && url.endsWith('/webauthn/register/options')) {
        const body = init.body ? JSON.parse(init.body) : {};
        const username = body.username || 'demo';
        const challenge = 'dGVzdC1jaGFsbGVuZ2U'; // base64url('test-challenge')
        const userId = 'dXNlci1pZA';              // base64url('user-id')
        return new Response(
          JSON.stringify({
            challenge,
            rp: { name: 'Fucodo Demo', id: 'localhost' },
            user: { id: userId, name: username, displayName: body.displayName || username },
            pubKeyCredParams: [ { type: 'public-key', alg: -7 } ],
            timeout: 60000,
            attestation: 'none',
            excludeCredentials: []
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (method === 'POST' && url.endsWith('/webauthn/register/verify')) {
        return new Response(
          JSON.stringify({ status: 'ok', userId: 'user-id', credentialId: 'cred-id' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      // Fallback to real fetch for other assets
      return realFetch ? realFetch(input, init) : Promise.reject(new Error('fetch not available'));
    };

    // Install navigator.credentials.create mock
    const realCreds = navigator.credentials;
    const mockCred = {
      id: 'mock-credential-id',
      type: 'public-key',
      rawId: bufFrom('rawId'),
      response: {
        attestationObject: bufFrom('attestation'),
        clientDataJSON: bufFrom('clientData')
      },
      getClientExtensionResults: () => ({}),
      authenticatorAttachment: 'platform'
    };
    navigator.credentials = {
      ...realCreds,
      create: async () => mockCred
    };

    // Render element
    const el = document.createElement('fucodo-auth-passkey-register');
    if (args.endpoint) el.setAttribute('endpoint', args.endpoint);
    if (args.username) el.setAttribute('username', args.username);
    if (args.displayName) el.setAttribute('display-name', args.displayName);
    el.style.maxWidth = '640px';

    // Cleanup when story unmounts
    const restore = () => {
      window.fetch = realFetch;
      navigator.credentials = realCreds;
      el.removeEventListener('registered', onOk);
      el.removeEventListener('error', onErr);
    };
    const onOk = (e) => {
      // eslint-disable-next-line no-console
      console.log('Mock registration OK', e.detail);
    };
    const onErr = (e) => {
      // eslint-disable-next-line no-console
      console.error('Mock registration error', e.detail);
    };
    el.addEventListener('registered', onOk);
    el.addEventListener('error', onErr);

    // Storybook calls render only once per mount; hook into element removal
    const obs = new MutationObserver(() => {
      if (!document.body.contains(el)) {
        restore();
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return el;
  }
};

export const CustomButtonContent = {
  name: 'Mit eigenem Button-Inhalt (Slot)',
  args: {
    endpoint: 'https://example.com',
    username: 'j.doe',
    displayName: 'John Doe'
  },
  render: (args) => {
    const el = document.createElement('fucodo-auth-passkey-register');
    if (args.endpoint) el.setAttribute('endpoint', args.endpoint);
    if (args.username) el.setAttribute('username', args.username);
    if (args.displayName) el.setAttribute('display-name', args.displayName);
    el.style.maxWidth = '640px';

    const btnContent = document.createElement('span');
    btnContent.setAttribute('slot', 'action');
    btnContent.textContent = '🔐 Passkey jetzt registrieren';
    el.appendChild(btnContent);

    return el;
  }
};
