# Task Management Frontend

A modern React application for managing tasks, projects, and team collaboration.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **React Toastify** - Notifications

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Management System
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Navbar, Sidebar)
│   ├── common/         # Common components (Spinner, Modal)
│   ├── projects/       # Project components
│   ├── tasks/          # Task components
│   ├── comments/       # Comment components
│   ├── users/          # User components
│   ├── notifications/  # Notification components
│   └── subscriptions/  # Subscription components
├── pages/              # Page components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API service layer
│   └── api/           # API endpoint services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Features

### Authentication
- Login and registration forms
- JWT token management
- Protected routes with role-based access
- Automatic token refresh on 401

### Dashboard
- Overview statistics
- Quick access to projects and tasks
- User greeting

### Projects
- Create and manage projects
- Add team members
- View project tasks

### Tasks
- Create and manage tasks
- Set priority and due dates
- Assign tasks to team members
- Update task status
- Add comments

### Users (Admin)
- View all users
- Manage user roles
- User management

### Subscriptions
- Browse available plans
- Manage subscriptions
- Razorpay payment integration

### Settings
- Profile management
- Password change
- Preferences

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. All API calls include JWT authentication via Axios interceptors.

### API Services

- `authService` - Authentication endpoints
- `projectsService` - Project CRUD operations
- `tasksService` - Task management
- `commentsService` - Comment management
- `usersService` - User management
- `notificationsService` - Notifications
- `plansService` - Subscription plans
- `subscriptionsService` - Subscription management

## State Management

The app uses React Context API for global state:

- **AuthContext** - User authentication and profile
- **NotificationContext** - Toast notifications

Component-level state is managed with React hooks (useState, useReducer).

## Styling

Tailwind CSS is used for all styling with a custom color palette defined in `tailwind.config.js`:

- Primary: #3b82f6 (Blue)
- Secondary: #10b981 (Green)
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Orange)

## Form Validation

Forms use React Hook Form with Zod for validation schemas. Validation rules are defined in `utils/validators.ts`.

## Error Handling

- Error Boundary component for React errors
- Axios interceptors for API errors
- Toast notifications for user feedback
- Proper error states in forms

## Development Workflow

1. Create types in `types/` directory
2. Create API services in `services/api/`
3. Build components in `components/`
4. Create pages in `pages/`
5. Add routing in `App.tsx`

## License

MIT
