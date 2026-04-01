import { Routes } from '@angular/router';

import { Home } from '@pages/home/home';
import { Languages } from '@pages/languages/languages';
import { Types } from '@app/pages/registers/types/types';

export const APP_ROUTES_MAP = {
  configurations: {
    languages: '/configs/langs',
  },
  registers: {
    types: '/registers/types',
  },
};

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'configs',
    children: [
      {
        path: 'langs',
        component: Languages,
      },
    ],
  },
  {
    path: 'registers',
    children: [
      {
        path: 'types',
        component: Types,
      },
    ],
  },
];
