# Kinetic Engine — Product Ideas, Assessment & Roadmap

## 1. Executive summary

This document consolidates the current product ideas for **The Kinetic Engine** into a more structured, product-oriented form.
The goal is not only to list features, but to separate:

- ideas that are already implemented,
- ideas that are valid but require refinement,
- ideas that should become short-term priorities,
- ideas that belong to a longer strategic roadmap.

The current direction is strong. The project has already moved beyond a simple workout logger and is evolving toward a **personal training operating system**: training log, cardio tracking, body composition tracking, exercise knowledge base, quick actions, backup/import flows and PWA deployment readiness.

The next stage should focus less on adding random features and more on **product maturity**:

- better information architecture,
- stronger responsiveness,
- more flexible training-plan management,
- data durability and synchronization,
- cleaner naming and language consistency,
- a clearer distinction between MVP features and long-term platform ambitions.

---

## 2. Assessment of submitted ideas

### 2.1. Ideas that are strong and should remain in scope

#### A. Full training-plan flexibility
**Original idea:** remove the rigid dependency on the current 3-day plan and allow users to create their own plans, save them, choose them from a list and mark one as default.

**Assessment:** very strong suggestion.
This is one of the most important product-level improvements because it moves the app from a personal hardcoded tool to a reusable training platform.

**Why it matters:**
- eliminates the current ceiling of the app,
- makes the product usable for more than one training style,
- allows dashboard, schedule and weekly flows to adapt to the user instead of forcing the user into a predefined structure.

**Priority:** High

---

#### B. Dashboard and Cardio responsiveness
**Original idea:** Dashboard and Cardio lose responsiveness when zoom increases and content goes off-screen.

**Assessment:** very strong and high-value observation.
This is not just a visual complaint — it directly affects usability and perceived quality.

**Why it matters:**
- poor responsiveness makes the product feel unfinished,
- these are two of the most frequently visited sections,
- layout instability hurts trust more than minor missing features.

**Priority:** High

---

#### C. Weekly and monthly summaries
**Original idea:** generate weekly summaries on Sundays and monthly summaries on the last day of the month.

**Assessment:** very good feature direction.
This fits the nature of the product and builds retention.

**Why it matters:**
- turns raw logs into insight,
- gives users a reason to return,
- supports behavior change, not just record keeping.

**Priority:** Medium-High

---

#### D. Online saving / sync
**Original idea:** save entered data online.

**Assessment:** strategically excellent, but large in scope.
This is not a simple enhancement — it is a platform transition.

**Why it matters:**
- removes dependence on one browser/device,
- enables real backup continuity,
- opens the door to accounts, cloud sync and multi-device usage.

**Priority:** Strategic / Long-term

---

#### E. PWA maturity
**Original idea:** PWA.

**Assessment:** strong and aligned with the product.
The app already has PWA direction, so this is not a new idea but a maturity track.

**Why it matters:**
- improves perceived app quality,
- makes the product feel native-like,
- supports offline-first positioning.

**Priority:** Medium

---

### 2.2. Ideas that are correct, but should be reframed more professionally

#### A. “Loguj spacer” sounds awkward
**Assessment:** correct.
This is a UX writing issue, but still important.

**Recommended reframing:**
Replace with clearer action labels, for example:
- **Dodaj aktywność**
- **Zapisz cardio**
- **Dodaj sesję cardio**

**Priority:** Medium

---

#### B. English language support
**Assessment:** good idea, but not immediate priority unless the project is intended for public distribution beyond the current audience.

**Recommended reframing:**
Treat this as **internationalization readiness**, not merely “add English”.
The correct scope is:
- translation layer,
- externalized strings,
- language switching support.

**Priority:** Low-Medium for now, High if distribution broadens

---

#### C. Rename “Poradnik” to “Encyklopedia ćwiczeń”
**Assessment:** good suggestion.
The current name is acceptable, but the proposed one is more precise and product-like.

**Why it matters:**
- stronger information scent,
- better communicates value,
- matches actual content better.

**Priority:** Medium

---

### 2.3. Ideas that are partially valid, but need design clarification

#### A. Cardio distance should not be “optional”
**Original idea:** distance is the most important metric and should drive pace/speed calculations.

**Assessment:** directionally right, but should not be applied blindly.

**Recommended interpretation:**
Distance should become the **primary analytical input** for pace/speed whenever provided.
However, steps should still remain supported as a fallback for casual walking entries.

**Best product decision:**
- keep both fields,
- treat distance as the preferred input,
- calculate pace and speed from distance whenever distance exists,
- use steps only as fallback estimation.

**Priority:** Medium

---

#### B. Training entry should allow date selection and distance-like manual backfill
**Original idea:** while entering a workout, there should be a date picker so the user can log yesterday’s workout.

**Assessment:** strong suggestion.
The mention of “distance” is cardio-specific, but the underlying issue is valid: training logs need backfill support.

**Recommended interpretation:**
Add support for:
- selecting training date,
- logging past sessions,
- optionally duplicating/moving a session entry to another date.

**Priority:** High

---

#### C. Exercise encyclopedia category rail is inconvenient
**Original idea:** categories require horizontal scrolling, which is uncomfortable, and exercise detail cards waste space.

**Assessment:** good UX observation.
This is exactly the kind of issue that should be fixed during a usability pass.

**Recommended direction:**
- replace horizontal-only category rail with wrapped chips or a hybrid grid,
- reduce empty space in exercise detail cards,
- remove decorative elements that do not add value.

**Priority:** Medium-High

---

### 2.4. Suggestions that are already implemented or mostly addressed

The following ideas are no longer future roadmap items in their original form because they are already present in the current product version:

#### A. Quick actions on dashboard
The idea to add two dashboard buttons for quick cardio entry and quick body-data entry is already implemented.

#### B. Import/export for body data in settings
This is already implemented.

#### C. “Delete everything” should also remove body data and require typing “TAK”
This is already implemented in the current UX/security flow.

These items should therefore be moved out of the roadmap and documented as **completed product improvements**.

---

### 2.5. Ideas that are promising but require dependency decisions

#### A. WGER database integration
**Assessment:** potentially powerful, but this is not a small feature.
This requires deciding whether the app should rely on:
- an external exercise source,
- imported structured exercise metadata,
- or a custom internal exercise library.

**Risk:**
External dependency increases maintenance burden, legal/API uncertainty and content mismatch risk.

**Recommendation:**
Treat this as discovery work first, not implementation work.

**Priority:** Strategic / Research

---

## 3. Recommended roadmap

## Phase 1 — Product hardening (Now)
Focus: stability, clarity, responsiveness and UX polish.

### Goals
- eliminate visible rough edges,
- improve trust and usability,
- prepare the app for broader testing.

### Scope
1. Fix Dashboard responsiveness.
2. Fix Cardio responsiveness.
3. Improve top KPI cards on Dashboard.
4. Rename awkward microcopy such as “Loguj spacer”.
5. Rename “Poradnik” to “Encyklopedia ćwiczeń”.
6. Remove unnecessary decorative text such as “Technika Mistrzowska” where it adds no product value.
7. Rework exercise-category navigation to avoid forced horizontal scrolling.
8. Tighten exercise detail layout to reduce empty space.

### Outcome
The app feels more deliberate, more premium and more production-ready.

---

## Phase 2 — Training-system flexibility (Next)
Focus: remove hardcoded plan assumptions.

### Goals
- make the product adaptable to different users and training styles,
- transform the training module into a configurable system.

### Scope
1. Add support for custom training plans.
2. Allow plans to be saved into a plan library.
3. Allow one plan to be marked as default.
4. Make Dashboard, schedule and training views consume the selected default plan.
5. Add manual date selection for training logging.
6. Allow backfilling past training sessions.

### Outcome
The app stops being tied to one personal routine and becomes a reusable training platform.

---

## Phase 3 — Insight and retention layer (Later)
Focus: make the app more reflective and motivating.

### Goals
- convert raw data into useful summaries,
- reinforce habit loops and progress visibility.

### Scope
1. Weekly training/cardio/body summary.
2. Monthly progress summary.
3. Goal completion snapshots.
4. Basic streak logic or consistency scoring.
5. Improved notification logic around milestones and summaries.

### Outcome
The app becomes more than a logger; it becomes a feedback system.

---

## Phase 4 — Platform maturity (Strategic)
Focus: durability, reach and ecosystem growth.

### Goals
- reduce device dependence,
- improve installability and portability,
- prepare for wider usage.

### Scope
1. Proper cloud sync / account model.
2. Stronger PWA completeness and offline confidence.
3. Internationalization architecture.
4. Research external exercise-data integration (e.g. WGER or equivalent source).

### Outcome
The project evolves from a local web app into a scalable personal fitness product foundation.

---

## 4. Recommended product priorities in plain language

If the goal is to improve the product **without losing focus**, the best order is:

1. **Fix responsiveness and UI polish first.**
2. **Then unlock custom plans and date-flexible training logs.**
3. **Then build summaries and retention features.**
4. **Only after that move into sync, integrations and multilingual expansion.**

This order gives the highest ratio of:
- user-visible improvement,
- implementation realism,
- product maturity gain.

---

## 5. Final verdict on the original suggestion set

The suggestion set is actually very solid.
The main issue is not the quality of the ideas, but the way they are currently phrased — they are closer to raw implementation notes than to a professional product backlog.

### What is strongest in the original list
- custom training plans,
- responsiveness fixes,
- cloud persistence,
- summaries,
- PWA direction.

### What should be reframed
- English language → internationalization layer,
- WGER → research/integration discovery,
- distance input → primary metric preference, not mandatory-only dogma.

### What should be removed from future roadmap because it is already done
- quick-add dashboard buttons,
- body import/export in settings,
- destructive clear-all confirmation with “TAK”.

Overall assessment:
**the idea pool is good, practical and product-oriented.**
With better framing and prioritization, it becomes a credible roadmap rather than a loose wish list.
