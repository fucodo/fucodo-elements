import './main.scss';

import '../node_modules/image-crop-dialog/index.min.js';

const form = document.querySelector('form');
const submit = document.getElementById('foo');

submit.addEventListener('click', (event) => {
  event.preventDefault();

  let data = new FormData(form, submit);

  console.log(data);

  for (const value of data.entries()) {
    if (value[0] !== 'picture') {
      continue;
    }

    const img = document.createElement('img');
    img.src = URL.createObjectURL(value[1]);

    const result = document.getElementById("result");

    result.innerHTML = '';
    result.appendChild(img);
  }
});