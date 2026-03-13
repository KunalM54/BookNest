import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const fullNamePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const studentIdPattern = /^S\d{4,10}$/;
export const strongPasswordPattern = /^(?=\S{6,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;

export const noWhitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;

  if (typeof value === 'string' && value.length > 0 && value.trim().length === 0) {
    return { whitespace: true };
  }

  return null;
};

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!password || !confirmPassword || password === confirmPassword) {
    return null;
  }

  return { passwordMismatch: true };
};
