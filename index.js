import {LitElement, html, css} from 'lit';

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {TaskList} from '@tiptap/extension-task-list';
import {TaskItem} from '@tiptap/extension-task-item';
import {Image} from '@tiptap/extension-image';
import {CodeBlock} from '@tiptap/extension-code-block';

import {Markdown} from "tiptap-markdown";

class MyEditor extends LitElement {
  static get styles() {
    return css`
        :host {
            min-width: 600px;
            max-width: 600px;
        }
        
        .toolbar {
            margin: 20px 0;
            border: 1px solid white;
            display: flex;
            border-radius: 14px;
            height: 24px;
            justify-content: start;
            align-items: center;
            padding: 0 4px;
            width: min-content;
        }
        
        .button {
            background: none;
            color: white;
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 24px;
            height: 24px;
            margin: 0;
            padding: 0;
        }

        .button:disabled {
            opacity: 0.5;
        }
        
        .icon {
            filter: invert(1);
        }

        input[type="file"] {
            display: none;
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

        .tiptap blockquote {
            border-left: 3px solid rgba(61, 37, 20, 0.12);
            margin: 1.5rem 0;
            padding-left: 1rem;
        }

        .tiptap img {
            display: block;
            height: auto;
            margin: 1.5rem 0;
            max-width: 100%;

            &.ProseMirror-selectednode {
                outline: 3px solid rgb(106, 0, 245);
            }
        }

        .tiptap pre {
            background: rgb(46, 43, 41);
            border-radius: 0.5rem;
            color: rgb(255, 255, 255);
            font-family: 'JetBrainsMono', monospace;
            margin: 1.5rem 0;
            padding: 0.75rem 1rem;
        }

        .tiptap pre code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }
    `;
  }

  render() {
    return html`
        <slot></slot>
        <div class="toolbar">
            <button class="button" @click="${() => {this.editor.chain().focus().toggleBold().run()}}"><img class="icon" src="type-bold.svg" alt="bold"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleItalic().run()}}"><img class="icon" src="type-italic.svg" alt="italic"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleStrike().run()}}"><img class="icon" src="type-strikethrough.svg" alt="strike"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleBulletList().run()}}"><img class="icon" src="list-ul.svg" alt="list unordered"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleOrderedList().run()}}"><img class="icon" src="list-ol.svg" alt="list ordered"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleTaskList().run()}}"><img class="icon" src="list-check.svg" alt="list tasks"></button>
            <label class="button"><img class="icon" src="card-image.svg" alt="image upload"><input type="file" accept="image/*" @change="${this.handleImageUpload}"></label>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleBlockquote().run()}}"><img class="icon" src="quote.svg" alt="quote"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().undo().run()}}" ?disabled="${!this._canUndo}"><img class="icon" src="arrow-counterclockwise.svg" alt="undo"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().redo().run()}}" ?disabled="${!this._canRedo}"><img class="icon" src="arrow-clockwise.svg" alt="redo"></button>
            <button class="button" @click="${() => {this.editor.chain().focus().toggleCodeBlock().run()}}"><img class="icon" src="code.svg" alt="code block"></button>
        </div>
        <span id="editor"></span>
    `;
  }

  static get properties() {
    return {
      _canUndo: {state: true},
      _canRedo: {state: true},
    };
  }

  constructor() {
    super();

    this._canUndo = false;
    this._canRedo = false;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated(_changedProperties) {
    super.firstUpdated(_changedProperties);

    let content = '';

    this.shadowRoot.querySelector('slot').assignedElements().forEach((element) => {
      if (element.tagName.toLowerCase() === 'textarea') {
        content = element.innerHTML.split('\n').map(line => line.trim()).join('\n');
      }

      element.remove();
    });

    this.editor = new Editor({
      element: this.shadowRoot.querySelector('#editor'),
      extensions: [
        StarterKit,
        TaskList,
        TaskItem,
        Image.configure({
          allowBase64: true,
        }),
        Markdown,
        CodeBlock,
      ],
      content: content,
      onUpdate: () => {
        this._canUndo = this.editor.can().undo();
        this._canRedo = this.editor.can().redo();
      }
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.editor.destroy();
  }

  handleImageUpload(event) {
    const reader = new FileReader();

    reader.onload = (event) => {
      this.editor.chain().focus().setImage({src: event.target.result}).run();
    }

    if (event.target.files.length > 0) {
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  getMarkdown() {
    return this.editor.storage.markdown.getMarkdown();
  }
}

customElements.define('fucodo-editor', MyEditor);
