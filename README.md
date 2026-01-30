# Suscriptio

Personal subscription manager PWA built with React, TypeScript, and Tailwind CSS. Track your recurring expenses, visualize spending patterns, and never forget a payment.

## Features

### Core
- **Dashboard**: Monthly/yearly spend overview, upcoming payments, and category breakdown
- **Subscription Management**: Add, edit, delete, and cancel subscriptions with undo support
- **Categories**: Organize subscriptions (streaming, productivity, music, gaming, etc.)
- **Tags**: Flexible custom tags for personalized classification
- **Multi-currency**: Support for EUR, USD, GBP, MXN, and more

### Analytics
- **Key Metrics**: Active count, average cost, most expensive subscription
- **Top Categories**: Visual breakdown of spending by category
- **Annual Projection**: 12-month forecast with monthly vs yearly payment distribution
- **Timeline & Calendar**: Visualize upcoming payments in timeline or calendar view

### Data Management
- **Export**: Download data as JSON (backup) or CSV (Excel/Sheets compatible)
- **Import**: Restore from backup with merge or replace options
- **Local Storage**: All data stored locally with persistence

### User Experience
- **Bilingual**: Full Spanish and English support with language selector
- **Reminders**: Browser notifications for upcoming payments (while app is open)
- **Responsive**: Mobile-first design, works on any device
- **PWA**: Installable on desktop and mobile with offline support
- **Accessibility**: Keyboard navigation, ARIA labels, focus management
- **Toast Notifications**: Feedback on all actions with undo support

### Advanced Filters
- Filter by status (active/canceled)
- Filter by category (multi-select)
- Filter by tags
- Filter by price range
- Filter by payment date range
- Quick presets (next 7 days, this month, etc.)

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **Tailwind CSS v4** for styling
- **Zustand 5** for state management
- **Recharts** for data visualization
- **react-i18next** for internationalization
- **Sonner** for toast notifications
- **date-fns** for date manipulation
- **VitePWA** for PWA features
- **Vitest** for testing
- **ESLint + Prettier** for code quality

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linting
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # SpendOverview, KeyMetrics, Timeline, Calendar, Charts
│   ├── subscriptions/ # List, Card, Form, Modal, Filters
│   ├── layout/        # AppLayout, Header, MobileNav
│   └── ui/            # Button, Input, Select, Modal, Badge
├── store/             # Zustand stores (subscriptions, settings, reminders)
├── hooks/             # Custom hooks
├── utils/             # Calculations, validation, date utilities
├── types/             # TypeScript interfaces and enums
├── locales/           # i18n translations (es, en)
├── constants/         # Currencies, categories
└── pages/             # Settings, Login, Register
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
