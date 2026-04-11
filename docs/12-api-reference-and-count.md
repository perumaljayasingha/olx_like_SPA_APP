# API Reference and API Count

## Total APIs in this project

## Business APIs

There are **7 business APIs** under `/api/v1`:

1. `GET /api/v1/categories`
2. `GET /api/v1/listings`
3. `GET /api/v1/listings/{id}`
4. `POST /api/v1/listings`
5. `PUT /api/v1/listings/{id}`
6. `DELETE /api/v1/listings/{id}?sellerId=...`
7. `POST /api/v1/auth/register`

## Documentation APIs

There are **2 documentation endpoints**:

1. `GET /swagger-ui.html`
2. `GET /v3/api-docs`

So, total including docs endpoints = **9 endpoints**.

---

## Endpoint details (beginner-friendly)

## 1) Get categories

- Method: `GET`
- URL: `/api/v1/categories`
- Purpose: fetch all category options for filters and posting form.
- Request body: none
- Response: array of categories

## 2) Get listings (search + pagination)

- Method: `GET`
- URL: `/api/v1/listings`
- Query params (optional): `categoryId`, `q`, plus paging (`page`, `size`, `sort`)
- Purpose: browse active listings with filters.
- Response: paged object (`content` + page metadata)

Example:

`GET /api/v1/listings?page=0&size=12&q=phone&categoryId=1`

## 3) Get listing by id

- Method: `GET`
- URL: `/api/v1/listings/{id}`
- Purpose: show one listing detail screen.
- Error: 404 if listing not found.

## 4) Create listing

- Method: `POST`
- URL: `/api/v1/listings`
- Purpose: publish a new listing.
- Required fields:
  - `title`
  - `price`
  - `itemCondition`
  - `categoryId`
  - `sellerId`

Sample JSON:

```json
{
  "title": "Royal Enfield Classic 350",
  "description": "Single owner, all documents clear.",
  "price": 175000,
  "itemCondition": "GOOD",
  "categoryId": 2,
  "sellerId": 1,
  "city": "Bengaluru",
  "imageUrl": "https://placehold.co/600x400?text=Bike"
}
```

## 5) Update listing

- Method: `PUT`
- URL: `/api/v1/listings/{id}`
- Purpose: modify an existing listing.
- Important: seller owner check is enforced.

Sample JSON:

```json
{
  "sellerId": 1,
  "price": 169999,
  "city": "Pune"
}
```

## 6) Archive listing

- Method: `DELETE`
- URL: `/api/v1/listings/{id}?sellerId=1`
- Purpose: soft remove listing from active search results.
- Response: `204 No Content`

## 7) Register user

- Method: `POST`
- URL: `/api/v1/auth/register`
- Purpose: create user account.
- Password is hashed with BCrypt on backend.

Sample JSON:

```json
{
  "email": "rahul@example.com",
  "password": "StrongPass123",
  "fullName": "Rahul Sharma",
  "phone": "+919876543210"
}
```
