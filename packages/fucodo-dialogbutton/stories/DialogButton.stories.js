// Import the component from the package source (no dist bundle present in repo)
import '../index';

export default {
  title: 'Components/fucodo-dialogbutton',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    url: { control: { type: 'text' }, description: 'URL to fetch HTML from (supports data: URL in this demo)' },
    selector: { control: { type: 'text' }, description: 'CSS selector to extract from fetched HTML' },
    dialogId: { control: { type: 'text' }, description: 'Optional ID of an existing <dialog> element to reuse' },
    label: { control: { type: 'text' }, description: 'Label of the slotted trigger content' },
  },
};

function makeDataUrl() {
  const html = `<!doctype html>
  <html><head><meta charset="utf-8"><title>Demo Content</title></head>
  <body>
    <article id="content">
      <h2 style="margin:0 0 8px 0; font-size:18px;">Loaded dialog content</h2>
      <p style="margin:0 0 8px 0;">This HTML was fetched from a <code>data:</code> URL and inserted into the dialog.</p>
      <p style="margin:0; font-size:12px; color:#666;">Close with the button in the top right or by pressing Esc.</p>
    </article>
    <div id="other" style="display:none">This section should not be selected</div>
  </body></html>`;
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

const Template = ({ url, selector = '#content', dialogId = '', label = 'Open dialog' }) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <style>
      /* Minimal styles so the dialog looks decent without Bootstrap */
      dialog.card { padding: 16px 16px 12px; border: 1px solid #ddd; border-radius: 8px; }
      .btn-close { border: 0; background: transparent; width: 24px; height: 24px; cursor: pointer; }
      .btn-close::before { content: '✕'; display:block; line-height:24px; text-align:center; color:#666; }
    </style>
    <section class="demo" style="display:flex; flex-direction:column; gap:12px; align-items:center;">
      <fucodo-dialogbutton data-demo></fucodo-dialogbutton>
    </section>
  `;

  const el = wrapper.querySelector('[data-demo]');
  if (el) {
    el.setAttribute('selector', selector || '#content');
    const effectiveUrl = url && url.trim().length ? url : makeDataUrl();
    el.setAttribute('url', effectiveUrl);
    if (dialogId) {
      el.setAttribute('dialogId', dialogId);
    } else {
      el.removeAttribute('dialogId');
    }
    // Set the slotted trigger content
    el.innerHTML = `<button type="button" class="btn-primary" style="padding:8px 12px; border-radius:6px; border:1px solid #0d6efd; background:#0d6efd; color:#fff;">${label || 'Open dialog'}</button>`;
  }

  return wrapper;
};

export const Default = Template.bind({});
Default.args = {
  url: '',
  selector: '#content',
  dialogId: '',
  label: 'Open dialog',
};
