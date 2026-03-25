import '../dist/index.js';

export default {
  title: 'Charts/RoadmapChart',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible roadmap chart web component that visualizes projects, tasks, and their dependencies over time. It supports hierarchical data and can be populated via an inline JSON script tag, a data-json attribute, or an external source URL.',
      },
    },
  },
  argTypes: {
    jsonData: {
      control: 'object',
      description: 'The roadmap data structure.',
    },
    src: {
      control: 'text',
      description: 'External URL to fetch roadmap data from.',
    },
    error: {
      control: 'text',
      description: 'Simulated error message.',
    },
  },
};

const Template = (args) => {
  const container = document.createElement('div');
  const roadmap = document.createElement('roadmap-chart');

  if (args.src) {
    roadmap.setAttribute('src', args.src);
  }

  if (args.jsonData && !args.src) {
    const script = document.createElement('script');
    script.type = 'application/json';
    script.textContent = JSON.stringify(args.jsonData);
    roadmap.appendChild(script);
  }

  // Handle click events and log to the output pre tag as in the example
  const output = document.createElement('pre');
  output.style.marginTop = '20px';
  output.style.padding = '10px';
  output.style.background = '#f8f9fa';
  output.style.border = '1px solid #dee2e6';
  output.textContent = 'Nothing clicked yet.';

  roadmap.addEventListener('roadmap-item-click', (event) => {
    output.textContent = JSON.stringify(event.detail.item, null, 2);
  });

  container.appendChild(roadmap);
  container.appendChild(output);

  return container;
};

const defaultData = [
  {
    "name": "Platform",
    "children": [
      {
        "name": "Frontend",
        "children": [
          {
            "id": "UX-LOGIN-001",
            "topic": "Login UX concept",
            "owner": "Mia",
            "assignees": ["Tom"],
            "link": "https://example.org/tickets/102",
            "column": "Q2",
            "progress": 100,
            "startDate": "2026-02-05",
            "endDate": "2026-03-05",
            "dependsOn": []
          },
          {
            "id": "UX-LOGIN-002",
            "topic": "Login modernization",
            "owner": "Anna",
            "assignees": ["Ben", "Mia"],
            "link": "https://example.org/tickets/123",
            "column": "Q2",
            "progress": 75,
            "startDate": "2026-03-15",
            "endDate": "2026-04-01",
            "dependsOn": ["BE-AUTH-001", "UX-LOGIN-001"]
          }
        ]
      },
      {
        "name": "Backend",
        "children": [
          {
            "id": "BE-AUTH-001",
            "topic": "Auth API",
            "owner": "Chris",
            "assignees": ["Nina"],
            "link": "https://example.org/tickets/101",
            "column": "Q2",
            "progress": 80,
            "startDate": "2026-02-01",
            "endDate": "2026-03-10",
            "dependsOn": []
          },
          {
            "id": "BE-AUTH-002",
            "topic": "Auth API",
            "owner": "Chris",
            "assignees": ["Nina"],
            "link": "https://example.org/tickets/101",
            "column": "Q2",
            "progress": 80,
            "startDate": "2026-02-01",
            "endDate": "2026-03-10",
            "dependsOn": [
              "BE-AUTH-001"
            ]
          },
          {
            "id": "BE-AUTH-003",
            "topic": "Auth API",
            "owner": "Chris",
            "assignees": ["Nina"],
            "link": "https://example.org/tickets/101",
            "column": "Q2",
            "progress": 80,
            "startDate": "2026-03-01",
            "endDate": "2026-03-10",
            "dependsOn": []
          },
          {
            "id": "BE-AUTH-004",
            "topic": "Auth API",
            "owner": "Chris",
            "assignees": ["Nina"],
            "link": "https://example.org/tickets/101",
            "column": "Q2",
            "progress": 80,
            "startDate": "2026-03-15",
            "endDate": "2026-04-10",
            "dependsOn": []
          },
          {
            "name": "Backend Details",
            "children": [
              {
                "id": "BE-AUTH-005",
                "topic": "Auth API",
                "owner": "Chris",
                "assignees": ["Nina"],
                "link": "https://example.org/tickets/101",
                "column": "Q2",
                "progress": 80,
                "startDate": "2026-03-15",
                "endDate": "2026-04-10",
                "dependsOn": [
                    "UX-LOGIN-001"
                ]
              },
            ]
          }
        ]
      }
    ]
  }
];

export const Default = Template.bind({});
Default.args = {
  jsonData: defaultData,
};

export const Empty = Template.bind({});
Empty.args = {
  jsonData: [],
};

export const InvalidData = Template.bind({});
InvalidData.args = {
    jsonData: { "not": "an array" }
};
