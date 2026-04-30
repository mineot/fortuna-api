import { type PropsWithChildren } from 'react';
import { CrudTableWidget } from '@widgets';
// import { useAppShell } from './app-shell.hooks';
// import { LanguageSwitcher } from './language-switcher';
// import { NavLink } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

export function AppShell({ children }: PropsWithChildren) {
  // const { meta, pathName } = useAppShell();
  // const { t } = useTranslation();
  // return (
  //   <div className="app-shell">
  //     <header>
  //       <h1 className="flex gap-1">
  //         <span>{meta.name}</span>
  //         <span>[{meta.version}]</span>
  //       </h1>
  //       <LanguageSwitcher />
  //       <nav>
  //         <i className="icon-settings-2"></i>
  //         <i className="icon-mail"></i>
  //         <NavLink to="/" title={t('app.navigator.home')}>
  //           <i className="icon-house"></i>
  //         </NavLink>
  //         <i className="icon-menu"></i>
  //       </nav>
  //     </header>
  //     <main>{children}</main>
  //     <footer>
  //       <h2>{pathName}</h2>
  //       <nav>
  //         <button>Btn 1</button>
  //         <button>Btn 2</button>
  //         <button>Btn 3</button>
  //       </nav>
  //     </footer>
  //   </div>
  // );

  // return (
  //   // <section className="flex-1 flex gap-0 overflow-hidden">
  //   //   <aside className="p-2 bg-blue-500">
  //   //     <div>Brand</div>
  //   //     <div>Language</div>
  //   //     <div>Accounts</div>
  //   //     <div>Categories</div>
  //   //     <div>Etc...</div>
  //   //   </aside>
  //   //   <section className="flex-1 flex flex-col gap-0">
  //   //     <header className="bg-yellow-500">Header</header>
  //   //     <main className="flex-1 bg-purple-500">Main</main>
  //   //     <footer className="bg-pink-500">Footer</footer>
  //   //   </section>
  //   // </section>
  // );

  return <CrudTableWidget />;
}
