import '../dist/index.js';

export default {
  title: 'Components/Table/fucodo-table-collapsible',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Wrap a regular HTML <table> with <fucodo-table-collapsible>. Use <tbody> with data-group attribute to create collapsible groups.',
      },
    },
  },
};

const Template = () => {
  return `
    <fucodo-table-collapsible>
      <table>
        <thead>
          <tr>
            <th>Projekt</th>
            <th>Status</th>
            <th>Bearbeiter</th>
            <th>Fällig</th>
          </tr>
        </thead>

        <tbody data-group="Frontend" data-open="true">
          <tr><td>Login-Seite</td><td>✅ Fertig</td><td>Kay</td><td>01.06.2026</td></tr>
          <tr><td>Dashboard-Layout</td><td>🔄 In Arbeit</td><td>Mia</td><td>15.06.2026</td></tr>
          <tr><td>Dark Mode</td><td>⏳ Offen</td><td>Kay</td><td>20.06.2026</td></tr>
        </tbody>

        <tbody data-group="Backend">
          <tr><td>REST API</td><td>✅ Fertig</td><td>Ben</td><td>28.05.2026</td></tr>
          <tr><td>Auth-Service</td><td>🔄 In Arbeit</td><td>Lea</td><td>12.06.2026</td></tr>
          <tr><td>Datenbank-Migration</td><td>⏳ Offen</td><td>Ben</td><td>25.06.2026</td></tr>
          <tr><td>Cache-Layer</td><td>⏳ Offen</td><td>Lea</td><td>30.06.2026</td></tr>
        </tbody>

        <tbody data-group="DevOps">
          <tr><td>CI/CD Pipeline</td><td>✅ Fertig</td><td>Jo</td><td>01.05.2026</td></tr>
          <tr><td>Monitoring Setup</td><td>🔄 In Arbeit</td><td>Jo</td><td>18.06.2026</td></tr>
        </tbody>
      </table>
    </fucodo-table-collapsible>
  `;
};

export const Default = Template.bind({});
