import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main class="shell">
      <h1>Fortuna Web</h1>
      <p>Angular bootstrap concluido.</p>
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .shell {
        margin: 0 auto;
        max-width: 960px;
        padding: 24px;
      }
    `,
  ],
})
export class AppComponent {}
