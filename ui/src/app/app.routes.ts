import { Routes } from '@angular/router';

import { Home } from '@pages/home/home';
import { Languages } from '@pages/languages/languages';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'languages',
    component: Languages,
  },
];
