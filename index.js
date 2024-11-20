import { LitElement, html} from 'lit';
import ImageCropElement from "@github/image-crop-element";

export class ImageCrop extends LitElement {
  static get properties() {
    return {
      x: { type: Number },
      y: { this: Number },
      width: { type: Number },
      height: { type: Number },
    };
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
        <slot></slot>
        <dialog id="foo">
            <div style="display: block; height: 500px; width: 500px; background-color: white">
                <image-crop></image-crop>
                <button id="bar">Close</button>
                <button id="baz">Confirm</button>
            </div>
        </dialog>
    `;
  }

  connectedCallback() {
    super.connectedCallback();

    const input = this.renderRoot.querySelector('input');
    // const dialog = this.renderRoot.querySelector('#foo');

    if (!input) {
      return;
    }

    input.addEventListener('change', (event) => {
      if (input.files.length !== 1) {
        return;

        // TODO remove all files except last
      }


      this.querySelector('image-crop').src = URL.createObjectURL(input.files[0]);

      this.renderRoot.querySelector('#bar').addEventListener('click', () => {
        this.renderRoot.querySelector('dialog')?.close();
      });

      this.renderRoot.querySelector('#baz').addEventListener('click', (event) => {
        event.preventDefault();

        // const dataTransfer = new DataTransfer();
        // dataTransfer.items.add(file);
        // document.getElementById('upload2').files = dataTransfer.files;

        let base = new Image();
        base.src = this.querySelector('image-crop').src;

        // const canvas = this.renderRoot.querySelector('canvas');
        const canvas = document.createElement('canvas');

        canvas.height = 500;
        canvas.width = 500;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(base, this.x, this.y, this.width, this.height, 0, 0, 500, 500);

        canvas.toBlob(function(blob) {
          const file = new File([blob], 'foo.png', {type: 'image/png'}); // TODO verify available formats

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          document.querySelector('input').files = dataTransfer.files; // not possible -> security
        })


        this.renderRoot.querySelector('dialog')?.close();
      });

      this.renderRoot.querySelector('dialog')?.showModal();
    });

    document.addEventListener('image-crop-change', (event) => {
      this.x = event.detail.x;
      this.y = event.detail.y;
      this.width = event.detail.width;
      this.height = event.detail.height;
    });
  }
}

customElements.define('image-crop-lol', ImageCrop);