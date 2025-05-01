import '../packages/imagecrop/dist/index';

export default {
  title: 'Components/ImageCrop',
};

export const Default = () => {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
    <form>
      <image-crop-dialog width="600" height="800">
        <input type="file" accept="image/png, image/jpeg, image/tiff" name="picture">
        <span slot="label-cancel">Abbrechen</span>
        <span slot="label-confirm">Bestätigen</span>
      </image-crop-dialog>
      <button id="foo">Submit</button>
    </form>
    <div id="result"></div>
  `;

  const form = wrapper.querySelector('form');
  const submit = wrapper.querySelector('#foo');

  submit.addEventListener('click', (event) => {
    event.preventDefault();

    const data = new FormData(form, submit);

    for (const value of data.entries()) {
      if (value[0] !== 'picture') continue;

      const img = document.createElement('img');
      img.src = URL.createObjectURL(value[1]);

      const result = wrapper.querySelector('#result');

      result.innerHTML = '';
      result.appendChild(img);
    }
  });

  return wrapper;
};