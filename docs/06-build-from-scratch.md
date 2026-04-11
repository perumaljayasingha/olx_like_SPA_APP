# Build From Scratch (Manual Steps)

This document explains how to create an app like this manually from zero.

## 1) Create repository structure

```powershell
mkdir olx_like_SPA_APP
cd olx_like_SPA_APP
mkdir backend
mkdir frontend
```

## 2) Backend manual setup (Spring Boot + Maven)

1. Create a Spring Boot Maven project with dependencies:
   - Spring Web
   - Spring Data JPA
   - Validation
   - MySQL Driver
   - Flyway
   - Lombok
   - Springdoc OpenAPI UI
2. Add `application.yml` with datasource and CORS.
3. Add migrations:
   - `V1__init_schema.sql` for tables/indexes
   - `V2__seed_data.sql` for demo data
4. Create packages:
   - `entity`, `domain`, `repository`, `service`, `controller`, `dto`, `mapper`, `exception`, `config`
5. Implement:
   - Entities (`User`, `Category`, `Listing`)
   - Repositories (+ listing specification)
   - Services with business rules
   - Controllers with `/api/v1` endpoints
   - Global exception handler
   - OpenAPI endpoints for API documentation
6. Add Maven wrapper and compile.

Run:

```powershell
cd backend
.\mvnw.cmd -DskipTests compile
.\mvnw.cmd spring-boot:run
```

## 3) Frontend manual setup (Angular SPA)

Generate app:

```powershell
npx @angular/cli@19 new frontend --directory=frontend --routing --style=scss --ssr=false --skip-git
```

Then:

1. Create architecture folders:
   - `core/models`, `core/services`, `core/interceptors`
   - `features/home`, `features/listings`, `features/auth`
   - `shared/ui`
2. Add route map in `app.routes.ts`.
3. Add typed API services and models.
4. Add global API error interceptor and banner UI.
5. Build user-facing pages:
   - Home
   - Listing list
   - Listing detail
   - Create listing
   - Register
6. Configure environment API URLs.

Run:

```powershell
cd frontend
npm install
npm start
```

## 4) Database and infrastructure

Use Docker:

```powershell
docker compose up -d
```

Or setup MySQL manually and point backend datasource config to it.

## 4.1) DB auto vs manual

- Auto DB create:
  - Keep `createDatabaseIfNotExist=true` in JDBC URL
  - Ensure DB user has CREATE DATABASE permission
- Manual DB create:
  - Create `olx_spa` manually
  - Flyway still creates tables automatically

Important:
- Tables should be managed by Flyway migrations.
- Avoid manual table creation in normal project flow.

## 5) Final verification checklist

- Backend starts without Flyway errors.
- Frontend loads and calls API.
- Can browse listings.
- Can register user.
- Can create and archive listing.
- Error banner appears for invalid requests.
- Swagger UI opens successfully.
- Postman collection requests run as expected.
