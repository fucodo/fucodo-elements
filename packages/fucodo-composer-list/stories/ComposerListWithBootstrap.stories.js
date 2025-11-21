import '../dist/index';

export default {
  title: 'Apps/DataSources/ComposerList/WithBootstrap',
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

const Template = ({ vendor = 'symfony', type = 'library', page = 1, perPage = 25, sort = 'downloads', exactVendor = 1 }) => {
  // Render story inside a Shadow DOM and import Bootstrap only for this story
  const host = document.createElement('div');
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
    <main class="container my-4">
      <div class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">Composer Packages</h5>
            </div>
            <div class="card-body">
              <fucodo-composer-list
                vendor="${vendor}"
                excact-vendor="${exactVendor}"
                type="${type}"
                page="${page}"
                per-page="${perPage}"
                sort="${sort}"
              ></fucodo-composer-list>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
  return host;
};

export const WithBootstrap = Template.bind({});
WithBootstrap.args = {
  vendor: 'fucodo',
  exactVendor: true,
  type: '',
  page: 1,
  perPage: 25,
  sort: 'downloads',
};
