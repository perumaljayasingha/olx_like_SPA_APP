# Exception and Bug Handling

## Backend exception strategy

The backend uses centralized handling in `GlobalExceptionHandler`:

- `ResourceNotFoundException` -> HTTP 404, code `NOT_FOUND`
- `BusinessException` -> custom status/code (e.g. conflict, forbidden)
- Validation exceptions -> HTTP 400, code `VALIDATION_FAILED`
- Parse/type issues -> HTTP 400, code `BAD_REQUEST`
- Unknown errors -> HTTP 500, code `INTERNAL_ERROR`

Error response shape:

```json
{
  "timestamp": "2026-04-08T10:00:00Z",
  "status": 400,
  "code": "VALIDATION_FAILED",
  "message": "Request validation failed",
  "path": "/api/v1/auth/register",
  "fieldErrors": {
    "email": ["must be a well-formed email address"]
  }
}
```

## Frontend exception strategy

- `apiErrorInterceptor` catches `HttpErrorResponse`
- It extracts `message` and optional `fieldErrors`
- Aggregated message is stored in `ErrorStateService`
- Shared error banner renders user-facing feedback

## Bug handling workflow

1. Reproduce with exact inputs and route.
2. Capture API request/response from browser network tab.
3. Check backend console logs for stack trace.
4. Check DB data consistency (row exists? FK valid? status value?)
5. Fix at correct layer:
   - Validation issue -> DTO constraints
   - Business rule issue -> Service layer
   - Query issue -> Repository/specification
   - UX issue -> frontend component/service
6. Add/update tests (recommended next step).
7. Verify end-to-end manually.

## Common bug categories in this app

- Wrong `sellerId` causes forbidden update/archive.
- Missing required fields in create/update payload.
- CORS origin mismatch.
- DB credential mismatch in `application.yml`.
- Frontend environment misconfiguration (`apiBaseUrl`).
