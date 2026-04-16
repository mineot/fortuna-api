import type { PropsWithChildren } from 'react';
import { Home, ListTree, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import { LanguageSwitcher } from './LanguageSwitcher';

type NavItem = {
  icon: LucideIcon;
  route: string;
  label: string;
};

export function AppShell({ children }: PropsWithChildren) {
  const { t } = useTranslation();

  const navItems: NavItem[] = [
    { icon: Home, route: '/', label: t('app.nav.home') },
    { icon: ListTree, route: '/types', label: t('app.nav.types') },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1 className="sidebar-title">{t('app.title')}</h1>
        <LanguageSwitcher />
        <nav className="sidebar-nav">
          {navItems.map(({ icon: Icon, route, label }) => (
            <NavLink
              key={route}
              to={route}
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              <Icon className="nav-link-icon" size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
