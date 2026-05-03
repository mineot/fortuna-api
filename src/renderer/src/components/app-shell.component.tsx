import type { AppShellProps } from './app-shell.types';
import { useAppShell } from './app-shell.hooks';

export function AppShell({ children }: AppShellProps) {
  const { meta } = useAppShell();

  return (
    <section className="flex-fill d-flex gap-1 overflow-hidden">
      <aside className="d-flex flex-column gap-1 p-1 bg-body-tertiary">
        <div>
          <h3 className="m-0">{meta.name}</h3>
          <small className="text-white-50">{meta.version}</small>
        </div>
      </aside>
      <main className="flex-fill d-flex flex-column gap-0 p-1">{children}</main>
    </section>
  );
}
