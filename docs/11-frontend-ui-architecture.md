# Frontend UI Architecture (Beginner Friendly)

## Why this UI structure is used

The UI follows a simple and scalable Angular structure:

- `core` for app-wide logic (API services, models, interceptor)
- `features` for page-level user flows
- `shared` for reusable UI components

This avoids mixing API/business code inside templates and keeps features easy to extend.

## Routing and page map

Defined in `frontend/src/app/app.routes.ts`:

- `/` -> Home page
- `/listings` -> Listing grid with filters
- `/listings/new` -> Create listing form
- `/listings/:id` -> Listing detail page
- `/register` -> User registration page

## Components used and why

## App shell

- File: `app.component.*`
- Purpose: global header, navigation, user chip, footer, and route outlet.
- Why: single place for consistent layout and branding.

## Error banner

- File: `shared/ui/error-banner.component.ts`
- Purpose: show API errors in one consistent place.
- Why: central error visibility improves UX and reduces duplicate error markup.

## Home component

- File: `features/home/home.component.ts`
- Purpose: hero section + CTA to key flows.
- Why: first-time users quickly understand what app does.

## Listing list component

- File: `features/listings/listing-list.component.ts`
- Purpose: search/filter, cards, loading skeleton, pagination.
- Why: marketplace browsing should be fast and clear.

## Listing detail component

- File: `features/listings/listing-detail.component.ts`
- Purpose: full item details, seller section, archive action.
- Why: buyer and seller need focused detail view.

## Listing create component

- File: `features/listings/listing-create.component.ts`
- Purpose: structured form to publish ads.
- Why: form validation and clean grouping reduce submission mistakes.

## Register component

- File: `features/auth/register.component.ts`
- Purpose: user onboarding.
- Why: enables personalized seller identity instead of demo fallback.

## Services used and why

- `ListingService`: listing CRUD and search API integration.
- `CategoryService`: category list retrieval.
- `AuthService`: register/logout and local user state.
- `ErrorStateService`: signal-based global error message holder.

## Interceptor use

- `apiErrorInterceptor` captures HTTP errors and formats field errors for display.
- Why: all API errors handled uniformly, less repeated code.

## Design system

- Global style tokens in `styles.scss`:
  - colors
  - spacing/radius/shadows
  - button variants
  - typography helpers
- Why: consistent, attractive UI with easy future theme changes.

## India market adaptations in UI

- INR currency formatting (`INR` with `en-IN` locale)
- Indian city examples in form placeholders
- Branding text adapted to India local marketplace context
