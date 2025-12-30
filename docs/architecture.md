# Architecture Design

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | React 18+ | UI components |
| Language | TypeScript | Type safety |
| Build Tool | Vite | Fast dev server and bundling |
| Styling | Tailwind CSS | Utility-first styling |
| State Management | Zustand | Global state + localStorage |
| Routing | React Router v6 | Client-side routing |
| Charts | Recharts | Data visualization |
| i18n | react-i18next | Spanish localization |
| PWA | Vite PWA Plugin | Service worker + manifest |
| Date Handling | date-fns | Date manipulation |
| Storage | localStorage | Data persistence (MVP) |

## Project Structure

```
suscriptio/
├── public/
│   ├── icons/              # PWA icons (192x192, 512x512)
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx          # Main app shell
│   │   │   ├── Header.tsx             # Top navigation
│   │   │   └── MobileNav.tsx          # Bottom mobile nav
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx          # Main dashboard page
│   │   │   ├── SpendOverview.tsx      # Monthly/yearly totals
│   │   │   ├── UpcomingPayments.tsx   # Next 30 days list
│   │   │   ├── CategoryBreakdown.tsx  # Pie/bar chart
│   │   │   ├── KeyMetrics.tsx         # Quick stats
│   │   │   └── TrendsChart.tsx        # Optional trends (v2)
│   │   ├── subscriptions/
│   │   │   ├── SubscriptionList.tsx   # List page
│   │   │   ├── SubscriptionCard.tsx   # Individual card/row
│   │   │   ├── SubscriptionModal.tsx  # Add/edit modal
│   │   │   ├── SubscriptionForm.tsx   # Form fields
│   │   │   └── EmptyState.tsx         # No subscriptions view
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   └── shared/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── store/
│   │   └── subscriptionStore.ts       # Zustand store
│   ├── types/
│   │   ├── subscription.ts            # Subscription types
│   │   └── index.ts                   # Barrel export
│   ├── utils/
│   │   ├── calculations.ts            # Spend calculations
│   │   ├── dateUtils.ts               # Date manipulation
│   │   ├── validation.ts              # Form validation
│   │   └── storage.ts                 # localStorage helpers
│   ├── hooks/
│   │   ├── useSubscriptions.ts        # Custom hook for store
│   │   └── useAutoAdvanceDates.ts     # Auto-advance logic
│   ├── locales/
│   │   ├── es/
│   │   │   └── translation.json       # Spanish translations
│   │   └── en/
│   │       └── translation.json       # English (v2)
│   ├── config/
│   │   └── i18n.ts                    # i18n configuration
│   ├── App.tsx                        # Root component
│   ├── main.tsx                       # Entry point
│   ├── index.css                      # Tailwind imports
│   └── vite-env.d.ts                  # Vite types
├── docs/                               # Project documentation
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

## Component Hierarchy

```
App
├── AppLayout
│   ├── Header
│   │   └── Navigation links
│   ├── MobileNav (mobile only)
│   └── Router Outlet
│       ├── Dashboard (/)
│       │   ├── SpendOverview
│       │   ├── UpcomingPayments
│       │   │   └── SubscriptionCard (list)
│       │   ├── CategoryBreakdown
│       │   │   └── Recharts PieChart
│       │   └── KeyMetrics
│       └── SubscriptionList (/subscriptions)
│           ├── Filters (status, sort)
│           ├── SubscriptionCard (list)
│           └── EmptyState (if no subscriptions)
├── SubscriptionModal (global, controlled)
│   └── SubscriptionForm
│       ├── Input (name, cost, url)
│       ├── Select (frequency, status, category)
│       ├── DatePicker (next payment)
│       └── Textarea (notes)
└── ConfirmDialog (global, controlled)
```

## State Management (Zustand)

### Store Structure

```typescript
// src/store/subscriptionStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription, BillingFrequency, SubscriptionStatus } from '@/types';

interface SubscriptionStore {
  // State
  subscriptions: Subscription[];

  // Actions
  addSubscription: (subscription: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void; // Sets status to CANCELED
  getSubscriptionById: (id: string) => Subscription | undefined;

  // Derived / Computed (selectors)
  getActiveSubscriptions: () => Subscription[];
  getCanceledSubscriptions: () => Subscription[];
  getUpcomingPayments: (days: number) => Subscription[];
  getMonthlySpend: () => number;
  getYearlySpend: () => number;
  getCategoryBreakdown: () => { category: string; total: number; count: number }[];
  getMostExpensiveSubscription: () => Subscription | null;
}

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: [],

      addSubscription: (subscription) => {
        const newSubscription: Subscription = {
          ...subscription,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          subscriptions: [...state.subscriptions, newSubscription],
        }));
      },

      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((sub) =>
            sub.id === id ? { ...sub, ...updates, updatedAt: new Date() } : sub
          ),
        }));
      },

      deleteSubscription: (id) => {
        // Soft delete: set status to CANCELED
        get().updateSubscription(id, { status: SubscriptionStatus.CANCELED });
      },

      getSubscriptionById: (id) => {
        return get().subscriptions.find((sub) => sub.id === id);
      },

      getActiveSubscriptions: () => {
        return get().subscriptions.filter((sub) => sub.status === SubscriptionStatus.ACTIVE);
      },

      getCanceledSubscriptions: () => {
        return get().subscriptions.filter((sub) => sub.status === SubscriptionStatus.CANCELED);
      },

      getUpcomingPayments: (days) => {
        const now = new Date();
        const futureDate = addDays(now, days);
        return get()
          .getActiveSubscriptions()
          .filter((sub) => {
            const paymentDate = new Date(sub.nextPaymentDate);
            return paymentDate >= now && paymentDate <= futureDate;
          })
          .sort((a, b) => new Date(a.nextPaymentDate).getTime() - new Date(b.nextPaymentDate).getTime());
      },

      getMonthlySpend: () => {
        return get()
          .getActiveSubscriptions()
          .reduce((total, sub) => {
            if (sub.billingFrequency === BillingFrequency.MONTHLY) {
              return total + sub.cost;
            } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
              return total + sub.cost / 12;
            }
            return total;
          }, 0);
      },

      getYearlySpend: () => {
        return get()
          .getActiveSubscriptions()
          .reduce((total, sub) => {
            if (sub.billingFrequency === BillingFrequency.MONTHLY) {
              return total + sub.cost * 12;
            } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
              return total + sub.cost;
            }
            return total;
          }, 0);
      },

      getCategoryBreakdown: () => {
        const breakdown = new Map<string, { total: number; count: number }>();

        get().getActiveSubscriptions().forEach((sub) => {
          const category = sub.category || 'other';
          const monthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY
            ? sub.cost
            : sub.cost / 12;

          const existing = breakdown.get(category) || { total: 0, count: 0 };
          breakdown.set(category, {
            total: existing.total + monthlyCost,
            count: existing.count + 1,
          });
        });

        return Array.from(breakdown.entries()).map(([category, data]) => ({
          category,
          ...data,
        }));
      },

      getMostExpensiveSubscription: () => {
        const active = get().getActiveSubscriptions();
        if (active.length === 0) return null;

        return active.reduce((max, sub) => {
          const maxMonthlyCost = max.billingFrequency === BillingFrequency.MONTHLY
            ? max.cost
            : max.cost / 12;
          const subMonthlyCost = sub.billingFrequency === BillingFrequency.MONTHLY
            ? sub.cost
            : sub.cost / 12;

          return subMonthlyCost > maxMonthlyCost ? sub : max;
        });
      },
    }),
    {
      name: 'subscriptions-storage', // localStorage key
    }
  )
);
```

### Custom Hooks

```typescript
// src/hooks/useSubscriptions.ts
// Convenience hook for common store operations

import { useSubscriptionStore } from '@/store/subscriptionStore';

export const useSubscriptions = () => {
  const store = useSubscriptionStore();

  return {
    subscriptions: store.subscriptions,
    activeSubscriptions: store.getActiveSubscriptions(),
    upcomingPayments: store.getUpcomingPayments(30),
    monthlySpend: store.getMonthlySpend(),
    yearlySpend: store.getYearlySpend(),
    categoryBreakdown: store.getCategoryBreakdown(),
    mostExpensive: store.getMostExpensiveSubscription(),
    addSubscription: store.addSubscription,
    updateSubscription: store.updateSubscription,
    deleteSubscription: store.deleteSubscription,
  };
};
```

```typescript
// src/hooks/useAutoAdvanceDates.ts
// Auto-advance past payment dates on app load

import { useEffect } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { addMonths, addYears } from 'date-fns';
import { BillingFrequency, SubscriptionStatus } from '@/types';

export const useAutoAdvanceDates = () => {
  const { subscriptions, updateSubscription } = useSubscriptionStore();

  useEffect(() => {
    const now = new Date();

    subscriptions.forEach((sub) => {
      if (sub.status !== SubscriptionStatus.ACTIVE) return;

      const nextPayment = new Date(sub.nextPaymentDate);
      if (nextPayment >= now) return; // Date is still valid

      // Auto-advance
      let newDate = nextPayment;
      if (sub.billingFrequency === BillingFrequency.MONTHLY) {
        while (newDate < now) {
          newDate = addMonths(newDate, 1);
        }
      } else if (sub.billingFrequency === BillingFrequency.YEARLY) {
        while (newDate < now) {
          newDate = addYears(newDate, 1);
        }
      }

      updateSubscription(sub.id, { nextPaymentDate: newDate });
    });
  }, []); // Run only on mount
};
```

## Data Flow

### Add Subscription Flow

1. User clicks "+ Añadir suscripción"
2. `SubscriptionModal` opens (state: `isOpen = true`)
3. User fills `SubscriptionForm`
4. Form validates on blur and submit
5. On "Guardar" → `form.onSubmit()`
6. Call `useSubscriptionStore().addSubscription(data)`
7. Zustand store:
   - Generates UUID
   - Sets timestamps
   - Adds to `subscriptions` array
   - Persists to localStorage (middleware)
8. UI re-renders (React reactivity)
9. Dashboard updates with new subscription

### Edit Subscription Flow

1. User clicks subscription card
2. `SubscriptionModal` opens with `initialData`
3. User modifies fields
4. On "Guardar" → `form.onSubmit()`
5. Call `useSubscriptionStore().updateSubscription(id, updates)`
6. Zustand store:
   - Finds subscription by ID
   - Merges updates
   - Sets `updatedAt`
   - Persists to localStorage
7. UI re-renders
8. Dashboard recalculates totals

### Dashboard Calculations

1. Component mounts
2. `useSubscriptions()` hook accesses store
3. Store computes derived values:
   - `getMonthlySpend()` → iterates active subs, normalizes to monthly
   - `getYearlySpend()` → iterates active subs, normalizes to yearly
   - `getCategoryBreakdown()` → groups by category, sums monthly cost
4. React renders with computed values
5. Recharts visualizes category breakdown

## Routing

```typescript
// src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { SubscriptionList } from '@/components/subscriptions/SubscriptionList';

function App() {
  useAutoAdvanceDates(); // Auto-advance on app load

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/subscriptions" element={<SubscriptionList />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
```

## Internationalization (i18n)

### Configuration

```typescript
// src/config/i18n.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from '@/locales/es/translation.json';

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
  },
  lng: 'es', // Default language
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;
```

### Translation File Structure

```json
// src/locales/es/translation.json

{
  "common": {
    "add": "Añadir",
    "edit": "Editar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "confirm": "Confirmar",
    "currency": "€"
  },
  "dashboard": {
    "title": "Panel de control",
    "monthlySpend": "Gasto mensual",
    "yearlySpend": "Gasto anual",
    "upcomingPayments": "Próximos pagos",
    "categoryBreakdown": "Desglose por categoría",
    "activeSubscriptions": "Suscripciones activas",
    "mostExpensive": "Más cara"
  },
  "subscriptions": {
    "title": "Suscripciones",
    "add": "Añadir suscripción",
    "edit": "Editar suscripción",
    "cancelSubscription": "Cancelar suscripción",
    "confirmCancel": "¿Cancelar suscripción? Se excluirá de los totales, pero se mantendrá el registro.",
    "keepActive": "Mantener activa",
    "emptyState": "No hay suscripciones. ¡Añade tu primera suscripción!",
    "fields": {
      "name": "Nombre",
      "cost": "Coste",
      "billingFrequency": "Frecuencia de pago",
      "nextPaymentDate": "Próxima fecha de pago",
      "status": "Estado",
      "category": "Categoría",
      "notes": "Notas",
      "providerUrl": "URL del proveedor"
    },
    "frequency": {
      "monthly": "Mensual",
      "yearly": "Anual"
    },
    "status": {
      "active": "Activa",
      "canceled": "Cancelada"
    },
    "categories": {
      "streaming": "Streaming",
      "productivity": "Productividad",
      "cloud_storage": "Almacenamiento en la nube",
      "music": "Música",
      "gaming": "Juegos",
      "health_fitness": "Salud y fitness",
      "news_learning": "Noticias y aprendizaje",
      "utilities": "Utilidades",
      "other": "Otro"
    }
  },
  "validation": {
    "required": "Este campo es obligatorio",
    "minLength": "Mínimo {{min}} caracteres",
    "maxLength": "Máximo {{max}} caracteres",
    "invalidUrl": "URL no válida",
    "invalidNumber": "Número no válido",
    "minValue": "Valor mínimo: {{min}}",
    "maxValue": "Valor máximo: {{max}}"
  }
}
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.monthlySpend')}: {monthlySpend} {t('common.currency')}</p>
    </div>
  );
}
```

## PWA Configuration

### Vite PWA Plugin Setup

```typescript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'Suscriptio',
        short_name: 'Suscriptio',
        description: 'Gestor de suscripciones personal',
        theme_color: '#6366f1', // Indigo-500 (example)
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### Service Worker Strategy

- **Cache-first** for app shell (HTML, CSS, JS)
- **Network-first** for data (N/A in MVP, no backend)
- Auto-update on new version

## Styling & Design System

### Tailwind Configuration

```javascript
// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        // Add custom colors as needed
      },
    },
  },
  plugins: [],
};
```

### Component Patterns

- **UI Components** (`src/components/ui/`): Reusable, unstyled logic + Tailwind classes
- **Feature Components**: Compose UI components + business logic
- **Responsive Design**: Mobile-first with Tailwind breakpoints (`sm:`, `md:`, `lg:`)

## Utilities & Helpers

### Calculations

```typescript
// src/utils/calculations.ts

import { Subscription, BillingFrequency } from '@/types';

export const normalizeToMonthly = (cost: number, frequency: BillingFrequency): number => {
  if (frequency === BillingFrequency.MONTHLY) return cost;
  if (frequency === BillingFrequency.YEARLY) return cost / 12;
  return 0;
};

export const normalizeToYearly = (cost: number, frequency: BillingFrequency): number => {
  if (frequency === BillingFrequency.MONTHLY) return cost * 12;
  if (frequency === BillingFrequency.YEARLY) return cost;
  return 0;
};

export const calculateTotalSpend = (
  subscriptions: Subscription[],
  normalize: 'monthly' | 'yearly'
): number => {
  return subscriptions.reduce((total, sub) => {
    const amount = normalize === 'monthly'
      ? normalizeToMonthly(sub.cost, sub.billingFrequency)
      : normalizeToYearly(sub.cost, sub.billingFrequency);
    return total + amount;
  }, 0);
};
```

### Date Utilities

```typescript
// src/utils/dateUtils.ts

import { differenceInDays, format, addMonths, addYears, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export const getDaysUntilPayment = (paymentDate: Date | string): number => {
  const now = new Date();
  const payment = new Date(paymentDate);
  return differenceInDays(payment, now);
};

export const getPaymentLabel = (daysUntil: number): string => {
  if (daysUntil === 0) return 'Vence hoy';
  if (daysUntil === 1) return 'Vence mañana';
  if (daysUntil > 1 && daysUntil <= 7) return `Vence en ${daysUntil} días`;
  return '';
};

export const advancePaymentDate = (
  currentDate: Date,
  frequency: BillingFrequency
): Date => {
  if (frequency === BillingFrequency.MONTHLY) {
    return addMonths(currentDate, 1);
  } else if (frequency === BillingFrequency.YEARLY) {
    return addYears(currentDate, 1);
  }
  return currentDate;
};
```

### Validation

```typescript
// src/utils/validation.ts

export const validateSubscriptionForm = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'validation.minLength';
  }
  if (data.name && data.name.length > 60) {
    errors.name = 'validation.maxLength';
  }

  if (!data.cost || data.cost < 0.01) {
    errors.cost = 'validation.minValue';
  }
  if (data.cost > 9999) {
    errors.cost = 'validation.maxValue';
  }

  if (!data.billingFrequency) {
    errors.billingFrequency = 'validation.required';
  }

  if (!data.nextPaymentDate) {
    errors.nextPaymentDate = 'validation.required';
  }

  if (data.providerUrl && !isValidUrl(data.providerUrl)) {
    errors.providerUrl = 'validation.invalidUrl';
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = 'validation.maxLength';
  }

  return errors;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

## Build & Deployment

### Build Commands

```json
// package.json scripts

{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "type-check": "tsc --noEmit"
  }
}
```

### Deployment Options (Free Tier)

1. **Vercel** (Recommended for MVP)
   - Zero config for Vite apps
   - Automatic HTTPS
   - Global CDN
   - Free tier: Unlimited hobby projects

2. **Netlify**
   - Similar to Vercel
   - Drag & drop deployment
   - Free tier: 100GB bandwidth/month

3. **GitHub Pages**
   - Free for public repos
   - Requires base path configuration

### Environment Variables

```env
# .env.local (not committed)
VITE_APP_VERSION=1.0.0
```

## Testing Strategy (v2)

For MVP, manual testing is acceptable given time constraints.

**Future (v2):**
- Unit tests: Vitest
- Component tests: React Testing Library
- E2E tests: Playwright

## Performance Optimizations

### Initial Load

- Code splitting by route (React.lazy)
- Lazy load charts (Recharts)
- Tree-shake Tailwind CSS (production build)

### Runtime

- Memoize expensive calculations (useMemo)
- Debounce search/filter inputs
- Virtual scrolling for long subscription lists (v2)

### Bundle Size

- Use date-fns with tree-shaking (import only needed functions)
- Recharts tree-shaking (import specific charts)

## Security Considerations

### Input Sanitization

- React default XSS protection (JSX escaping)
- Validate all form inputs (client-side)
- Sanitize URLs before rendering links

### localStorage Security

- No sensitive data (no passwords, tokens)
- Data stored unencrypted (acceptable for personal subscriptions)
- Future: Encrypt with Web Crypto API if needed

### CSP (Content Security Policy)

- Configure in index.html or hosting platform
- Restrict script sources

## Accessibility (a11y)

### Keyboard Navigation

- Focusable interactive elements
- Tab order follows visual flow
- Escape closes modals

### Screen Readers

- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA labels for icons
- Form labels properly associated

### Color Contrast

- WCAG AA minimum (4.5:1 for text)
- Test with browser DevTools

## Error Handling

### User-Facing Errors

- Form validation errors (inline)
- Empty states (no subscriptions)
- Graceful degradation (localStorage unavailable)

### Error Boundary

```typescript
// src/components/shared/ErrorBoundary.tsx

import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Algo salió mal. Por favor, recarga la página.</div>;
    }
    return this.props.children;
  }
}
```

## Next Steps

With architecture defined, proceed to **Phase 4: Implementation**

1. Project setup (Vite + dependencies)
2. Type definitions
3. Store implementation
4. UI components (bottom-up)
5. Feature components
6. Routing & layout
7. PWA configuration
8. i18n setup
9. Build & deploy

See [workflow/03-build.md](workflow/03-build.md) for implementation steps.
