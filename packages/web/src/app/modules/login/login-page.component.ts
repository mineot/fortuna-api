import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthSessionService } from '../../core/auth/auth-session.service.js';

@Component({
  selector: 'app-login-page',
  template: `
    <section>
      <h2>Login</h2>
      <p>Página técnica mínima para validação de guard/sessão.</p>
      <button type="button" (click)="simulateLogin()">Simular Login</button>
    </section>
  `,
})
export class LoginPageComponent {
  private readonly session = inject(AuthSessionService);
  private readonly router = inject(Router);

  simulateLogin(): void {
    this.session.setAccessToken('dev-token');
    void this.router.navigateByUrl('/');
  }
}
