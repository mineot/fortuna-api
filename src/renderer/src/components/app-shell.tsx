import { type PropsWithChildren } from 'react';
import { useAppShell } from './app-shell.hooks';

export function AppShell({ children }: PropsWithChildren) {
  const { meta } = useAppShell();

  return (
    <section className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="app-title">{meta.name}</span>
          <span className="app-subtitle">{meta.version}</span>
          <span>Language</span>
        </div>
        <span>Navigator</span>
      </aside>
      <main className="content">{children}</main>
    </section>
  );
}
