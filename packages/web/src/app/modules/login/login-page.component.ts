import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service.js';

@Component({
  selector: 'app-login-page',
  template: `
    <section>
      <h2>Login</h2>
      <p>Página técnica mínima para validação de guard/sessão.</p>
      <form (submit)="onSubmit($event, email.value, password.value)">
        <label>
          Email
          <input #email type="email" required />
        </label>
        <label>
          Senha
          <input #password type="password" required />
        </label>
        <button type="submit" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      @if (errorMessage) {
        <p>{{ errorMessage }}</p>
      }
    </section>
  `,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected isSubmitting = false;
  protected errorMessage: string | null = null;

  onSubmit(event: Event, email: string, password: string): void {
    event.preventDefault();

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService
      .login({ email: email.trim(), password })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
        }),
      )
      .subscribe({
        next: () => {
          void this.router.navigateByUrl('/');
        },
        error: (error: { message?: string }) => {
          this.errorMessage = error.message ?? 'Falha no login.';
        },
      });
  }
}
