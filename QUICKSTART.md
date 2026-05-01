# Quick Start Guide - Task Management Frontend

## One-Minute Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:3000
```

## Running Frontend + Backend Together

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Login Credentials (Test with Backend)

Create test users via the register page or use existing backend accounts:
- Visit `/login` or `/register`
- Email: your-email@example.com
- Password: your-password

## Project Routes

| Route | Purpose | Auth Required |
|-------|---------|---|
| `/login` | Login page | ❌ |
| `/register` | Register page | ❌ |
| `/dashboard` | Overview & stats | ✅ |
| `/projects` | Projects list | ✅ |
| `/tasks` | Tasks list | ✅ |
| `/users` | User management | ✅ Admin |
| `/subscriptions` | Plans & billing | ✅ |
| `/settings` | Profile settings | ✅ |

## File Structure Quick Reference

```
frontend/
├── src/
│   ├── components/     # UI components
│   ├── pages/         # Page components
│   ├── contexts/      # Global state (Auth, Notifications)
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API client & utilities
│   ├── types/         # TypeScript types
│   ├── utils/         # Helper functions
│   ├── App.tsx        # Routing setup
│   └── main.tsx       # Entry point
├── index.html         # HTML entry
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript config
```

## Key Files to Know

- **src/App.tsx** - All routing configuration
- **src/contexts/AuthContext.tsx** - Authentication state
- **src/components/layout/MainLayout.tsx** - Main app wrapper
- **src/services/api/** - API endpoint methods
- **src/types/** - All TypeScript types
- **src/pages/** - Page components

## Adding New Features

### 1. Create a new page component
```typescript
// src/pages/MyNewPage.tsx
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';

export const MyNewPage: React.FC = () => {
  return (
    <MainLayout>
      <h1>My New Page</h1>
    </MainLayout>
  );
};
```

### 2. Add route in App.tsx
```typescript
<Route
  path="/my-new-page"
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  }
/>
```

### 3. Add navigation link in Sidebar.tsx
```typescript
{ label: 'My New Page', icon: MyIcon, path: '/my-new-page' },
```

## Common Tasks

### Use Authentication
```typescript
import { useAuth } from '../hooks/useAuth';

const { user, login, logout, isAuthenticated } = useAuth();
```

### Show Toast Notification
```typescript
import { useNotification } from '../hooks/useNotification';

const { showToast } = useNotification();

showToast('Success message', 'success');
showToast('Error message', 'error');
```

### Call API
```typescript
import { projectsService } from '../services/api/projects';

const projects = await projectsService.getAll();
const project = await projectsService.getById(1);
```

### Use Forms
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../utils/validators';

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(projectSchema),
});
```

## Environment Variables

Create `.env.local` in frontend folder:
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Management System
```

## Build for Production

```bash
npm run build      # Creates optimized dist/ folder
npm run preview    # Preview the production build locally
```

## Troubleshooting

### "Cannot find module" error
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### Port 3000 already in use
- Vite will automatically use the next available port
- Or kill the process: `lsof -i :3000` and `kill -9 <PID>`

### API connection errors
1. Ensure backend is running on port 5000
2. Check `.env.local` has correct `VITE_API_BASE_URL`
3. Check browser console for CORS errors

### TypeScript errors
```bash
npm run build     # Check for actual compile errors
```

## Component Template

```typescript
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useNotification } from '../hooks/useNotification';

export const MyComponent: React.FC = () => {
  const { showToast } = useNotification();

  const handleClick = () => {
    showToast('Action completed!', 'success');
  };

  return (
    <MainLayout>
      <div>
        <h1>My Component</h1>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </MainLayout>
  );
};
```

## Useful VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Thunder Client (API testing)

## Performance Tips

1. Use React DevTools Profiler to identify slow renders
2. Implement code splitting for large pages
3. Use React.memo() for expensive components
4. Avoid unnecessary re-renders with useCallback

## Testing

(When adding tests):
```bash
npm install --save-dev vitest @testing-library/react
npm test
```

## Deployment

### To Vercel (recommended)
```bash
# Push to GitHub, then:
# 1. Go to https://vercel.com/import
# 2. Import your GitHub repo
# 3. Set environment variables
# 4. Deploy!
```

### To Netlify
```bash
npm install netlify-cli -g
netlify login
netlify deploy --prod
```

## API Documentation

See `/docs` in backend or refer to:
- **FRONTEND_SETUP.md** - Detailed setup guide
- **IMPLEMENTATION_SUMMARY.md** - Architecture overview
- **frontend/README.md** - Project documentation

## Next Steps

1. ✅ Frontend is running
2. ✅ Login/Register works
3. ✅ Dashboard displays
4. ⬜ Implement Projects features
5. ⬜ Implement Tasks features
6. ⬜ Implement User management
7. ⬜ Implement Subscriptions
8. ⬜ Polish and deploy

## Getting Help

- Check existing components for patterns
- Review type definitions in `src/types/`
- Look at similar implementations
- Check React/TypeScript documentation links in README.md

---

**Happy coding! 🚀**

For detailed information, see FRONTEND_SETUP.md or frontend/README.md
