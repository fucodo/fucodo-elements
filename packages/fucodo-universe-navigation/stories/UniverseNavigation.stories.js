import '../dist/index.js';

export default {
  title: 'Components/Universe/Navigation',
  component: 'fucodo-universe-navigation',
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: true,
      },
      description: {
        component: 'Navigation component for Fucodo Universe. Fetches navigation data from a JSON endpoint.',
      },
    },
  },
  argTypes: {
    src: {
      control: 'text',
      description: 'The URL to fetch the navigation data from.',
    },
    interval: {
      control: 'number',
      description: 'Refresh interval in seconds.',
    },
    'cache-key': {
      control: 'text',
      description: 'Key used for localStorage caching.',
    },
    breakpoint: {
      control: 'number',
      description: 'Mobile breakpoint in pixels.',
    },
  },
};

const navigationData = {
  "logo": {
    "text": "Fucodo Universe",
    "url": "/",
    "image": "/assets/logo.svg"
  },
  "notifications": {
    "count": 7,
    "url": "/notifications",
    "label": "Benachrichtigungen"
  },
  "menu": [
    {
      "text": "Dashboard",
      "url": "/dashboard",
      "icon": {
        "type": "svg",
        "value": "<svg viewBox=\"0 0 24 24\"><path d=\"M3 12l9-9 9 9v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z\"/></svg>"
      },
      "badge": 3
    },
    {
      "text": "Projekte",
      "url": "/projects",
      "icon": {
        "type": "url",
        "value": "/assets/icons/projects.svg"
      }
    },
    {
      "text": "Einstellungen",
      "url": "/settings",
      "icon": {
        "type": "svg",
        "value": "<svg viewBox=\"0 0 24 24\"><path d=\"M19.43 12.98c.04-.32.07-.65.07-.98s-.02-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.28 7.28 0 0 0-1.69-.98L14.5 2.42A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42L9.12 5.07c-.61.24-1.18.56-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.06.65-.06.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.65a.5.5 0 0 0 .49.42h4a.5.5 0 0 0 .49-.42l.38-2.65c.61-.24 1.18-.56 1.69-.98l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z\"/></svg>"
      }
    }
  ]
};

const mockEndpoints = {
  '/api/navigation': navigationData,
  '/api/navigation/no-notifications': {
    ...navigationData,
    notifications: undefined
  },
  '/api/navigation/zero-notifications': {
    ...navigationData,
    notifications: {
      ...navigationData.notifications,
      count: 0
    }
  },
  '/api/navigation/custom-logo': {
    ...navigationData,
    logo: {
      ...navigationData.logo,
      image: 'https://fucodo.de/fileadmin/CI-CD/Logo/fucodo.svg'
    }
  }
};

const Template = (args) => {
  const container = document.createElement('div');
  container.style.minHeight = '100px';
  container.style.position = 'relative';

  if (args.containerStyle) {
    Object.assign(container.style, args.containerStyle);
  }

  const el = document.createElement('fucodo-universe-navigation');
  Object.entries(args).forEach(([key, value]) => {
    if (value !== undefined) {
      el.setAttribute(key, value);
    }
  });

  container.appendChild(el);
  return container;
};

export const Default = Template.bind({});
Default.args = {
  src: '/api/navigation',
};

// Global decorator for mocking fetch
const fetchMockDecorator = (Story) => {
  if (!window.fetch.original) {
    const originalFetch = window.fetch;
    window.fetch = async (url, options) => {
      const endpoint = Object.keys(mockEndpoints).find(e => url === e || url.endsWith(e));
      if (endpoint) {
        return {
          ok: true,
          json: async () => mockEndpoints[endpoint],
        };
      }
      return originalFetch(url, options);
    };
    window.fetch.original = originalFetch;
  }
  return Story();
};

Default.decorators = [fetchMockDecorator];

export const NoNotifications = Template.bind({});
NoNotifications.args = {
  src: '/api/navigation/no-notifications',
};
NoNotifications.decorators = [fetchMockDecorator];

export const ZeroNotifications = Template.bind({});
ZeroNotifications.args = {
  src: '/api/navigation/zero-notifications',
};
ZeroNotifications.decorators = [fetchMockDecorator];

export const CustomLogo = Template.bind({});
CustomLogo.args = {
  src: '/api/navigation/custom-logo',
};
CustomLogo.decorators = [fetchMockDecorator];

export const Mobile = Template.bind({});
Mobile.args = {
  src: '/api/navigation',
  breakpoint: 2000, // Force mobile view
  containerStyle: {
    maxWidth: '375px',
    margin: '0 auto',
    border: '1px solid #e5e7eb',
    height: '400px',
    overflow: 'hidden'
  }
};
Mobile.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
  docs: {
    story: {
      iframeHeight: '400px',
    },
  },
};
Mobile.decorators = [fetchMockDecorator];
