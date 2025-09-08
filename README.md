# Lyra

Frontend Repository for MailFlare

## Directory Structure

```
/client
├── public/
│   ├── index.html
│   └── favicon.ico
└── src/
    ├── assets/
    │   ├── images/
    │   │   └── logo.png
    │   └── styles/
    │       └── main.css
    ├── components/
    │   ├── auth/
    │   │   ├── LoginButton.js
    │   │   └── LogoutButton.js
    │   ├── common/
    │   │   ├── Navbar.js
    │   │   ├── Footer.js
    │   │   └── Spinner.js
    │   ├── dashboard/
    │   │   ├── Analytics.js
    │   │   └── Settings.js
    │   └── gmail/
    │       ├── EmailList.js
    │       ├── EmailListItem.js
    │       └── EmailDetail.js
    ├── pages/
    │   ├── HomePage.js
    │   ├── LoginPage.js
    │   ├── DashboardPage.js
    │   └── GmailPage.js
    ├── services/
    │   ├── authService.js
    │   ├── dashboardService.js
    │   └── gmailService.js
    ├── App.js
    ├── index.js
    └── routes.js
```

## Explanation of the Structure

### `public/`
- **index.html**: The main HTML file where your React app is mounted.
- **favicon.ico**: Your site's icon.

### `src/assets/`
- **images/logo.png**: For your application's logo.
- **styles/main.css**: For global CSS styles.

### `src/components/`
This is for your reusable UI pieces, organized by feature for scalability:

- **auth/**: Components related to authentication, like LoginButton.js and LogoutButton.js.
- **common/**: Components used across multiple pages, like Navbar.js, Footer.js, and Spinner.js for loading states.
- **dashboard/**: Components specific to the dashboard, like Analytics.js and Settings.js.
- **gmail/**: Components for the Gmail integration, such as EmailList.js to display emails, EmailListItem.js for a single email in the list, and EmailDetail.js to show a single email.

### `src/pages/`
These components represent the main views or pages of your application:

- **HomePage.js**: The landing page of your application.
- **LoginPage.js**: A page for users to log in.
- **DashboardPage.js**: The main dashboard view after a user logs in.
- **GmailPage.js**: A page to display and interact with Gmail messages.

### `src/services/`
This directory abstracts away the API calls to your backend:

- **authService.js**: Functions for making API calls to your /auth routes (e.g., login(), logout()).
- **dashboardService.js**: Functions for fetching data for the dashboard from your /dashboard routes.
- **gmailService.js**: Functions for interacting with your /gmail API endpoints.

### Root Files
- **App.js**: The root component of your React application, containing the main routing logic.
- **index.js**: The entry point of your application, where the App component is rendered.
- **routes.js**: A dedicated file to define the frontend routes, keeping your App.js cleaner.

This structure provides a robust and organized foundation for your frontend, making it easier to develop, maintain, and scale.
