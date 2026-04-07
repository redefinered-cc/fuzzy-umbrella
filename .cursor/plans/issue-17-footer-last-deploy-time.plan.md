---
issue: 17
implementation_branch: issue-17-footer-last-deploy-time
---

## Issue Understanding

### Problem summary

Issue #17 requests a read-only footer indicator that shows the last successful production deploy time so support/QA can quickly verify how fresh the running build is without checking CI manually.

### Current vs expected behavior

- **Current behavior**
  - The app is a single React/Vite page (`src/App.jsx`) and has no deploy-time indicator in UI.
  - There is no existing deploy metadata wiring in the frontend (`import.meta.env` / `VITE_*` usage is absent).
  - There is no deploy workflow in-repo (`.github/workflows/deploy.yml` is not present); only CI exists (`.github/workflows/ci.yml`).
  - There are no existing app tests configured (no test script or test files).
- **Expected behavior**
  - Footer displays a human-readable `Last deployed: …` value (timezone/format explicitly chosen and documented).
  - If deploy metadata is unavailable, UI shows a clear non-breaking fallback (`Deploy time unavailable`).
  - No secret exposure in client bundle.
  - Basic automated coverage exists for both available/unavailable display states.

### Assumptions

1. “Last successful deploy” can be represented by metadata injected at build/deploy time (preferred `VITE_*`-style public value), unless product requires an authoritative runtime source.
2. This repository’s current CI/build path is the nearest existing place to add metadata propagation, but production deployment may happen outside this repo.
3. Footer can be implemented in `src/App.jsx` (or extracted footer component) without broader layout refactor.

**Clarifying questions (for human validation)**

1. Should timestamp be displayed in **UTC** or **user-local time**?
2. Must this reflect **actual production deploy completion** (authoritative), or is **build timestamp used in production artifact** acceptable?
3. If authoritative deploy time is required, which system is source-of-truth (hosting provider/API/workflow)?
4. Is adding a lightweight test setup (Vitest + RTL) acceptable in this issue scope, given no existing tests?

**Confidence:** Medium (UI scope is clear; deploy metadata source is partially undefined).

## Scope and Impact

### In scope

- Add footer UI text for deploy timestamp.
- Add metadata parsing/formatting/fallback behavior in frontend.
- Wire a safe public deploy-time value path (likely `VITE_*` environment variable).
- Add tests covering available/unavailable cases.
- Document formatting and fallback behavior in code/docs as needed.

### Out of scope

- Full deploy history UI.
- Admin tooling or non-footer surfacing.
- Secret/token-based client calls to internal CI systems.
- Broad deployment pipeline redesign.

### Likely affected modules/files

- **Frontend UI**
  - `src/App.jsx` (add footer display and conditional rendering)
  - `src/App.css` (footer styling tokens/layout alignment)
- **Build/config metadata**
  - `vite.config.js` (only if compile-time define helper is used)
  - `.github/workflows/ci.yml` (candidate for metadata env propagation if build-time path used)
  - `.env.example` or docs (if introducing documented `VITE_DEPLOYED_AT` variable)
- **Testing**
  - `package.json` (test script and dependencies if introducing test stack)
  - `src/App.test.jsx` (or equivalent) for available/unavailable render assertions

### Risks

- **Compatibility:** Low-to-medium. Introducing test stack may alter project tooling expectations.
- **Performance:** Low if static value; medium if runtime fetch is added (must avoid blocking first paint).
- **Security:** Medium if metadata source is external API; low if using public non-secret env var.
- **Migrations/ops:** Medium risk that true deploy timestamp is unavailable until deployment system publishes it.

## Implementation Plan (no code)

1. **Decide metadata source and format contract**
   - **Goal:** Choose canonical value and display format before coding.
   - **Files/components:** `docs` references, issue notes, potential workflow env contract.
   - **Expected outcome:** Agreed contract (e.g., `VITE_DEPLOYED_AT` ISO-8601 string; display in UTC or local format).

2. **Add footer rendering path in app UI**
   - **Goal:** Introduce visible footer line `Last deployed: ...` with graceful fallback.
   - **Files/components:** `src/App.jsx`, `src/App.css` (or extracted `src/components/Footer.jsx` if preferred).
   - **Expected outcome:** Footer consistently renders on all app states; unavailable metadata renders fallback text.

3. **Implement metadata resolution logic**
   - **Goal:** Read deploy timestamp from approved source and normalize validity.
   - **Files/components:** `src/App.jsx` (or utility module), optional `vite.config.js`/env docs.
   - **Expected outcome:** Invalid/missing timestamp does not crash UI; output is deterministic and documented.

4. **Wire CI/deploy metadata propagation (non-secret)**
   - **Goal:** Ensure production artifact receives timestamp value at build/deploy time.
   - **Files/components:** `.github/workflows/ci.yml` and/or deploy workflow (if managed elsewhere); documentation.
   - **Expected outcome:** Production builds include deploy timestamp metadata without exposing sensitive tokens.

5. **Add baseline automated coverage**
   - **Goal:** Verify available/unavailable footer text rendering.
   - **Files/components:** `package.json`, test config files (if needed), `src/App.test.jsx`.
   - **Expected outcome:** Test command passes and guards against regressions for both states.

6. **Update documentation for operators and developers**
   - **Goal:** Document variable contract, fallback behavior, and formatting rule.
   - **Files/components:** `README.md` and/or `docs/*`.
   - **Expected outcome:** Clear instructions for setting/validating deploy timestamp in environments.

## Test Plan

### Unit

- Timestamp formatter:
  - valid ISO input -> expected human-readable output.
  - invalid string/empty -> `Deploy time unavailable`.
- Resolver logic:
  - env present/missing behaviors.
  - guard against runtime exceptions.

### Integration/E2E

- App render test verifies footer line appears on initial render.
- Scenario with provided deploy value.
- Scenario without deploy value.
- (Optional) If runtime endpoint approach chosen: mock success/failure and ensure non-blocking render.

### Regression checklist

- Existing page layout/sections still render (`#center`, `#next-steps`, spacer/ticks).
- No console errors in dev/build preview.
- Build output succeeds without requiring private secrets.
- Accessibility sanity: footer text readable and not hidden by responsive rules.

### Edge/failure cases

- Malformed timestamp string.
- Future timestamp (clock skew) handling.
- Empty env variable in local dev.
- Network timeout/error (only if runtime fetch route chosen).

## Validation and Rollout

### Local/staging verification

1. Run app locally with and without deploy metadata value.
2. Confirm fallback text in default developer environment.
3. Validate formatting in target timezone policy (UTC/local).
4. Verify production-like build artifact includes expected value.

### Logs/metrics/alerts

- Track frontend errors for metadata parsing/render path.
- If runtime endpoint used, monitor request error rate/latency.
- Optional lightweight telemetry event when fallback path is shown frequently (if analytics already exists).

### Rollout and rollback strategy

- Roll out behind simple environment-controlled metadata availability (safe default fallback).
- If display causes confusion or bad data, rollback by unsetting metadata variable or reverting UI commit.
- Prefer incremental merge with clear release note for support/QA.

## Delivery Plan

### Small commit sequence

1. **UI commit:** add footer and fallback rendering/styling.
2. **Metadata commit:** add deploy-time variable resolution + workflow/docs wiring.
3. **Tests commit:** add/enable tests for available/unavailable cases.
4. **Docs commit:** finalize usage/validation documentation.

### PR checklist

- [ ] References `#17` and matches accepted timestamp policy.
- [ ] No secrets exposed in client code or workflow changes.
- [ ] Screenshots or short proof of UI states (available/unavailable).
- [ ] Tests added and passing.
- [ ] Notes operational dependency if deploy system integration is external.

### Definition of Done

- Footer shows human-readable deploy time when available.
- Fallback message appears when unavailable, with no UI breakage.
- Security/performance constraints satisfied.
- Automated tests cover both primary states.
- Human reviewer validates metadata source choice and plan assumptions.
