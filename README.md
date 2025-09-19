# MailFlare - Modular React Email Client

A modern, modular React email client built with Vite, Zustand for state management, and a clean component architecture.

## 🏗️ Project Structure

````
src/
├── api/                    # API abstraction layer
│   ├── client.js          # Axios client configuration
│   ├── auth.js            # Authentication API methods
│   ├── dashboard.js       # Dashboard/stats API methods
│   ├── emails.js          # Email management API methods
│   └── index.js           # API exports
├── store/                  # Zustand state stores
│   ├── authStore.js       # Authentication state
│   ├── dashboardStore.js  # Dashboard data & stats
│   ├── emailsStore.js     # Email data & management
│   └── index.js           # Store exports
├── components/             # Reusable components
│   ├── common/            # Shared layout components
│   │   ├── AppLayout.jsx  # Main app layout
│   │   └── Footer.jsx     # Footer component
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── DashboardHeader.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── ActivityChart.jsx
│   │   ├── QuickActions.jsx
│   │   ├── TopContacts.jsx
# MailFlare
│   │   └── index.js
│   ├── emails/            # Email-specific components
│   │   ├── EmailsHeader.jsx
# MailFlare

Modern React email client with AI‑assisted workflows.

## Features
- Inbox list view (full‑width) with familiar email browsing
- Full‑screen email detail route with clean reading experience
- AI summary of each email’s content
- Three AI quick‑reply suggestions with Send action
- Global loading overlay for a smooth, consistent feel
- Sidebar toggle on smaller screens
- Pagination and basic importance/read states
- Graceful fallback data when backend is unavailable

## Libraries (what we used and where)
- React + Vite — application UI and fast dev/build tooling
- React Router — navigation (list: /emails, detail: /emails/:id)
- Zustand — app state (auth, dashboard, emails, ui)
- Axios — HTTP client with interceptors (centralized headers, global loader)
- Tailwind CSS — styling system for rapid, consistent UI
- Framer Motion — micro‑interactions and subtle animations
- Recharts — dashboard charts and visualizations
- @fontsource/inter — typography (Inter font)
- classnames — conditional class management
- js-cookie — lightweight cookie utilities for auth/session needs
4. **Components** receive data via props and emit events via callbacks

## 🧪 Development

### Getting Started

```bash
npm install
npm run dev
````

## 📦 Building for Production

```bash
npm run build
npm run preview
```

## 🚧 Future Improvements

1. **Add TypeScript** for better type safety
2. **Email Compose** functionality
3. **Real-time Updates** with WebSocket integration
4. **Email Search** and advanced filtering
5. **Offline Support** with service workers
6. **Unit Tests** with Vitest and React Testing Library
7. **E2E Tests** with Playwright
8. **Performance Monitoring** with analytics

## 🔗 API Integration

The application is designed to work with a backend API. Set your backend URL in the environment:

```bash
VITE_BACKEND_URL=http://localhost:3001
```

API endpoints from backend:

- `GET /auth/status` - Check authentication
- `GET /dashboard/userProfile` - Get user info
- `GET /dashboard/EmailCount` - Get email counts
- `GET /user/topContacts` - Get frequent contacts
- `POST /auth/logout` - Logout user

## 📝 Notes

- This refactored version reduces API calls through intelligent caching
- Components are now highly reusable and testable
- State management is centralized and predictable
- The codebase is more maintainable with clear separation of concerns
