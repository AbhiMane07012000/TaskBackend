# Project Setup

This project is a Node.js + Express authentication API that uses Prisma with PostgreSQL and exposes Swagger docs.

## Prerequisites

Make sure you have these installed before starting:

- Node.js 20+ recommended
- npm
- PostgreSQL

## 1. Install dependencies

```bash
npm install
```

## 2. Create environment variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/setup_db"
JWT_SECRET="your-access-token-secret"
JWT_REFRESH_SECRET="your-refresh-token-secret"
```

### Environment variable notes

- `PORT`: Port used by the Express server.
- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `JWT_SECRET`: Secret for access tokens.
- `JWT_REFRESH_SECRET`: Secret for refresh tokens.

## 3. Run Followin commands

```bash 
npx prisma migrate dev --name init 
npx prisma generate
```
## 4. Run database migrations

Apply the existing Prisma migrations:

```bash
npx prisma migrate deploy
```

If you are working locally and want Prisma to manage development migrations, you can also use:

```bash
npx prisma migrate dev
```

## 5. Start the project

For development:

```bash
npm run dev
```


## 6. Open the API

After the server starts, you can access:

- API base URL: `http://localhost:5000`
- Swagger documentation: `http://localhost:5000/api-docs`

## Project structure 

> Note: Follow Modular approch like auth and post(post is added for reference)

```text
src/
  auth/
      auth.controller.js
      auth.middleware.js
      auth.routes.js
  post/
      post.controller.js
      post.middleware.js
      postroutes.js
  index.js
config/
  db.js
  swagger.js
prisma/
  schema.prisma
  migrations/
```

> The authentication feature is organized in its own `src/auth` module so routes, middleware, and controllers stay grouped together.

