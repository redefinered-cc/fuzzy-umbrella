---
issue: 11
implementation_branch: issue-11-show-last-deploy-time
---

## Issue Understanding

- **Problem summary**
  - The app should show a read-only footer value for the **last successful production deploy time** so QA/support can quickly verify build freshness without checking CI or chat.
  - Issue asks for graceful fallback when deploy metadata is missing and for coverage of available/unavailable rendering paths.
- **Current vs expected behavior**
  - **Current:** No deploy timestamp is displayed anywhere in the UI. There is no known existing deploy metadata wiring in the React app.
  - **Expected:** Footer displays `Last deployed: <human-readable timestamp>` using a safe metadata source (build-time env or existing public endpoint) and shows a non-breaking fallback (`Deploy time unavailable`) when missing/unreadable.
- **Assumptions**
  - This repository is currently a minimal React + Vite app with no dedicated footer component yet (`src/App.jsx` contains the whole page layout).
  - No deploy workflow file currently present in repo (`.github/workflows/deploy.yml` not found), so metadata source contract is currently undefined.
  - Build-time metadata exposure via `VITE_*` env is preferred over a blocking client fetch.
  - Time display will default to **UTC** for consistency unless product/design specifies user-localized formatting.
  - Adding a lightweight test setup (Vitest + React Testing Library) is acceptable to satisfy acceptance criteria because test tooling is not currently configured.
- **Clarifying questions (non-blocking for planning)**
  - What is the canonical metadata source for “last successful production deploy time” (CI env var name, artifact, endpoint)?
  - Should timestamp be shown in UTC explicitly (e.g., `2026-03-31 12:45 UTC`) or localized to browser locale?
  - Is footer text expected on all routes/pages once app grows, or only current landing view?

## Scope and Impact

- **In scope**
  - Add footer UI line for deploy time in the React app.
  - Read deploy timestamp from approved non-secret metadata path.
  - Add fallback rendering when metadata is absent/invalid.
  - Add tests for both available and unavailable states.
  - Document expected env variable and formatting decision.
- **Out of scope**
  - Building full release history, release controls, or admin views.
  - Changing deployment pipeline behavior itself (only consuming metadata).
  - Any privileged/private API integration requiring auth tokens in browser.
- **Likely affected modules/files**
  - `src/App.jsx` (introduce footer rendering and metadata read path)
  - `src/App.css` (footer styling, spacing, responsive behavior)
  - `src/index.css` (possibly shared typography/color token reuse only if needed)
  - `package.json` / `package-lock.json` (if test tooling is added)
  - New test files (likely `src/App.test.jsx` and optional test setup file)
  - `README.md` or a docs file for env var + formatting behavior
- **Risks**
  - **Compatibility:** Browser date formatting differences if locale APIs are used without deterministic options.
  - **Performance:** Avoid blocking network fetch on first paint; use build-time value or deferred fetch.
  - **Security:** Ensure only non-sensitive deploy timestamp is exposed; no CI tokens or internal endpoints in client bundle.
  - **Migrations:** No DB/schema migration expected.
  - **Operational risk:** Missing CI wiring for deploy timestamp can cause fallback-only behavior in production until pipeline is configured.

## Implementation Plan (no code)

1. **Define metadata contract and formatting policy**
   - **Goal:** Lock source and format so implementation is deterministic.
   - **Files/components:** Docs note (`README.md` or `docs/`), implementation constants in app module.
   - **Expected outcome:** Clear contract (e.g., `VITE_LAST_DEPLOYED_AT` as ISO-8601 UTC string) and agreed display format/fallback text.

2. **Add footer display in app layout**
   - **Goal:** Render a stable footer line with deploy timestamp or fallback.
   - **Files/components:** `src/App.jsx`, `src/App.css`.
   - **Expected outcome:** Footer consistently appears and reads either `Last deployed: <formatted>` or `Deploy time unavailable`.

3. **Implement safe metadata parsing/formatting path**
   - **Goal:** Convert raw metadata to user-facing text without runtime errors.
   - **Files/components:** `src/App.jsx` (or a small utility module if extracted).
   - **Expected outcome:** Invalid/missing metadata resolves to fallback; valid ISO timestamp renders human-readable UTC/localized form per decided policy.

4. **Add automated coverage for available/unavailable states**
   - **Goal:** Protect behavior and acceptance criteria via tests.
   - **Files/components:** test config (`package.json` scripts and optional `vitest` config), `src/App.test.jsx` (or equivalent).
   - **Expected outcome:** Tests verify footer text for (a) valid deploy metadata, (b) missing/invalid metadata fallback.

5. **Document usage and operational expectations**
   - **Goal:** Make deploy metadata setup explicit for CI/CD and local dev.
   - **Files/components:** `README.md` (or docs page).
   - **Expected outcome:** Team can configure env var in production deploy pipeline; local dev behavior documented as fallback unless env is provided.

## Test Plan

- **Unit**
  - Timestamp formatter behavior:
    - Valid ISO input → expected human-readable output.
    - Invalid/empty input → fallback indicator.
  - If utility extraction is used, test pure formatting function independently.
- **Integration/E2E**
  - App render with env metadata present shows `Last deployed: ...` in footer.
  - App render without metadata shows `Deploy time unavailable`.
  - Ensure no layout regressions (footer visible in desktop/mobile breakpoints).
- **Regression checklist**
  - Existing App content still renders (hero, docs/social sections).
  - No console errors from env parsing in dev/build.
  - `npm run build` succeeds with and without metadata env set.
  - Lint/test commands pass in CI expectations.
- **Edge/failure cases**
  - Malformed timestamp string.
  - Timestamp in non-ISO format from CI misconfiguration.
  - Empty string env var.
  - Extremely old/future timestamp (still renders without crash).

## Validation and Rollout

- **Local/staging verification**
  - Run app locally with and without `VITE_LAST_DEPLOYED_AT`.
  - Build preview validation to confirm production bundle behavior.
  - Verify exact footer copy and formatting in browser.
- **Logs/metrics/alerts**
  - Frontend-only change: no new backend metrics required.
  - Optional: temporary console warning in dev for invalid timestamp (omit in production output).
- **Rollout and rollback strategy**
  - Rollout with standard deploy pipeline; feature is low risk and isolated to footer rendering.
  - If metadata wiring is missing, UI fallback prevents user-facing breakage.
  - Rollback by reverting commit(s) if formatting/display causes regressions.

## Delivery Plan

- **Small commit sequence**
  1. Metadata contract + docs scaffold.
  2. Footer UI + styling.
  3. Parsing/formatting logic.
  4. Test setup and test cases.
  5. Final polish (lint/build fixes, docs clarifications).
- **PR checklist**
  - Acceptance criteria mapped in PR description.
  - Security note confirming no secret/token exposure.
  - Screenshot or short clip of footer in metadata-present and fallback states.
  - Test evidence included (command output).
  - Link back to issue #11.
- **Definition of Done**
  - Footer deploy timestamp/fallback behavior implemented and verified.
  - Tests cover available + unavailable states.
  - Documentation updated for metadata input and formatting.
  - CI checks pass and issue is ready for human approval.

## Unknowns and Confidence

- **Unknowns**
  - Authoritative deploy metadata source and variable naming in this repo’s actual production pipeline.
  - Final formatting preference (UTC vs localized).
- **Confidence**
  - **Medium-high** that UI and fallback behavior can be delivered with low risk.
  - **Medium** on exact metadata plumbing until CI/source-of-truth is confirmed.
