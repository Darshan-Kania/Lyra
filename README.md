# MailFlare - Modular React Email Client

A modern, modular React email client built with Vite, Zustand for state management, and a clean component architecture.

## 🏗️ Project Structure

```
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
│   │   └── index.js
│   ├── emails/            # Email-specific components
│   │   ├── EmailsHeader.jsx
│   │   ├── EmailList.jsx
│   │   ├── EmailContent.jsx
│   │   └── index.js
│   ├── settings/          # Settings components (future)
│   └── auth/              # Auth components (future)
├── pages/                 # Page components
│   ├── LandingPage.jsx    # Landing/login page
│   ├── Dashboard.jsx      # Main dashboard
│   ├── EmailsPage.jsx     # Email management
│   ├── SettingsPage.jsx   # User settings
│   └── AuthCallback.jsx   # OAuth callback
├── hooks/                 # Custom React hooks
│   ├── useStores.js       # Store convenience hooks
│   └── index.js
├── routes/                # Routing configuration
│   └── Router.jsx
├── utils/                 # Utility functions
│   └── auth.js           # Legacy auth utils (deprecated)
└── assets/               # Static assets
```

## 🔧 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization

## 🚀 Key Features

### Modular Architecture
- **Component Separation**: Each major feature has its own component directory
- **API Abstraction**: Centralized API logic with error handling and caching
- **State Management**: Zustand stores for different domains (auth, dashboard, emails)
- **Custom Hooks**: Convenience hooks for common store operations

### State Management with Zustand

#### Auth Store (`useAuthStore`)
```javascript
import { useAuthStore } from '../store';

const { 
  isAuthenticated, 
  user, 
  login, 
  logout, 
  checkAuthStatus 
} = useAuthStore();
```

#### Dashboard Store (`useDashboardStore`)
```javascript
import { useDashboardStore } from '../store';

const { 
  stats, 
  topContacts, 
  activityData, 
  fetchStats, 
  fetchActivityData 
} = useDashboardStore();
```

#### Emails Store (`useEmailSelectors`)
```javascript
import { useEmailSelectors } from '../store/emailsStore';

const { 
  paginatedEmails, 
  selectedEmail, 
  unreadCount,
  fetchEmails, 
  selectEmail 
} = useEmailSelectors();
```

### API Layer Benefits
- **Centralized Configuration**: Single axios instance with interceptors
- **Error Handling**: Consistent error handling across all API calls
- **Caching**: Built-in caching to reduce redundant API calls
- **Fallback Data**: Graceful fallbacks when APIs are unavailable

### Component Benefits
- **Reusable**: Components can be easily reused across different pages
- **Testable**: Isolated components are easier to unit test
- **Maintainable**: Changes to UI logic are contained within specific components
- **Props Interface**: Clear interfaces between parent and child components

## 🔄 Data Flow

1. **Pages** use stores to get data and trigger actions
2. **Stores** call API methods to fetch/update data
3. **API methods** handle HTTP requests with proper error handling
4. **Components** receive data via props and emit events via callbacks

## 🧪 Development

### Getting Started
```bash
npm install
npm run dev
```

### Store Usage Examples

#### Authentication
```javascript
// In a component
const { user, login, logout } = useAuth(); // Custom hook

// Login
const handleLogin = () => {
  login(); // Redirects to Google OAuth
};

// Logout
const handleLogout = async () => {
  const result = await logout();
  if (result.success) {
    navigate('/');
  }
};
```

#### Dashboard Data
```javascript
const { stats, refreshAll } = useDashboard(); // Custom hook

// Refresh all dashboard data
useEffect(() => {
  refreshAll();
}, []);

// Display stats
return <DashboardStats stats={stats} />;
```

#### Email Management
```javascript
const { 
  paginatedEmails, 
  selectedEmail, 
  selectEmail 
} = useEmails(); // Custom hook

// Select an email
const handleEmailSelect = (emailId) => {
  selectEmail(emailId); // Automatically marks as read
};
```

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

Expected API endpoints:
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
