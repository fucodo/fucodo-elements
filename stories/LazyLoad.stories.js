import '../packages/lazyload/dist/index'; // import your LazyLoad definition

export default {
  title: 'Components/LazyLoad',
};

export const Default = () => {
  const wrapper = document.createElement('main');

  wrapper.innerHTML = `
    <lazy-load url="lazy.html">
      <span aria-busy="true">Loading...</span>
    </lazy-load>
  `;

  return wrapper;
};