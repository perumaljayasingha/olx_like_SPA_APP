# Application Workflow Overview

## High-level flow

1. User opens Angular SPA at `http://localhost:4200`.
2. Angular router loads screen (`home`, `listings`, `listing detail`, `register`, `create listing`).
3. Frontend services call backend REST API under `/api/v1/*`.
4. Spring Boot controllers delegate to service layer.
5. Service layer validates business rules and uses repository layer.
6. JPA repositories query MySQL; Flyway keeps schema consistent.
7. Responses return DTO models to frontend.
8. Any backend exception is converted by `GlobalExceptionHandler` to `ApiErrorResponse`.
9. Frontend `apiErrorInterceptor` captures API errors and shows a user banner.

## User journey examples

## Browse listings

- Screen: `/listings`
- Frontend call: `GET /api/v1/listings?page=0&size=12`
- Optional filters: `categoryId`, `q`
- Backend: `ListingController.search()` -> `ListingService.searchActive()` -> `ListingSpecifications.activePublicView()`

## Listing detail

- Screen: `/listings/:id`
- Frontend call: `GET /api/v1/listings/{id}`
- Backend returns single `ListingResponse` or `NOT_FOUND`

## Create listing

- Screen: `/listings/new`
- Frontend call: `POST /api/v1/listings`
- Payload includes `title`, `price`, `itemCondition`, `categoryId`, `sellerId`, etc.
- Backend checks seller/category and persists listing

## Archive listing

- Screen: listing detail
- Frontend call: `DELETE /api/v1/listings/{id}?sellerId=...`
- Backend only allows archive by owner seller

## Register user

- Screen: `/register`
- Frontend call: `POST /api/v1/auth/register`
- Password hashed using BCrypt (`PasswordConfig`)
- Frontend stores user in `localStorage` for current session identity
