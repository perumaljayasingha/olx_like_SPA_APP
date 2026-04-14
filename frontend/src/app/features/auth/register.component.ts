import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="card">
        <div class="card-accent" aria-hidden="true"></div>
        <div class="card-body">
          <h1 class="page-title">Join Bazaar India</h1>
          <p class="sub">Register with mobile OTP verification (mock SMS). Templates come from backend config only.</p>

          @if (!otpSent()) {
            <form [formGroup]="form" (ngSubmit)="requestOtp()" class="form">
              <label class="field">
                <span class="label">Email <span class="req">*</span></span>
                <input type="email" formControlName="email" class="input" autocomplete="email" />
              </label>
              <label class="field">
                <span class="label">Password <span class="req">*</span></span>
                <input
                  type="password"
                  formControlName="password"
                  class="input"
                  autocomplete="new-password"
                  placeholder="At least 8 characters"
                />
              </label>
              <label class="field">
                <span class="label">Full name <span class="req">*</span></span>
                <input type="text" formControlName="fullName" class="input" />
              </label>
              <label class="field">
                <span class="label">Phone <span class="req">*</span></span>
                <input type="tel" formControlName="phone" class="input" placeholder="+919876543210" />
              </label>
              <button type="submit" class="btn btn-primary submit" [disabled]="form.invalid || busy()">
                {{ busy() ? 'Sending OTP...' : 'Send OTP' }}
              </button>
              @if (formError(); as msg) {
                <p class="err">{{ msg }}</p>
              }
            </form>
          } @else {
            <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()" class="form">
              <p class="sub">OTP sent to {{ phoneValue() }}</p>
              <label class="field">
                <span class="label">OTP <span class="req">*</span></span>
                <input type="text" class="input" formControlName="otp" placeholder="123456" />
              </label>
              <button type="submit" class="btn btn-primary submit" [disabled]="otpForm.invalid || busy()">
                {{ busy() ? 'Verifying...' : 'Verify OTP and Create Account' }}
              </button>
              <button type="button" class="btn btn-secondary submit" (click)="reset()">Change details</button>
              @if (formError(); as msg) {
                <p class="err">{{ msg }}</p>
              }
            </form>
          }

          <p class="foot">
            Already exploring listings?
            <a routerLink="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .page { display: flex; justify-content: center; padding: 1rem 0 2rem; }
    .card { display: flex; width: 100%; max-width: 420px; background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); box-shadow: var(--shadow-lg); overflow: hidden; }
    .card-accent { width: 6px; flex-shrink: 0; background: linear-gradient(180deg, var(--accent-bright), var(--brand)); }
    .card-body { flex: 1; padding: 1.75rem 1.75rem 1.5rem; }
    .sub { margin: -0.25rem 0 1.5rem; color: var(--text-muted); font-size: 0.95rem; line-height: 1.55; }
    .form { display: flex; flex-direction: column; gap: 1rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    .label { font-size: 0.8rem; font-weight: 700; color: var(--text); }
    .req { color: var(--accent); }
    .input { font-family: inherit; font-size: 0.95rem; padding: 0.65rem 0.85rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-2); color: var(--text); }
    .input:focus { background: var(--surface); border-color: var(--accent); }
    .submit { margin-top: 0.35rem; width: 100%; padding: 0.8rem 1rem; font-size: 1rem; }
    .foot { margin: 1.35rem 0 0; font-size: 0.9rem; color: var(--text-muted); text-align: center; }
    .err { margin: 0; color: #b91c1c; font-size: 0.88rem; font-weight: 600; }
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly busy = signal(false);
  readonly otpSent = signal(false);
  readonly phoneValue = signal('');
  readonly formError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    fullName: ['', [Validators.required, Validators.maxLength(255)]],
    phone: ['', [Validators.required, Validators.maxLength(50)]],
  });

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  requestOtp(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.busy.set(true);
    this.auth
      .requestRegisterOtp({
        email: v.email,
        password: v.password,
        fullName: v.fullName,
        phone: v.phone,
      })
      .subscribe({
        next: () => {
          this.formError.set(null);
          this.phoneValue.set(v.phone);
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
    this.auth.verifyRegisterOtp({ phone: this.phoneValue(), otp: this.otpForm.getRawValue().otp }).subscribe({
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
      if (code === 'EMAIL_IN_USE') return 'Email already registered. Please login.';
      if (code === 'PHONE_IN_USE') return 'Mobile number already registered. Please login.';
      if (code === 'INVALID_OTP') return 'Incorrect OTP. Please request a new OTP and try again.';
      const message = (err.error as { message?: string }).message;
      if (message) return message;
    }
    return 'Unable to process registration now. Please try again.';
  }
}
