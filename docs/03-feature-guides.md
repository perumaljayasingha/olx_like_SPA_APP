# Feature Guides (Separated)

## Feature: Categories

Purpose:
- Provide marketplace category list for filters and forms.

Backend:
- Endpoint: `GET /api/v1/categories`
- Controller: `CategoryController`
- Service: `CategoryService`

Frontend:
- Service: `CategoryService.list()`
- Used in: listing filter and create listing form

## Feature: Listing Search + Pagination

Purpose:
- Browse active listings with pagination and optional filters.

Backend:
- Endpoint: `GET /api/v1/listings`
- Inputs: `categoryId`, `q`, pageable params
- Logic: `ListingSpecifications.activePublicView` enforces active-only results

Frontend:
- Component: listing list screen
- Service: `ListingService.search()`
- UI: filter panel + paginated cards
- India adaptation: prices rendered in INR format (`en-IN`)

## Feature: Listing Detail

Purpose:
- Show full listing content for a selected item.

Backend:
- Endpoint: `GET /api/v1/listings/{id}`
- Returns `ListingResponse`

Frontend:
- Component: listing detail screen
- Service: `ListingService.getById()`

## Feature: Create Listing

Purpose:
- Allow seller to publish a new ad.

Backend:
- Endpoint: `POST /api/v1/listings`
- Validates seller and category existence
- Defaults `listingStatus` to `ACTIVE` when omitted

Frontend:
- Component: listing create screen
- Service: `ListingService.create()`
- Uses current user id from `AuthService.sellerIdOrDefault()`

## Feature: Update Listing

Purpose:
- Update fields of an existing listing.

Backend:
- Endpoint: `PUT /api/v1/listings/{id}`
- Rule: only listing owner can update

Frontend:
- Service method exists: `ListingService.update()`
- Current UI can be extended with edit screen

## Feature: Archive Listing

Purpose:
- Hide listing from browse results without deleting row.

Backend:
- Endpoint: `DELETE /api/v1/listings/{id}?sellerId=...`
- Sets `listingStatus = ARCHIVED`

Frontend:
- Action on listing detail screen

## Feature: User Registration

Purpose:
- Create a user account for posting as personal profile.

Backend:
- Endpoint: `POST /api/v1/auth/register`
- Business rule: unique email
- Password hash: BCrypt

Frontend:
- Component: register screen
- Service: `AuthService.register()`
- Stores returned user in `localStorage`

## Feature: API Documentation and Testing

Purpose:
- Make APIs easy to explore and test for developers and QA.

Backend:
- Swagger/OpenAPI endpoints:
  - `/swagger-ui.html`
  - `/v3/api-docs`

Testing assets:
- Postman collection:
  - `docs/postman/olx-spa-api.postman_collection.json`

## Feature: Global API Error UX

Purpose:
- Show understandable error messages for users.

Backend:
- `GlobalExceptionHandler` standardizes error payload

Frontend:
- `apiErrorInterceptor` reads backend error + field errors
- Message published to `ErrorStateService`
- Shared UI component displays dismissible banner
