import { Routes } from '@angular/router';

import { Home } from '@pages/home/home';
import { Languages } from '@pages/languages/languages';
import { Types } from '@pages/adds/types/types';

export const APP_ROUTES_MAP = {
  configurations: {
    languages: '/configs/langs',
  },
  adds: {
    types: '/adds/types',
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
    path: 'adds',
    children: [
      {
        path: 'types',
        component: Types,
      },
    ],
  },
];
