# OLX-like SPA (Angular + Spring Boot + MySQL)

Single-page marketplace-style app: **Angular** frontend, **Spring Boot** (Maven) API, **MySQL** with **Flyway** migrations, layered packages, validation, and a global REST exception handler.

## Documentation

- Main index: `docs/README.md`
- Workflow: `docs/01-workflow-overview.md`
- Setup/tools: `docs/02-setup-and-tools.md`
- Features (separate): `docs/03-feature-guides.md`
- Exceptions and bug handling: `docs/04-exception-and-bug-handling.md`
- Debugging playbook: `docs/05-debugging-playbook.md`
- Build from scratch: `docs/06-build-from-scratch.md`
- Roadmap and suggestions: `docs/07-roadmap-and-suggestions.md`
- Swagger and Postman testing: `docs/08-swagger-and-postman.md`
- Database auto/manual setup: `docs/09-database-setup-auto-vs-manual.md`
- Best practices and standards: `docs/10-best-practices-and-standards.md`
- Frontend UI architecture: `docs/11-frontend-ui-architecture.md`
- API reference and count: `docs/12-api-reference-and-count.md`

## Layout

| Path | Description |
|------|-------------|
| `backend/` | Spring Boot 3.4, Java 17, REST API under `/api/v1/*` |
| `frontend/` | Angular 19 SPA with lazy-loaded feature routes |
| `docker-compose.yml` | Optional local MySQL 8.4 |

## Prerequisites

- JDK 17+, Node 18+ / npm
- MySQL 8+ (or `docker compose up -d`)

## Database

1. Create database `olx_spa` (or use Docker compose; URL in `backend/src/main/resources/application.yml` uses `createDatabaseIfNotExist=true`).
2. Set `spring.datasource.username` / `password` to match your instance.

## Run the API

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

API: `http://localhost:8080` — e.g. `GET http://localhost:8080/api/v1/listings`
Swagger UI: `http://localhost:8080/swagger-ui.html`

## Run the SPA

```powershell
cd frontend
npm install
npm start
```

App: `http://localhost:4200` (dev build uses `environment.development.ts` → API `http://localhost:8080`).

## Environment variables (recommended)

Backend supports:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Example env file:
- `backend/.env.example`

## API surface (v1)

- `GET /api/v1/categories` — all categories  
- `GET /api/v1/listings` — paged active listings (`categoryId`, `q`, `page`, `size`, `sort`)  
- `GET /api/v1/listings/{id}` — detail  
- `POST /api/v1/listings` — create (JSON body includes `sellerId` for now; replace with JWT later)  
- `PUT /api/v1/listings/{id}` — update (seller must match)  
- `DELETE /api/v1/listings/{id}?sellerId=` — archive listing  
- `POST /api/v1/auth/register` — register user (BCrypt password hash)

## Future-friendly hooks

- Versioned API path (`/api/v1`) for additive changes  
- Flyway migrations for schema evolution  
- DTOs + mappers separate from JPA entities  
- `BusinessException` / `ResourceNotFoundException` + `GlobalExceptionHandler`  
- Frontend: `core/` (HTTP, models, interceptors), `features/*`, `shared/ui`  
- Register flow stores the user in `localStorage` so “Post ad” uses your `sellerId`; otherwise defaults to demo user `1`
