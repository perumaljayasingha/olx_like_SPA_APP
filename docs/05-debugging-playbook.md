# Debugging Playbook

## Quick triage matrix

- UI issue only, no API failure -> debug Angular component/template/styles.
- API 4xx with validation/business code -> check request payload and service rules.
- API 5xx -> inspect backend logs and stack trace first.
- Data mismatch -> verify Flyway migration + MySQL rows.

## Frontend debugging steps

1. Run app:
   ```powershell
   cd frontend
   npm start
   ```
2. Open browser devtools:
   - Console: runtime errors
   - Network: inspect API calls and payload
3. Verify current route exists in `app.routes.ts`.
4. Check service method called (`ListingService`, `AuthService`, etc.).
5. Validate `environment.development.ts` API URL.
6. Confirm interceptor message for failures.

## Backend debugging steps

1. Run API:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
2. Reproduce with frontend or Postman.
3. Read stack trace in terminal.
4. Verify endpoint mapping in controller.
5. Step through service business rules:
   - Owner checks
   - Existence checks
   - Default status behavior
6. Verify SQL + schema:
   - Flyway applied
   - Required rows exist
   - FK references valid

## Debugging DB issues

- Check MySQL is reachable on expected host/port.
- Validate credentials in `application.yml`.
- Confirm `olx_spa` database exists.
- Check migration history table: `flyway_schema_history`.

## Handy validation commands

```powershell
cd frontend
npm run build
```

```powershell
cd backend
.\mvnw.cmd -DskipTests compile
```
