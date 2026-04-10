import '../dist/index.js';

export default {
  title: 'Charts/RoadmapChart 2',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An improved Gantt / Roadmap chart web component that visualizes tasks, their progress, and dependencies over time. It supports grouped rows, drag-and-drop movement, resizing, and multiple view modes.',
      },
    },
  },
  argTypes: {
    tasks: {
      control: 'object',
      description: 'The array of task objects.',
    },
    viewMode: {
      control: { type: 'select', options: ['Day', 'Week', 'Month', 'Quarter', 'Year'] },
      description: 'The time scale of the chart.',
    },
    todayButton: {
      control: 'boolean',
      description: 'Whether to show the "Today" button.',
    },
    viewModeSelect: {
      control: 'boolean',
      description: 'Whether to show the view mode selector.',
    },
    progressDraggable: {
      control: 'boolean',
      description: 'Whether progress is draggable.',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the chart is readonly.',
    },
    barCornerRadius: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
      description: 'Radius of the task bar corners.',
    },
    arrowCurve: {
      control: { type: 'range', min: 0, max: 50, step: 1 },
      description: 'Curve radius of dependency arrows.',
    },
  },
};

const Template = (args) => {
  const roadmap = document.createElement('fucodo-chart-roadmap');

  // Set properties
  if (args.tasks) {
    roadmap.tasks = args.tasks;
  }
  if (args.viewMode) {
    roadmap.viewMode = args.viewMode;
  }
  roadmap.todayButton = args.todayButton !== undefined ? args.todayButton : true;
  roadmap.viewModeSelect = args.viewModeSelect !== undefined ? args.viewModeSelect : true;
  roadmap.progressDraggable = !!args.progressDraggable;
  roadmap.readonly = !!args.readonly;
  if (args.barCornerRadius !== undefined) {
    roadmap.barCornerRadius = args.barCornerRadius;
  }
  if (args.arrowCurve !== undefined) {
    roadmap.arrowCurve = args.arrowCurve;
  }

  // Handle click events and log to the output pre tag
  const container = document.createElement('div');
  const output = document.createElement('pre');
  output.style.marginTop = '20px';
  output.style.padding = '10px';
  output.style.background = '#f8f9fa';
  output.style.border = '1px solid #dee2e6';
  output.style.overflow = 'auto';
  output.style.maxHeight = '200px';
  output.textContent = 'Interaction logs will appear here.';

  roadmap.addEventListener('task-click', (event) => {
    output.textContent = `Task Clicked: ${JSON.stringify(event.detail.task, null, 2)}`;
  });

  roadmap.addEventListener('date-change', (event) => {
    output.textContent = `Date Changed: ${JSON.stringify(event.detail, null, 2)}`;
  });

  roadmap.addEventListener('progress-change', (event) => {
    output.textContent = `Progress Changed: ${JSON.stringify(event.detail, null, 2)}`;
  });

  container.appendChild(roadmap);
  container.appendChild(output);

  return container;
};

const defaultTasks = [
  { id: '1', name: 'Login UX concept', group: 'Frontend', start: '2026-02-05', end: '2026-03-05', progress: 100, owner: 'Mia' },
  { id: '2', name: 'Login modernization', group: 'Frontend', start: '2026-03-15', end: '2026-04-01', progress: 75, dependencies: ['1'], owner: 'Anna' },
  { id: '3', name: 'Auth API', group: 'Backend', start: '2026-02-01', end: '2026-03-10', progress: 80, owner: 'Chris' },
  { id: '4', name: 'Database Schema', group: 'Backend', start: '2026-03-11', end: '2026-03-25', progress: 40, dependencies: ['3'], owner: 'Chris' },
  { id: '5', name: 'API Integration', group: 'Backend', start: '2026-03-26', end: '2026-04-10', progress: 0, dependencies: ['2', '4'], owner: 'Chris' },
  { id: '6', name: 'Mobile App UX', group: 'Mobile', start: '2026-03-01', end: '2026-03-20', progress: 20, color: '#f43f5e' },
];

export const Default = Template.bind({});
Default.args = {
  tasks: defaultTasks,
  viewMode: 'Month',
};

export const DayView = Template.bind({});
DayView.args = {
  tasks: defaultTasks,
  viewMode: 'Day',
};

export const WeekView = Template.bind({});
WeekView.args = {
  tasks: defaultTasks,
  viewMode: 'Week',
};

export const QuarterView = Template.bind({});
QuarterView.args = {
  tasks: defaultTasks,
  viewMode: 'Quarter',
};

export const YearView = Template.bind({});
YearView.args = {
  tasks: defaultTasks,
  viewMode: 'Year',
};

export const Readonly = Template.bind({});
Readonly.args = {
  tasks: defaultTasks,
  readonly: true,
};
