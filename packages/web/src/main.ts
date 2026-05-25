import { bootstrapApplication } from '@angular/platform-browser';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { AppComponent } from './app/app.component.js';
import { appConfig } from './app/app.config.js';

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
  console.error(error);
});
