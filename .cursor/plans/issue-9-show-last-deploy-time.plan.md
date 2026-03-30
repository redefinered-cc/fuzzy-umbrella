---
issue: 9
implementation_branch: issue-9-show-last-deploy-time
---

## Issue Understanding

- **Problem summary**
  - The app should show a read-only footer line with the last successful production deploy timestamp so support/QA can quickly verify deployment freshness without checking CI/chat.
- **Current vs expected behavior**
  - **Current:** No footer deploy timestamp is rendered; no deploy metadata path exists in the current React/Vite app.
  - **Expected:** Footer renders `Last deployed: <human-readable timestamp>` when metadata exists, and a safe fallback (`Deploy time unavailable`) when it does not.
- **Assumptions**
  - The safest/default implementation path is **build-time metadata injection** (e.g., `VITE_DEPLOYED_AT`) to avoid first-paint blocking network calls.
  - Display timezone will be **UTC** by default unless product direction explicitly requires user-local time.
  - Local/dev builds may not define deploy metadata; fallback is expected there.
  - It is acceptable to introduce a minimal test setup (Vitest + React Testing Library) because the repo currently has no test framework.

**Unknowns / clarifying questions**
1. What is the authoritative deploy timestamp source (CI variable, artifact metadata, or existing public endpoint)?
2. Should timestamp be shown in UTC or localized to the viewer?
3. Should non-production environments show the same footer line, or a separate environment-aware message?
4. Are we expected to add a test runner in this issue if none currently exists?

**Confidence:** Medium (UI target is clear; metadata source and test-framework expectation are not yet explicit).

## Scope and Impact

- **In scope**
  - Footer UX update to include deploy timestamp text.
  - Deploy metadata read/parsing/formatting logic with resilient fallback.
  - Tests covering metadata available/unavailable rendering behavior.
  - Lightweight docs/update notes for required env var and formatting choice.
- **Out of scope**
  - Deployment pipeline redesign or release history UI.
  - Any privileged or token-based browser API access.
  - Admin pages or broader observability features.

- **Likely affected modules/files**
  - `src/App.jsx` (current top-level layout; footer placement point).
  - `src/App.css` and/or `src/index.css` (footer styles and spacing).
  - New utility module (proposed): `src/lib/deployMetadata.js` (read + normalize + format logic).
  - Test files (proposed): `src/lib/deployMetadata.test.js`, `src/App.test.jsx` (or equivalent component test).
  - `package.json` (test scripts/deps if introducing Vitest).
  - `vite.config.js` (test config if Vitest is adopted).
  - Optional docs/env sample update (if present): `README.md` or `.env.example`.

- **Risks**
  - **Compatibility:** Invalid/missing timestamp formats could produce inconsistent output across browsers if not normalized.
  - **Performance:** Runtime fetch would risk delayed render; avoid by using static build-time value.
  - **Security:** No internal CI tokens/endpoints should be exposed to client code.
  - **Migrations:** None expected for data/storage; only front-end rendering/config wiring.

**Confidence:** Medium-high for UI/code touchpoints; medium for CI metadata wiring until source is confirmed.

## Implementation Plan (no code)

1. **Confirm deploy metadata contract**
   - **Goal:** Lock input source and format (e.g., ISO-8601 via `VITE_DEPLOYED_AT`).
   - **Files/components:** CI/deploy docs/workflows (if available), `README.md` (documentation update).
   - **Expected outcome:** Explicit contract for timestamp source, format, and fallback semantics.

2. **Introduce deploy metadata utility**
   - **Goal:** Centralize read/validate/format behavior so UI stays simple.
   - **Files/components:** New `src/lib/deployMetadata.js` (or similarly named utility).
   - **Expected outcome:** Single function returning either formatted deploy text or a stable unavailable state.

3. **Render footer deploy line in app layout**
   - **Goal:** Add `Last deployed: ...` in footer area without disrupting current layout.
   - **Files/components:** `src/App.jsx` (or extracted footer component), `src/App.css`/`src/index.css`.
   - **Expected outcome:** Footer line visible in standard viewports; graceful fallback string when metadata missing.

4. **Add tests for available/unavailable states**
   - **Goal:** Enforce rendering correctness and fallback behavior.
   - **Files/components:** `src/App.test.jsx`, `src/lib/deployMetadata.test.js`, plus `package.json`/`vite.config.js` if test stack is added.
   - **Expected outcome:** Automated tests pass for both metadata-present and metadata-absent scenarios.

5. **Document operational expectations**
   - **Goal:** Make behavior predictable for developers and release engineers.
   - **Files/components:** `README.md` (or project docs).
   - **Expected outcome:** Clear notes on env variable usage, timezone/display choice, and local-dev fallback.

**Confidence:** Medium (depends on deploy timestamp source confirmation).

## Test Plan

- **Unit**
  - Validate timestamp parser/formatter for:
    - valid ISO timestamps,
    - invalid/unparseable strings,
    - undefined/empty metadata.
  - Verify output contract: formatted string vs unavailable sentinel.

- **Integration / E2E**
  - Component-level rendering test for app footer with mocked env states:
    - `VITE_DEPLOYED_AT` defined => `Last deployed: ...` visible.
    - `VITE_DEPLOYED_AT` missing/invalid => `Deploy time unavailable` visible.
  - Ensure no network dependency is required for first paint.

- **Regression checklist**
  - Existing page sections still render and layout spacing remains acceptable across breakpoints.
  - Dark/light theme readability for footer text.
  - Build output does not include secrets or accidental token values.

- **Edge/failure cases**
  - Malformed date strings (non-ISO/random text).
  - Extremely old/future dates.
  - Empty string env variable.
  - Client runtime where `Intl` formatting behaves differently (ensure deterministic fallback).

**Confidence:** Medium-high for coverage strategy; medium for exact tooling until framework decision is finalized.

## Validation and Rollout

- **Local/staging verification**
  - Run lint/build/tests locally.
  - Manual check with and without deploy env variable set.
  - Verify visual placement in desktop/mobile breakpoints.

- **Logs/metrics/alerts**
  - No new backend service expected, so no new runtime metrics required.
  - Optional: add non-noisy console warning in development only for malformed timestamp input (avoid production log noise).

- **Rollout and rollback strategy**
  - Rollout via standard merge-to-main release path.
  - If issue occurs, rollback by reverting the UI/footer commit; feature has no data migration dependencies.

**Confidence:** High for rollback simplicity; medium for rollout details if CI metadata wiring changes are needed.

## Delivery Plan

- **Small commit sequence**
  1. Add deploy metadata utility + footer rendering/styling.
  2. Add tests for available/unavailable cases (and test harness if needed).
  3. Add/update docs for env contract and display behavior.

- **PR checklist**
  - [ ] Footer shows deploy time when metadata exists.
  - [ ] Fallback shown when metadata missing/invalid.
  - [ ] No client-exposed secret/token introduced.
  - [ ] Tests added and passing for both states.
  - [ ] Lint/build pass.
  - [ ] Docs updated with metadata contract and timezone decision.

- **Definition of Done**
  - Acceptance criteria in issue #9 are satisfied.
  - Human reviewer can verify plan assumptions and approve metadata source/timezone decisions.
  - Issue labels reflect plan-ready state and handoff to human input.

**Overall confidence:** Medium (implementation is straightforward once metadata source and timezone preference are confirmed).
