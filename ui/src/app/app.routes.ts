import { Routes } from '@angular/router';

import { HomePage } from '@pages/home/home.page';
import { TypesPage } from '@pages/registers/types/types.page';

export const APP_ROUTES_MAP = {
  registers: {
    types: '/registers/types',
  },
};

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'registers',
    children: [
      {
        path: 'types',
        component: TypesPage,
      },
    ],
  },
];
