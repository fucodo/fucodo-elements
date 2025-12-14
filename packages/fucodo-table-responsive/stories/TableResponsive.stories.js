import '../dist/index.js';

export default {
  title: 'Components/Table/fucodo-table-responsive',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Wrap a regular HTML <table> with <fucodo-table-responsive>. It switches to a stacked mobile layout when the available width is smaller than the table’s natural width (or the optional min-width attribute).',
      },
    },
  },
  argTypes: {
    containerWidth: {
      control: { type: 'range', min: 240, max: 1200, step: 10 },
      description: 'Width of the demo container to simulate responsiveness.',
      table: { category: 'demo' },
    },
    minWidth: {
      control: { type: 'text' },
      description: 'Optional min-width attribute (e.g., 720 or 720px). If omitted, width is auto-measured.',
      table: { category: 'attributes' },
    },
  },
};

const DemoTable = () => `
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>SKU</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Coffee Beans</td>
        <td>CAF-001</td>
        <td>$12.90</td>
        <td>In stock</td>
        <td>Single origin, medium roast</td>
      </tr>
      <tr>
        <td>Earl Grey Tea</td>
        <td>TEA-010</td>
        <td>$7.50</td>
        <td>Low</td>
        <td>Bergamot aroma</td>
      </tr>
      <tr>
        <td>French Press</td>
        <td>GEAR-1337</td>
        <td>$32.00</td>
        <td>Backorder</td>
        <td>Borosilicate glass</td>
      </tr>
    </tbody>
  </table>
`;

const Template = ({ containerWidth = 900, minWidth }) => {
  const host = document.createElement('div');
  host.style.width = `${containerWidth}px`;
  host.style.maxWidth = '100%';
  host.style.border = '1px dashed #ccc';
  host.style.padding = '8px';
  host.style.borderRadius = '8px';

  const attr = minWidth ? ` min-width="${minWidth}"` : '';
  host.innerHTML = `
    <fucodo-table-responsive${attr}>
      ${DemoTable()}
    </fucodo-table-responsive>
  `;
  return host;
};

export const Default = Template.bind({});
Default.args = {
  containerWidth: 900,
  minWidth: '',
};

export const NarrowContainer = Template.bind({});
NarrowContainer.args = {
  containerWidth: 420,
  minWidth: '',
};

export const CustomMinWidth = Template.bind({});
CustomMinWidth.args = {
  containerWidth: 600,
  minWidth: '720',
};
