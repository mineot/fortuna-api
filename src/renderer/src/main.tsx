import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { initializeI18n } from './i18n';
import './styles/global.css';

async function bootstrap(): Promise<void> {
  await initializeI18n();

  const container = document.getElementById('app');
  if (!container) {
    throw new Error('Renderer root element #app not found.');
  }

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
