# BACKLOG

> Active backlog for **The Kinetic Engine** after the April 4, 2026 documentation refresh.

---

## Recently Completed

### Product and UX
- [Done] Dashboard and Cardio responsive pass
- [Done] Cardio distance-first logging
- [Done] Training date backfill
- [Done] Encyclopedia rename and layout cleanup
- [Done] Dashboard quick actions
- [Done] Body import/export in Settings
- [Done] Clear-all confirmation with `TAK`
- [Done] Weekly and monthly summary cards v1
- [Done] PWA hardening v1

### Still Worth Checking Manually
- Real browser/device smoke test for the new PWA flow
- Final in-browser visual polish pass for Dashboard and Cardio after responsive changes

---

## P1 - Next Major Product Work

### P1.1 Custom training plan system
**Goal**
Replace the hardcoded weekly plan assumptions with a real plan model.

**Scope**
- create, edit, duplicate, and delete plans
- choose a default plan
- make Dashboard, Training, and schedule flows use the selected plan

**Acceptance criteria**
- User can save more than one plan
- User can set one plan as default
- The default plan drives the main training experience

---

### P1.2 Cloud save and sync architecture
**Goal**
Move from single-browser persistence to real multi-device continuity.

**Scope**
- account model
- cloud persistence
- conflict strategy
- offline-first sync behavior

**Acceptance criteria**
- Data survives device changes
- Reinstall/browser reset recovery is possible
- Sync direction is documented before full implementation

---

### P1.3 Scheduled summary flow
**Goal**
Go beyond static summary cards and support end-of-period summary events.

**Scope**
- Sunday weekly close
- end-of-month close
- optional notifications or summary inbox items
- reuse current local summary logic where possible

**Acceptance criteria**
- Weekly and monthly closes happen consistently
- Summary output feels like a real product feature, not just another stats card

---

### P1.4 PWA smoke test and legacy cleanup
**Goal**
Finish the "ideal PWA" track with validation, not only implementation.

**Scope**
- test install/update/offline on desktop Chrome
- test install/update/offline on Android Chrome
- test install guidance flow on iOS Safari
- remove legacy `sw.js` once the new path is validated
- align versioning/update notes

**Acceptance criteria**
- Install/update flow is predictable on supported platforms
- Legacy PWA files no longer create confusion
- Offline behavior is documented and trustworthy

---

## P2 - Strong Improvements

### P2.1 English / i18n foundation
- extract strings
- prepare Polish and English support
- verify layout after translation

### P2.2 Dashboard visual polish pass
- tune spacing and hierarchy after recent responsive and summary additions
- validate at common desktop zoom levels

### P2.3 Exportable progress reports
- weekly/monthly report cards
- clean shareable or printable output

### P2.4 Version consistency and product vocabulary
- align UI version with export schema version
- formalize naming across UI and docs

---

## P3 - Research and Longer-Term Ideas

### P3.1 WGER integration research
- evaluate API/data fit
- assess maintenance and licensing risk
- decide whether to integrate or stay internal

### P3.2 Adaptive insights
- recovery nudges
- volume suggestions
- inactivity flags
- streak/best-week highlights

### P3.3 Retention loops
- reminders
- milestones
- streak design
- celebration moments that do not feel noisy

---

## Technical Debt

### TD.1 Remove legacy or transitional code paths
- old service worker file
- temporary compatibility layers
- leftover naming drift across modules

### TD.2 Keep docs synced with reality
- README
- changelog
- dev shortcut
- roadmap/backlog notes

---

## Recommended Execution Order

1. Custom training plan system
2. PWA smoke test and legacy cleanup
3. Scheduled summary flow
4. Cloud save and sync architecture
5. English / i18n foundation
6. WGER and adaptive insights research
