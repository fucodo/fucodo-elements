import {LitElement, html, css} from 'lit';

import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {TaskList} from '@tiptap/extension-task-list';
import {TaskItem} from '@tiptap/extension-task-item';
import {Image} from '@tiptap/extension-image';
import {CodeBlock} from '@tiptap/extension-code-block';
import {Link} from '@tiptap/extension-link';

import {Markdown} from "tiptap-markdown";

import * as icons from './icons'

class MyEditor extends LitElement {
  static get styles() {
    return css`
        :host {
            min-width: 600px;
            max-width: 600px;
            height: 400px;
        }
        
        .toolbar {
            display: flex;
            height: 24px;
            width: 100%;
            padding: 10px;
            justify-content: start;
            align-items: center;
            gap: 4px;
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
      
        .editor {
            padding: 10px 18px;
        }
      
        .editor:focus {
            outline: none;
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
        }

        .tiptap img.ProseMirror-selectednode {
            outline: 3px solid #6a00f5;
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

        .tiptap a {
            color: #6a00f5;
            cursor: pointer;
        }
        .tiptap a:hover {
            color: #5800cc;
        }

        .markdown-input {
            display: block;
            height: calc(100% - 44px);
            padding: 10px 18px;
            background-color: white;
            color: black;
            font-family: monospace;
            font-size: 14px;
            border: none;
            resize: none;
            outline: none;
            width: 100%;
            box-sizing: border-box;
            position: relative;
        }
    `;
  }

  render() {
    return html`
        <slot></slot>
        <div class="toolbar">
            <button class="button" aria-label="bold" @click="${() => {this.editor.chain().focus().toggleBold().run()}}"><div class="icon" .innerHTML=${icons.boldIcon}></div></button>
            <button class="button" aria-label="italic" @click="${() => {this.editor.chain().focus().toggleItalic().run()}}"><div class="icon" .innerHTML=${icons.italicIcon}></div></button>
            <button class="button" aria-label="strike" @click="${() => {this.editor.chain().focus().toggleStrike().run()}}"><div class="icon" .innerHTML=${icons.strikeIcon}></div></button>
            <button class="button" aria-label="list unordered" @click="${() => {this.editor.chain().focus().toggleBulletList().run()}}"><div class="icon" .innerHTML=${icons.bulletListIcon}></div></button>
            <button class="button" aria-label="list ordered" @click="${() => {this.editor.chain().focus().toggleOrderedList().run()}}"><div class="icon" .innerHTML=${icons.orderedListIcon}></div></button>
            <button class="button" aria-label="list tasks" @click="${() => {this.editor.chain().focus().toggleTaskList().run()}}"><div class="icon" .innerHTML=${icons.taskListIcon}></div></button>
            <label class="button"><div class="icon" .innerHTML=${icons.imageIcon}></div><input type="file" accept="image/*"  aria-label="image upload" @change="${this.handleImageUpload}"></label>
            <button class="button" aria-label="quote" @click="${() => {this.editor.chain().focus().toggleBlockquote().run()}}"><div class="icon" .innerHTML=${icons.quoteIcon}></div></button>
            <button class="button" aria-label="undo" @click="${() => {this.editor.chain().focus().undo().run()}}" ?disabled="${!this._canUndo}"><div class="icon" .innerHTML=${icons.undoIcon}></div></button>
            <button class="button" aria-label="redo" @click="${() => {this.editor.chain().focus().redo().run()}}" ?disabled="${!this._canRedo}"><div class="icon" .innerHTML=${icons.redoIcon}></div></button>
            <button class="button" aria-label="code block" @click="${() => {this.editor.chain().focus().toggleCodeBlock().run()}}"><div class="icon" .innerHTML=${icons.codeIcon}></div></button>
            <button class="button" aria-label="link" @click="${this.handleSetLink}"><div class="icon" .innerHTML=${icons.linkIcon}></div></button>
            <button class="button" aria-label="markdown mode" @click="${this.toggleMode}"><div class="icon" .innerHTML=${icons.markdownIcon}></div></button>
        </div>
        <span class="divider"></span>
        <span id="editor" style="${this._markdownMode ? 'display: none;' : ''}"></span>
        ${this._markdownMode ? html`<textarea class="markdown-input" .value="${this._markdownText}" @input="${this.updateFromTextarea}"></textarea>` : null}
    `;
  }

  static get properties() {
    return {
      _canUndo: { state: true },
      _canRedo: { state: true },
      _markdownMode: { state: true },
      _markdownText: { state: true },
    };
  }

  constructor() {
    super();

    this._canUndo = false;
    this._canRedo = false;
    this._markdownMode = false;
    this._markdownText = '';
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
        Link,
      ],
      content: content,
      onUpdate: () => {
        this._canUndo = this.editor.can().undo();
        this._canRedo = this.editor.can().redo();
      },
      editorProps: {
        attributes: {
          class: 'editor',
        },
      },
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

  handleSetLink() {
    const previousUrl = this.editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return
    }

    if (url === '') {
      this.editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return
    }

    this.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  getMarkdown() {
    if (this._markdownMode) {
      this.editor.commands.setContent(this._markdownText);
    }

    return this.editor.storage.markdown.getMarkdown();
  }

  toggleMode() {
    if (!this._markdownMode) {
      this._markdownText = this.getMarkdown();
    } else {
      this.editor.commands.setContent(this._markdownText);
    }
    this._markdownMode = !this._markdownMode;
  }

  updateFromTextarea(event) {
    this._markdownText = event.target.value;
  }
}

customElements.define('fucodo-editor', MyEditor);
