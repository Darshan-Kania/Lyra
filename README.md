# 🌟 Lyra Frontend – MailFlare React Client

Lyra is the **modern, modular React frontend** for **MailFlare**, built with **Vite**, **Zustand**, **Tailwind**, and **clean component architecture**. It provides the user interface for viewing emails, reading AI summaries, sending replies, managing inbox states, and displaying dashboard analytics.

This README is fully rewritten and aligned with your complete MailFlare system architecture.

---

# 🚀 Overview

Lyra connects with the **Velora backend** and **N8N AI engine** to deliver a fast, smooth, and intelligent email‑management UI.

### ✨ Core Highlights

* 🔑 Google OAuth login (via backend)
* 📬 Inbox list view (paginated)
* 📨 Full email detail page
* 🤖 AI summary with 3 quick‑reply suggestions
* 💬 Reply‑send workflow
* 📊 Dashboard charts (Recharts)
* 🎛️ Zustand‑based stores for clean state management
* 🎨 Tailwind UI with Framer Motion animations
* 📱 Responsive layout (sidebar toggle on mobile)
* 🔄 Graceful fallback UI if backend is down

---

# 🧱 Project Structure

```
src/
├── api/                     # API abstraction layer
│   ├── client.js            # Axios configuration + interceptors
│   ├── auth.js              # Authentication API
│   ├── dashboard.js         # Dashboard & stats APIs
│   ├── emails.js            # Email fetch/modify APIs
│   ├── settings.js          # Filter/update APIs
│   └── index.js             # API exports
│
├── store/                   # Zustand stores
│   ├── authStore.js         # Auth state & session
│   ├── dashboardStore.js    # Counts, stats, activity
│   ├── emailsStore.js       # Inbox list, selected email, actions
│   └── index.js             # Export entry
│
├── components/
│   ├── common/
│   │   ├── AppLayout.jsx    # Main shell layout
│   │   └── Footer.jsx
│   │
│   ├── dashboard/
│   │   ├── DashboardHeader.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── ActivityChart.jsx
│   │   ├── QuickActions.jsx
│   │   ├── TopContacts.jsx
│   │   └── index.js
│   │
│   ├── emails/
│       ├── EmailsHeader.jsx
│       ├── EmailList.jsx
│       ├── EmailItem.jsx
│       ├── EmailDetail.jsx
│       ├── SummaryBox.jsx
│       ├── ReplySuggestions.jsx
│       └── Pagination.jsx
│
├── pages/                   # Route pages
├── routes/                  # React Router config
├── utils/                   # Helpers
└── main.jsx
```

---

# 🎨 UI & UX Principles

* Clean, modern email‑client layout similar to Gmail/Hey
* Inbox → detail is fullscreen for distraction‑free reading
* Subtle Framer Motion animations (fade, slide, transitions)
* AI summary always visible on right side
* Reply suggestions styled as quick‑action cards
* Optimistic UI for read/important toggles

---

# 🔗 API Integration

Lyra communicates directly with the **Velora backend API**.

### Environment Variables

```
VITE_BACKEND_URL=http://localhost:3001

```
