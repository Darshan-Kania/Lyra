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
│   ├── settings.js        # Settings API methods
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
- Simple, local loading states (no global loader/bus)
- Sidebar toggle on smaller screens
- Pagination and basic importance/read states
- Graceful fallback data when backend is unavailable

## Libraries (what we used and where)
- React + Vite — application UI and fast dev/build tooling
- React Router — navigation (list: /emails, detail: /emails/:id)
- Zustand — app state (auth, dashboard, emails)
- Axios — HTTP client with light interceptors (no global side-effects)
- Tailwind CSS — styling system for rapid, consistent UI
- Framer Motion — micro‑interactions and subtle animations
- Recharts — dashboard charts and visualizations
 
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

The application is designed to work with a backend API. Set your backend URL and optional timeout in the environment:

```bash
VITE_BACKEND_URL=http://localhost:3001
# 0 disables timeout (good for dev), or set to e.g. 30000 for 30s
VITE_API_TIMEOUT=0
```

API endpoints from backend:

- `GET /auth/status` - Check authentication
- `GET /dashboard/userProfile` - Get user info
- `GET /dashboard/EmailCount` - Get email counts
- `GET /user/topContacts` - Get frequent contacts
- `POST /auth/logout` - Logout user
- `POST /updationFilter` - Update settings filters

## 📝 Notes

- This refactor centralizes all API calls in `src/api` and store actions
- UI components do not call HTTP directly—stores/hooks handle it
- Intelligent caching in stores reduces API calls
- Clean separation of concerns improves maintainability

### Environment files
- Copy `.env.example` to `.env.local` (already provided) and adjust values.
- `VITE_API_TIMEOUT` defaults to 0 (no timeout) to avoid blank pages on slow responses during development.
