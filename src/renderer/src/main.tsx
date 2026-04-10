import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles/global.css';

const container = document.getElementById('app');
if (!container) {
  throw new Error('Renderer root element #app not found.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
