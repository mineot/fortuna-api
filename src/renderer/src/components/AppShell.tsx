import type { AppShellProps } from './app-shell.types';
import { CrudTable } from '@components';

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="p-10">
      <CrudTable />
      {/* <div>{children}</div> */}
    </div>
  );
}
