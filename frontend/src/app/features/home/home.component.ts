import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-badge">Trusted local marketplace</div>
      <h1 class="hero-title">Turn unused items into <em>cash</em>, fast.</h1>
      <p class="hero-lead">
        List in minutes, chat-ready profiles, and a calm browsing experience — all in one lightweight
        single-page app.
      </p>
      <div class="hero-actions">
        <a routerLink="/listings" class="btn btn-primary btn-lg">Explore listings</a>
        <a routerLink="/listings/new" class="btn btn-secondary btn-lg">Post your first ad</a>
      </div>
      <ul class="hero-stats" aria-label="Highlights">
        <li>
          <strong>Simple</strong>
          <span>No clutter — just search, filter, and buy.</span>
        </li>
        <li>
          <strong>Fast</strong>
          <span>Built as a SPA with a snappy Spring Boot API.</span>
        </li>
        <li>
          <strong>Safe basics</strong>
          <span>Passwords hashed server-side; you control your data.</span>
        </li>
      </ul>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }
    .hero {
      max-width: 44rem;
      margin: 0 auto;
      padding: 2rem 0 3rem;
      text-align: center;
    }
    .hero-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--brand);
      background: var(--accent-soft);
      border: 1px solid var(--accent-border);
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      margin-bottom: 1.25rem;
    }
    .hero-title {
      font-size: clamp(2rem, 5vw, 2.85rem);
      font-weight: 800;
      letter-spacing: -0.045em;
      line-height: 1.12;
      margin: 0 0 1rem;
      color: var(--text);
    }
    .hero-title em {
      font-style: normal;
      color: var(--accent);
      position: relative;
    }
    .hero-title em::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.08em;
      height: 0.28em;
      background: var(--accent-soft);
      z-index: -1;
      border-radius: 4px;
    }
    .hero-lead {
      font-size: 1.08rem;
      color: var(--text-muted);
      line-height: 1.65;
      margin: 0 auto 1.75rem;
      max-width: 36rem;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin-bottom: 2.75rem;
    }
    .btn-lg {
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      border-radius: var(--radius-md);
    }
    .hero-stats {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      text-align: left;
    }
    .hero-stats li {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.1rem 1.2rem;
      box-shadow: var(--shadow-sm);
    }
    .hero-stats strong {
      display: block;
      font-size: 0.95rem;
      color: var(--brand);
      margin-bottom: 0.35rem;
    }
    .hero-stats span {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.45;
    }
  `,
})
export class HomeComponent {}
