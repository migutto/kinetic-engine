# DEVLOG - The Kinetic Engine

> Product and engineering notes on the road to a local-first training journal for strength, cardio, body tracking, and practical day-to-day use.

---

## 2026-04-04 - Documentation sync after the April refresh

This pass did not change runtime behavior. Its job was to bring the Markdown docs back in line with the current product after the latest wave of UX, summary, and PWA work.

### Highlights

- Updated `README.md` to match the current feature set and PWA architecture.
- Rewrote backlog and roadmap notes so completed work is no longer framed as future work.
- Refreshed `devshortcut.md` with a simpler, user-facing summary of recent changes.
- Aligned documentation around the active PWA path:
  - `manifest.webmanifest`
  - `sw-pwa.js`
  - `js/pwa.js`

### Why this mattered

The app changed quickly over a short period. Without a doc sync, the repo would describe an older product than the one the code actually delivers.

---

## 2026-04-04 - PWA hardening and legacy cleanup

This pass moved the app from "PWA in theory" to a more complete installable experience with clearer offline and update behavior.

### Highlights

- Added a dedicated `manifest.webmanifest`:
  - relative `start_url` and `scope`
  - corrected icon references
  - install shortcuts for training, cardio, and body entry
- Added a dedicated `sw-pwa.js` service worker:
  - app-shell precache
  - separate runtime cache
  - offline fallback page
  - update flow through `SKIP_WAITING`
  - cache cleanup and navigation preload
- Added a dedicated `js/pwa.js` layer:
  - install prompt banner
  - iOS install guidance fallback
  - update-ready banner
  - topbar install/update action
  - online/offline toasts
  - storage-persistence request
- Removed the old `sw.js` path from the active app flow and added automatic cleanup for legacy registrations and caches.

### Why this mattered

The product already behaved like a local-first tool, but the install/update/offline experience still had rough edges. This pass made the app feel more like a real installed product and less like a bookmarked page.

### Known follow-ups

- Real browser/device smoke testing is still needed on desktop Chrome, Android Chrome, and iOS Safari.
- Platform-specific install/update limitations should be reflected in docs and UX copy.

---

## 2026-04-04 - Weekly and monthly summaries v1

This pass added period-level summaries to the dashboard without adding any backend or scheduled-job dependency.

### Highlights

- Added two local dashboard cards:
  - weekly summary
  - monthly summary
- Both summaries use existing local data:
  - completed workouts
  - logged cardio
  - steps and calories
  - body measurements
- Each card compares the current period with the previous one.

### Why this mattered

The app already stored useful data, but it still demanded interpretation. These cards make the dashboard more readable and more useful in day-to-day review.

---

## 2026-04-04 - Quick wins for logging trust and dashboard clarity

This pass focused on practical quality-of-life improvements that shorten the gap between user intent and clean data entry.

### Highlights

- Reworked cardio entry around distance-first logging:
  - distance is required in the main form and quick-add modal
  - pace and speed are calculated only from entered distance
  - steps remain optional metadata
- Added date selection for standard training days in the workout detail panel:
  - workouts can be logged under a different date
  - the UI shows when the selected date falls outside the current week
- Refined dashboard top cards into more useful "right now" metrics:
  - weekly training completion
  - weekly cardio distance
  - today's steps vs goal
  - latest body measurement snapshot
- Renamed the old guide section to **Exercise Encyclopedia / Encyklopedia cwiczen**.
- Cleaned up the exercise detail screen:
  - removed the low-value "Technika Mistrzowska" block
  - widened the content layout
  - wrapped category chips instead of forcing horizontal scrolling
- Clarified destructive data-wipe messaging so it explicitly includes profile, notifications, and settings data.

### Why this mattered

These changes improved trust in small but important ways. Cardio metrics now depend on a real distance value, backfilled training no longer needs a workaround, and the dashboard answers "how am I doing now?" more clearly.

### Known follow-ups

- Training backfill is still limited by the current week-plan-centric workout model.
- Legacy cardio entries can still fall back to step-derived distance for historical totals.
- Exact in-browser spacing and polish still deserve a final visual pass on multiple viewport sizes.

---

## 2026-04-04 - Responsive hardening and state consistency

This pass focused less on surface features and more on restoring trust in the app's foundations: data integrity, smaller-screen usability, and reliable notifications.

### Highlights

- Fixed a local state consistency issue around notifications across:
  - `cardio.js`
  - `training.js`
  - `ui.js`
- Added a safer notification API that can mutate the in-memory data object before the final `saveData()` call.
- Introduced structural hooks in `index.html` so responsive CSS can control complex panels without leaning on fragile inline selectors.
- Added mobile and tablet coverage in `style.css` for:
  - Dashboard
  - Cardio
  - Training toolbar wrapping
  - Guide two-panel collapse
  - Body Composition two-panel collapse
  - forms, drawers, modals, tiles, and top navigation

### Why this mattered

A local-first tool loses credibility fast if fresh data can be overwritten or if key screens still behave like desktop-only layouts. This pass made the app feel safer and more believable on real devices.

---

## 2026-04-03 - Dashboard shortcuts, cardio polish, and backup safety

This iteration focused on practical quality-of-life improvements, GitHub Pages readiness, and shortening the path between intent and data entry.

### Highlights

- Cleaned up deployment-facing paths in the main entrypoint.
- Added dashboard-level quick actions for:
  - **Quick Cardio**
  - **Quick Body Measurement**
- Added auto-fill logic for quick modal dates when opening the modal.
- Expanded cardio logging with:
  - manual distance input
  - pace calculation
  - speed calculation
  - weekly step and calorie summaries
  - richer activity history cards
  - JSON export/import
- Added full backup export/import from settings.
- Added explicit confirmation before destructive full-data wipe.

### Known follow-ups

- The codebase exports some payloads as `3.1`, while the settings UI still displays `v3.0`.
- Quick modal date autofill currently fills only empty fields, so preserving an older date between modal openings is still possible.
- There is still a small amount of transitional code around modal patching that could be cleaned up.

---

## Earlier phases

### App shell and product framing

- Branded app shell: **The Kinetic Engine**
- PWA-facing head configuration
- Modular JS loading strategy
- Persistent sidebar and topbar navigation
- Main sections for Dashboard, Training, Cardio, Guide, and Body Composition

### Training workflow foundation

- Weekly training navigation
- Day tiles and workout detail panel
- Check-in flow
- Rest timer widget
- 1RM calculator
- Profile surface in the sidebar

### Dashboard as the operational home screen

- Stat cards
- Training volume visibility
- Step trend visualization
- Weekly progress preview
- "Today active" card
- Schedule summary
- Notification entrypoint

### Body tracking and analytics

- Measurement entry flow
- Body history views
- Smoothing options
- Chart stack for weight, fat, lean mass, FFMI, and weekly deltas
- JSON/CSV export for body data

### Cardio MVP

- Logging for cardio and walking sessions
- Time, steps, calories, heart rate, and distance
- Recent activity history
- Weekly totals

### Data ownership and local-first recovery

- Module-level exports/imports
- Full backup support
- Stronger destructive-action safeguards

---

## Product direction

The Kinetic Engine is evolving toward a polished local-first training cockpit:

- strength tracking
- cardio tracking
- body composition analytics
- quick dashboard capture
- personal progress visualization
- PWA-friendly deployment
- zero-backend portability

The direction stays the same: keep the app lightweight, fast, personal, and robust enough to feel like a real installable tool rather than a hobby page.
