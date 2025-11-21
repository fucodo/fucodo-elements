import '../dist/index';

export default {
  title: 'Components/Fundamentals/ImageCrop/With Bootstrap',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: { type: 'number', min: 50, step: 10 }, description: 'Target crop width (px)', table: { defaultValue: { summary: 600 } } },
    height: { control: { type: 'number', min: 50, step: 10 }, description: 'Target crop height (px)', table: { defaultValue: { summary: 800 } } },
  },
};

// Usage with Bootstrap-like markup and custom slot labels (icons + text)
const BootstrapTemplate = ({ width = 600, height = 800 }) => {
  const wrapper = document.createElement('main');

  wrapper.innerHTML = `
    <form>
      <image-crop-dialog width="${width}" height="${height}">
        <input accept="image/png, image/jpeg, image/tiff" capture="user" class="form-control" id="uploader-passbild" type="file" name="object[passbild]">
        <span slot="label-cancel">
          <span style="display:inline-block; width:16px; height:16px;fill:currentColor;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16" style="display:block;">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"></path>
            </svg>
          </span>
          Abbrechen
        </span>
        <span slot="label-confirm">
          <span style="display:inline-block; width:16px; height:16px;fill:currentColor;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16" style="display:block;">
              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"></path>
            </svg>
          </span>
          Bestätigen
        </span>
      </image-crop-dialog>
      <button id="foo" class="btn btn-primary">Submit</button>
    </form>
    <div id="result"></div>
  `;

  const form = wrapper.querySelector('form');
  const submit = wrapper.querySelector('#foo');

  submit.addEventListener('click', (event) => {
    event.preventDefault();

    const data = new FormData(form, submit);

    for (const value of data.entries()) {
      if (value[0] !== 'object[passbild]') continue;

      const img = document.createElement('img');
      img.src = URL.createObjectURL(value[1]);

      const result = wrapper.querySelector('#result');

      result.innerHTML = '';
      result.appendChild(img);
    }
  });

  return wrapper;
};

export const WithBootstrap = BootstrapTemplate.bind({});
WithBootstrap.args = {
  width: 600,
  height: 800,
};
