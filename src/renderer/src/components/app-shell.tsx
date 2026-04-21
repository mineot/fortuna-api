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
      <div>
        <button>Button Normal</button>
      </div>
      <div>
        <button className="flat">Button Flat</button>
      </div>
      <div className="input-group">
        <label htmlFor="test-input">Label</label>
        <input id="test-input" type="text" placeholder="Text Input" />
      </div>
      <div className="input-group linear">
        <label htmlFor="test-input-linear">Label</label>
        <input id="test-input-linear" type="text" placeholder="Text Input Linear" />
      </div>
      <div className="input-group checkbox">
        <input id="test-input-checkbox" type="checkbox" placeholder="checkbox" />
        <label htmlFor="test-input-checkbox">Label</label>
      </div>
      <div className="input-group radio">
        <input id="test-input-radio" type="radio" placeholder="radio" name="radio-text" value="1" />
        <label htmlFor="test-input-radio">Label</label>
      </div>
      <div className="input-group radio">
        <input id="test-input-radio-2" type="radio" placeholder="radio" name="radio-text" value="2" />
        <label htmlFor="test-input-radio-2">Label</label>
      </div>
      <div>
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
      </div>
      <div>
        <button>Open Modal</button>
        <div className="modal">
          <div className="modal-container">
            <div className="header">Header</div>
            <div className="content">Content</div>
            <div className="footer">Footer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
