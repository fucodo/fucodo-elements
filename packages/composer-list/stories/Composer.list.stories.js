import '../dist/index';

export default {
  title: 'Apps/DataSources/ComposerList',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
      vendor: { control: { type: 'text' } },
      exactVendor: { control: { type: 'boolean' } },
      type: { control: { type: 'text' } },
      page: { control: { type: 'number' } },
      perPage: { control: { type: 'number', min: 1, max: 50, step: 1, description: 'Max: 50' } },
      sort: { control: { type: 'text' } },
  },
};

const Template = ({ vendor = 'symfony', type = 'library', page = 1, perPage = 25, sort = 'downloads', exactVendor = 1}) => {
  const wrapper = document.createElement('main');
  wrapper.innerHTML = `
    <fucodo-composer-list
        vendor="${vendor}"
        excact-vendor="${exactVendor}"
        type="${type}"
        page="${page}"
        per-page="${perPage}"
        sort="${sort}"
        >
    </fucodo-modal-once>
  `;
  const el = wrapper.querySelectorAll('fucodo-composer-list').item(0);
  return el;
};

export const Default = Template.bind({});
Default.args = {
    vendor: 'fucodo',
    exactVendor: true,
    type: '',
    page: 1,
    perPage: 25,
    sort: 'downloads',
};
