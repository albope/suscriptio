# Project Goals

## Problem Statement

### Specific Pain Point or Need

I currently lack a clear, centralized view of my personal subscriptions. Subscriptions are spread across different services and platforms, which makes it difficult to:

- Know exactly which services I'm subscribed to
- Track upcoming payment dates
- Understand my real monthly and yearly recurring expenses
- Detect forgotten or underused subscriptions

This leads to unnecessary spending, poor financial awareness, and lack of control over recurring payments.

### Target Users

**Primary target user:** Individual consumers (like myself) who manage multiple digital subscriptions, such as:

- Streaming platforms
- Software tools
- Cloud services
- Apps with monthly or yearly billing

**Secondary (future consideration):**

- Power users with many subscriptions
- Freelancers or professionals tracking personal recurring costs

**Current focus:** Strictly on individual personal use, not businesses.

### Why This Problem Matters

Subscriptions are designed to be frictionless to start but easy to forget. Without a clear overview:

- People overspend without realizing it
- Monthly and yearly costs feel abstract and underestimated
- There's no proactive reminder or visibility to make informed decisions

Having a simple, visual dashboard that shows what I pay, when I pay it, and how much it adds up to over time directly improves financial awareness, control, and decision-making.

## Proposed Solution

### Vision

A personal PWA subscription manager that acts as a single source of truth for all my recurring subscriptions.

Users will interact with:

- A dashboard that instantly shows monthly/yearly recurring spend and upcoming charges
- A subscriptions list where each subscription has key details (price, billing cycle, next payment date, category, status)
- A simple add/edit flow (manual entry first) to keep it fast and frictionless
- Optional alerts/reminders for upcoming renewals or unusual changes

The product should feel like a lightweight personal finance companion focused specifically on recurring payments—simple, visual, and actionable.

### Core Features (Essentials)

1. **Subscription registry (CRUD)**
   - Add, edit, archive/cancel, and view subscriptions
   - Fields: name, cost, billing frequency (monthly/yearly/custom), next payment date, category, notes, status

2. **Next payments & calendar view**
   - "Upcoming payments" list for the next 7/30/90 days
   - Basic calendar/list timeline of when charges will occur

3. **Spending analytics dashboard**
   - Total spend: monthly and yearly
   - Breakdown by category (e.g., streaming, productivity, cloud, health)
   - Simple trend view over time (even if initially based on projections)

4. **Reminders / alerts**
   - Notifications for upcoming payment (e.g., 3 days before)
   - Optional alerts for annual renewals or high-cost subscriptions

5. **Insights / hygiene features (lightweight)** *(OK to postpone to v2)*
   - "Unused/forgotten" subscriptions flag (initially manual)
   - "Audit mode" suggestions: expensive subscriptions, duplicates, rarely used categories

### Differentiation vs Existing Trackers

Common problems with existing subscription trackers:

- Too heavy / finance-app-like, not focused on simplicity
- Poor dashboard clarity or too many steps to maintain data
- Limited personalization (categories, notes, custom billing)
- Lack of proactive visibility (what's coming next + yearly impact)

**This solution will be better by:**

- Speed of entry (frictionless manual management first)
- A clean dashboard optimized for immediate clarity (monthly/yearly + upcoming)
- PWA-first: cross-device, installable, lightweight, and always accessible
- A workflow designed to keep data updated without feeling like a chore

### Technical Approach

**Platform:** PWA web app

- Works on desktop and mobile
- Installable on phone as an app-like experience
- Potential offline support for viewing data and adding subscriptions
- Alerts via web notifications (if feasible) or in-app reminders

**Focus:** Personal use now, with architecture allowing future scaling if needed for publishing.

## Success Criteria

### How Will I Know This Project is Successful?

This project will be considered successful if:

- I can see my total monthly and yearly subscription spend at a glance from a dashboard
- I actively use the app to manage my subscriptions for at least 1–3 months
- I identify and cancel at least one unused or unnecessary subscription
- The app becomes my single reference point for knowing:
  - What I'm subscribed to
  - When the next payments are
  - How much recurring cost I've committed to

Success is primarily practical and personal, not adoption-based.

### Key Outcomes / Metrics That Matter

- Number of active subscriptions tracked accurately
- Clear visibility of:
  - Monthly recurring spend
  - Yearly recurring spend
- Reduction of unnecessary spending (qualitative but real)
- Frictionless usage: adding or updating a subscription takes seconds, not minutes
- App feels useful without requiring constant maintenance

## Constraints

### Timeline

**MVP target:** Today

The MVP must be:

- Small
- Focused
- Fully usable by the end of the day

**Anything that delays reaching a usable MVP today is out of scope.**

### Budget

The project should be built with **minimal to zero cost**:

- Free tiers preferred for:
  - Hosting
  - Database
  - Notifications (if any)
- No paid services required for MVP

### Technical Constraints

- **App type:** PWA
- **Must be usable on both desktop and mobile**
- **Language support:**
  - Spanish must be supported from v1
  - English can be added later, but Spanish is required initially
- **Development environment:**
  - Built using Claude Code
  - Focus on simplicity and speed over perfect architecture
- **Stack decisions should favor:**
  - Fast iteration
  - Low setup friction
  - Technologies I'm comfortable with or want to reinforce

### Scope — Explicitly OUT of Scope for v1

The following are **not included** in the MVP:

- Bank or card integrations
- Automatic subscription detection
- Receipt or email scanning
- Sharing subscriptions with other users
- Multi-user accounts or collaboration
- Advanced analytics or forecasting
- Native mobile apps (iOS / Android)
- Complex permissions or role systems

**The MVP is manual, personal, and focused by design.**
