# Toghrak X

Full-stack news/blog x with categories, posts, pages, footer links, and admin workflows.
Stack: Angular (frontend) + Spring Boot (backend) + PostgreSQL + JWT.

## Features

- Public: browse posts by recency/popularity/category, view post detail with images, static pages (About/Contact/FAQ/Terms/Privacy) with galleries, footer links & social links, responsive UI.
- Auth: JWT login.
- Admin: manage posts (with images/categories), categories (CRUD + navbar updates), static pages (CRUD + gallery images), footer links, social links, users/roles.

## Tech

- Frontend: Angular, RxJS, Angular Router, Bootstrap styles, custom CSS/SCSS.
- Backend: Spring Boot 3, Spring Security (JWT), Spring Data JPA, Hibernate, PostgreSQL.
- Extras: Simple rate limiter on public endpoints, server-side HTML escaping for page content, image upload endpoint for galleries.

## Prerequisites

- Node 18+ / npm, Angular CLI
- Java 21, Maven 3.9+
- PostgreSQL 14+ (or compatible)

## Backend setup

1. Create a PostgreSQL DB/user.
2. Set `backend/src/main/resources/application.properties`:

spring.datasource.url=jdbc:postgresql://localhost:5432/blogdb
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASS
app.jwt.secret=CHANGE_ME
app.jwt.expiration=3600000

3. Run: `cd backend && mvn clean package -DskipTests && mvn spring-boot:run`
4. Swagger: http://localhost:8081/swagger-ui/index.html

## Frontend setup

1. `cd frontend && npm install`
2. Dev: `ng serve --open` (expects backend at http://localhost:8081; change in `src/environments/environment.ts` if needed)
3. Prod build: `ng build`

## Local run

- Backend: `mvn spring-boot:run` (8081)
- Frontend: `ng serve` (4200)

## Deployment notes

- Set `app.jwt.secret` securely.
- Adjust CORS in SecurityConfig if hosting frontend separately.
- Configure image storage/CDN for uploads.
- Consider adding Flyway/Liquibase migrations in production.

## Scripts

- Backend tests: `mvn test`
- Frontend lint: `ng lint`
- Frontend tests: `ng test`

## Troubleshooting

- “Unused file” warnings in Angular are cosmetic; exclude in tsconfig if desired.
- If you see schema errors, add DB migrations or align DB with JPA entities.
