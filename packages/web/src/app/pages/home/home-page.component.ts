import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `
    <section>
      <h2>Home (Protected)</h2>
      <p>Rota protegida por AuthGuard.</p>
    </section>
  `,
})
export class HomePageComponent {}
