import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../core/services/auth.service';
import { ErrorStateService } from '../../core/services/error-state.service';
import { ListingService } from '../../core/services/listing.service';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, UpperCasePipe],
  template: `
    <a routerLink="/listings" class="back">← Back to listings</a>

    @if (loading()) {
      <div class="loading-card" aria-busy="true">
        <div class="loading-shimmer"></div>
        <p class="loading-text">Loading listing…</p>
      </div>
    } @else if (listing()) {
      @let l = listing()!;
      <article class="detail">
        <div class="media">
          @if (l.imageUrl) {
            <img [src]="l.imageUrl" [alt]="l.title" />
          } @else {
            <div class="ph">No photo added</div>
          }
        </div>
        <div class="panel">
          <div class="panel-inner">
            <h1 class="title">{{ l.title }}</h1>
            <p class="price">{{ l.price | currency: 'USD' : 'symbol' : '1.0-2' }}</p>

            <div class="chips">
              @if (l.city) {
                <span class="chip">{{ l.city }}</span>
              }
              <span class="chip chip-muted">{{ formatCondition(l.itemCondition) }}</span>
              <span class="chip chip-status">{{ l.listingStatus }}</span>
            </div>

            <p class="listed">Listed {{ l.createdAt | date: 'medium' }}</p>

            <section class="block">
              <h2 class="block-title">Description</h2>
              <p class="desc">{{ l.description || 'No description provided.' }}</p>
            </section>

            <section class="seller-card">
              <h2 class="block-title">Seller</h2>
              <div class="seller-row">
                <span class="seller-avatar" aria-hidden="true">{{ l.seller.fullName.charAt(0) | uppercase }}</span>
                <div>
                  <p class="seller-name">{{ l.seller.fullName }}</p>
                  <p class="seller-email">{{ l.seller.email }}</p>
                </div>
              </div>
            </section>

            @if (canManage(l)) {
              <div class="actions">
                <button type="button" class="btn-danger" (click)="archive(l)" [disabled]="archiving()">
                  {{ archiving() ? 'Archiving…' : 'Archive listing' }}
                </button>
              </div>
            }
          </div>
        </div>
      </article>
    } @else {
      <div class="not-found">
        <p>We couldn’t find that listing.</p>
        <a routerLink="/listings" class="btn btn-primary">Browse all</a>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .back {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      color: var(--text-muted);
      margin-bottom: 1.25rem;
    }
    .back:hover {
      color: var(--brand);
    }
    .loading-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: var(--shadow-sm);
    }
    .loading-shimmer {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      border-radius: var(--radius-md);
      background: linear-gradient(90deg, var(--surface-3), var(--surface-2), var(--surface-3));
      background-size: 200% 100%;
      animation: slide 1.2s ease infinite;
    }
    @keyframes slide {
      0% {
        background-position: 100% 0;
      }
      100% {
        background-position: -100% 0;
      }
    }
    .loading-text {
      margin: 0;
      color: var(--text-muted);
      font-weight: 500;
    }
    .detail {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 1.75rem;
      align-items: start;
    }
    @media (max-width: 880px) {
      .detail {
        grid-template-columns: 1fr;
      }
    }
    .media {
      position: sticky;
      top: 5.5rem;
    }
    @media (max-width: 880px) {
      .media {
        position: static;
      }
    }
    .media img {
      width: 100%;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-md);
      display: block;
    }
    .ph {
      aspect-ratio: 4/3;
      border-radius: var(--radius-lg);
      background: linear-gradient(145deg, var(--surface-3), var(--surface-2));
      border: 1px dashed var(--border-strong);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-soft);
      font-weight: 500;
    }
    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }
    .panel-inner {
      padding: 1.5rem 1.65rem 1.75rem;
    }
    .title {
      font-size: clamp(1.5rem, 3vw, 1.85rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.2;
      margin: 0 0 0.5rem;
      color: var(--text);
    }
    .price {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--brand);
      margin: 0 0 1rem;
      letter-spacing: -0.03em;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-bottom: 0.65rem;
    }
    .chip {
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.35rem 0.65rem;
      border-radius: var(--radius-full);
      background: var(--accent-soft);
      color: var(--brand);
      border: 1px solid var(--accent-border);
    }
    .chip-muted {
      background: var(--surface-3);
      border-color: var(--border);
      color: var(--text-muted);
    }
    .chip-status {
      background: var(--warning-soft);
      border-color: #fcd34d;
      color: #92400e;
    }
    .listed {
      font-size: 0.88rem;
      color: var(--text-soft);
      margin: 0 0 1.35rem;
    }
    .block {
      margin-bottom: 1.35rem;
    }
    .block-title {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--text-soft);
      margin: 0 0 0.5rem;
    }
    .desc {
      margin: 0;
      white-space: pre-wrap;
      line-height: 1.65;
      color: var(--text-muted);
    }
    .seller-card {
      padding: 1rem 1.1rem;
      background: var(--surface-2);
      border-radius: var(--radius-md);
      border: 1px solid var(--border);
    }
    .seller-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .seller-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(145deg, var(--accent-bright), var(--accent));
      color: #fff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .seller-name {
      margin: 0;
      font-weight: 700;
      color: var(--text);
    }
    .seller-email {
      margin: 0.15rem 0 0;
      font-size: 0.88rem;
      color: var(--text-muted);
    }
    .actions {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
    .btn-danger {
      width: 100%;
      padding: 0.75rem 1rem;
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
      background: linear-gradient(165deg, var(--danger), #b91c1c);
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      box-shadow: var(--shadow-xs);
      transition: opacity var(--transition);
    }
    .btn-danger:hover:not(:disabled) {
      opacity: 0.92;
    }
    .btn-danger:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .not-found {
      text-align: center;
      padding: 2.5rem;
      background: var(--surface);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
    }
    .not-found p {
      margin: 0 0 1rem;
      color: var(--text-muted);
    }
    .not-found .btn {
      text-decoration: none;
    }
  `,
})
export class ListingDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ListingService);
  readonly auth = inject(AuthService);
  private readonly errors = inject(ErrorStateService);

  readonly listing = signal<Listing | null>(null);
  readonly loading = signal(true);
  readonly archiving = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isFinite(id)) {
      this.router.navigate(['/listings']);
      return;
    }
    this.api.getById(id).subscribe({
      next: (l) => {
        this.listing.set(l);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/listings']);
      },
    });
  }

  formatCondition(c: string): string {
    return c.replaceAll('_', ' ');
  }

  canManage(l: Listing): boolean {
    return this.auth.sellerIdOrDefault() === l.seller.id;
  }

  archive(l: Listing): void {
    if (!confirm('Archive this listing? It will disappear from search results.')) {
      return;
    }
    this.archiving.set(true);
    this.errors.clear();
    this.api.archive(l.id, this.auth.sellerIdOrDefault()).subscribe({
      next: () => {
        this.archiving.set(false);
        this.router.navigate(['/listings']);
      },
      error: () => this.archiving.set(false),
    });
  }
}
