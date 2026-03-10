import '../dist/index.js';

export default {
  title: 'Components/Forms/Select',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AJAX-enabled Select Web Component. Enhances a standard <select> with Choices.js for remote data loading, searching, and multiple selections.',
      },
    },
  },
  argTypes: {
    ajaxUrl: {
      control: { type: 'text' },
      description: 'The URL for fetching remote data (data-ajax--url on the select).',
    },
    cache: {
      control: { type: 'boolean' },
      description: 'Whether to cache AJAX results (data-ajax--cache on the select).',
    },
    multiple: {
      control: { type: 'boolean' },
      description: 'Enable multiple selection.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the select.',
    },
  },
};

const Template = ({ ajaxUrl, cache, multiple, disabled }) => {
  const host = document.createElement('div');
  
  // Necessary CSS for Choices.js and Bootstrap-like form controls
  host.innerHTML = `
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" crossorigin="anonymous">
    
    <style>
      /* Ensure Choices.js works well within the container */
      .choices { margin-bottom: 1rem; }
    </style>

    <fucodo-select>
      <select 
        class="form-select"
        ${multiple ? 'multiple' : ''} 
        ${disabled ? 'disabled' : ''}
        data-ajax--url="${ajaxUrl || ''}"
        data-ajax--cache="${cache ? 'true' : 'false'}"
      >
        <option value="">Select an option...</option>
        <option value="1">Pre-defined Option 1</option>
        <option value="2">Pre-defined Option 2</option>
      </select>
    </fucodo-select>

    <div class="mt-3">
      <small class="text-muted">
        Note: AJAX functionality requires a working endpoint. This story demonstrates the UI enhancement.
      </small>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
  `;

  return host;
};

export const Default = Template.bind({});
Default.args = {
  ajaxUrl: '',
  cache: false,
  multiple: false,
  disabled: false,
};

export const Multiple = Template.bind({});
Multiple.args = {
  ajaxUrl: '',
  cache: false,
  multiple: true,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ajaxUrl: '',
  cache: false,
  multiple: false,
  disabled: true,
};

export const AjaxDemo = Template.bind({});
AjaxDemo.args = {
  ajaxUrl: 'https://api.github.com/search/repositories?q=fucodo',
  cache: true,
  multiple: false,
  disabled: false,
};
AjaxDemo.parameters = {
  docs: {
    description: {
      story: 'Demonstrates the structure for AJAX loading. Note that the component expects a Select2-like response format (results array with id/text).',
    },
  },
};
