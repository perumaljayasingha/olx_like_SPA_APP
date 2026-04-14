# Auth OTP, Testing, and Debug Logging

## Mobile OTP auth flow (mock SMS)

Current implementation:

- Register step 1: `POST /api/v1/auth/register/request-otp`
- Register step 2: `POST /api/v1/auth/register/verify-otp`
- Login step 1: `POST /api/v1/auth/login/request-otp`
- Login step 2: `POST /api/v1/auth/login/verify-otp`
- Logout: `POST /api/v1/auth/logout`

Notes:

- OTP is 6-digit and currently valid for 3 minutes.
- SMS provider is mock now (no real SMS provider integration yet).
- OTP templates are centralized in one place:
  - `backend/src/main/resources/application.yml` under `app.sms.templates`
- To switch to real SMS later, replace only `SmsGateway` bean implementation.

## Where to update SMS template only once

- File: `backend/src/main/resources/application.yml`
- Keys:
  - `app.sms.templates.register-otp`
  - `app.sms.templates.login-otp`

No need to change controller/service business code for template wording changes.

## Exception and error handling for auth

Business exceptions used:

- `EMAIL_IN_USE`
- `PHONE_IN_USE`
- `INVALID_OTP`
- `AUTH_REQUIRED`

Global response shape remains standardized by `GlobalExceptionHandler`.

## Debug logging

Enabled in `application.yml`:

- `logging.level.com.olxspa.app=debug`

Auth service logs:

- OTP generation trigger (without exposing OTP in API response)
- Session token creation (token prefix only in logs)
- Mock SMS dispatch line for local debugging

## Automated API testing (Rest Assured)

Added:

- Dependency: `io.rest-assured:rest-assured` (test scope)
- Test file: `backend/src/test/java/com/olxspa/app/AuthFlowApiTest.java`

Current coverage:

- Category endpoint health check
- OTP request validation failure case

Run:

```powershell
cd backend
.\mvnw.cmd test
```

## Automated UI testing (Cypress)

Added:

- `frontend/cypress.config.ts`
- `frontend/cypress/e2e/smoke.cy.ts`
- scripts in `frontend/package.json`:
  - `cy:open`
  - `cy:run`

Run:

```powershell
cd frontend
npm install
npm run cy:run
```

## Real-time production readiness checklist

For real SMS and production login:

1. Replace mock `SmsGateway` with provider SDK (Twilio/msg91/etc.).
2. Move OTP/session state from in-memory maps to Redis.
3. Replace random session token with JWT + refresh tokens.
4. Add rate limits for OTP requests.
5. Add OTP retry and lockout policy.
6. Add audit logs and alerting.
