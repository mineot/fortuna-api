const app = document.querySelector('#app');

if (app) {
  app.innerHTML = `
    <section class="card">
      <h1>Fortuna</h1>
      <p>Electron + Vite renderer is running.</p>
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
    margin: 0;
    color: #4b5563;
  }
`;

document.head.append(style);
