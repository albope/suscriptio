# Project Specification

## Overview

**Project Name:** Suscriptio (Subscription Manager PWA)

**Target:** Personal subscription tracking and financial awareness

**Timeline:** MVP today ✅ **COMPLETADO**

**Platform:** Progressive Web App (PWA)

**Primary Language:** Spanish (English in v2)

**Current Status:** MVP + Backend integration complete

## Technical Stack

### Core Technologies

- **Frontend Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand with localStorage persistence + Supabase sync
- **Charting:** Recharts (for category breakdown visualization)
- **Internationalization:** react-i18next with JSON translation files
- **PWA:** Installable from day one, minimal offline support
- **Backend:** Supabase (PostgreSQL + Auth) ✅ *Added post-MVP*
- **Authentication:** Supabase Auth (email/password) ✅ *Added post-MVP*

### Rationale

- **React + TypeScript:** Type safety, familiar ecosystem, fast development
- **Vite:** Fastest build tool for pure frontend MVP
- **Tailwind:** Utility-first CSS, no heavy design system overhead
- **Zustand:** Lightweight state management, simple localStorage integration
- **Recharts:** React-native charting, simple API
- **react-i18next:** Standard i18n solution, JSON-based translations

## Data Model

### Subscription Entity

```typescript
interface Subscription {
  id: string; // UUID
  name: string; // 2-60 chars, required
  cost: number; // Positive, min 0.01, max 9999, 2 decimals, required
  currency: string; // Fixed "EUR" for MVP, stored per record for future
  billingFrequency: BillingFrequency; // required
  nextPaymentDate: Date; // required, today or future
  status: SubscriptionStatus; // required
  category?: Category; // optional
  notes?: string; // max 500 chars, optional
  providerUrl?: string; // valid URL, optional
  reminderDaysBefore?: number; // optional, for v2
  createdAt: Date; // auto-managed
  updatedAt: Date; // auto-managed
}

enum BillingFrequency {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  // v2: WEEKLY, QUARTERLY, CUSTOM
}

enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  // v2: PAUSED, TRIAL
}

enum Category {
  STREAMING = 'streaming',
  PRODUCTIVITY = 'productivity',
  CLOUD_STORAGE = 'cloud_storage',
  MUSIC = 'music',
  GAMING = 'gaming',
  HEALTH_FITNESS = 'health_fitness',
  NEWS_LEARNING = 'news_learning',
  UTILITIES = 'utilities',
  OTHER = 'other',
}
```

### Validation Rules

| Field | Rule |
|-------|------|
| `name` | Required, trimmed, 2-60 chars |
| `cost` | Required, positive number, 0.01-9999, max 2 decimals |
| `billingFrequency` | Required, must match enum |
| `nextPaymentDate` | Required, valid date, >= today |
| `status` | Required, must match enum |
| `notes` | Optional, max 500 chars |
| `providerUrl` | Optional, valid URL format |

### Data Persistence

**MVP:** localStorage (or IndexedDB)
- Single-device support
- No authentication required
- No cross-device sync

**v2:** Backend database (Supabase/Firebase) with sync

## Feature Specifications

### 1. Subscription Registry (CRUD)

#### 1.1 Add Subscription

**Trigger:**
- "+ Add subscription" button (top-right on desktop, sticky bottom on mobile)
- Available on Dashboard and Subscriptions list page

**UI:**
- Modal/drawer (preference)
- Single form with all fields at once (no wizard)

**Form Fields:**

| Field | Type | Required | Default |
|-------|------|----------|---------|
| Name | Text input | Yes | - |
| Cost | Number input | Yes | - |
| Currency | Display only | - | EUR |
| Billing Frequency | Select/Radio | Yes | Monthly |
| Next Payment Date | Date picker | Yes | Today |
| Status | Select/Radio | Yes | Active |
| Category | Select | No | - |
| Notes | Textarea | No | - |
| Provider URL | Text input | No | - |

**Actions:**
- "Save" → validates, creates subscription, closes modal, refreshes dashboard
- "Cancel" → closes modal without saving

**Validation:**
- Client-side validation on blur and submit
- Display inline error messages
- Disable "Save" until form is valid

#### 1.2 Edit Subscription

**Trigger:**
- Click/tap on subscription card in list
- Or explicit "Edit" icon/button on card

**UI:**
- Same modal as Add, pre-filled with existing data
- All fields editable

**Behavior:**
- Changing billing frequency: next payment date remains as set (no auto-recalculation in MVP)
- Changing next payment date: becomes new source of truth
- Status change: updates immediately

**Actions:**
- "Save" → validates, updates subscription, closes modal
- "Cancel" → discards changes, closes modal

#### 1.3 Cancel/Delete Subscription

**Behavior:**
- No hard delete in MVP
- "Cancel" sets `status` to `CANCELED`
- Record remains in storage

**Confirmation:**
- Dialog: "¿Cancelar suscripción? Se excluirá de los totales, pero se mantendrá el registro."
- Actions: "Cancelar suscripción" | "Mantener activa"

**Reactivation:**
- User can change status back to `ACTIVE` via edit

#### 1.4 Subscription List View

**Location:** Separate page `/subscriptions`

**Display:**
- Card/row per subscription showing:
  - Name
  - Cost + frequency (e.g., "€9.99 / mes")
  - Next payment date
  - Category (optional but recommended)
  - Status badge (Active/Canceled)

**Sorting:**
- Default: Next payment date ascending
- Optional sorts:
  - Name A-Z
  - Cost (highest first)
  - Status (Active first)

**Filtering:**
- Status filter:
  - Active (default)
  - Canceled
  - All

**MVP Simplification:**
- If time is tight: only default sort + status filter

### 2. Dashboard & Analytics

#### 2.1 Dashboard Layout (Priority Order)

1. **Total Spend Overview** (Hero section)
2. **Upcoming Payments** (Short-term actionable)
3. **Category Breakdown** (Visual insights)
4. **Key Metrics** (Quick glance indicators)
5. **Trends** (Optional/lightweight in MVP)

**Goal:** Answer in 5 seconds: "How much am I spending, what's coming next, and where is my money going?"

#### 2.2 Total Spend Overview

**Metrics:**

**Monthly Spend (Normalized):**
- Monthly subscriptions → full cost
- Yearly subscriptions → cost ÷ 12
- Only `ACTIVE` subscriptions included

**Yearly Spend (Normalized):**
- Monthly subscriptions → cost × 12
- Yearly subscriptions → full cost
- Only `ACTIVE` subscriptions included

**Display:**
- Large, prominent numbers
- Clear labels: "Gasto mensual" / "Gasto anual"
- Currency: EUR (€)

**Exclusions:**
- `CANCELED` subscriptions excluded from totals

#### 2.3 Upcoming Payments

**Time Window:**
- Next 30 days (default, no tabs in MVP)

**Sorting:**
- By payment date ascending (soonest first)

**Information per Item:**
- Subscription name
- Next payment date
- Amount
- Category (optional)
- Status indicator (if needed)

**In-app Reminders (MVP):**
- Visual indicators in list:
  - "Vence en 3 días"
  - "Vence mañana"
  - "Vence hoy"
- No push notifications in MVP (v2)

#### 2.4 Category Breakdown

**Visualization:**
- Pie chart or bar chart (simple, single visualization)
- Recharts component

**Data:**
- Total spend per category (primary)
- Subscription count per category (optional, can be v2)

**Calculation:**
- Based on normalized monthly spend
- Only `ACTIVE` subscriptions

#### 2.5 Key Metrics / Quick Glance

**Indicators:**
- Number of active subscriptions
- Most expensive subscription (name + cost)
- Optional: Count of subscriptions charging in next 30 days

**Display:**
- Small cards or inline stats
- Not cluttered, clean layout

#### 2.6 Trends (Lightweight)

**Time Ranges:**
- Default: 12 months
- Optional toggles: 3 months, 6 months, 12 months

**Data Source:**
- Projected data (not historical payments)
- Based on current active subscriptions + billing frequency

**Chart Type:**
- Simple line or bar chart (Recharts)

**MVP Note:**
- Can be deferred if time is tight

### 3. User Interactions & UX

#### 3.1 Navigation

**Pages:**
- `/` → Dashboard
- `/subscriptions` → Subscription list

**Navigation Bar:**
- Dashboard link
- Subscriptions link
- (Optional) Settings link for v2

#### 3.2 Responsive Design

**Desktop:**
- Clean layout, sidebar navigation or top nav
- Modals for add/edit

**Mobile:**
- Bottom navigation or hamburger menu
- Drawer/bottom sheet for add/edit
- Sticky "+ Add" button

#### 3.3 Date Auto-Advancement

**Behavior:**
- When `nextPaymentDate` passes (< today):
  - If `status === ACTIVE`:
    - Auto-calculate new `nextPaymentDate` based on `billingFrequency`
    - Monthly: +1 month
    - Yearly: +1 year
  - If `status === CANCELED`:
    - Do not auto-advance

**Implementation:**
- Check on app load and dashboard view
- Update subscriptions with passed dates

#### 3.4 Language & Localization

**MVP:**
- Spanish UI (required)
- All labels, buttons, messages, validation errors in Spanish

**i18n Setup:**
- react-i18next with JSON translation files
- Namespace: `translation.json` (Spanish)
- English translation file prepared but not active (for v2)

**Translation Keys Structure:**
```json
{
  "dashboard": {
    "title": "Panel de control",
    "monthlySpend": "Gasto mensual",
    "yearlySpend": "Gasto anual"
  },
  "subscriptions": {
    "add": "Añadir suscripción",
    "edit": "Editar suscripción",
    "cancel": "Cancelar suscripción"
  },
  // etc.
}
```

### 4. PWA Requirements

#### 4.1 Installability

**Required:**
- Web app manifest (`manifest.json`)
- Service worker for offline capability
- App installable on desktop and mobile

**Manifest Fields:**
- `name`: "Suscriptio"
- `short_name`: "Suscriptio"
- `description`: "Gestor de suscripciones personal"
- `start_url`: "/"
- `display`: "standalone"
- `theme_color`: (TBD based on design)
- `background_color`: (TBD)
- `icons`: 192x192, 512x512 (minimum)

#### 4.2 Offline Support

**MVP (Minimal):**
- App shell cached (HTML, CSS, JS)
- Data persisted in localStorage (works offline by default)
- No network requests in MVP (no backend)

**Service Worker:**
- Cache-first strategy for app assets
- Basic offline page if needed

**v2:**
- Background sync for backend data
- Offline-first with sync when online

#### 4.3 Notifications

**MVP:**
- No push notifications (deferred to v2)
- In-app visual reminders only

**v2:**
- Browser push notifications for upcoming payments
- Notification API setup
- User opt-in flow

## User Flows

### Flow 1: First-Time User

1. User opens app (web URL or installed PWA)
2. Dashboard shows empty state: "No hay suscripciones. ¡Añade tu primera suscripción!"
3. User clicks "+ Añadir suscripción"
4. Modal opens with form
5. User fills in required fields (name, cost, frequency, date)
6. User clicks "Guardar"
7. Modal closes, dashboard updates with first subscription
8. User sees total spend, upcoming payment, and category breakdown (single item)

### Flow 2: Add Subscription

1. User on Dashboard or Subscriptions page
2. Clicks "+ Añadir suscripción" button
3. Modal/drawer opens
4. User enters:
   - Name: "Netflix"
   - Cost: 11.99
   - Frequency: Monthly
   - Next Payment: 2025-01-15
   - Category: Streaming
5. Clicks "Guardar"
6. Subscription created, ID generated, timestamps set
7. Modal closes
8. Dashboard/list refreshes with new subscription

### Flow 3: View Dashboard

1. User opens app
2. Dashboard displays:
   - Total monthly spend: €45.97
   - Total yearly spend: €551.64
   - Upcoming payments (next 30 days) list
   - Category breakdown pie chart
   - Key metrics: 5 active subscriptions, most expensive: Spotify (€9.99/mes)
3. User scans info in ~5 seconds
4. User identifies upcoming payment tomorrow
5. User clicks on subscription to view/edit details

### Flow 4: Edit Subscription

1. User on Subscriptions list
2. Clicks on "Spotify" card
3. Edit modal opens with pre-filled data
4. User changes cost from €9.99 to €10.99 (price increase)
5. User clicks "Guardar"
6. Subscription updated
7. Dashboard totals recalculate
8. User sees updated monthly spend

### Flow 5: Cancel Subscription

1. User on Subscriptions list
2. Clicks on "Gym App" card
3. Edit modal opens
4. User clicks "Cancelar suscripción" button
5. Confirmation dialog: "¿Cancelar suscripción? Se excluirá de los totales..."
6. User confirms
7. Status changed to `CANCELED`
8. Subscription excluded from dashboard totals
9. Subscription still visible in list with "Canceled" badge
10. User can filter to view only Active subscriptions

### Flow 6: View Upcoming Payments

1. User on Dashboard
2. Scrolls to "Próximos pagos" section
3. Sees list of subscriptions charging in next 30 days
4. Items sorted by date (soonest first)
5. User sees visual indicator: "Vence en 2 días" for Amazon Prime
6. User clicks on Amazon Prime to review details

## Non-Functional Requirements

### Performance

- Initial load: < 2 seconds on 3G
- Time to Interactive: < 3 seconds
- Dashboard calculations: < 100ms

### Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast WCAG AA minimum

### Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Security

- No authentication in MVP (local data only)
- No sensitive data transmission (no backend)
- Input sanitization and validation
- XSS prevention (React default escaping)

## Out of Scope (v1)

The following are explicitly **NOT** in MVP:

- Bank or card integrations
- Automatic subscription detection
- Receipt or email scanning
- Sharing subscriptions with other users
- Multi-user accounts or collaboration
- Advanced analytics or forecasting
- Native mobile apps (iOS/Android)
- Complex permissions or role systems
- Push notifications
- ~~Backend/database (localStorage only)~~ ✅ *Implemented with Supabase*
- ~~Authentication~~ ✅ *Implemented with Supabase Auth*
- Multi-currency support (EUR only)
- Custom billing frequencies (weekly, quarterly, custom)
- Payment history tracking
- Email reminders
- Export/import functionality
- ~~Dark mode (can be quick-win if time permits)~~ ✅ *Implemented*

## Success Metrics (Reiteration)

**MVP is successful if:**

1. I can see total monthly and yearly spend at a glance
2. I actively use the app for 1-3 months
3. I identify and cancel at least one unused subscription
4. The app becomes my single reference point for subscriptions
5. Adding/updating a subscription takes < 30 seconds
6. The app is installable as a PWA on desktop and mobile
7. The UI is fully functional in Spanish

## Development Phases

See [architecture.md](architecture.md) for technical architecture and implementation plan.

## Implementation Status

### Completed Phases

1. **Phase 1:** Planning ✅
2. **Phase 2:** Specification ✅
3. **Phase 3:** Architecture design ✅
4. **Phase 4:** MVP Implementation ✅
5. **Phase 5:** Backend Integration (Supabase) ✅

### Next Steps (v2)

1. Testing (Vitest + React Testing Library)
2. Push notifications for reminders
3. Password recovery flow
4. Multi-currency support
5. Additional billing frequencies
