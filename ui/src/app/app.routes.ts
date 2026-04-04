import { Routes } from '@angular/router';

import { HomePage } from '@pages/home/home.page';
import { TypeFormPage } from '@pages/registers/types/type-form/type-form.page';
import { TypesPage } from '@pages/registers/types/types.page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'registers/types',
    component: TypesPage,
  },
  {
    path: 'registers/types/create',
    component: TypeFormPage,
  },
  {
    path: 'registers/types/:id/edit',
    component: TypeFormPage,
  },
];
