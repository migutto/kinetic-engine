# BACKLOG

> Product backlog for **The Kinetic Engine**  
> Status: draft backlog based on current product state, uploaded notes, and recent UX / feature suggestions.

---

## How to use this backlog

- **P0** — critical issues or blockers affecting usability, data safety, or core product quality
- **P1** — high-value improvements with strong product impact
- **P2** — meaningful enhancements that improve polish, flexibility, or retention
- **P3** — exploratory ideas, integrations, and lower-priority product opportunities

Recommended workflow:
1. Close all **P0** items first
2. Move to **P1** product upgrades
3. Use **P2** for polish / retention / differentiation
4. Treat **P3** as research, experiments, or post-MVP roadmap

---

# P0 — Critical usability and product quality

## P0.1 Responsive layout fixes for Dashboard and Cardio
**Problem**  
Dashboard and Cardio do not scale cleanly on some zoom levels and narrower viewport widths. Parts of the UI can overflow beyond the visible screen area.

**Why it matters**  
This directly degrades usability and makes the product feel unfinished compared with the better responsiveness already present in Sylwetka, Trening, and Poradnik.

**Scope**
- Audit overflow behavior for Dashboard
- Audit overflow behavior for Cardio
- Add responsive breakpoints for major grid sections
- Prevent content from escaping viewport boundaries
- Validate layout at common zoom levels and laptop resolutions

**Acceptance criteria**
- No horizontal overflow on supported viewport sizes
- Cards reflow cleanly on narrower screens
- Main content remains readable at standard browser zoom ranges
- Dashboard and Cardio match the responsiveness standard of the stronger modules

---

## P0.2 Clean up cardio input logic and metric priority
**Problem**  
Distance is currently treated as optional, while pace and speed may fall back to step-based estimation. This weakens data quality when the user wants more training-grade cardio tracking.

**Why it matters**  
Distance is perceived as the most important metric for meaningful pace and speed calculations.

**Scope**
- Revisit whether distance should be primary input rather than secondary
- Decide final model:
  - distance-first,
  - steps-first,
  - or dual-mode with explicit source labeling
- Adjust calculation copy and UX to reflect the chosen model
- Make the resulting logic transparent to the user

**Acceptance criteria**
- Users understand which metric drives pace and speed
- No misleading or ambiguous calculations
- Input form clearly communicates primary and fallback logic

---

## P0.3 Product terminology cleanup
**Problem**  
Some labels feel inconsistent or unnatural, for example “Loguj Spacer”.

**Why it matters**  
Microcopy strongly affects perceived product quality.

**Scope**
- Review cardio-related labels
- Standardize naming across tabs, buttons, stats, and modals
- Align tone across the app: premium, clean, performance-oriented, but natural in Polish

**Acceptance criteria**
- No obviously awkward labels remain in primary user flows
- Terminology is consistent between Dashboard, Cardio, Settings, and notifications

---

# P1 — High-impact product improvements

## P1.1 Full custom training plan system
**Problem**  
The product is still anchored to the current fixed 3-day structure. Users should be able to create and manage their own training systems.

**Why it matters**  
This is one of the most important feature upgrades for turning the app from a personal tracker into a reusable training product.

**Scope**
- Create a plan model independent from the current hardcoded A/B/C structure
- Allow users to:
  - create a new plan
  - edit a plan
  - duplicate a plan
  - delete a plan
  - set a default plan
- Store created plans in persistent data
- Make selected default plan drive:
  - Trening
  - Dashboard schedule
  - check-in flows
  - future summaries and analytics

**Acceptance criteria**
- User can create at least one fully custom plan
- User can choose which plan is active/default
- Active plan propagates correctly through all training-related views

---

## P1.2 Structured summaries: weekly and monthly reports
**Problem**  
The app tracks useful data but does not yet convert it into recurring insights.

**Why it matters**  
Summaries increase retention, reinforce progress, and make the app feel more intelligent.

**Scope**
- Generate weekly summary at end of week
- Generate monthly summary at end of month
- Include:
  - completed workouts
  - cardio frequency
  - steps total
  - total distance
  - body-weight delta
  - trend highlights
- Decide whether summaries are:
  - in-app cards,
  - notifications,
  - exportable reports,
  - or a combination

**Acceptance criteria**
- Weekly summary is generated consistently
- Monthly summary is generated consistently
- Summary content is readable and useful, not just raw numbers

---

## P1.3 Online save / sync architecture
**Problem**  
The current product is local-first. Data durability and multi-device continuity remain limited.

**Why it matters**  
Online persistence is one of the clearest upgrades from hobby project to real product.

**Scope**
- Define sync architecture
- Choose storage / backend direction
- Support account-bound persistence
- Design conflict strategy for merging data from different devices
- Define offline-first vs online-first model

**Acceptance criteria**
- User data survives device changes
- Product can restore data after reinstall / browser reset
- Sync strategy is documented before implementation begins

---

## P1.4 PWA hardening and installability pass
**Problem**  
The product is already moving toward PWA behavior, but it should be formalized as a first-class capability.

**Why it matters**  
PWA support improves installability, perceived polish, and long-term product identity.

**Scope**
- Audit manifest completeness
- Audit service worker behavior
- Validate icons and installability
- Test offline shell behavior
- Define update strategy for cached assets

**Acceptance criteria**
- App installs cleanly where supported
- Core shell works reliably offline
- PWA behavior is documented and testable

---

# P2 — Strong improvements and product polish

## P2.1 Rename “Poradnik” to “Encyklopedia ćwiczeń”
**Problem**  
The current tab label may understate the real value of the exercise knowledge base.

**Why it matters**  
“Encyklopedia ćwiczeń” better communicates breadth and structure.

**Scope**
- Rename tab
- Update related headings and placeholders
- Audit supporting copy for consistency

**Acceptance criteria**
- Naming is consistent across navigation and detail views

---

## P2.2 Improve category navigation in exercise encyclopedia
**Problem**  
The category strip requires horizontal scrolling, which is not convenient.

**Why it matters**  
This creates friction in a core discovery flow.

**Scope**
- Redesign category navigation
- Consider:
  - wrapping layout
  - dropdown
  - segmented controls
  - collapsible filter panel
- Preserve clean visual hierarchy

**Acceptance criteria**
- All categories are easily discoverable without awkward horizontal scrolling
- Category selection remains fast and visually clear

---

## P2.3 Reduce dead space in exercise detail view
**Problem**  
Exercise detail cards contain too much empty space at standard zoom.

**Why it matters**  
This lowers information density and makes the encyclopedia feel less refined.

**Scope**
- Audit vertical spacing and section proportions
- Remove unnecessary visual filler
- Improve content hierarchy within the detail view

**Acceptance criteria**
- Exercise detail cards feel denser, cleaner, and more intentional
- Above-the-fold content becomes more useful

---

## P2.4 Remove unnecessary “Technika Mistrzowska / bolt” block from exercise cards
**Problem**  
This section is perceived as unnecessary clutter.

**Why it matters**  
Removing low-value decorative content improves clarity.

**Scope**
- Audit purpose of the block
- Remove it or replace it with higher-value instructional content

**Acceptance criteria**
- No purely ornamental section occupies premium content space unless it adds clear value

---

## P2.5 Improve dashboard top stat cards
**Problem**  
Top dashboard cards currently feel visually off.

**Why it matters**  
The first visible UI zone strongly shapes product perception.

**Scope**
- Revisit spacing, hierarchy, icon balance, and card density
- Make the cards feel more intentional and premium
- Align visual language with the rest of the app

**Acceptance criteria**
- Top stat cards look coherent and balanced
- Dashboard first impression improves noticeably

---

## P2.6 Internationalization / English language support
**Problem**  
The product is currently Polish-only.

**Why it matters**  
English support would expand audience reach and improve portfolio value.

**Scope**
- Extract UI strings
- Design localization structure
- Prepare Polish and English language packs
- Test overflow and spacing after translation

**Acceptance criteria**
- Core app supports both Polish and English
- Language switching does not break layout or UX

---

## P2.7 Add date and distance flexibility to training entry flows
**Problem**  
Training-related logging is less flexible than some other modules when it comes to historical entry and richer metrics.

**Why it matters**  
Users should be able to backfill data naturally and consistently.

**Scope**
- Audit whether training entry needs explicit date support for past sessions
- Evaluate whether distance belongs in training flows, cardio flows, or both
- Align data-entry ergonomics across modules

**Acceptance criteria**
- Historical logging is supported where product logic requires it
- Cross-module data entry feels consistent

---

# P3 — Research, differentiation, and longer-horizon ideas

## P3.1 WGER / exercise database integration research
**Problem**  
External exercise data could expand the knowledge base and reduce manual maintenance.

**Why it matters**  
Could accelerate content scale, but should be evaluated carefully.

**Scope**
- Research WGER capabilities and licensing
- Evaluate data model compatibility
- Assess UX implications of imported content
- Decide build-vs-integrate approach

**Acceptance criteria**
- Clear go / no-go recommendation documented
- Technical constraints and product risks identified

---

## P3.2 Smart recommendations and adaptive insights
**Problem**  
The app tracks many data points but does not yet translate them into recommendations.

**Why it matters**  
Adaptive insights could become a major differentiator.

**Scope**
- Suggest recovery-oriented nudges
- Suggest volume adjustments
- Flag inactivity patterns
- Highlight streaks and best weeks

**Acceptance criteria**
- Recommendations are grounded in actual tracked data
- Suggestions feel useful, not noisy

---

## P3.3 Habit loops and retention design
**Problem**  
The current product supports tracking but does not fully leverage retention mechanics.

**Why it matters**  
Long-term consistency is core to fitness products.

**Scope**
- Add progress streaks
- Add milestone celebrations
- Add configurable reminders
- Design re-engagement touchpoints

**Acceptance criteria**
- Retention mechanics support, rather than distract from, the core product

---

## P3.4 Exportable progress reports
**Problem**  
Users may want to share progress snapshots outside the app.

**Why it matters**  
This supports motivation, coaching use cases, and portfolio polish.

**Scope**
- Define report layouts
- Support export of weekly / monthly summaries
- Consider visual report cards or printable snapshots

**Acceptance criteria**
- Reports are readable, attractive, and useful outside the app

---

# Cross-cutting technical debt

## TD.1 Remove dead or transitional code paths
**Scope**
- Remove obsolete patches, comments, and temporary compatibility code
- Clean up modal/opening logic where patching was used as an interim solution
- Standardize naming and function ownership across modules

---

## TD.2 Version consistency
**Scope**
- Align version naming across UI, exports, and internal metadata
- Prevent mismatch between visible app version and exported payload version

---

## TD.3 Formalize product vocabulary
**Scope**
- Define naming rules for tabs, actions, logs, summaries, and metrics
- Ensure consistent voice across UI and documentation

---

# Suggested execution order

## Phase 1 — Stabilization
- P0.1 Responsive layout fixes for Dashboard and Cardio
- P0.2 Cardio metric priority cleanup
- P0.3 Product terminology cleanup
- TD.1 Dead code cleanup
- TD.2 Version consistency

## Phase 2 — Product foundation upgrade
- P1.1 Full custom training plan system
- P1.2 Weekly and monthly summaries
- P1.4 PWA hardening

## Phase 3 — Product maturity
- P1.3 Online save / sync architecture
- P2.2 Exercise category navigation redesign
- P2.3 Exercise detail density improvements
- P2.5 Dashboard top stat card redesign
- P2.6 English language support

## Phase 4 — Scale and differentiation
- P3.1 WGER research
- P3.2 Adaptive insights
- P3.3 Retention loops
- P3.4 Exportable reports

---

# Notes

This backlog intentionally separates:
- **core product quality**
- **high-value feature growth**
- **polish**
- **research / exploratory opportunities**

That separation should help keep development focused and prevent mixing urgent UX fixes with longer-horizon product ideas.
