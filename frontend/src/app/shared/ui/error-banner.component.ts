import { Component, inject } from '@angular/core';
import { ErrorStateService } from '../../core/services/error-state.service';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  template: `
    @if (errors.message(); as msg) {
      <div class="wrap">
        <div class="banner" role="alert">
          <span class="icon" aria-hidden="true">!</span>
          <p class="text">{{ msg }}</p>
          <button type="button" class="dismiss" (click)="errors.clear()">Dismiss</button>
        </div>
      </div>
    }
  `,
  styles: `
    .wrap {
      max-width: 1180px;
      margin: 0 auto;
      padding: 0.5rem 1.25rem 0;
    }
    .banner {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0.85rem 1rem;
      background: linear-gradient(135deg, #fef2f2, #fff5f5);
      border: 1px solid #fecaca;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      color: #7f1d1d;
      font-size: 0.9rem;
    }
    .icon {
      flex-shrink: 0;
      width: 1.65rem;
      height: 1.65rem;
      border-radius: 50%;
      background: #fee2e2;
      color: #b91c1c;
      font-weight: 800;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .text {
      flex: 1;
      margin: 0;
      line-height: 1.45;
      padding-top: 0.1rem;
    }
    .dismiss {
      flex-shrink: 0;
      border: none;
      background: #fff;
      color: #991b1b;
      font-family: inherit;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      border: 1px solid #fecaca;
    }
    .dismiss:hover {
      background: #fef2f2;
    }
  `,
})
export class ErrorBannerComponent {
  readonly errors = inject(ErrorStateService);
}
