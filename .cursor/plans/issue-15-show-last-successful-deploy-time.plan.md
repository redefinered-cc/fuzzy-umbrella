---
issue: 15
implementation_branch: issue-15-show-last-successful-deploy-time
---

## Issue Understanding

- **Problem summary**
  - Issue #15 requests an in-app footer line that shows the **last successful production deploy timestamp** so support/QA can quickly verify build freshness without leaving the app.
  - The value should be read-only, human-readable, and resilient when metadata is unavailable.

- **Current vs expected behavior**
  - **Current:** The app has no footer deploy timestamp and no deploy metadata integration in current `main` (`src/App.jsx` has no footer metadata display; no deploy helper module exists).
  - **Expected:** Footer displays `Last deployed: <formatted timestamp>` when metadata exists, and a safe fallback such as `Deploy time unavailable` when it does not.

- **Assumptions**
  - Preferred source is **build-time env injection** via `import.meta.env.VITE_LAST_DEPLOYED_AT` (no blocking runtime call).
  - Display format will be **UTC** to avoid client timezone ambiguity and keep deterministic output for tests/docs.
  - Existing deployment workflow can provide this env var (or can be augmented later if missing); this issue focuses on consumer-side display.
  - Prior related branches (e.g. `issue-13-show-last-deploy-time`) indicate maintainers accept introducing minimal test tooling (Vitest + Testing Library) for this feature.

- **Clarifying questions (for human validation)**
  1. Should displayed time always be UTC (recommended) or localized per user browser locale/timezone?
  2. Is there an existing deploy workflow (`deploy.yml`) that already exports deploy timestamp envs, or should AgentDev include a follow-up workflow update task?
  3. Should footer text include additional metadata (e.g., commit SHA) now or stay timestamp-only per scope?

- **Confidence:** **Medium-high** on UI + client fallback scope; **medium** on deploy metadata wiring until deployment workflow availability is confirmed.

## Scope and Impact

- **In scope**
  - Footer UI for deploy timestamp.
  - Deterministic timestamp formatting helper and fallback behavior.
  - Minimal tests covering available/unavailable render paths.
  - Documentation note for chosen time format and env contract.

- **Out of scope**
  - Full release history, admin dashboards, rollback controls.
  - Secrets/token handling changes in browser.
  - Major deployment pipeline redesign.

- **Likely affected modules/files**
  - `src/App.jsx` (render footer line and consume deploy value)
  - `src/App.css` (footer styling aligned with existing tokens)
  - `src/deployInfo.js` (new helper for parse/format/fallback)
  - `src/deployInfo.test.js` (unit tests for formatter/fallback)
  - `src/App.test.jsx` (render behavior tests)
  - `vitest.config.js` and `src/test/setup.js` (if test framework is added)
  - `package.json` / `package-lock.json` (test deps + script)
  - `README.md` (document env variable and formatting choice)

- **Risks**
  - **Compatibility:** Browser/Node locale formatting differences if formatter is not pinned (mitigated by explicit `Intl.DateTimeFormat` config and UTC suffix).
  - **Performance:** Negligible if using static env value; avoid runtime blocking fetch at first paint.
  - **Security:** Must not expose CI secrets; only safe public metadata (`VITE_*`) should be consumed client-side.
  - **Migrations:** If no current test harness exists, adding Vitest introduces tooling changes and CI script updates.

## Implementation Plan (no code)

1. **Confirm metadata contract and display convention**
   - **Goal:** Lock down timestamp source and output format before coding.
   - **Files/components:** `README.md`, (possibly `.github/workflows/deploy.yml` for verification only).
   - **Expected outcome:** Documented decision: use `VITE_LAST_DEPLOYED_AT`, UTC display, fallback string.

2. **Add deploy timestamp domain helper**
   - **Goal:** Centralize parse/format/fallback logic for reliability and testability.
   - **Files/components:** `src/deployInfo.js`.
   - **Expected outcome:** Pure functions for validating raw timestamp, formatting UTC human-readable value, and returning fallback on invalid/missing data.

3. **Integrate footer display into app shell**
   - **Goal:** Render “Last deployed: …” in footer without breaking existing layout.
   - **Files/components:** `src/App.jsx`, `src/App.css`.
   - **Expected outcome:** Footer appears consistently across viewport sizes with existing design tokens; value uses helper output and gracefully degrades.

4. **Establish/extend test coverage for acceptance criteria**
   - **Goal:** Verify both available and unavailable cases and formatter behavior.
   - **Files/components:** `src/deployInfo.test.js`, `src/App.test.jsx`, `vitest.config.js`, `src/test/setup.js`, `package.json`.
   - **Expected outcome:** Automated tests assert deterministic UTC formatting and fallback rendering; local/CI test command available.

5. **Document operational expectations**
   - **Goal:** Reduce confusion for future maintainers and release engineers.
   - **Files/components:** `README.md`.
   - **Expected outcome:** Clear note on env var name, example value format (ISO 8601), and fallback behavior in local/dev contexts.

## Test Plan

- **Unit**
  - `formatDeployTimestamp` returns UTC-formatted string for valid ISO timestamp.
  - Returns `null` for missing/blank/invalid input.
  - `getDeployTimeValue` returns fallback when formatter output is `null`.

- **Integration/E2E (component-level for this repo)**
  - Render app with explicit deploy timestamp prop/env stub and assert `Last deployed:` plus formatted value.
  - Render app with empty/missing deploy timestamp and assert fallback text.
  - Validate no runtime errors when env var is undefined.

- **Regression checklist**
  - Existing page sections (`#center`, `#next-steps`) still render unchanged.
  - Footer styling does not regress mobile layout or dark mode readability.
  - Lint/build/test all pass in CI workflow.

- **Edge/failure cases**
  - Invalid date string (`not-a-date`) → fallback.
  - Whitespace-only string → fallback.
  - Future/past valid timestamps still render correctly.
  - Locale differences do not alter expected UTC suffix semantics.

## Validation and Rollout

- **Local/staging verification**
  - Run lint/build/tests locally.
  - Manually verify footer rendering in dev with and without `VITE_LAST_DEPLOYED_AT`.
  - Verify production/staging build receives timestamp env from deployment context.

- **Logs/metrics/alerts**
  - No new backend logs required for static env approach.
  - If runtime endpoint is later introduced, add non-blocking error logging and monitor fetch failure rate.

- **Rollout and rollback strategy**
  - Rollout via normal merge-to-main deployment.
  - Safe rollback is standard revert of footer/deploy-info changes.
  - If env missing post-release, UI fallback preserves usability without hotfix urgency.

## Delivery Plan

- **Small commit sequence**
  1. Add deploy helper + App footer integration + styles.
  2. Add/enable tests for helper and footer rendering.
  3. Update docs for env contract and formatting behavior.

- **PR checklist**
  - Acceptance criteria mapped in PR description.
  - Screenshots for desktop/mobile footer state (available/unavailable).
  - Test evidence (`npm run test`, lint, build) included.
  - Confirm no secrets exposed in client bundle.

- **Definition of Done**
  - Footer shows deterministic deploy timestamp when available.
  - Fallback shown when metadata absent/invalid with no page breakage.
  - Tests cover both states and pass in CI.
  - Documentation updated and human reviewer confirms plan assumptions.

