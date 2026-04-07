# Roadmap and Suggestions

## Priority future features

## 1) Authentication and authorization

- Add login endpoint and JWT token flow.
- Remove `sellerId` from public payloads.
- Use authenticated user identity on backend.

## 2) Real image upload

- Replace URL-based images with upload service (S3/local object storage).
- Add image validation and compression.

## 3) Listing edit UI

- Add dedicated edit page.
- Reuse create form with patch/update mode.

## 4) Favorites and saved searches

- Allow users to bookmark listings.
- Add notification hooks for matching new listings.

## 5) In-app chat / inquiry system

- Buyer-seller chat thread.
- Read/unread states and moderation hooks.

## 6) Quality and reliability

- Add unit and integration tests.
- Add API docs (`springdoc-openapi`).
- Add CI pipeline (build + test + lint).
- Add centralized logging and metrics.

## Architecture improvements

- Introduce mapstruct for mapping consistency.
- Add pagination defaults/limits and stricter sort whitelist.
- Add DTO versioning strategy for API evolution.
- Add feature flags for safe rollout of new UI.
