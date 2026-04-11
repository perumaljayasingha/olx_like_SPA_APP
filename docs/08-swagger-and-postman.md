# Swagger and Postman API Testing Guide

## Swagger (OpenAPI) support

Swagger UI is enabled using `springdoc-openapi-starter-webmvc-ui`.

## URLs

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## How to use Swagger

1. Start backend:
   ```powershell
   cd backend
   .\mvnw.cmd spring-boot:run
   ```
2. Open `http://localhost:8080/swagger-ui.html`.
3. Expand any endpoint.
4. Click **Try it out**.
5. Provide request values and execute.
6. Validate status code and response payload.

## Postman collection

Collection file:
- `docs/postman/olx-spa-api.postman_collection.json`
- `docs/postman/local.postman_environment.json` (environment variables for local testing)

## Import steps

1. Open Postman.
2. Click **Import** -> select the collection JSON file.
3. Import `docs/postman/local.postman_environment.json`.
4. Select the imported environment in Postman top-right.
5. Ensure variable `baseUrl` is `http://localhost:8080`.
6. Run requests in order:
   - categories/listings
   - register
   - create/update/archive listing

## Sample test sequence

1. `Register User`
2. `Create Listing`
3. Copy created `id` into `listingId` variable
4. `Get Listing By Id`
5. `Update Listing`
6. `Archive Listing`

## Tips for beginners

- Keep one Postman environment for local and one for staging.
- Save real examples in request history as team references.
- Verify both success (2xx) and failure cases (4xx/5xx).
