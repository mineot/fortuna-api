import { BrowserRouter } from 'react-router-dom';

import { AppShell } from '@components';
import { AppRoutes } from '@router';

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  );
}
