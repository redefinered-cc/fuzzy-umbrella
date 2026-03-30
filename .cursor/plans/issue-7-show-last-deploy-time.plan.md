---
issue: 7
implementation_branch: issue-7-show-last-deploy-time
---

## Issue Understanding

- **Problem summary**
  - Issue #7 requests a footer-visible, read-only "Last deployed: ..." timestamp for production so support/QA can quickly confirm build freshness without checking CI logs.
  - The value should come from existing deploy metadata or a lightweight/public-safe source.
- **Current vs expected behavior**
  - **Current:** The app (`src/App.jsx`) has no footer deploy metadata line, and there is no visible deploy timestamp anywhere in the UI.
  - **Expected:** Footer shows a human-readable deploy timestamp when available, and a safe fallback (for missing metadata/local dev) when unavailable.
- **Assumptions**
  - Deploy metadata source is not yet implemented in this repo; we will use a non-secret client-safe source such as `import.meta.env.VITE_LAST_DEPLOYED_AT` by default.
  - Time display decision will be documented and kept consistent (assume **UTC** formatting unless product requests locale formatting).
  - Footer can be introduced in `App.jsx` without needing a broader layout refactor, given current app structure.
  - Tests can be introduced in the same PR by adding a test runner stack (Vitest + React Testing Library), since no test framework is currently configured.

## Clarifying Questions

1. Should the timestamp be displayed in **UTC** or **viewer-local timezone** (acceptance allows either)?
2. Is there an existing production metadata endpoint we must consume, or is `VITE_LAST_DEPLOYED_AT` the preferred source?
3. Is there a preferred fallback copy (exact text), e.g., "Deploy time unavailable" vs "Last deployed: unavailable"?
4. Are there localization/i18n requirements for the footer text in this repository?

## Scope and Impact

- **In scope**
  - Add footer UI line for deploy timestamp.
  - Add metadata parsing/formatting utility logic.
  - Add graceful fallback behavior when metadata is missing/invalid.
  - Add tests covering available/unavailable states.
  - Document required env variable and formatting behavior.
- **Out of scope**
  - Full deploy history, release timeline, rollback controls.
  - Reworking deployment pipeline internals beyond exposing/consuming a timestamp.
  - Admin-only or non-footer surfaces for deploy metadata.

- **Likely affected modules/files**
  - `src/App.jsx` (render footer and deploy line)
  - `src/App.css` (footer styling aligned with existing tokens/layout)
  - `src/index.css` (only if shared typography/token usage is needed)
  - `README.md` (document env var and fallback behavior)
  - `package.json` / `package-lock.json` (test tooling additions if needed)
  - New likely utility/test files:
    - `src/utils/deployTime.js` (parse/format logic)
    - `src/utils/deployTime.test.js` (unit tests)
    - `src/App.test.jsx` (render fallback/available states)
    - `vitest.config.js` and/or `src/test/setup.js` (if test harness added)

- **Risks**
  - **Compatibility:** No existing test harness; adding one can introduce CI/script updates.
  - **Performance:** If runtime fetch is chosen, must be non-blocking and not delay first paint.
  - **Security:** Must not expose CI tokens or private endpoints; only client-safe metadata.
  - **Data quality:** Invalid/missing timestamps must fail safely to fallback text.
  - **Migrations:** None expected for DB/schema/infrastructure in UI-only approach.

## Implementation Plan (no code)

1. **Decide and document metadata contract**
   - **Goal:** Lock down source and format for deploy timestamp.
   - **Files/components:** `README.md` (and optional inline code docs in new utility file).
   - **Expected outcome:** Clear contract such as `VITE_LAST_DEPLOYED_AT` (ISO 8601 string, UTC), fallback behavior defined.

2. **Introduce deploy-time formatting utility**
   - **Goal:** Centralize parse/format/fallback logic for reliability and testability.
   - **Files/components:** `src/utils/deployTime.js` (new).
   - **Expected outcome:** Utility returns either formatted display text or an unavailable state without throwing.

3. **Add footer deploy indicator to UI**
   - **Goal:** Render "Last deployed: ..." in footer area.
   - **Files/components:** `src/App.jsx`, `src/App.css` (and possibly `src/index.css`).
   - **Expected outcome:** Footer consistently displays either a formatted timestamp or fallback message across viewport sizes/themes.

4. **Add tests for available/unavailable scenarios**
   - **Goal:** Prevent regressions and satisfy acceptance criteria.
   - **Files/components:** `src/utils/deployTime.test.js`, `src/App.test.jsx`; test config files and `package.json` scripts if absent.
   - **Expected outcome:** Automated coverage verifies:
     - valid metadata -> readable footer text
     - missing/invalid metadata -> fallback text

5. **Wire CI-compatible test command (if test stack introduced)**
   - **Goal:** Ensure tests can run locally and in CI without disrupting existing pipeline.
   - **Files/components:** `package.json`, `package-lock.json`, optionally CI workflow docs or scripts.
   - **Expected outcome:** Repeatable `npm test`/`npm run test` path available and documented.

## Test Plan

- **Unit**
  - `deployTime` utility:
    - valid ISO timestamp -> expected formatted string (documented timezone convention)
    - undefined/empty string -> unavailable state
    - invalid timestamp string -> unavailable state
  - Optional snapshot for format output stability.

- **Integration/E2E**
  - App render test:
    - with env timestamp set -> footer shows "Last deployed: <formatted>"
    - without env timestamp -> footer shows fallback text
  - Optional lightweight browser smoke test in preview build to confirm footer placement and responsiveness.

- **Regression checklist**
  - Existing page sections (hero, docs/social cards, counter) still render and style correctly.
  - No console errors/warnings due to invalid date parsing.
  - Build (`npm run build`) still passes.
  - Lint (`npm run lint`) still passes.

- **Edge/failure cases**
  - Timestamp present but malformed.
  - Timestamp present but non-ISO/non-UTC.
  - Extremely old/future timestamp (display remains stable).
  - Local dev with no env metadata.

## Validation and Rollout

- **Local/staging verification**
  - Run with and without `VITE_LAST_DEPLOYED_AT`.
  - Confirm text and styling in light/dark themes and at smaller breakpoints.
  - Verify production build output includes no secrets and no runtime failures.

- **Logs/metrics/alerts**
  - Frontend-only change has limited observability; rely on:
    - CI build/lint/test pass signals
    - browser console checks (no parse/render errors)
  - If endpoint-based source is later chosen, add endpoint health/error monitoring separately.

- **Rollout and rollback strategy**
  - Roll out with normal PR merge path to `main`.
  - If bad display behavior occurs, rollback by reverting the feature commit(s).
  - Fallback behavior ensures non-breaking UX even when metadata is absent.

## Delivery Plan

- **Small commit sequence**
  1. docs/contract + utility scaffold
  2. UI footer render + styles
  3. tests + test tooling wiring
  4. final docs polish (if separate)

- **PR checklist**
  - Acceptance criteria explicitly checked in PR description.
  - Screenshot(s) for available/unavailable footer states.
  - Test evidence attached (unit + app render).
  - Security check: no private tokens or secrets exposed in client code.
  - Note timezone choice and formatting contract.

- **Definition of Done**
  - Footer shows deploy timestamp (or fallback) reliably.
  - Tests exist for both available and unavailable states and pass in CI.
  - Documentation updated with metadata source and behavior.
  - Human validates plan and triggers implementation workflow.

## Unknowns and Confidence

- **Unknowns:** Final metadata source (env vs endpoint), timezone preference, exact fallback copy.
- **Confidence:** **Medium** — UI implementation is straightforward, but repository currently lacks explicit deploy metadata and test harness, which adds integration decisions during implementation.
