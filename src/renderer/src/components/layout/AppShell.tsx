import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Fortuna</h1>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/types" className={({ isActive }) => (isActive ? 'active' : '')}>
            Types
          </NavLink>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
