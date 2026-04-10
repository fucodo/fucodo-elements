# Fucodo Chart Roadmap 2

A modern, high-performance Gantt / Roadmap chart web component built with [Lit](https://lit.dev/). This component is heavily inspired by the clean aesthetics and functional simplicity of [Frappe Gantt](https://github.com/frappe/gantt), while adding support for grouped tasks, custom styling, and seamless integration as a standard Web Component.

## Features

-   **Multi-View Support**: Switch between Day, Week, Month, Quarter, and Year views.
-   **Interactive**: Drag-to-move and drag-to-resize tasks.
-   **Grouped Rows**: Organise tasks into collapsible groups (swimlanes).
-   **Dependency Visualization**: Clear SVG-based dependency arrows between tasks.
-   **Custom Styling**: Easily themeable via CSS variables.
-   **Progress Tracking**: Visual progress overlay on each task bar.
-   **Built-in Toolbar**: Optional "Today" button and view mode selector.
-   **High Performance**: Efficient SVG rendering for smooth interactions.

## Installation

```bash
npm install fucodo-chart-roadmap-2
```

## Usage

### Basic Example

```html
<fucodo-chart-roadmap id="my-roadmap" view-mode="Month"></fucodo-chart-roadmap>

<script type="module">
  import 'fucodo-chart-roadmap-2';

  const roadmap = document.getElementById('my-roadmap');
  roadmap.tasks = [
    { 
      id: '1', 
      name: 'Requirement Analysis', 
      group: 'Phase 1', 
      start: '2026-04-01', 
      end: '2026-04-10', 
      progress: 100 
    },
    { 
      id: '2', 
      name: 'Design', 
      group: 'Phase 1', 
      start: '2026-04-11', 
      end: '2026-04-25', 
      progress: 40,
      dependencies: ['1']
    }
  ];
</script>
```

### Properties

| Property            | Attribute                | Type      | Default   | Description                                                                 |
|---------------------|--------------------------|-----------|-----------|-----------------------------------------------------------------------------|
| `tasks`             | -                        | `Array`   | `[]`      | Array of task objects.                                                      |
| `viewMode`          | `view-mode`              | `String`  | `'Month'` | Timeline scale: `'Day' \| 'Week' \| 'Month' \| 'Quarter' \| 'Year'`.        |
| `readonly`          | `readonly`               | `Boolean` | `false`   | Disables drag and resize interactions.                                      |
| `todayButton`       | `today-button`           | `Boolean` | `true`    | Shows/hides the "Today" button in the toolbar.                              |
| `viewModeSelect`    | `view-mode-select`       | `Boolean` | `true`    | Shows/hides the view mode switcher.                                         |
| `progressDraggable` | `progress-draggable`     | `Boolean` | `false`   | Enables dragging the progress handle on task bars.                          |
| `holidays`          | `holidays`               | `String`  | `''`      | Comma-separated ISO dates (e.g., `'2026-12-25,2027-01-01'`) to highlight.   |
| `rowHeight`         | `row-height`             | `Number`  | `44`      | Height of each task row in pixels.                                          |
| `sidebarWidth`      | `sidebar-width`          | `Number`  | `240`     | Width of the task sidebar in pixels.                                        |

### Events

| Event             | Detail                                | Description                                            |
|-------------------|---------------------------------------|--------------------------------------------------------|
| `task-click`      | `{ task: Object }`                    | Fired when a task bar is clicked.                      |
| `date-change`     | `{ task: Object, start: Date, end: Date }` | Fired after a task is moved or resized.                |
| `progress-change` | `{ task: Object, progress: Number }`  | Fired after a task's progress is updated via dragging. |

## Theming

Fucodo Chart Roadmap 2 uses CSS variables for easy customization. You can override these in your global styles:

```css
fucodo-chart-roadmap {
  --fc-accent: #007bff;
  --fc-bg: #ffffff;
  --fc-text: #333333;
  --fc-border: #e0e0e0;
  --fc-surface: #f8f9fa;
}
```

Refer to `style.scss` for the full list of available tokens.

## Comparison with Frappe Gantt

Fucodo Chart Roadmap 2 honors the design philosophy of Frappe Gantt while improving upon it for modern web development:

1.  **Web Component**: Native custom element support, no global dependencies.
2.  **Lit-based**: Leverages Lit's reactive templates for better performance and developer experience.
3.  **Grouping**: Built-in support for task groups/swimlanes, which is often requested in Frappe Gantt.
4.  **Flexbox Layout**: Improved layout stability compared to pure SVG-based positioning.
