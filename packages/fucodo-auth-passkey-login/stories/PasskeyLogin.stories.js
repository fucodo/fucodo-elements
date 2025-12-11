// Storybook stories for <fucodo-auth-passkey-login>
// Demonstrates default usage and a fully mocked login flow.

import '../dist/index.js';

export default {
  title: 'Auth/Passkey Login',
  parameters: {
    docs: {
      description: {
        component:
          'Meldet einen Benutzer mit Passkey (WebAuthn) an. ' +
          'Die Komponente wird ausschließlich über die Attribute `endpoint` und `username` konfiguriert. ' +
          'Der Username ist Pflicht (Attribut `username`). Ohne gesetzte Pflicht-Attribute ist der Button deaktiviert. ' +
          'Die Mock-Story überschreibt `fetch` und `navigator.credentials.get`, um den Flow ohne echten Server/Authenticator zu demonstrieren.'
      }
    }
  },
  argTypes: {
    endpoint: {
      control: 'text',
      description: 'Basis-URL deines Backends (z. B. https://example.com)',
      table: { category: 'attributes' }
    },
    username: {
      control: 'text',
      description: 'Eindeutiger Benutzername (Pflicht)',
      table: { category: 'attributes' }
    }
  }
};

export const Default = {
  name: 'Standard',
  render: (args) => {
    const el = document.createElement('fucodo-auth-passkey-login');
    if (args.endpoint) el.setAttribute('endpoint', args.endpoint);
    if (args.username) el.setAttribute('username', args.username);
    el.style.maxWidth = '640px';
    return el;
  }
};

export const PreFilled = {
  name: 'Mit vorausgefüllten Attributen',
  args: {
    endpoint: 'https://example.com',
    username: 'j.doe'
  },
  render: (args) => Default.render(args)
};

export const WithMockServer = {
  name: 'Mit Mock-Server & Mock-WebAuthn (klickbar)',
  args: {
    endpoint: 'https://mock.local',
    username: 'demo'
  },
  render: (args) => {
    const bufFrom = (str) => {
      const bytes = new TextEncoder().encode(str);
      return bytes.buffer;
    };

    const toB64url = (buf) => {
      const bytes = new Uint8Array(buf);
      let str = '';
      for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
      return btoa(str).replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    };

    // Install fetch mock
    const realFetch = window.fetch?.bind(window);
    window.fetch = async (input, init = {}) => {
      const url = typeof input === 'string' ? input : input.url;
      const method = (init.method || 'GET').toUpperCase();
      if (method === 'POST' && url.endsWith('/webauthn/login/options')) {
        const body = init.body ? JSON.parse(init.body) : {};
        if (!body.username) return new Response(null, { status: 400 });
        const challenge = 'bG9naW4tY2hhbGxlbmdl'; // base64url('login-challenge')
        const credId = 'bW9jay1jcmVkLWlk';      // base64url('mock-cred-id')
        return new Response(
          JSON.stringify({
            challenge,
            rpId: 'localhost',
            allowCredentials: [
              { type: 'public-key', id: credId, transports: ['internal'] }
            ],
            userVerification: 'preferred',
            timeout: 60000
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      if (method === 'POST' && url.endsWith('/webauthn/login/verify')) {
        return new Response(
          JSON.stringify({ status: 'ok', userId: 'user-id', credentialId: 'mock-cred-id', token: 'dummy-token' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return realFetch ? realFetch(input, init) : Promise.reject(new Error('fetch not available'));
    };

    // Install navigator.credentials.get mock
    const realCreds = navigator.credentials;
    const mockAssertion = {
      id: 'mock-cred-id',
      type: 'public-key',
      rawId: bufFrom('mock-cred-id'),
      response: {
        authenticatorData: bufFrom('authData'),
        clientDataJSON: bufFrom('clientData'),
        signature: bufFrom('signature'),
        userHandle: bufFrom('user-id')
      },
      getClientExtensionResults: () => ({}),
      authenticatorAttachment: 'platform'
    };
    navigator.credentials = {
      ...realCreds,
      get: async () => mockAssertion
    };

    const el = document.createElement('fucodo-auth-passkey-login');
    if (args.endpoint) el.setAttribute('endpoint', args.endpoint);
    if (args.username) el.setAttribute('username', args.username);
    el.style.maxWidth = '640px';

    const restore = () => {
      window.fetch = realFetch;
      navigator.credentials = realCreds;
      el.removeEventListener('loggedin', onOk);
      el.removeEventListener('error', onErr);
    };
    const onOk = (e) => {
      // eslint-disable-next-line no-console
      console.log('Mock login OK', e.detail);
    };
    const onErr = (e) => {
      // eslint-disable-next-line no-console
      console.error('Mock login error', e.detail);
    };
    el.addEventListener('loggedin', onOk);
    el.addEventListener('error', onErr);

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
    username: 'j.doe'
  },
  render: (args) => {
    const el = document.createElement('fucodo-auth-passkey-login');
    if (args.endpoint) el.setAttribute('endpoint', args.endpoint);
    if (args.username) el.setAttribute('username', args.username);
    el.style.maxWidth = '640px';

    const btnContent = document.createElement('span');
    btnContent.setAttribute('slot', 'action');
    btnContent.textContent = '🔓 Mit Passkey anmelden';
    el.appendChild(btnContent);

    return el;
  }
};
