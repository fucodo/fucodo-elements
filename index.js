import {LitElement, html} from 'lit';

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

class MyEditor extends LitElement {
  render() {
    return html`<span id="editor"></span>`;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);

    this.editor = new Editor({
      element: this.shadowRoot.querySelector('#editor'),
      extensions: [
        StarterKit,
      ],
      content: '<p>Hello World!</p>',
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.editor.destroy();
  }
}

customElements.define('fucodo-editor', MyEditor);
