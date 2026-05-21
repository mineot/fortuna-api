import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard.js';
import { guestGuard } from './core/guards/guest.guard.js';

import { HomePageComponent, LoginPageComponent } from './pages/index.js';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: HomePageComponent,
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    component: LoginPageComponent,
  },
];
