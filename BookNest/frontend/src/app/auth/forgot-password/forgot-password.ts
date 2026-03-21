import { Component, OnInit, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { SnackbarService } from '../../services/snackbar';

type Step = 'email' | 'otp' | 'reset';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword implements OnInit, OnDestroy {
  
  @ViewChildren('otpInput') otpInputRefs!: QueryList<ElementRef<HTMLInputElement>>;
  
  currentStep: Step = 'email';
  email = '';
  
  emailForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  otpDigits: string[] = ['', '', '', '', '', ''];
  private otpTimerInterval: any;
  resendCooldown = 0;
  
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private snackbar: SnackbarService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });

    this.resetForm = this.fb.group({
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.clearTimer();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  get emailCtrl() { return this.emailForm.get('email'); }
  get otpCtrl() { return this.otpForm.get('otp'); }
  get newPasswordCtrl() { return this.resetForm.get('newPassword'); }
  get confirmPasswordCtrl() { return this.resetForm.get('confirmPassword'); }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onEmailSubmit() {
    this.errorMessage = '';
    this.emailForm.markAllAsTouched();

    if (this.emailForm.invalid) {
      return;
    }

    this.email = this.emailCtrl?.value;
    this.isLoading = true;

    this.http.post<any>('http://localhost:8080/api/auth/forgot-password', { email: this.email })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'OTP sent to your email. Please check your inbox.';
            this.currentStep = 'otp';
            this.startResendCooldown();
            this.snackbar.show('OTP sent successfully!');
            setTimeout(() => this.focusOtpInput(0), 100);
          } else {
            this.errorMessage = response.message || 'Failed to send OTP. Please try again.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Email not found. Please check your email address.';
        }
      });
  }

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 1);

    input.value = value;
    this.otpDigits[index] = value;
    this.updateOtpValue();

    if (value && index < 5) {
      setTimeout(() => this.focusOtpInput(index + 1), 10);
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      setTimeout(() => this.focusOtpInput(index - 1), 10);
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    digits.forEach((digit, i) => {
      this.otpDigits[i] = digit;
      const inputs = this.otpInputRefs?.toArray();
      if (inputs && inputs[i]) {
        inputs[i].nativeElement.value = digit;
      }
    });

    const focusIndex = Math.min(digits.length, 5);
    setTimeout(() => this.focusOtpInput(focusIndex), 10);
    this.updateOtpValue();
  }

  private focusOtpInput(index: number) {
    const inputs = this.otpInputRefs?.toArray();
    if (inputs && inputs[index]) {
      inputs[index].nativeElement.focus();
    }
  }

  private updateOtpValue() {
    const otp = this.otpDigits.join('');
    this.otpForm.patchValue({ otp }, { emitEvent: false });
  }

  onOtpSubmit() {
    this.errorMessage = '';
    this.otpForm.markAllAsTouched();

    if (this.otpForm.invalid) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    const otp = this.otpCtrl?.value;
    this.isLoading = true;

    this.http.post<any>('http://localhost:8080/api/auth/verify-otp', { email: this.email, otp })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.currentStep = 'reset';
            this.successMessage = '';
            this.snackbar.show('OTP verified successfully!');
          } else {
            this.errorMessage = response.message || 'Invalid OTP. Please try again.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Invalid or expired OTP. Please try again.';
        }
      });
  }

  onResetSubmit() {
    this.errorMessage = '';
    this.resetForm.markAllAsTouched();

    if (this.resetForm.invalid) {
      if (this.resetForm.hasError('passwordMismatch')) {
        this.errorMessage = 'Passwords do not match.';
      }
      return;
    }

    const newPassword = this.newPasswordCtrl?.value;
    const otp = this.otpCtrl?.value;

    this.isLoading = true;

    this.http.post<any>('http://localhost:8080/api/auth/reset-password', {
      email: this.email,
      otp: otp,
      newPassword: newPassword
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = 'Password reset successfully! Redirecting to login...';
          this.snackbar.show('Password reset successful!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.errorMessage = response.message || 'Failed to reset password. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to reset password. Please try again.';
      }
    });
  }

  goBack() {
    if (this.currentStep === 'otp') {
      this.currentStep = 'email';
      this.clearTimer();
      this.resetOtp();
    } else if (this.currentStep === 'reset') {
      this.currentStep = 'otp';
      this.resetForm.reset();
    }
  }

  resendOtp() {
    if (this.resendCooldown > 0) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>('http://localhost:8080/api/auth/forgot-password', { email: this.email })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'New OTP sent to your email.';
            this.startResendCooldown();
            this.resetOtp();
            this.snackbar.show('OTP resent successfully!');
            setTimeout(() => this.focusOtpInput(0), 100);
          } else {
            this.errorMessage = response.message || 'Failed to resend OTP.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Failed to resend OTP. Please try again.';
        }
      });
  }

  private startResendCooldown() {
    this.resendCooldown = 60;
    this.clearTimer();
    this.otpTimerInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.otpTimerInterval) {
      clearInterval(this.otpTimerInterval);
      this.otpTimerInterval = null;
    }
  }

  private resetOtp() {
    this.otpDigits = ['', '', '', '', '', ''];
    const inputs = this.otpInputRefs?.toArray();
    if (inputs) {
      inputs.forEach(input => {
        input.nativeElement.value = '';
      });
    }
    this.otpForm.reset();
  }

  getStepTitle(): string {
    switch (this.currentStep) {
      case 'email': return 'Forgot Password';
      case 'otp': return 'Verify OTP';
      case 'reset': return 'Reset Password';
    }
  }

  getStepDescription(): string {
    switch (this.currentStep) {
      case 'email': return 'Enter your registered email address and we\'ll send you an OTP to reset your password.';
      case 'otp': return `Enter the 6-digit code sent to ${this.email}`;
      case 'reset': return 'Create a new password for your account.';
    }
  }
}
