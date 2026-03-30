---
issue: 6
implementation_branch: issue-6-show-last-deploy-time-footer
---

## Issue Understanding

**Issue:** #6 — `[Feature] Show last successful deploy time in the app footer`

### Problem summary

- Support/QA cannot quickly tell whether production reflects the latest release.
- The app currently has no footer deploy timestamp or equivalent runtime signal.
- The issue requests a read-only footer line showing last successful production deploy time, with a safe fallback when metadata is unavailable.

### Current vs expected behavior

- **Current:** No deploy freshness indicator is rendered in the UI; users must check CI or ask in chat.
- **Expected:** Footer shows `Last deployed: ...` in a human-readable format; if metadata is missing/invalid, show a non-breaking fallback such as `Deploy time unavailable`.

### Issue metadata reviewed

- **Labels on issue now:** `status:ready`
- **Comments:** none
- **Links/references in issue body:**
  - `.github/workflows/deploy.yml` (referenced, not present in current repository tree)
  - `.github/workflows/router.yml`
  - `docs/labels.md`
  - Placeholder references for design/prior discussion (not provided)

### Assumptions

1. A build-time/public deployment timestamp source is acceptable and preferred (e.g., `VITE_LAST_DEPLOYED_AT`).
2. If deploy workflow metadata is unavailable in this repo, implementation should still be resilient and display fallback text.
3. Footer placement can be implemented inside existing app layout (`App.jsx`) without introducing a new global layout system.
4. Time display will default to **UTC** unless product direction explicitly requires end-user locale.
5. Test tooling may need to be introduced/expanded because this repo currently has no test harness configured.

### Clarifying questions (for human validation)

1. Should the timestamp be shown in **UTC** or **viewer-local timezone**?
2. What is the canonical deploy metadata source for production in this project (CI env var, hosting env var, or API endpoint)?
3. Is there an expected exact copy format (e.g., `Last deployed: 2026-03-30 09:31 UTC`)?
4. Should the footer line appear in all environments (dev/staging/prod) with fallback, or only in production builds?
5. Is introducing Vitest/RTL acceptable if no existing test framework is present?

**Confidence:** Medium (UI scope is clear; deploy metadata source is currently unspecified).

## Scope and Impact

### In scope

- Add a footer UI element that displays deploy time when available.
- Implement safe parsing/formatting of deploy timestamp input.
- Add deterministic fallback text when metadata is missing/invalid.
- Add tests for available/unavailable rendering paths.
- Document chosen timezone behavior and metadata contract.

### Out of scope

- Changing deployment infrastructure/pipeline behavior beyond exposing existing metadata.
- Building release history, audit timeline, or admin controls.
- Adding authenticated/private deployment data to client-side bundle.

### Likely affected modules/files

- `src/App.jsx` (or extracted footer component integration point)
- `src/App.css` and/or `src/index.css` (footer styling using existing tokens)
- Potential new UI/helper files:
  - `src/components/AppFooter.jsx` (or similar)
  - `src/utils/deployTime.js` (parse/format + fallback logic)
- Build/runtime config touchpoints:
  - `README.md` (document env contract)
  - `package.json` (if adding test scripts/deps)
  - `vite.config.js` (only if test setup requires it)
- Optional CI/deploy workflow files if metadata injection needs explicit wiring:
  - `.github/workflows/deploy.yml` (referenced by issue, currently absent in repo)

### Risks

- **Compatibility:** Locale/date formatting differences can cause inconsistent snapshots unless stabilized.
- **Performance:** Should remain negligible if implemented as build-time value; avoid blocking network fetch on first paint.
- **Security:** Must not expose CI secrets/tokens; only public timestamp metadata should reach browser.
- **Operational:** If timestamp contract differs across environments, fallback may appear unexpectedly.
- **Migrations:** None expected (no schema/data migration).

**Confidence:** Medium-high for UI impact; medium for deployment metadata integration due missing deploy workflow in repo.

## Implementation Plan (no code)

### Step 1 — Confirm metadata contract and timezone policy
- **Goal:** Lock down source-of-truth and display format before coding.
- **Files/components:** `README.md` (contract note), deployment docs/workflow references.
- **Expected outcome:** Explicit decision: input key (e.g., `VITE_LAST_DEPLOYED_AT`) + output timezone/format + fallback text.

### Step 2 — Introduce deploy-time formatting utility
- **Goal:** Isolate parsing/formatting behavior from UI rendering.
- **Files/components:** `src/utils/deployTime.js` (new).
- **Expected outcome:** Utility returns formatted deploy string for valid input and a deterministic “unavailable” state for null/invalid values.

### Step 3 — Create/reuse footer presentation component
- **Goal:** Render deploy line in footer area without disturbing existing layout.
- **Files/components:** `src/components/AppFooter.jsx` (new) or `src/App.jsx` section.
- **Expected outcome:** Footer shows `Last deployed: <value>` or fallback text, with semantic markup and accessibility-safe text.

### Step 4 — Wire metadata source into app
- **Goal:** Read from build-time public env (preferred) and pass to footer.
- **Files/components:** `src/App.jsx`, optional `src/config/*`.
- **Expected outcome:** App obtains deploy timestamp from `import.meta.env` (or approved endpoint path) with zero blocking fetch on first paint.

### Step 5 — Add styling with existing tokens
- **Goal:** Keep footer visually consistent and unobtrusive.
- **Files/components:** `src/App.css` and/or `src/index.css`.
- **Expected outcome:** Footer text integrated near lower page area, responsive, no contrast/accessibility regressions.

### Step 6 — Add tests for available/unavailable states
- **Goal:** Satisfy acceptance criteria and prevent regressions.
- **Files/components:** `src/**/*.test.*`, `package.json` scripts/deps, optional Vitest config.
- **Expected outcome:** Automated tests cover:
  - valid timestamp render path
  - missing/invalid metadata fallback path
  - stable output under chosen timezone strategy

### Step 7 — Document runtime contract and troubleshooting
- **Goal:** Make behavior operationally clear to support/release teams.
- **Files/components:** `README.md` (or docs page).
- **Expected outcome:** Clear instructions for setting deploy-time metadata and expected fallback behavior per environment.

## Test Plan

### Unit

- Utility tests for deploy-time parser/formatter:
  - valid ISO timestamp -> expected formatted string
  - empty/undefined -> unavailable fallback
  - invalid timestamp -> unavailable fallback
  - timezone output behavior (UTC or local) is deterministic

### Integration/E2E

- Component rendering tests (App + footer):
  - with metadata present, footer contains `Last deployed: ...`
  - without metadata, footer contains fallback and app still renders fully
- Optional lightweight browser E2E smoke:
  - app loads with no runtime errors
  - footer remains visible at typical viewport sizes

### Regression checklist

- Existing App hero/content still renders unchanged.
- No console errors/warnings in dev/build preview.
- Build output does not include sensitive CI tokens.
- Lint/build pipelines remain green.

### Edge/failure cases

- Malformed timestamp string
- Timestamp in unexpected format/timezone offset
- Empty env var in local development
- Missing metadata in staging/preview environments

**Confidence:** Medium-high (test objectives are clear; exact framework setup may add minor variability).

## Validation and Rollout

### Local/staging verification

- Local verify with:
  - metadata provided (expected formatted timestamp)
  - metadata omitted (fallback message)
- Staging/prod verify displayed value corresponds to known recent deployment event.

### Logs/metrics/alerts

- Frontend has limited telemetry in current repo; rely on:
  - browser console sanity checks
  - CI build/lint status
  - optional release checklist item validating footer timestamp post-deploy

### Rollout and rollback strategy

- Rollout: merge behind normal release flow; deploy with metadata key set.
- If metadata wiring fails: fallback text prevents user-visible breakage.
- Rollback: revert commit(s) or redeploy prior build; no data migration needed.

## Delivery Plan

### Small commit sequence

1. `feat(footer): add deploy time utility and footer component` (logic + render path)
2. `style(footer): integrate footer styling into app layout`
3. `test(footer): cover deploy time available/unavailable states`
4. `docs(deploy): document deploy timestamp contract and fallback behavior`

### PR checklist

- [ ] Links issue `#6`
- [ ] Documents timezone choice and metadata source
- [ ] Includes tests for available/unavailable rendering
- [ ] Confirms no secret exposure in client bundle
- [ ] Includes screenshots or short demo for footer appearance (optional but recommended)

### Definition of Done

- Footer displays deploy time or fallback without breaking UI.
- Accepted metadata contract is implemented and documented.
- Tests pass in CI and cover both required rendering states.
- Human reviewer validates plan assumptions/questions before AgentDev starts implementation.

---

### Unknowns and confidence callout

- **Primary unknown:** authoritative deploy metadata source is not present in current repo tree.
- **Secondary unknown:** required timezone/display format preference.
- **Overall planning confidence:** **Medium** (implementation is straightforward once metadata contract is confirmed).
