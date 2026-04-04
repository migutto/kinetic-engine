# DEVLOG — The Kinetic Engine

> Road to a local-first training journal focused on strength, cardio, body composition, and polished day-to-day UX.

---

## 2026-04-04 — Service worker repair, state consistency, and responsive layout hardening

This pass focused less on adding surface-level features and more on restoring trust in the app’s foundations: installability, data integrity, and usability on smaller screens.

### Highlights

- Repaired the service worker implementation in `sw.js`:
  - removed syntax-breaking commas
  - restored valid install / activate / fetch / push handling
  - switched the active runtime logic to a cleaner, scope-aware URL model
  - improved offline fallback behavior for navigations
- Fixed a local state consistency issue around notifications:
  - `cardio.js`
  - `training.js`
  - `ui.js`
- Added a safer notification API that can mutate the currently edited in-memory data object before the final `saveData()` call.
- Introduced responsive layout hooks in `index.html` so CSS can control complex panels without depending purely on fragile inline selectors.
- Added mobile and tablet media-query coverage in `style.css` for:
  - Dashboard
  - Cardio
  - Training toolbar wrapping
  - Guide two-panel collapse
  - Body Composition two-panel collapse
  - forms, drawers, modals, tiles, and top navigation

### Why this mattered

The app already looked ambitious, but a broken service worker and a notification overwrite bug were both trust-damaging issues. On top of that, parts of the interface still behaved like a desktop-only product even though the project is clearly moving toward a real PWA experience.

This pass was about making the app feel safer and more believable: if a user installs it, logs activity, and opens it on a smaller screen, the core behavior should still feel solid.

### Notable UX wins

- Dashboard and Cardio no longer depend so heavily on wide desktop layouts.
- Multi-column sections now collapse more gracefully on tablets and phones.
- Top navigation, sidebar, drawers, and modals adapt more cleanly to smaller screens.
- Notification badges now reflect the latest state without risking fresh entries being overwritten by an older localStorage snapshot.

### Technical notes

- `sw.js` now passes syntax validation with `node --check`.
- `addNotification()` in `ui.js` now supports operating on a passed-in data reference instead of always reloading state from storage.
- Cardio save flows and training completion now append notifications to the same object that later gets persisted.
- `index.html` received structural IDs/classes specifically to support responsive CSS without large markup rewrites.
- `style.css` now contains dedicated responsive rules instead of relying almost entirely on the desktop baseline.

### Known follow-ups

- The current `sw.js` still contains a disabled legacy block that should be fully removed in a later cleanup pass.
- Responsive behavior was verified structurally in code, but not yet fully reviewed in-browser across multiple device sizes.
- Some panels still carry a lot of inline layout styles, so future responsiveness work will be easier if more layout responsibility is moved from HTML into CSS.

---

## 2026-04-03 — Deployment cleanup, dashboard quick actions, cardio/logging polish

This iteration focused on practical quality-of-life improvements, GitHub Pages readiness, and shortening the path between intent and data entry.

### Highlights

- Cleaned up deployment-facing paths in the main entrypoint:
  - `manifest.json`
  - `icon-192.png`
  - `style.css`
  - `sw.js` registration from `app.js`
- Added dashboard-level quick actions for:
  - **Quick Cardio**
  - **Quick Body Measurement**
- Added auto-fill logic for quick modal dates when opening the modal.
- Expanded cardio logging with:
  - optional manual distance input
  - pace calculation
  - speed calculation
  - weekly step and calorie summaries
  - richer activity history cards
  - JSON export/import
- Added full backup export/import from settings.
- Added explicit confirmation before destructive full-data wipe.

### Why this mattered

The app already had a solid structure, but too many common actions still required context switching. This pass made the dashboard more actionable and brought the product closer to a real daily-use flow instead of a static tracker.

### Notable UX wins

- Logging cardio no longer depends only on steps.
- Measurements can now be added directly from the dashboard.
- Data safety improved through backup tools and a confirmation gate for destructive actions.
- GitHub Pages deployment became much more realistic thanks to corrected relative asset paths and service worker registration.

### Technical notes

- `index.html` now references relative frontend assets directly.
- `app.js` patches `openModal()` to ensure quick-form dates are prefilled.
- `cardio.js` introduces distance-first and steps-first input flexibility.
- `ui.js` adds backup tooling and guarded wipe behavior.

### Known follow-ups

- The codebase exports some payloads as `3.1`, while the settings UI still displays `v3.0`.
- Quick modal date autofill currently fills only empty fields, so preserving an older date between modal openings is still possible.
- There is still a small amount of dead or transitional code around modal patching that could be cleaned up.

---

## Earlier phase — PWA shell and application framing

Once the project moved beyond a single-page mockup, the application shell was formalized around a stronger product identity.

### What was established

- branded app shell: **The Kinetic Engine**
- PWA-facing head configuration
- modular JS loading strategy
- persistent sidebar and topbar navigation
- sections for:
  - Dashboard
  - Training
  - Cardio
  - Guide
  - Body Composition

### Why this mattered

This was the point where the project stopped feeling like a demo and started behaving like a proper application shell that could scale with new modules.

---

## Earlier phase — Training workflow foundation

The next major milestone was building the training core.

### What was introduced

- weekly training navigation
- day tiles and workout detail panel
- check-in flow
- rest timer widget
- 1RM calculator
- profile surface in the sidebar

### Why this mattered

The app needed to support the real training loop first: open the week, select the day, execute the session, and track completion. This phase established the operational backbone of the project.

---

## Earlier phase — Dashboard as the operational home screen

After the training flow was stable, attention shifted to building a dashboard that actually earned its place.

### What was introduced

- stat cards
- training volume visibility
- step trend visualization
- weekly progress preview
- “today active” card
- schedule summary
- notification entrypoint

### Why this mattered

The dashboard became the app’s command center rather than a decorative landing page. It started surfacing useful context immediately instead of forcing the user into deeper screens first.

---

## Earlier phase — Body composition analytics

With workout tracking established, the product expanded into body recomposition and trend analysis.

### What was introduced

- measurement entry flow
- body history views
- smoothing options
- chart stack for weight, fat, lean mass, FFMI, and weekly deltas
- JSON/CSV export for body data

### Why this mattered

This phase widened the app’s role from “training logger” to a broader personal physique tracker. It also laid the foundation for longer-term analytical use instead of simple session archiving.

---

## Earlier phase — Cardio MVP

The cardio module began as a simpler tracking surface and later grew into a more mature subsystem.

### Initial goals

- log walking/cardio sessions
- store time, steps, calories, heart rate, and distance
- show recent activity
- expose weekly totals

### Why this mattered

Strength work and daily movement should live in one product, not in disconnected notes or spreadsheets. This phase unified those inputs in one workflow.

---

## Earlier phase — Data ownership and local-first mindset

As the feature set expanded, the need for safer local data handling became more obvious.

### What was introduced progressively

- module-level exports/imports
- full backup support
- more explicit safety affordances around destructive actions

### Why this mattered

The project is intentionally lightweight and local-first, so recoverability and user control are not “nice to have” extras — they are core product responsibilities.

---

## Product direction

The Kinetic Engine is evolving toward a polished **local-first training cockpit**:

- strength tracking
- cardio tracking
- body composition analytics
- quick dashboard capture
- personal progress visualization
- PWA-friendly deployment
- zero-backend portability

The direction is now clear: keep the app lightweight, fast, personal, and robust enough to feel like a real installable tool rather than a hobby page.
---

## 2026-04-04 - Quick wins pass: cardio trust, training dates, dashboard polish, encyclopedia cleanup

This pass turned a set of product notes into practical quality-of-life improvements. The goal was to tighten the daily logging flow, remove misleading UI copy, and make the most-used screens feel more trustworthy and more usable on both desktop and mobile.

### Highlights

- Reworked cardio entry around distance-first logging:
  - distance is now required in both the main form and the quick-add modal
  - pace and speed are calculated only from entered distance
  - steps remain optional metadata instead of acting as a hidden distance substitute
- Added date selection for standard training days directly in the workout detail panel:
  - workouts can now be logged under a different date without needing the custom workout builder
  - the UI clearly shows when a selected session date is outside the current week schedule
- Refined the dashboard top cards into more useful "right now" metrics:
  - weekly training completion
  - weekly cardio distance
  - today's steps vs goal
  - latest body measurement snapshot
- Renamed the exercise section from **Guide / Poradnik** to **Exercise Encyclopedia / Encyklopedia cwiczen** across the core UI.
- Cleaned up the exercise detail screen:
  - removed the unnecessary "Technika Mistrzowska" hero badge
  - widened the content layout to reduce dead space
  - wrapped category chips instead of forcing horizontal scrolling
- Clarified destructive data-wipe messaging in settings so it explicitly includes profile, notifications, and settings data.

### Why this mattered

These changes improve trust in the app in small but meaningful ways. Cardio metrics now depend on a real distance value, backfilled training sessions no longer require workarounds, and the dashboard surfaces more actionable information instead of broad lifetime counters. The encyclopedia also feels less decorative and more like a useful reference screen.

### Notable UX wins

- The label "Loguj spacer" is gone in favor of more neutral cardio wording.
- Distance fields no longer suggest that the most important cardio metric is optional.
- Standard workouts can be backfilled to another day from the main training flow.
- Dashboard stat cards now answer "how am I doing now?" more clearly.
- Encyclopedia category filters no longer depend on sideways scrolling.

### Known follow-ups

- Training backfill currently protects against conflicting workout types on the same date, but the broader workout model is still week-plan-centric and will benefit from the later plan-system refactor.
- Legacy cardio records can still fall back to step-derived distance for historical totals so older data remains visible.
- The dashboard and encyclopedia improvements were implemented structurally in code, but a later in-browser polish pass would still be valuable for exact spacing on multiple viewport sizes.

---

## 2026-04-04 - Weekly and monthly summaries v1

This pass added local weekly and monthly summaries directly to the dashboard so the app can surface period-level progress without any backend or scheduled job system.

### Highlights

- Added two new dashboard summary cards:
  - weekly summary
  - monthly summary
- Both summaries are generated locally from existing app data:
  - completed workouts
  - logged cardio
  - steps and calories
  - body measurements
- Each card compares the current period with the previous one so trends are visible without opening charts or tables.

### Why this mattered

The app already had plenty of raw data, but it still required interpretation. These cards add a lighter "what happened in this period?" layer, which makes the dashboard feel more like a real training cockpit and less like a set of disconnected modules.

---

## 2026-04-04 - PWA hardening pass

This pass turns the app from a "PWA on paper" into a more complete installable experience with a cleaner offline and update flow.

### Highlights

- Added a new dedicated `manifest.webmanifest`:
  - relative `start_url` and `scope` for safer deployment under changing base paths
  - corrected icon references
  - improved install shortcuts for training, cardio, and body measurements
- Added a new dedicated `sw-pwa.js` service worker:
  - clean app-shell precache
  - runtime cache separated from shell cache
  - offline fallback page
  - update flow through `SKIP_WAITING`
  - navigation preload and cache cleanup
- Added a new `js/pwa.js` layer to the app:
  - install prompt banner
  - iOS install guidance fallback
  - update-ready banner when a new service worker is waiting
  - topbar action button for install/update state
  - online/offline toasts
  - storage persistence request to reduce the chance of browser data eviction

### Why this mattered

The app already behaved like a local-first tool, but the PWA layer still had rough edges: fragile manifest setup, legacy service worker baggage, and no clear user-facing install/update experience. This pass closes those gaps so the app behaves more like a real installed product and less like a bookmarked page.

### Known follow-ups

- The old `sw.js` file is still present in the repo as legacy code, but the active registration now points at the new `sw-pwa.js`.
- A proper in-browser install test and device smoke test are still worth doing on Android, desktop Chrome, and iOS Safari.
