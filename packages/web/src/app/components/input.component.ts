import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  ValidationErrors,
  Validators,
} from '@angular/forms';

type InputType = 'text' | 'email' | 'password';

@Component({
  standalone: true,
  selector: 'app-input',
  imports: [CommonModule],
  templateUrl: './input.component.html',
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = 'Label';
  @Input() type: InputType = 'text';
  @Input() placeholder = '';
  @Input() inputId = '';
  @Input() name = '';
  @Input() forceTouched = false;
  @Input() showPasswordToggle = false;

  value = '';
  disabled = false;
  isPasswordVisible = false;

  private readonly ngControl: NgControl | null = null;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    this.ngControl = inject(NgControl, { self: true, optional: true });
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get showError(): boolean {
    const control = this.ngControl?.control;
    return Boolean(control?.invalid && (this.forceTouched || control.touched || control.dirty));
  }

  get inputType(): InputType | 'text' {
    if (this.canTogglePassword) {
      return this.isPasswordVisible ? 'text' : 'password';
    }

    return this.type;
  }

  get canTogglePassword(): boolean {
    return this.showPasswordToggle && this.type === 'password';
  }

  get errorMessage(): string {
    return this.errorMessages.join(' ');
  }

  get errorMessages(): string[] {
    const errors = this.ngControl?.control?.errors;
    if (!errors) return [];
    return Object.entries(errors).map(([key, value]) => this.formatErrorMessage(key, value));
  }

  get isRequired(): boolean {
    const control = this.ngControl?.control;

    if (!control) {
      return false;
    }

    if (
      control.hasValidator(Validators.required) ||
      control.hasValidator(Validators.requiredTrue)
    ) {
      return true;
    }

    const validator = control.validator;
    if (!validator) {
      return false;
    }

    const errors = validator(new FormControl(''));
    return Boolean(errors?.['required'] || errors?.['requiredTrue']);
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event): void {
    const element = event.target as HTMLInputElement;
    this.value = element.value;
    this.onChange(this.value);
  }

  handleBlur(): void {
    this.onTouched();
  }

  togglePasswordVisibility(): void {
    if (this.disabled || !this.canTogglePassword) {
      return;
    }

    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private formatErrorMessage(key: string, errorValue: ValidationErrors[string]): string {
    if (typeof errorValue === 'string') {
      return errorValue;
    }

    if (
      errorValue &&
      typeof errorValue === 'object' &&
      'message' in errorValue &&
      typeof (errorValue as { message?: unknown }).message === 'string'
    ) {
      return (errorValue as { message: string }).message;
    }

    return `${this.label}: ${key}`;
  }
}
