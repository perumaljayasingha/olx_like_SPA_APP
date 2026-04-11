# Database Setup: Auto vs Manual

This app supports both auto-creation and manual DB setup.

## Current behavior in this project

From `application.yml`:

- `spring.datasource.url` includes `createDatabaseIfNotExist=true`
- Flyway migrations are enabled (`spring.flyway.enabled: true`)
- JPA uses `ddl-auto: validate` (it checks schema, does not create/alter tables)

Meaning:

- Database can be auto-created by MySQL driver URL (if user permissions allow).
- Tables are created by Flyway scripts, not by Hibernate auto-DDL.

## Option A: Automatic DB creation (recommended for local)

Requirements:
- MySQL user has permission to create DB.

Steps:
1. Keep default URL with `createDatabaseIfNotExist=true`.
2. Start backend.
3. Flyway creates tables and seed data automatically.

## Option B: Manual DB creation

Steps:
1. Create DB manually:
   ```sql
   CREATE DATABASE olx_spa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Keep backend URL pointed to `olx_spa`.
3. Start backend; Flyway will still create tables/migrations.

## Manual table creation?

Not needed in normal flow.

- Do **not** manually create tables when Flyway is active.
- Tables should come from:
  - `V1__init_schema.sql`
  - `V2__seed_data.sql`

## Environment variable based DB config

The app now supports:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

Example (PowerShell):

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/olx_spa?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=utf8"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="root"
cd backend
.\mvnw.cmd spring-boot:run
```
