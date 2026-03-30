import './window.global';
import { App } from './app/app';
import { bootstrapApplication } from '@angular/platform-browser';
import { LanguageService } from './app/i18n/language.service';
import { provideAppInitializer, inject } from '@angular/core';

bootstrapApplication(App, {
  providers: [
    provideAppInitializer(() => {
      const languageService = inject(LanguageService);
      return languageService.init();
    }),
  ],
}).catch((error) => console.error(error));
