import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { LanguageSwitcher } from './LanguageSwitcher';

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="sidebar-title">{t('app.title')}</h1>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            {t('app.nav.home')}
          </NavLink>
          <NavLink
            to="/types"
            className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
          >
            {t('app.nav.types')}
          </NavLink>
        </nav>
        <LanguageSwitcher />
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
