# DEVLOG — The Kinetic Engine

> Road to a local-first training journal focused on strength, cardio, body composition, and polished day-to-day UX.

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
