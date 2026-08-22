# GlobeTrotter

A working build of the Editorial-Brutalist GlobeTrotter design spec: plan
multi-city trips with a real day-by-day itinerary, a live budget breakdown,
and a single link to share a trip read-only.

This is a real, runnable React app — not a mockup. It implements the full
design system (single-typeface type scale, sharp corners, hard-offset
"stamp" shadows, ticket-stub motif, boarding-progress loaders, ink-stamp
confirmations) and every flow works end-to-end in the browser.

## Run it

```bash
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000`. In a second terminal,
configure PostgreSQL and start the backend:

```bash
cd backend
npm install
copy .env.example .env
# edit .env with your PostgreSQL credentials
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```

Then open the Vite URL and sign in with `demo@globetrotter.app` / `demo1234`,
or register a new account.

To build for production / deploy anywhere static:

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## What's implemented

Screens, in the priority order the original spec called out:

1. **Login** / **Register** — split-screen, inline validation, real error
   states, boarding-progress button loading.
2. **Dashboard** — welcome strip, next-trip highlight, empty state for new
   users.
3. **Create Trip** — name, dates, multi-city picker.
4. **Itinerary Builder** — per-day city assignment, add/remove activities
   with live day-total, suggested-activity chips.
5. **Itinerary View** — read-only day-by-day layout, share-link generation
   (copies to clipboard with an ink-stamp confirmation), total cost.
6. **My Trips** — list with delete + a real confirm-before-delete modal.
7. **City Search** — debounced (300ms) search over a city dataset.
8. **Budget** — per-city bar breakdown, per-day table.
9. **Shared View** (`/shared/:shareId`) — public, unauthenticated,
   read-only trip page with "Copy this trip" (routes through Register if
   the viewer isn't logged in, then completes the copy).
10. **Profile / Settings** — tabbed (Profile / Preferences / Privacy),
    autosave-on-blur fields with an inline "Saving… / Saved" status.

**Cut from this build**, per the original doc's own stated priority order
("cut first if short on time"): the Calendar view and the Admin/Analytics
dashboard. Both would slot in as new pages + routes using the same
components (Button, Field, NavBar, the `.ticket` / hard-shadow / boarding-bar
patterns) — nothing about the design system needs to change to add them.

## What's real vs. mocked

The app now has an Express backend backed by PostgreSQL through Prisma. The
React pages keep their existing interfaces while `src/api/authApi.js` and
`src/api/tripsApi.js` call the backend through the Vite `/api` proxy.

Third-party city, image, and currency integrations remain isolated in
`src/api/*.js` and can be enabled independently:

| File | Stands in for | Real integration |
|---|---|---|
| `backend/` | PostgreSQL + Prisma REST backend | Auth, trips, stops, activities, budgets, and sharing |
| `src/api/citiesApi.js` | GeoDB Cities / Teleport API | debounced `namePrefix` search |
| `src/api/imagesApi.js` | Unsplash / Pexels | city photo by name |
| `src/api/currencyApi.js` | exchangerate.host | live FX rates |

Only the JWT token remains in browser localStorage; user and travel data are
stored in PostgreSQL. Never commit `backend/.env` or database credentials.

City photos render as the solid Ink Black placeholder block by design (the
spec explicitly asks for this instead of a skeleton shimmer while images
load) — wiring `imagesApi.js` to Unsplash will start filling those in.

## Typography note

The original design brief listed four candidate display/accent typefaces
(AKIRA, Urbanist, Monigue, Obelisk) for three different type roles. That's
been consolidated to **Urbanist alone** across the whole app — hierarchy
comes from weight (Black for headlines, SemiBold for UI, Regular for body),
size, case, and letter-spacing rather than switching families, so the type
system reads as one voice instead of three competing ones.

## Project structure

```
src/
   api/         frontend API adapters and third-party integrations
  components/  Button, Field, NavBar, Loader, Stamp, EmptyState, RequireAuth
  context/     AuthContext (session state)
  data/        seed city dataset
  hooks/       useDebouncedValue
  pages/       one file (+ css) per screen
  styles/      tokens.css — the whole design system as CSS variables
backend/
   prisma/      PostgreSQL schema and seed data
   src/         Express server and shared Prisma client
```
