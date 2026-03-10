import '../dist/index.js';

export default {
  title: 'Components/Tabs/Bootstrap-Persistent',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Bootstrap-compatible Persistent Tabs Web Component. Extends Bootstrap tabs by adding localStorage persistence and marking tabs with validation errors.',
      },
    },
  },
  argTypes: {
    key: {
      control: { type: 'text' },
      description: 'Optional salt for the storage hash (defaults to location.pathname).',
    },
    stateKey: {
      control: { type: 'text' },
      description: 'Optional additional state key for the storage hash.',
    },
  },
};

const Template = ({ key, stateKey }) => {
  const host = document.createElement('div');
  
  const keyAttr = key ? ` key="${key}"` : '';
  const stateKeyAttr = stateKey ? ` state-key="${stateKey}"` : '';

  host.innerHTML = `
    <!-- Bootstrap CSS for styling -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" crossorigin="anonymous">
    
    <fucodo-tabs${keyAttr}${stateKeyAttr}>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Contact</button>
        </li>
      </ul>
      <div class="tab-content pt-3">
        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
          <h4>Home Content</h4>
          <p>This tab's state is persisted in localStorage. Reload the page or navigate away and back to see it in action.</p>
        </div>
        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
          <h4>Profile Content</h4>
          <p>Profile information goes here.</p>
          <div class="is-invalid"></div> <!-- This will trigger the error marking if logic allows -->
        </div>
        <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
          <h4>Contact Content</h4>
          <p>Contact details and form.</p>
        </div>
      </div>
    </fucodo-tabs>
    
    <!-- Bootstrap JS (optional, component has fallback but works better with it) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
  `;

  return host;
};

export const Default = Template.bind({});
Default.args = {
  key: 'demo-tabs',
};

export const WithValidationErrors = ({ key, stateKey }) => {
  const host = document.createElement('div');
  
  const keyAttr = key ? ` key="${key}"` : '';
  const stateKeyAttr = stateKey ? ` state-key="${stateKey}"` : '';

  host.innerHTML = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" crossorigin="anonymous">
    
    <fucodo-tabs${keyAttr}${stateKeyAttr}>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="valid-tab" data-bs-toggle="tab" data-bs-target="#valid-pane" type="button" role="tab">Valid Tab</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="invalid-tab" data-bs-toggle="tab" data-bs-target="#invalid-pane" type="button" role="tab">Invalid Tab</button>
        </li>
      </ul>
      <div class="tab-content pt-3">
        <div class="tab-pane fade show active" id="valid-pane" role="tabpanel">
          <p>This tab is valid.</p>
        </div>
        <div class="tab-pane fade" id="invalid-pane" role="tabpanel">
          <p>This tab contains invalid fields.</p>
          <input class="is-invalid" value="Error here">
        </div>
      </div>
    </fucodo-tabs>
  `;

  return host;
};
WithValidationErrors.args = {
  key: 'validation-demo',
};
