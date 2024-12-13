import {LitElement, html, css} from 'lit';

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline';
import {TaskList} from '@tiptap/extension-task-list';
import {TaskItem} from '@tiptap/extension-task-item';

import {Markdown} from "tiptap-markdown";

class MyEditor extends LitElement {
  static get styles() {
    return css`
        :host {
            min-width: 600px;
        }
        
        .toolbar {
            margin: 20px 0;
        }

        .tiptap :first-child {
            margin-top: 0;
        }

        .tiptap ul, .tiptap ol {
            padding: 0 1rem;
            margin: 1.25rem 1rem 1.25rem 0.4rem;
        }

        .tiptap ul li p, .tiptap ol li p {
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }

        .tiptap ul[data-type="taskList"] {
            list-style: none;
            margin-left: 0;
            padding: 0;
        }

        .tiptap ul[data-type="taskList"] li {
            align-items: flex-start;
            display: flex;
        }

        .tiptap ul[data-type="taskList"] li > label {
            flex: 0 0 auto;
            margin-right: 0.5rem;
            user-select: none;
        }

        .tiptap ul[data-type="taskList"] li > div {
            flex: 1 1 auto;
        }

        .tiptap ul[data-type="taskList"] input[type="checkbox"] {
            cursor: pointer;
        }

        .tiptap ul[data-type="taskList"] ul[data-type="taskList"] {
            margin: 0;
        }
    `;
  }

  render() {
    return html`
        <div class="toolbar">
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
        TaskList,
        TaskItem,
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
