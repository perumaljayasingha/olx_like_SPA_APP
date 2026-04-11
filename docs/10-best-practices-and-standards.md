# Best Practices and Standards

## Coding standards

## Backend (Java/Spring)

- Keep controllers thin; business logic in services.
- Use DTOs for request/response, do not expose JPA entities directly.
- Use `@Valid` on request DTOs and bean validation annotations.
- Throw domain exceptions (`BusinessException`, `ResourceNotFoundException`) and handle centrally.
- Keep package-by-layer naming consistent:
  - `controller`, `service`, `repository`, `dto`, `entity`, `mapper`, `exception`, `config`
- Prefer constructor injection (Lombok `@RequiredArgsConstructor` already used).
- Keep transaction boundaries in service layer.

## Frontend (Angular)

- Keep API calls in services (`core/services`) only.
- Use typed models for all API payloads.
- Keep feature screens under `features/*`.
- Shared reusable UI should go under `shared/ui`.
- Use lazy-loaded routes for major pages.
- Handle HTTP errors through interceptor + centralized state service.

## Naming guidelines

- Classes: `PascalCase`
- Variables/methods: `camelCase`
- Constants: `UPPER_SNAKE_CASE` (when true constants)
- Files: kebab-case in frontend; Java class names match file names in backend

## Project structure guidelines

## Backend

- `controller` = HTTP entry points
- `service` = use-case and rule implementation
- `repository` = persistence contracts
- `repository/spec` = dynamic query specs
- `dto` = API contracts
- `mapper` = conversion between entities and DTOs
- `exception` = app-specific errors + global handler
- `config` = CORS, password encoder, etc.

## Frontend

- `core/models` = TypeScript interfaces/types
- `core/services` = API service classes and auth state
- `core/interceptors` = HTTP cross-cutting concerns
- `features/*` = feature-wise pages
- `shared/ui` = reusable presentational components

## Documentation standards

- Keep each major area in a separate document.
- Include purpose, flow, commands, and troubleshooting.
- Add examples for API and UI behavior.
- Keep beginner notes in each section.
