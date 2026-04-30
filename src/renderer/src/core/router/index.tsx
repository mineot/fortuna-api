import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage } from '@pages';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
