import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { LanguageSwitcher } from './LanguageSwitcher';

type NavItem = {
  route: string;
  label: string;
};

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { route: '/', label: t('app.nav.home') },
    { route: '/types', label: t('app.nav.types') },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="sidebar-title">{t('app.title')}</h1>
        <LanguageSwitcher />
        <nav className="sidebar-nav">
          {navItems.map(({ route, label }) => (
            <NavLink
              key={route}
              to={route}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
