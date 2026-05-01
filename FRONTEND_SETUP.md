# Task Management Frontend Setup Guide

## Overview

This document provides instructions for setting up and running the React frontend for the Task Management System alongside the existing Node.js/Express backend.

## Project Structure

```
/
├── backend/          (Existing Node.js/Express API - port 5000)
└── frontend/         (New React application - port 3000)
```

## Prerequisites

- Node.js 16+ and npm
- Backend running on `http://localhost:5000`

## Installation & Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

Create a `.env.local` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Management System
```

### 4. Start the development server

```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## Development Workflow

### Running Both Services

To run both backend and frontend in development:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# or whatever command starts the backend
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Both services will be available:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000/api`

## Available Scripts

In the frontend directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Architecture

### Authentication Flow

1. User logs in via Login page
2. Frontend sends credentials to `/auth/login` endpoint
3. Backend returns JWT token and user data
4. Token is stored in localStorage
5. All subsequent API requests include token via Axios interceptors
6. Protected routes check authentication status
7. On 401 response, user is redirected to login

### API Integration

All API calls go through the Axios client configured in `src/services/api/client.ts`:

- Base URL: Configured via `VITE_API_BASE_URL`
- Authentication: JWT tokens in Authorization header
- Error handling: Automatic 401 redirect
- Response normalization: JSON content type

### Services

The frontend has dedicated API service modules:

```
src/services/api/
├── client.ts          # Axios instance
├── auth.ts            # /auth endpoints
├── projects.ts        # /projects endpoints
├── tasks.ts           # /tasks endpoints
├── comments.ts        # Comments endpoints
├── users.ts           # /users endpoints
├── notifications.ts   # /notifications endpoints
├── plans.ts           # /plans endpoints
└── subscriptions.ts   # /subscriptions endpoints
```

### State Management

Uses React Context API:

- **AuthContext**: Manages authentication state, login, logout, register
- **NotificationContext**: Manages toast notifications

Component-level state uses React hooks (useState, useCallback, etc.).

### Routing

Protected routes ensure only authenticated users can access the app:

```
/login          → Public
/register       → Public
/dashboard      → Protected
/projects       → Protected
/tasks          → Protected
/users          → Protected (Admin only)
/subscriptions  → Protected
/settings       → Protected
```

## Frontend Features (Implemented)

### Phase 1: Project Setup ✅
- React 18 + TypeScript + Vite configuration
- Tailwind CSS styling
- ESLint and Prettier setup
- Environment variable configuration

### Phase 2: Authentication System ✅
- Login form with validation
- Registration form with validation
- JWT token management
- Protected routes
- Role-based access control

### Phase 3: Layout & Navigation ✅
- Responsive navbar
- Responsive sidebar with active state
- Mobile menu toggle
- User profile dropdown
- Navigation menus

### Phase 4: Dashboard ✅
- Welcome message
- Statistics cards (Projects, Tasks, Users, Completed Tasks)
- Quick access links

### Other Pages (Structure Ready - Awaiting Full Implementation)
- Projects (list and detail views)
- Tasks (list and detail views)
- Users (admin only)
- Subscriptions
- Settings

## Backend API Endpoints Used

### Authentication
- `POST /auth/login` - Login user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Projects
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project
- `POST /projects/:id/members` - Add member
- `DELETE /projects/:id/members/:userId` - Remove member

### Tasks
- `GET /tasks` - List tasks
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `PATCH /tasks/:id/status` - Update task status
- `GET /projects/:projectId/tasks` - Get tasks by project

### Comments
- `GET /tasks/:taskId/comments` - Get comments
- `POST /tasks/:taskId/comments` - Create comment
- `PUT /tasks/:taskId/comments/:commentId` - Update comment
- `DELETE /tasks/:taskId/comments/:commentId` - Delete comment

### Users
- `GET /users` - List users
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `POST /users/:id/change-password` - Change password
- `DELETE /users/:id` - Delete user
- `PATCH /users/:id/role` - Update user role

### Notifications
- `GET /notifications` - List notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/mark-all-read` - Mark all as read
- `GET /notifications/unread-count` - Get unread count

### Plans & Subscriptions
- `GET /plans` - List plans
- `GET /subscriptions/current` - Get current subscription
- `POST /subscriptions` - Create subscription
- `POST /subscriptions/initiate-payment` - Razorpay payment
- `POST /subscriptions/verify-payment` - Verify payment

## Type Definitions

All TypeScript types are defined in `src/types/`:

- `models.ts` - Data model types (User, Project, Task, etc.)
- `api.ts` - API request/response types

## Validation

Form validation uses React Hook Form with Zod schemas:

- Email validation
- Password validation
- Form field validation
- Custom error messages

Schemas are in `src/utils/validators.ts`

## Styling

### Tailwind CSS

Configured with custom color palette:
- Primary: #3b82f6 (Blue)
- Secondary: #10b981 (Green)  
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Orange)

Dark mode support ready (can be added).

### Responsive Design

Uses Tailwind breakpoints:
- Mobile first approach
- `md:` prefix for 768px+
- `lg:` prefix for 1024px+

## Error Handling

1. **Error Boundary**: Catches React component errors
2. **Axios Interceptors**: Handles API errors and 401 redirects
3. **Form Validation**: Client-side validation with Zod
4. **Toast Notifications**: User feedback for all actions

## Performance Optimizations

- Code splitting via Vite
- Dynamic imports for routes
- Lazy loading of components
- Memoization where needed
- Efficient re-renders

## Testing (Future)

Structure supports adding:
- Vitest for unit tests
- React Testing Library for component tests
- Cypress for e2e tests

## Deployment

### Build for Production

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Environment Variables for Production

Update `.env.local` or `.env.production` with:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Task Management System
```

### Deployment Options

- Vercel (recommended)
- Netlify
- GitHub Pages
- Traditional web servers

## Troubleshooting

### Port Already in Use

If port 3000 is in use, Vite will automatically use the next available port.

### API Connection Issues

1. Ensure backend is running on port 5000
2. Check `VITE_API_BASE_URL` in `.env.local`
3. Check browser console for CORS errors
4. Verify backend allows requests from `localhost:3000`

### Build Errors

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf dist .vite`
3. Check Node version: `node --version` (should be 16+)

### Type Errors

If you see type errors:
1. Ensure `vite-env.d.ts` exists
2. Run `npm run build` to check for actual errors

## Next Steps

### Complete Features (Phases 5-11)

To complete the full implementation:

1. **Phase 5: Project Management**
   - List projects with pagination/filtering
   - Create/edit project forms
   - Project member management

2. **Phase 6: Task Management**
   - Task list with filters (status, priority, assignee)
   - Create/edit task forms
   - Task detail page with comments

3. **Phase 7: Comments System**
   - Comment list and form
   - Edit/delete own comments
   - Reply functionality

4. **Phase 8: User Management (Admin)**
   - User list and search
   - User edit forms
   - Role management

5. **Phase 9: Notifications**
   - Notification bell in navbar
   - Notification list panel
   - Mark as read functionality

6. **Phase 10: Subscriptions**
   - Plans list page
   - Subscription checkout
   - Razorpay integration

7. **Phase 11: Polish**
   - Loading skeletons
   - Pagination
   - Error messages
   - Confirmation dialogs

## Contributing

When adding new features:

1. Create components in appropriate directory
2. Add types in `src/types/`
3. Create API service if needed
4. Add forms with validation
5. Use Tailwind CSS for styling
6. Test with backend API

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Axios Docs](https://axios-http.com/)

## License

MIT
