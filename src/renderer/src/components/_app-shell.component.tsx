import type { AppShellProps } from './_app-shell.types';
import { Input } from '@widgets';

export function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <div>
        <Input id="test" label="Teste" />
      </div>
      <div>{children}</div>
    </div>
  );
}
