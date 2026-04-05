import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category } from '../../core/models/category.model';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../core/services/auth.service';
import { CategoryService } from '../../core/services/category.service';
import { ListingService } from '../../core/services/listing.service';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe, DatePipe],
  template: `
    <header class="page-head">
      <div>
        <h1 class="page-title">Browse listings</h1>
        <p class="page-sub">Fresh picks near you — filter by category or search keywords.</p>
      </div>
      <a routerLink="/listings/new" class="head-cta btn btn-primary">+ Post an ad</a>
    </header>

    <section class="filters" aria-label="Search and filters">
      <div class="filter-grid">
        <label class="field">
          <span class="field-label">Category</span>
          <select [(ngModel)]="categoryId" (change)="onFilterChange()" class="input">
            <option [ngValue]="null">All categories</option>
            @for (c of categories(); track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
            }
          </select>
        </label>
        <label class="field field-grow">
          <span class="field-label">Search</span>
          <input
            type="search"
            [(ngModel)]="query"
            (keyup.enter)="reload()"
            placeholder="Try “bike”, “phone”, “desk”…"
            class="input"
            autocomplete="off"
          />
        </label>
        <button type="button" class="btn btn-primary filter-btn" (click)="reload()">Search</button>
      </div>
    </section>

    @if (loading()) {
      <ul class="grid" aria-busy="true" aria-label="Loading listings">
        @for (s of skeletonSlots; track s) {
          <li>
            <div class="skeleton-card">
              <div class="skeleton-thumb shimmer"></div>
              <div class="skeleton-body">
                <div class="skeleton-line w-80 shimmer"></div>
                <div class="skeleton-line w-40 shimmer"></div>
                <div class="skeleton-line w-60 shimmer"></div>
              </div>
            </div>
          </li>
        }
      </ul>
    } @else if (listings().length === 0) {
      <div class="empty">
        <div class="empty-icon" aria-hidden="true">◇</div>
        <h2 class="empty-title">No matches yet</h2>
        <p class="empty-text">Try another category or a shorter search — or be the first to list something new.</p>
        <a routerLink="/listings/new" class="btn btn-primary">Create a listing</a>
      </div>
    } @else {
      <ul class="grid">
        @for (l of listings(); track l.id) {
          <li>
            <a [routerLink]="['/listings', l.id]" class="card">
              <div class="thumb">
                @if (l.imageUrl) {
                  <img [src]="l.imageUrl" [alt]="l.title" loading="lazy" />
                } @else {
                  <span class="ph">No photo</span>
                }
                <span class="badge">{{ l.category.name }}</span>
              </div>
              <div class="body">
                <h2 class="card-title">{{ l.title }}</h2>
                <p class="price">{{ l.price | currency: 'USD' : 'symbol' : '1.0-0' }}</p>
                <p class="meta">
                  @if (l.city) {
                    <span class="meta-pill">{{ l.city }}</span>
                  }
                  <span class="meta-date">{{ l.createdAt | date: 'mediumDate' }}</span>
                </p>
              </div>
            </a>
          </li>
        }
      </ul>

      <nav class="pager" aria-label="Pagination">
        <button type="button" class="btn btn-secondary" [disabled]="page() === 0" (click)="prev()">
          Previous
        </button>
        <span class="pager-info">Page {{ page() + 1 }} of {{ totalPages() || 1 }}</span>
        <button
          type="button"
          class="btn btn-secondary"
          [disabled]="page() >= totalPages() - 1"
          (click)="next()"
        >
          Next
        </button>
      </nav>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .page-head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .head-cta {
      text-decoration: none;
      white-space: nowrap;
    }
    .filters {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.1rem 1.25rem;
      margin-bottom: 1.75rem;
      box-shadow: var(--shadow-sm);
    }
    .filter-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.85rem 1rem;
      align-items: flex-end;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 11rem;
    }
    .field-grow {
      flex: 1;
      min-width: min(100%, 16rem);
    }
    .field-label {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-soft);
    }
    .input {
      font-family: inherit;
      font-size: 0.95rem;
      padding: 0.6rem 0.85rem;
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
    .filter-btn {
      padding-left: 1.35rem;
      padding-right: 1.35rem;
    }
    .grid {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.25rem;
    }
    .card {
      display: block;
      border-radius: var(--radius-md);
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      background: var(--surface);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      transition:
        transform var(--transition),
        box-shadow var(--transition),
        border-color var(--transition);
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--accent-border);
    }
    .thumb {
      position: relative;
      aspect-ratio: 4/3;
      background: linear-gradient(160deg, var(--surface-3), var(--surface-2));
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .ph {
      color: var(--text-soft);
      font-size: 0.88rem;
      font-weight: 500;
    }
    .badge {
      position: absolute;
      left: 0.65rem;
      bottom: 0.65rem;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      padding: 0.3rem 0.55rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.92);
      color: var(--brand);
      backdrop-filter: blur(6px);
      box-shadow: var(--shadow-xs);
    }
    .body {
      padding: 1rem 1.1rem 1.15rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 700;
      margin: 0 0 0.4rem;
      line-height: 1.35;
      color: var(--text);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .price {
      font-weight: 800;
      font-size: 1.15rem;
      margin: 0 0 0.5rem;
      color: var(--brand);
      letter-spacing: -0.02em;
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      align-items: center;
      margin: 0;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    .meta-pill {
      background: var(--surface-3);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-full);
      font-weight: 600;
    }
    .meta-date {
      font-weight: 500;
    }
    .pager {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .pager-info {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-muted);
      min-width: 10rem;
      text-align: center;
    }
    .empty {
      text-align: center;
      padding: 3rem 1.5rem;
      background: var(--surface);
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-lg);
    }
    .empty-icon {
      font-size: 2.5rem;
      color: var(--accent);
      opacity: 0.5;
      margin-bottom: 0.5rem;
    }
    .empty-title {
      margin: 0 0 0.5rem;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text);
    }
    .empty-text {
      margin: 0 auto 1.25rem;
      max-width: 26rem;
      color: var(--text-muted);
      line-height: 1.55;
    }
    .skeleton-card {
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--surface);
    }
    .skeleton-thumb {
      aspect-ratio: 4/3;
      background: var(--surface-3);
    }
    .skeleton-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .skeleton-line {
      height: 0.65rem;
      border-radius: 4px;
      background: var(--surface-3);
    }
    .w-40 {
      width: 40%;
    }
    .w-60 {
      width: 60%;
    }
    .w-80 {
      width: 80%;
    }
    .shimmer {
      position: relative;
      overflow: hidden;
    }
    .shimmer::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.55),
        transparent
      );
      animation: shimmer 1.2s ease-in-out infinite;
    }
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `,
})
export class ListingListComponent implements OnInit {
  private readonly listingsApi = inject(ListingService);
  private readonly categoriesApi = inject(CategoryService);
  readonly auth = inject(AuthService);

  readonly skeletonSlots = [0, 1, 2, 3, 4, 5];

  readonly categories = signal<Category[]>([]);
  readonly listings = signal<Listing[]>([]);
  readonly loading = signal(true);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly pageSize = 12;

  categoryId: number | null = null;
  query = '';

  ngOnInit(): void {
    this.categoriesApi.list().subscribe({
      next: (c) => this.categories.set(c),
      error: () => this.loading.set(false),
    });
    this.reload();
  }

  onFilterChange(): void {
    this.page.set(0);
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.listingsApi
      .search(this.page(), this.pageSize, this.categoryId, this.query || null)
      .subscribe({
        next: (res) => {
          this.listings.set(res.content);
          this.totalPages.set(res.page.totalPages);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  prev(): void {
    this.page.update((p) => Math.max(0, p - 1));
    this.reload();
  }

  next(): void {
    this.page.update((p) => p + 1);
    this.reload();
  }
}
