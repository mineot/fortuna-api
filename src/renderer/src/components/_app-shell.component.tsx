import type { AppShellProps } from './_app-shell.types';
import { Table } from '@widgets';

export function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <div>
        <Table columns={[]} rows={[]} />
      </div>
      <div>{children}</div>
    </div>
  );
}
