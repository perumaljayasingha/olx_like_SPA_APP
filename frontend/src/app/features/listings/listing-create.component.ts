import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemCondition } from '../../core/models/listing.model';
import { Category } from '../../core/models/category.model';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { ListingService } from '../../core/services/listing.service';

@Component({
  selector: 'app-listing-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/listings" class="back">← Back to listings</a>

    <div class="layout">
      <header class="intro">
        <h1 class="page-title">Post your ad</h1>
        <p class="page-sub">Add a clear title, honest condition, and a strong photo link — buyers decide in seconds.</p>
        @if (!auth.currentUser()) {
          <div class="hint">
            <strong>Tip:</strong> You’ll post as the demo account until you
            <a routerLink="/register">create your profile</a>.
          </div>
        }
      </header>

      <form [formGroup]="form" (ngSubmit)="submit()" class="form-card">
        <div class="form-grid">
          <label class="field field-full">
            <span class="label">Title <span class="req">*</span></span>
            <input type="text" formControlName="title" class="input" placeholder="e.g. iPhone 13 — 128GB, unlocked" />
          </label>

          <label class="field field-full">
            <span class="label">Description</span>
            <textarea
              rows="4"
              formControlName="description"
              class="input area"
              placeholder="Condition details, what’s included, pickup preferences…"
            ></textarea>
          </label>

          <label class="field">
            <span class="label">Price (INR) <span class="req">*</span></span>
            <input type="number" step="0.01" formControlName="price" class="input" />
          </label>

          <label class="field">
            <span class="label">Condition <span class="req">*</span></span>
            <select formControlName="itemCondition" class="input">
              @for (c of conditions; track c) {
                <option [value]="c">{{ formatCondition(c) }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span class="label">Category <span class="req">*</span></span>
            <select formControlName="categoryId" class="input">
              <option value="" disabled>Choose a category</option>
              @for (cat of categories(); track cat.id) {
                <option [value]="cat.id">{{ cat.name }}</option>
              }
            </select>
          </label>

          <label class="field">
            <span class="label">City</span>
            <input type="text" formControlName="city" class="input" placeholder="e.g. Bengaluru" />
          </label>

          <label class="field field-full">
            <span class="label">Image URL</span>
            <input
              type="url"
              formControlName="imageUrl"
              class="input"
              placeholder="https://… (link to a photo of your item)"
            />
          </label>
        </div>

        <div class="footer">
          <button type="submit" class="btn btn-primary submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Publishing...' : 'Publish listing' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .back {
      display: inline-flex;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
    }
    .back:hover {
      color: var(--brand);
    }
    .layout {
      display: grid;
      gap: 1.5rem;
      max-width: 40rem;
    }
    .intro {
      padding-right: 0.5rem;
    }
    .hint {
      margin-top: 1rem;
      padding: 0.9rem 1rem;
      background: var(--accent-soft);
      border: 1px solid var(--accent-border);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .hint strong {
      color: var(--brand);
    }
    .form-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      padding: 1.5rem 1.5rem 1.25rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem 1.15rem;
    }
    @media (max-width: 560px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .field-full {
      grid-column: 1 / -1;
    }
    .label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text);
    }
    .req {
      color: var(--accent);
    }
    .input {
      font-family: inherit;
      font-size: 0.95rem;
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface-2);
      color: var(--text);
      transition:
        border-color var(--transition),
        background var(--transition);
    }
    .input:hover {
      border-color: var(--border-strong);
    }
    .input:focus {
      background: var(--surface);
      border-color: var(--accent);
    }
    .area {
      resize: vertical;
      min-height: 6rem;
      line-height: 1.5;
    }
    .footer {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
    .submit {
      width: 100%;
      padding: 0.85rem 1.25rem;
      font-size: 1rem;
    }
  `,
})
export class ListingCreateComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly categoriesApi = inject(CategoryService);
  private readonly listingsApi = inject(ListingService);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly categories = signal<Category[]>([]);
  readonly saving = signal(false);

  readonly conditions: ItemCondition[] = ['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'];

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    price: [0, [Validators.required, Validators.min(0.01)]],
    itemCondition: ['GOOD' as ItemCondition, Validators.required],
    categoryId: ['', Validators.required],
    city: [''],
    imageUrl: [''],
  });

  ngOnInit(): void {
    this.categoriesApi.list().subscribe((c) => this.categories.set(c));
  }

  formatCondition(c: string): string {
    return c.replaceAll('_', ' ');
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const v = this.form.getRawValue();
    this.saving.set(true);
    this.listingsApi
      .create({
        title: v.title,
        description: v.description || undefined,
        price: v.price,
        itemCondition: v.itemCondition,
        categoryId: Number(v.categoryId),
        sellerId: this.auth.sellerIdOrDefault(),
        city: v.city || undefined,
        imageUrl: v.imageUrl || undefined,
      })
      .subscribe({
        next: (created) => this.router.navigate(['/listings', created.id]),
        error: () => this.saving.set(false),
        complete: () => this.saving.set(false),
      });
  }
}
