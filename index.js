import {LitElement, html} from 'lit';

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';

import {Markdown} from "tiptap-markdown";

class MyEditor extends LitElement {
  render() {
    return html`
        <div>
            <button @click="${this.handleBold}">Bold</button>
            <button @click="${this.handleItalic}">Italic</button>
            <button @click="${this.handleUnderline}">Underline</button>
            <button @click="${this.handleStrike}">Strike</button>
        </div>
        <span id="editor"></span
    `;
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
        Underline,
        Markdown,
      ],
      content: '<p>Hello World!</p>',
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.editor.destroy();
  }

  handleBold() {
    this.editor.chain().focus().toggleBold().run();
  }

  handleItalic() {
    this.editor.chain().focus().toggleItalic().run();
  }

  handleUnderline() {
    this.editor.chain().focus().toggleUnderline().run();
  }

  handleStrike() {
    this.editor.chain().focus().toggleStrike().run();
  }

  getMarkdown() {
    return this.editor.storage.markdown.getMarkdown();
  }
}

customElements.define('fucodo-editor', MyEditor);
