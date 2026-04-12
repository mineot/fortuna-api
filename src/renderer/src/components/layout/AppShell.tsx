import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="sidebar-title">Fortuna</h1>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Home
          </NavLink>
          <NavLink
            to="/types"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            Types
          </NavLink>
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
