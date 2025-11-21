import '../dist/index';

export default {
  title: 'Components/Fundamentals/ImageCrop/Default',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: { control: { type: 'number', min: 50, step: 10 }, description: 'Target crop width (px)', table: { defaultValue: { summary: 600 } } },
    height: { control: { type: 'number', min: 50, step: 10 }, description: 'Target crop height (px)', table: { defaultValue: { summary: 800 } } },
  },
};

const Template = ({ width = 600, height = 800 }) => {
  const wrapper = document.createElement('main');

  wrapper.innerHTML = `
    <form>
      <image-crop-dialog width="${width}" height="${height}">
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

export const Default = Template.bind({});
Default.args = {
  width: 600,
  height: 800,
};