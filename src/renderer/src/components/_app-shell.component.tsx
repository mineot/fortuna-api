import type { AppShellProps } from './_app-shell.types';
import { Form } from '@components';

export function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <div>
        <Form />
      </div>
      <div>{children}</div>
    </div>
  );
}
