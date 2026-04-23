import { type PropsWithChildren } from 'react';
import { useAppShell } from './app-shell.hooks';
import { LanguageSwitcher } from './language-switcher';
import { Navigator } from './navigator';

export function AppShell({ children }: PropsWithChildren) {
  const { meta } = useAppShell();

  // return (
  //   <section className="app-shell">
  //     <aside className="sidebar">
  //       <div className="sidebar-brand">
  //         <span className="app-title">{meta.name}</span>
  //         <span className="app-subtitle">{meta.version}</span>
  //         <LanguageSwitcher />
  //       </div>
  //       <Navigator />
  //     </aside>
  //     <main className="content">{children}</main>
  //   </section>
  // );

  return (
    <div className="flex flex-col gap-2 p-2 overflow-auto">
      <table>
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 1</td>
            <td>Cell 1</td>
          </tr>
        </tbody>
      </table>
      {/*
      <div>
        <button>Open Modal</button>
        <div className="modal">
          <div className="modal-container">
            <div className="header">Header</div>
            <div className="content">Content</div>
            <div className="footer">Footer</div>
          </div>
        </div>
      </div> */}
    </div>
  );
}
