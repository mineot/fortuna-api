import { AuthService } from '../../core/auth/auth.service.js';
import { Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { InputComponent } from '../../components/input.component.js';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { validationHelpers } from '../../shared/index.js';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [InputComponent, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  protected isSubmitting = false;
  protected errorMessage: string | null = null;

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        this.translatedValidator('required', Validators.required, 'validation.required'),
        this.translatedValidator('email', Validators.email, 'validation.email'),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        this.translatedValidator('required', Validators.required, 'validation.required'),
      ],
    }),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();

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

  private translatedValidator(
    errorKey: string,
    validator: ValidatorFn,
    messageKey: string,
  ): ValidatorFn {
    return validationHelpers.withMessage(validator, errorKey, () =>
      this.translate.instant(messageKey),
    );
  }
}
