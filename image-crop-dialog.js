import {LitElement, html, css} from 'lit';

import Croppie from'croppie/croppie.js';
import {croppieStyles} from "./croppie-styles";

export class ImageCrop extends LitElement {
  static get properties() {
    return {
      width: {type: Number, attribute: true},
      height: {type: Number, attribute: true},
    }
  }

  constructor() {
    super();

    this.width = 400;
    this.height = 400;
  }

  static styles = [
    croppieStyles,
    css`
        .dialog {
            width: 500px;
        }

        .dialog__content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1rem;
        }

        .dialog__body {
            width: 500px;
            height: 500px;
        }

        .dialog__actions {
            display: flex;
            gap: 0.5rem;
            width: 100%;
            justify-content: flex-end;
            align-items: center;
        }
        
        .cr-slider-wrap {
            visibility: hidden;
        }
    `,
  ];

  render() {
    return html`
        <slot @change="${this.handleChange}"></slot>
        
        <dialog class="dialog" part="dialog">
            <div class="dialog__content">
                <div class="dialog__body"></div>
                <div class="dialog__actions">
                    <button @click="${this.handleCancel}" part="button cancel">Cancel</button>
                    <button @click="${this.handleConfirm}" part="button confirm">Confirm</button>
                </div>
            </div>
        </dialog>
    `;
  }

  firstUpdated() {
    const scale = 400 / Math.max(this.width, this.height);

    this._croppie = new Croppie(this.renderRoot.querySelector('.dialog__body'), {
      viewport: {
        width: this.width * scale,
        height: this.height * scale,
        type: 'square',
        showZoomer: false,
      }
    })
  }

  handleChange(event) {
    const dialog = this.renderRoot.querySelector('dialog');

    if (event.target.files === 0) {
      return;
    }

    this._file = event.target.files[0]

    dialog.showModal();

    this._croppie.bind({
      url: URL.createObjectURL(this._file),
    });
  }

  handleCancel(event) {
    event.preventDefault();

    this.renderRoot.querySelector('slot').assignedElements().forEach((input) => {
      input.value = '';
    });

    this.renderRoot.querySelector('dialog')?.close();
  }

  handleConfirm(event) {
    event.preventDefault();

    const options = {
      type: 'rawcanvas',
      size: 'original',
      format: 'png',
      quality: 1,
      circle: false,
    }

    this._croppie.result(options).then((canvas) => {
      if (canvas.width > this.width || canvas.height > this.height) {
        this.rescaleCanvas(canvas);
      }

      // reject lower resolution crops here

      canvas.toBlob((blob) => {
        const name = this._file.name ? this._file.name.split('.').slice(0, -1).join('.') : 'image';

        const file = new File([blob], name +'.png', {type: 'image/png'});
        const input = this.renderRoot.querySelector('slot').assignedElements()[0];

        const transfer = new DataTransfer();

        transfer.items.add(file);
        input.files = transfer.files;

        this.renderRoot.querySelector('dialog').close();
      });
    });
  }

  rescaleCanvas(srcCanvas) {
    let srcContext = srcCanvas.getContext('2d');

    // there probably is way to avoid a temporary canvas using scale()
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/scale

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = this.width;
    canvas.height = this.height;

    context.drawImage(srcCanvas, 0, 0, this.width, this.height);

    srcCanvas.width = this.width;
    srcCanvas.height = this.height;

    srcContext.drawImage(canvas, 0, 0);
  }
}

customElements.define('image-crop-dialog', ImageCrop);