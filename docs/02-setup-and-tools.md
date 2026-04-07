# Setup and Tools

## Required tools

- Java 17+
- Node.js 18+ and npm
- MySQL 8+ (or Docker)
- Git
- Recommended IDE: Cursor / VS Code / IntelliJ

## Tech stack

- Frontend: Angular 19, RxJS, TypeScript, SCSS
- Backend: Spring Boot 3.4, Spring Web, Spring Data JPA, Validation
- Build: Maven Wrapper (`backend/mvnw.cmd`)
- DB migration: Flyway
- Database: MySQL 8

## Local setup

## 1) Database

Option A: Docker

```powershell
docker compose up -d
```

Option B: Manual MySQL

- Create DB: `olx_spa`
- Update credentials in `backend/src/main/resources/application.yml`

## 2) Start backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend URL: `http://localhost:8080`

## 3) Start frontend

```powershell
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:4200`

## 4) Build checks

Frontend production build:

```powershell
cd frontend
npm run build
```

Backend compile:

```powershell
cd backend
.\mvnw.cmd -DskipTests compile
```

## Useful project files

- `backend/src/main/resources/application.yml` - backend config
- `backend/src/main/resources/db/migration/*` - schema and seed migrations
- `frontend/src/environments/*` - frontend API base URL config
- `frontend/src/app/app.routes.ts` - SPA route map
