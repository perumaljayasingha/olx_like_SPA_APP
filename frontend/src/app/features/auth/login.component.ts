import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <h1 class="page-title">Login with mobile OTP</h1>
        <p class="sub">Mock SMS is enabled now. Change SMS templates only in backend config.</p>

        @if (!otpSent()) {
          <form [formGroup]="phoneForm" (ngSubmit)="requestOtp()" class="form">
            <label class="field">
              <span class="label">Mobile number</span>
              <input type="tel" formControlName="phone" class="input" placeholder="+919876543210" />
            </label>
            <button type="submit" class="btn btn-primary" [disabled]="phoneForm.invalid || busy()">
              {{ busy() ? 'Sending...' : 'Send OTP' }}
            </button>
            @if (formError(); as msg) {
              <p class="err">{{ msg }}</p>
            }
          </form>
        } @else {
          <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()" class="form">
            <p class="sub">OTP sent to {{ phoneValue() }}</p>
            <label class="field">
              <span class="label">Enter 6-digit OTP</span>
              <input type="text" formControlName="otp" class="input" placeholder="123456" />
            </label>
            <button type="submit" class="btn btn-primary" [disabled]="otpForm.invalid || busy()">
              {{ busy() ? 'Verifying...' : 'Verify OTP and Login' }}
            </button>
            <button type="button" class="btn btn-secondary" (click)="reset()">Change number</button>
            @if (formError(); as msg) {
              <p class="err">{{ msg }}</p>
            }
          </form>
        }

        <p class="foot">New user? <a routerLink="/register">Create account</a></p>
      </div>
    </div>
  `,
  styles: `
    .page { display: flex; justify-content: center; padding: 1rem 0 2rem; }
    .card { width: 100%; max-width: 420px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); padding: 1.5rem; }
    .sub { color: var(--text-muted); margin: 0 0 1rem; }
    .form { display: flex; flex-direction: column; gap: 0.9rem; }
    .field { display: flex; flex-direction: column; gap: 0.35rem; }
    .label { font-size: 0.82rem; font-weight: 700; }
    .input { font-family: inherit; font-size: 0.95rem; padding: 0.65rem 0.85rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); }
    .foot { margin: 1.1rem 0 0; text-align: center; color: var(--text-muted); }
    .err { margin: 0; color: #b91c1c; font-size: 0.88rem; font-weight: 600; }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly busy = signal(false);
  readonly otpSent = signal(false);
  readonly phoneValue = signal('');
  readonly formError = signal<string | null>(null);

  readonly phoneForm = this.fb.nonNullable.group({
    phone: ['', [Validators.required, Validators.maxLength(50)]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  requestOtp(): void {
    if (this.phoneForm.invalid) return;
    const phone = this.phoneForm.getRawValue().phone.trim();
    this.busy.set(true);
    this.auth.requestLoginOtp({ phone }).subscribe({
      next: () => {
        this.formError.set(null);
        this.phoneValue.set(phone);
        this.otpSent.set(true);
      },
      error: (err) => {
        this.formError.set(this.toFriendlyMessage(err));
        this.busy.set(false);
      },
      complete: () => this.busy.set(false),
    });
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;
    this.busy.set(true);
    this.auth.verifyLoginOtp({ phone: this.phoneValue(), otp: this.otpForm.getRawValue().otp }).subscribe({
      next: () => {
        this.formError.set(null);
        this.router.navigate(['/listings']);
      },
      error: (err) => {
        this.formError.set(this.toFriendlyMessage(err));
        this.busy.set(false);
      },
      complete: () => this.busy.set(false),
    });
  }

  reset(): void {
    this.otpSent.set(false);
    this.formError.set(null);
    this.otpForm.reset();
  }

  private toFriendlyMessage(err: unknown): string {
    if (err instanceof HttpErrorResponse && err.error && typeof err.error === 'object') {
      const code = (err.error as { code?: string }).code;
      if (code === 'PHONE_NOT_REGISTERED') {
        return 'Your number is not registered. Please register first.';
      }
      if (code === 'INVALID_OTP') {
        return 'Incorrect OTP. Please request a new OTP and try again.';
      }
      const msg = (err.error as { message?: string }).message;
      if (msg) return msg;
    }
    return 'Unable to process your request. Please try again.';
  }
}
