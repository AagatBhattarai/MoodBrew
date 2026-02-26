# MoodBrew — Project Documentation

> **Coffee discovery app for Pokhara** — Mood + weather–driven recommendations and Nepali coffee culture.

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [AI Integration & Knowledge](#2-ai-integration--knowledge)
3. [Data for the Recommendation System](#3-data-for-the-recommendation-system)
4. [How Weather & Mood Decide Recommendations](#4-how-weather--mood-decide-recommendations)
5. [Frontend User & Backend Admin](#5-frontend-user--backend-admin)
6. [Team Roles](#6-team-roles)
7. [Testing Methodologies](#7-testing-methodologies)

---

## 1. Problem Statement

**MoodBrew** solves:

- **Choice overload** — Users see personalized drink suggestions instead of scanning a long menu.
- **Context-aware picks** — Recommendations use **current mood** and **weather** (hot/rainy/cold).
- **Nepali coffee promotion** — Highlights local beans, cafes, and history (e.g. Proudly Nepali, flavor wheel).

*"What should I drink right now, given how I feel and the weather?"* — MoodBrew answers that with clear, contextual recommendations.

---

## 2. AI Integration & Knowledge

We use **rule-based recommendation logic** (no external LLM/API). The "AI" is implemented in code and data.

| Aspect | Location | Description |
|--------|----------|-------------|
| **Recommendation logic** | `app/src/views/HomeView.tsx` | `generateRecommendations(mood)` filters and sorts products, then attaches reasons. |
| **Knowledge base** | `app/src/data/index.ts` | Mood configs, flavor profiles, product `bestFor` tags, reason text, flavor–mood explanations. |

**Knowledge given to the "AI":**

- **Mood configs** — e.g. Energized, Cozy, Focused (id, label, description, color).
- **Product metadata** — Each drink has `bestFor` (moods), `temperature` (hot/iced/both), `flavorProfileIds`, `rating`, `weeklyOrders`.
- **Mood → reason text** — e.g. "Energized" → "High caffeine content with bold flavors…" via `aiRecommendations(mood)`.
- **Flavor–mood explanations** — Why a flavor fits a mood via `getFlavorExplanation(flavorId, mood)`.
- **Barista / educational content** — Nepali coffee facts (altitude, regions) for "AI Tip of the Day" and similar UI.

---

## 3. Data for the Recommendation System

| Data source | Fed from | Used for |
|-------------|----------|----------|
| **User mood** | User selection on home → `currentMood` in store | Filter products by `bestFor`. |
| **Weather** | Store (e.g. `mockWeather` in `App.tsx` or future API) | Re-sort: hot → iced first, rain → hot first. |
| **Product catalog** | `coffeeProducts` in `data/index.ts` | Filtering, sorting, and displaying recommendations. |

**Flow:** Filter by mood → optionally re-sort by weather → apply popularity boost → take top N → attach reason from `aiRecommendations(mood)` and pairing text.

---

## 4. How Weather & Mood Decide Recommendations

| Factor | Rule | Effect |
|--------|------|--------|
| **Mood** | Only products whose `bestFor` includes selected mood | Defines the candidate set. |
| **Temperature > 26°C** | Prefer iced | Iced drinks sorted first. |
| **Temperature < 18°C** | Prefer warm | Suggestion text and logic favor warm drinks. |
| **Condition includes "Rain"** | Prefer hot | Hot drinks sorted first. |
| **Popularity** | `weeklyOrders` > 200 get a boost | Higher-rated/popular items rank higher. |

Output: top recommendations with a short reason (from `aiRecommendations(mood)`) and a pairing tip.

---

## 5. Frontend User & Backend Admin

### Frontend user (customer)

- **Auth** — Login / signup (Supabase or dev admin bypass).
- **Home** — Greeting, weather card, mood selector, **AI recommendations** (match %, reason, pairing).
- **Discovery** — Flavor wheel, weather suggestion banner, Brew of the Day, Trending, Proudly Nepali.
- **Products & cafés** — Browse products, product detail, cafes, cafe detail.
- **Account** — Profile, edit profile, payment methods, addresses, notifications, privacy, settings.
- **Orders** — Cart, place order, view orders.
- **Gamification** — Daily challenges, streak, leaderboard.

### Backend admin

- **Access** — Only users with `role === 'admin'`.
- **Dashboard** — Overview (revenue, users, orders, cafes) from **real data** (order history, product/cafe counts, Supabase users).
- **Users** — List from Supabase `profiles`, show roles.
- **Products / Cafes** — Manage lists (from app data; can be wired to DB).

---

## 6. Team Roles

### Aagat — AI integration & overall project integration

- **AI:** Recommendation logic (mood + weather + product metadata), knowledge base (mood configs, flavor profiles, `bestFor`, `aiRecommendations`, `getFlavorExplanation`, Barista tip content).
- **Integration:** Connects frontend (views, store) with data layer and Supabase; ensures admin and app share auth, store, and navigation; recommendations flow from store into home and product/cafe flows.

### Diganta — Database integration (backend admin)

- **Database:** Supabase (auth, `profiles`, `payment_methods`, `addresses`, products/cafes/orders schema); types in `app/src/types/supabase.ts`.
- **Backend:** Auth (sign-in, sign-up, session), profile and related data fetch after login; admin user list from Supabase; future CRUD for products/cafes/orders.

### Bigyan — Frontend admin

- **UI:** All user-facing views (Home, Products, Product detail, Cafes, Cafe detail, Orders, Rankings, Profile, Settings, Login, Signup, etc.) and admin dashboard (sidebar, tabs, stats, user/product/cafe management).
- **State & UX:** Zustand store (user, mood, weather, cart, recommendations, challenges, etc.); navigation and flows so mood and weather drive recommendations and product/cafe usage.

---

## 7. Testing Methodologies

We use a mix of **static checks**, **build verification**, and **manual testing**. The project does not currently include an automated test runner (e.g. Jest, Vitest, Cypress) in the app.

### 7.1 Currently used

| Method | Tool / approach | Purpose |
|--------|-----------------|---------|
| **Linting** | ESLint (`npm run lint`) | Code style, React hooks rules, catch common bugs. |
| **Type checking** | TypeScript (`tsc -b` in build) | Type safety across store, data, and components. |
| **Build verification** | `npm run build` (Vite + TS) | Ensures app compiles and bundles without errors. |
| **Manual UI testing** | Run `npm run dev`, click through flows | Login, mood selection, recommendations, products, cafes, cart, profile, admin dashboard. |
| **Manual cross-view checks** | Navigate all views and roles | Ensure no broken links, missing data, or layout issues. |

### 7.2 Recommended / planned

| Method | Scope | What to cover |
|--------|--------|----------------|
| **Unit tests** | Pure logic (e.g. `data/index.ts`) | `aiRecommendations(mood)`, `getFlavorExplanation(flavorId, mood)`, `calculateDistance`, `filterProductsByFlavors`. |
| **Component tests** | React components | Mood selector, recommendation cards, flavor wheel, key UI components with mocked store. |
| **Integration tests** | Store + data + one view | e.g. "Select mood → recommendations update" with in-memory product list. |
| **E2E tests** | Full user flows | Login → select mood → see recommendations → open product → add to cart (e.g. Playwright or Cypress). |
| **API / DB tests** | Supabase | Auth flows, profile read/update, and any product/cafe/order endpoints if added. |

### 7.3 Test pyramid (conceptual)

```
        /\
       /  \   E2E (few, critical flows)
      /----\
     /      \  Integration (store + views + data)
    /--------\
   /          \  Unit (data helpers, pure logic)
  /------------\
```

### 7.4 Summary

- **In use:** Lint, TypeScript, Vite build, and manual testing for functionality and UI.
- **For documentation/presentation:** We describe the above as our testing methodology and the recommended next steps (unit → integration → E2E) for a React + Vite + Supabase app.

---

## Quick reference for presentations

| Question | Answer |
|----------|--------|
| How is AI integrated and knowledge given? | Rule-based logic in `HomeView.tsx` + knowledge in `data/index.ts` (moods, flavors, reasons, flavor–mood maps). No external LLM. |
| How is data fed for recommendations? | User mood (store), weather (store), product catalog (`data/index.ts`). Logic filters by mood, re-sorts by weather and popularity. |
| What does the frontend user do? | Login, set mood, see AI recommendations, use flavor wheel, browse products/cafes, profile, orders, challenges, leaderboard. |
| What does the backend admin do? | Use admin dashboard: stats from real data, manage users (Supabase), manage products/cafes. |
| How do weather and mood decide recommendations? | Mood filters by `bestFor`; weather re-sorts (hot→iced, rain→hot); popularity boost; top N with reasons. |
| What testing do you use? | ESLint, TypeScript, Vite build, manual UI and flow testing; unit/integration/E2E recommended for future. |

---

*MoodBrew — From the Himalayas to your cup.*
