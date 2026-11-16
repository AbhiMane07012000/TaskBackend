# Task Management API

A Node.js and Express API for authentication, projects, tasks, comments, notifications, dashboards, and subscriptions. It uses PostgreSQL through Prisma and provides interactive API documentation with Swagger UI.

## Requirements

- Node.js 20 or later
- npm
- PostgreSQL

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root. Set the credentials for the integrations you use; the database and JWT secrets are required by the API.

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/task_backend"

JWT_SECRET=replace_with_a_secure_secret
JWT_REFRESH_SECRET=replace_with_a_different_secure_secret

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GOOGLE_API_KEY=
SENDGRID_API_KEY=
MAIL_FROM=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

Apply the existing migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

To populate the database with the project seed data, run:

```bash
npx prisma db seed
```

## Run

Start the development server with automatic reload:

```bash
npm run dev
```

Or start it without reload:

```bash
npm start
```

The default API base URL is `http://localhost:5000`. Swagger documentation is available at `http://localhost:5000/api-docs`.

## API modules

Routes are mounted under these prefixes:

| Module | Route prefix |
| --- | --- |
| Authentication | `/api/auth` |
| Tasks | `/api/tasks` |
| Projects | `/api/projects` |
| Users | `/api/users` |
| Dashboard | `/api/dashboard` |
| Comments | `/api/comments` |
| Notifications | `/api/notifications` |
| Plans | `/api/plans` |
| Subscriptions | `/api/subscriptions` |

## Project structure

```text
config/       Integration and database configuration
middlewares/  Shared Express middleware
prisma/       Prisma schema, migrations, and seed script
src/          API entry point and feature modules
utils/        Mail and token utilities
```