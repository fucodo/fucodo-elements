import '../dist/index.js';

const menu = [
  { title: 'Als Privatperson spenden', link: '#privat', children: [
    { title: 'Jetzt spenden', link: '#jetzt' },
    { title: 'Pate werden', link: '#pate' },
    { title: 'Spenden zu einem Anlass', link: '#anlass' },
  ] },
  { title: 'Dauerspender werden', link: '#dauer' },
  { title: 'Philanthropisches Engagement', link: '#engagement', children: [
    { title: 'Als Unternehmen engagieren', link: '#unternehmen' },
  ] },
  { title: 'Spenden statt Schenken', link: '#schenken' },
];

export default {
  title: 'Components/fucdo-nested-menu',
  parameters: { layout: 'fullscreen' },
};

export const Default = () => {
  const host = document.createElement('div');
  host.innerHTML = `
    <header style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:1rem 2rem;background:white">
      <span style="font:600 1rem Arial;color:#222">Title</span>
      <button type="button" data-menu-trigger style="border:0;background:white;color:#222;font:600 1rem Arial;cursor:pointer">Spenden</button>
      <span></span>
    </header>
    <main style="height:70vh;display:grid;place-items:center;background:linear-gradient(120deg,#566879,#17212a);color:white">
      <h1>Content</h1>
    </main>
    <fucdo-nested-menu trigger="[data-menu-trigger]" data-menu='${JSON.stringify(menu)}'></fucdo-nested-menu>
  `;
  return host;
};
