# Suscriptio

Personal subscription manager PWA built with React, TypeScript, and Tailwind CSS.

## Features

- **Dashboard**: View monthly/yearly spend, upcoming payments, and category breakdown
- **Subscription Management**: Add, edit, and cancel subscriptions
- **Categories**: Organize subscriptions by type (streaming, productivity, etc.)
- **Auto-advance**: Automatically updates payment dates when they pass
- **PWA**: Installable on desktop and mobile with offline support
- **Spanish UI**: Default Spanish interface (English can be added in v2)

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Zustand (state management)
- Recharts (data visualization)
- react-i18next (internationalization)
- Vite PWA Plugin

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## MVP Scope

This is an MVP focused on core functionality:
- ✅ Manual subscription entry (CRUD)
- ✅ Dashboard with spend overview and analytics
- ✅ Upcoming payments view
- ✅ Category breakdown visualization
- ✅ localStorage persistence
- ✅ PWA installability

### Out of scope for v1
- Bank/card integrations
- Automatic subscription detection
- Multi-user support
- Push notifications
- Backend/cloud sync

## License

MIT
