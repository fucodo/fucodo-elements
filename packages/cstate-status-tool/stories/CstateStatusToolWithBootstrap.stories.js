import '../index.js';

export default {
  title: 'Apps/CstateStatusTool/WithBootstrap',
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    base: { control: { type: 'text' }, description: 'Data URL or URL to cState JSON (base attribute)' },
    defaultDetails: { control: { type: 'text' }, description: 'Default text template for the details field' },
  },
};

const Template = ({ base, defaultDetails }) => {
  const host = document.createElement('div');
  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />

    <main class="container my-4">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-10">
          <div class="card shadow-sm">
            <div class="card-header">
              <h5 class="card-title mb-0">cState Status Tool</h5>
            </div>
            <div class="card-body">
              <cstate-status-tool
                base='${base}'
                defaultDetails="${defaultDetails}"
              >
                <textarea name="content" slot="details-field"></textarea>
                <input type="text" name="filename" slot="filename-field" />
              </cstate-status-tool>
            </div>
            <div class="card-footer">
                <button type="submit" class="btn btn-primary" id="copy-button">Send</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

    // shadow.querySelector('form').addEventListener('click', () => {
    //     console.log('clicked');
    // });
//
  return host;
};

export const WithBootstrap = Template.bind({});
WithBootstrap.args = {
  base:
    '{"is":"index","cStateVersion":"5.6.1","apiVersion":"2.0","title":"Verfügbarkeit digitaler Dienste für Schulen in Sachsen","languageCodeHTML":"de","languageCode":"de","baseURL":"https://status.schullogin.de","description":"<no value>","summaryStatus":"disrupted","categories":[{"name":"Schullogin","hideTitle":false,"closedByDefault":false},{"name":"Dienste in Schullogin","hideTitle":false,"closedByDefault":false},{"name":"MeSax / LernSax","hideTitle":false,"closedByDefault":false},{"name":"Sächsischer Bildungsserver","hideTitle":false,"closedByDefault":false},{"name":"Sonstige","hideTitle":false,"closedByDefault":true}],"pinnedIssues":[],"systems":[{"name":"Anmeldung","category":"Schullogin","status":"disrupted","unresolvedIssues":[{"is":"issue","title":"Schullogin: vereinzelte Anmelde-Probleme bei SaxSVS-Accounts","createdAt":"2025-09-10 10:00:00 +0000 UTC","lastMod":"2025-09-12 19:20:02 +0200 +0200","permalink":"https://status.schullogin.de/issues/2025-09-10t1000--schullogin_vereinzelte_anmelde-probleme_saxsvs-accounts/","severity":"disrupted","resolved":false,"informational":false,"resolvedAt":"<no value>","affected":["Anmeldung"],"filename":"2025-09-10T1000--Schullogin_vereinzelte_Anmelde-Probleme_SaxSVS-Accounts.md"}]},{"name":"Support","category":"Schullogin","status":"ok","unresolvedIssues":[]},{"name":"Schnittstellen","category":"Schullogin","status":"ok","unresolvedIssues":[]},{"name":"Nachrichten","category":"Dienste in Schullogin","status":"ok","unresolvedIssues":[]},{"name":"Dateiablage","category":"Dienste in Schullogin","status":"ok","unresolvedIssues":[]},{"name":"Videokonferenz","category":"Dienste in Schullogin","status":"ok","unresolvedIssues":[]}]}',
  defaultDetails:
    'Kurzbeschreibung der Störung/Wartung ({{SYSTEMS}}).\n\nZeitpunkt: {{DATETIME}}\n\n{{STAND}}',
};
