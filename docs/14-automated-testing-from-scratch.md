# Automated Testing From Scratch (Cypress + Rest Assured)

This guide explains exactly how to run automated UI and API tests from a fresh machine.

## Prerequisites

- Java 17+
- Node.js 18+ and npm
- Git
- For Cypress local run: Chrome/Edge browser installed

## A) API testing with Rest Assured (backend)

## 1) Go to backend

```powershell
cd backend
```

## 2) Install dependencies and run tests

```powershell
.\mvnw.cmd test
```

What runs:

- `AuthFlowApiTest` using Spring Boot test profile (`application-test.yml`)
- H2 in-memory DB is used in test profile
- No MySQL dependency needed for test execution

## 3) Check reports

- Report folder:
  - `backend/target/surefire-reports/`

If failures happen, open report files and read failed assertion details.

## B) UI testing with Cypress (frontend)

## 1) Go to frontend

```powershell
cd frontend
```

## 2) Install dependencies

```powershell
npm install
```

## 3) Start app for Cypress

Use terminal 1:

```powershell
npm start
```

App should be at `http://localhost:4200`.

## 4) Run Cypress tests (headless)

Use terminal 2:

```powershell
npm run cy:run
```

## 5) Open Cypress interactive mode (optional)

```powershell
npm run cy:open
```

## 6) Where tests are stored

- Config: `frontend/cypress.config.ts`
- Specs: `frontend/cypress/e2e/*.cy.ts`

Current baseline test:

- `frontend/cypress/e2e/smoke.cy.ts`

## C) Recommended execution order

1. `backend` -> `.\mvnw.cmd test`
2. `frontend` -> `npm run build`
3. `frontend` -> `npm start`
4. `frontend` -> `npm run cy:run`

## D) Add a new API test (example pattern)

1. Create a new test file under:
   - `backend/src/test/java/com/olxspa/app/`
2. Use Rest Assured style:
   - set base URI + random port
   - call endpoint
   - assert status + response fields
3. Run:
   - `.\mvnw.cmd test`

## E) Add a new Cypress UI test (example pattern)

1. Add new `*.cy.ts` file under:
   - `frontend/cypress/e2e/`
2. Use flow:
   - `cy.visit()`
   - `cy.get()/cy.contains()`
   - assert UI behavior
3. Run:
   - `npm run cy:run`
