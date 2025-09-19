# Issues Log

A concise history of issues we hit and how we fixed them.

Last updated: 2025-09-19

## 1) Add summary + AI replies UI
- Problem: Needed a summary box and three AI-generated quick replies with Send buttons when viewing an email.
- Fix: Implemented UI in `src/components/emails/EmailContent.jsx` to render `selectedEmail.summary` and up to 3 `selectedEmail.aiReplies`, each with a Send button wired to `emailsAPI.sendReply()`.
- Key files: `src/components/emails/EmailContent.jsx`, `src/api/emails.js` (normalize/transform AI replies).

## 2) Fetch-by-ID when an email is clicked
- Problem: On selecting a mail, we needed to call backend by `/emails/:id` to get full details (summary/AI replies).
- Fix: `selectEmail(emailId)` in the store now calls `emailsAPI.getEmailById(emailId)` and merges the response into the selected item.
- Key files: `src/store/emailsStore.js` (selectEmail), `src/api/emails.js` (getEmailById).

## 3) Summary disappeared after refresh
- Problem: On reload, the summary block didn’t show until re-clicking.
- Fix (phase 1): After fetching the list, hydrate the selected email with `getEmailById()` so the summary is present without extra click.
- Key files: `src/store/emailsStore.js` (hydration after list fetch).

## 4) Keep selection across refresh (then changed UX)
- Problem: Wanted the same email to stay selected after refresh.
- Fix: Persisted `selectedEmailId` in zustand persistence.
- Follow-up UX change: Later requirement switched to Gmail-like behavior (no email open on list page). We removed auto-select on fetch and introduced a detail route.
- Key files: `src/store/emailsStore.js` (persist `selectedEmailId`, then stop auto-select).

## 5) Gmail-like navigation and layout
- Problem: On /emails, list should fill the page; clicking opens a full-screen detail view; back returns to list; sidebar toggle.
- Fix: Created a dedicated detail page/route and made the list page show only the list (full width). Sidebar is togglable on small screens.
- Key files:
  - `src/pages/EmailsPage.jsx` (list-only, navigate on click, fullWidth list, sidebar toggle)
  - `src/pages/EmailDetailPage.jsx` (full-screen content + back)
  - `src/routes/Router.jsx` (added `/emails/:id`)
  - `src/components/emails/EmailList.jsx` (added `fullWidth` prop)

## 6) Global loader overlay and blank page on reload
- Problem: Added a global loader via axios interceptors, but wiring it through the store created a circular import that caused a blank (white) page on reload.
- Fix: Replaced store-based loader control with a tiny event bus to avoid circular deps.
- Key files:
  - `src/utils/loadingBus.js` (new, pub/sub counter)
  - `src/api/client.js` (use loadingBus in interceptors)
  - `src/components/common/GlobalLoader.jsx` (subscribe to loadingBus)
  - `src/components/common/AppLayout.jsx` (renders GlobalLoader)

## 7) React Hooks order error in EmailContent
- Problem: "Rendered more hooks than during the previous render" due to useState declared after early returns.
- Fix: Moved `useState` hooks above early returns so hook order is stable.
- Key file: `src/components/emails/EmailContent.jsx`.
---

## Known follow-ups / ideas
- Add an error boundary around pages to catch unexpected render issues.
- Optional: Clear `selectedEmailId` when navigating to `/emails` to avoid highlighting any prior selection.
- Add unit tests for `emailsStore` behaviors (select, hydrate, persist, pagination).

## How to run
- Start dev server:
  - `npm run dev`

## Troubleshooting quick notes
- Blank page after edits: Check browser console for errors; verify no circular imports (we replaced loader wiring with `loadingBus`).
- Summary missing: Ensure the detail route `/emails/:id` is used, or that hydration runs for a persisted selection.
- No emails shown: Confirm backend URL via `VITE_BACKEND_URL` and that `/emails` endpoint is available; otherwise fallback sample data is used.
