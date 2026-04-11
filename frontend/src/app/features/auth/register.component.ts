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
          <p class="sub">Create an account to post ads under your name. Passwords are secured with BCrypt.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
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
              <span class="label">Phone <span class="opt">(optional)</span></span>
              <input type="tel" formControlName="phone" class="input" />
            </label>
            <button type="submit" class="btn btn-primary submit" [disabled]="form.invalid || busy()">
              {{ busy() ? 'Creating account…' : 'Create account' }}
            </button>
          </form>

          <p class="foot">
            Already exploring listings?
            <a routerLink="/listings">Back to listings</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .page {
      display: flex;
      justify-content: center;
      padding: 1rem 0 2rem;
    }
    .card {
      display: flex;
      width: 100%;
      max-width: 420px;
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
    }
    .card-accent {
      width: 6px;
      flex-shrink: 0;
      background: linear-gradient(180deg, var(--accent-bright), var(--brand));
    }
    .card-body {
      flex: 1;
      padding: 1.75rem 1.75rem 1.5rem;
    }
    .sub {
      margin: -0.25rem 0 1.5rem;
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.55;
    }
    .form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text);
    }
    .req {
      color: var(--accent);
    }
    .opt {
      font-weight: 500;
      color: var(--text-soft);
    }
    .input {
      font-family: inherit;
      font-size: 0.95rem;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-2);
      color: var(--text);
    }
    .input:focus {
      background: var(--surface);
      border-color: var(--accent);
    }
    .submit {
      margin-top: 0.35rem;
      width: 100%;
      padding: 0.8rem 1rem;
      font-size: 1rem;
    }
    .foot {
      margin: 1.35rem 0 0;
      font-size: 0.9rem;
      color: var(--text-muted);
      text-align: center;
    }
  `,
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly busy = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    fullName: ['', [Validators.required, Validators.maxLength(255)]],
    phone: ['', Validators.maxLength(50)],
  });

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.busy.set(true);
    this.auth
      .register({
        email: v.email,
        password: v.password,
        fullName: v.fullName,
        phone: v.phone || undefined,
      })
      .subscribe({
        next: () => this.router.navigate(['/listings']),
        error: () => this.busy.set(false),
        complete: () => this.busy.set(false),
      });
  }
}
