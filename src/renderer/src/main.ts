import type { Types } from '@db/schema';

function buildRows(types: Types[]): string {
  if (types.length === 0) {
    return '<tr><td colspan="3">No data yet</td></tr>';
  }

  return types
    .map((item) => `<tr><td>${item.id}</td><td>${item.group}</td><td>${item.value}</td></tr>`)
    .join('');
}

async function render(): Promise<void> {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) {
    return;
  }

  if (!window.fortuna?.listTypes) {
    app.innerHTML = `
      <section class="card">
        <h1>Fortuna</h1>
        <p>Renderer API is unavailable. Check preload/IPC initialization.</p>
      </section>
    `;
    return;
  }

  const types = await window.fortuna.listTypes();

  app.innerHTML = `
    <section class="card">
      <h1>Fortuna</h1>
      <p>Types received from Electron main process.</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Group</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          ${buildRows(types)}
        </tbody>
      </table>
    </section>
  `;
}

const style = document.createElement('style');
style.textContent = `
  :root {
    font-family: Arial, sans-serif;
    color: #1f2937;
    background: #f4f5f7;
  }

  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
  }

  .card {
    min-width: 520px;
    text-align: center;
    padding: 2rem;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }

  h1 {
    margin: 0 0 0.5rem;
    font-size: 1.75rem;
  }

  p {
    margin: 0 0 1rem;
    color: #4b5563;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 0.5rem;
    text-align: left;
  }

  th {
    background: #f9fafb;
  }
`;

document.head.append(style);

void render();
