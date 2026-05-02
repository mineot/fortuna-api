import type { InputValue } from '@widgets';
import type { AppShellProps } from './_app-shell.types';
import { Form } from '@components';

export function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <div>
        <Form
          controls={[
            { id: 'test1', label: 'Test 1', validations: [{ rule: 'REQUIRED', message: 'Required' }] },
            { id: 'test2', label: 'Test 2' },
            { id: 'test3', label: 'Test 3' },
            { id: 'test4', label: 'Test 4' },
          ]}
          data={{
            test1: 'Valor 1',
            test2: 'Valor 2',
            test3: 'Valor 3',
            test4: 'Valor 4',
          }}
          onSubmit={(data: Record<string, InputValue>) => {
            console.log(data);
          }}
          onCancel={() => {
            console.log('Cancel');
          }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
