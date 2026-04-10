import { Navigate, Route, Routes } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { TypesPage } from '../pages/TypesPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/types" element={<TypesPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}
