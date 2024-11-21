import {LitElement, html, css} from 'lit';
import ImageCropElement from "@github/image-crop-element";

export class ImageCrop extends LitElement {
  static get properties() {
    return {
      x: {type: Number},
      y: {this: Number},
      width: {type: Number},
      height: {type: Number},
    };
  }

  constructor() {
    super();

    // TODO remove

    this.x = 0;
    this.y = 0;
    this.width = 1024;
    this.height = 1024;
  }

  static get styles() {
    return css`
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
        
        .dialog__actions {
            display: flex;
            gap: 0.5rem;
            width: 100%;
            justify-content: flex-end;
            align-items: center;
        }
    `;
  }

  render() {
    return html`
        <slot @change="${this.handleChange}"></slot>
        
        <dialog class="dialog">
            <div class="dialog__content">
                <image-crop></image-crop>
                <div class="dialog__actions">
                    <button @click="${this.handleClose}">Close</button>
                    <button @click="${this.handleConfirm}">Confirm</button>
                </div>
            </div>
        </dialog>
    `;
  }

  handleChange(event) {
    const dialog = this.renderRoot.querySelector('dialog');
    const imageCrop = this.renderRoot.querySelector('image-crop');

    if (event.target.files === 0) {
      return;
    }

    imageCrop.src = URL.createObjectURL(event.target.files[0]);

    dialog.showModal();
  }

  handleClose(event) {
    event.preventDefault();

    this.renderRoot.querySelector('dialog')?.close();
  }

  handleConfirm(event) {
    event.preventDefault();

    this.cropImage();

    this.renderRoot.querySelector('dialog').close();
  }

  cropImage() {
    const input = this.renderRoot.querySelector('slot').assignedElements()[0];

    console.log(input.files);

    const canvas = document.createElement('canvas');

    let base = new Image();

    base.src = this.renderRoot.querySelector('image-crop').src;

    canvas.height = 500;
    canvas.width = 500;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(base, this.x, this.y, this.width, this.height, 0, 0, 500, 500);

    canvas.toBlob(function (blob) {
      const file = new File([blob], 'foo.png', {type: 'image/png'});

      const transfer = new DataTransfer();

      transfer.items.add(file);
      input.files = transfer.files;
    })
  }

  connectedCallback() {
    super.connectedCallback();

    document.addEventListener('image-crop-change', (event) => {
      this.x = event.detail.x;
      this.y = event.detail.y;
      this.width = event.detail.width;
      this.height = event.detail.height;
    });
  }
}

customElements.define('image-crop-dialog', ImageCrop);