import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AuthSessionService } from './core/auth/auth-session.service.js';
import { authInterceptor } from './core/http/auth.interceptor.js';
import { httpErrorInterceptor } from './core/http/http-error.interceptor.js';
import { routes } from './app.routes.js';

const initializeSession = () => {
  const session = inject(AuthSessionService);
  return () => session.initializeFromStorage();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeSession,
    },
  ],
};
