import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage, RegistersPage } from '@pages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/registers" element={<RegistersPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
