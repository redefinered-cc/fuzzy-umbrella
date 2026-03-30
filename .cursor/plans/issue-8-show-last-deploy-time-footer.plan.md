---
issue: 8
implementation_branch: issue-8-show-last-deploy-time-footer
---

## Issue Understanding

- **Problem summary**
  - The app should show when production was last successfully deployed, directly in the UI footer, so support/QA can quickly verify release freshness without checking CI dashboards.
  - Current repository state is a minimal React + Vite app (`src/App.jsx`) with no existing footer component, no deploy metadata plumbing, and no automated test files yet.
- **Current vs expected behavior**
  - **Current:** No deploy timestamp is rendered anywhere in the app; no deploy workflow (`deploy.yml`) exists in this repository to provide metadata.
  - **Expected:** Footer displays `Last deployed: <human-readable timestamp>` using a safe metadata source; when metadata is absent, footer shows a clear fallback such as `Deploy time unavailable`, without breaking rendering.
- **Assumptions**
  - Deployment timestamp will be sourced from build-time environment metadata (`VITE_*`) rather than a blocking runtime API call, because no public deploy metadata endpoint is currently present.
  - Timestamp display format will use UTC for deterministic output across clients and tests.
  - The implementation may introduce a lightweight test setup (Vitest + Testing Library) because no test harness currently exists but acceptance criteria require coverage of available/unavailable states.
  - “Footer” in this codebase means adding a dedicated section near the bottom of `App` (likely replacing or extending existing spacer section) while reusing existing CSS tokens.

### Clarifying questions (for human validation)

1. Should timestamp formatting be strictly UTC (recommended), or localized to viewer timezone?
2. Is build-time injection via `VITE_LAST_DEPLOYED_AT` acceptable as primary source, given there is currently no deploy metadata API?
3. Is introducing a minimal unit test stack (Vitest + React Testing Library) acceptable in this issue scope?
4. Should the footer appear on all environments (including local/dev) with fallback text, or only production?

**Confidence:** Medium-high on UI/component scope; medium on metadata source until question #2 is confirmed.

## Scope and Impact

- **In scope**
  - Add visible footer line for deploy timestamp/fallback.
  - Add safe metadata ingestion (environment variable or non-blocking resolver).
  - Add tests for timestamp present/absent rendering.
  - Document expected metadata contract and formatting choice.
- **Out of scope**
  - Building a release history UI.
  - Changing deployment infrastructure itself.
  - Introducing privileged client-visible tokens or secret-based API access.
  - Large layout redesign beyond required footer integration.

### Likely affected modules/files

- `src/App.jsx`  
  - Add footer render location and wire deploy-time display.
- `src/App.css` (and possibly `src/index.css`)  
  - Footer spacing/typography styles using existing CSS vars.
- `src/` new utility/component files (expected)
  - e.g., `src/components/DeployInfoFooter.jsx`
  - e.g., `src/utils/deployTime.js` for parsing/formatting/fallback logic.
- `README.md` (or docs file)
  - Document `VITE_LAST_DEPLOYED_AT` usage and fallback behavior.
- `package.json` (+ lockfile) if tests are introduced
  - Add test dependencies and `test` script.
- test files (new)
  - e.g., `src/components/DeployInfoFooter.test.jsx` or `src/App.test.jsx`.
- Optional workflow/docs touchpoint (non-blocking)
  - If desired, add note in CI/deploy docs on where deploy timestamp env is set.

### Risks

- **Compatibility**
  - Browser differences in date formatting if locale-based formatting is used; mitigated by explicit UTC formatting approach.
- **Performance**
  - Risk is low if using static build-time metadata (no network request).  
  - Higher risk if runtime fetch is added; this plan avoids blocking fetch by default.
- **Security**
  - Must avoid exposing secrets; only publish non-sensitive timestamp string through `VITE_*` public env.
- **Migrations / operational**
  - If using env injection, deployment pipeline/config must provide variable consistently; otherwise fallback path will be common.

## Implementation Plan (no code)

1. **Define deploy timestamp contract**
   - **Goal:** Establish one canonical source and format for deploy metadata in frontend.
   - **Files/components:** `README.md` (or new short doc), implementation utility file (planned).
   - **Expected outcome:** Clear rule such as: use `import.meta.env.VITE_LAST_DEPLOYED_AT` as ISO-8601 string; invalid/missing values render fallback.

2. **Create deploy-time formatting/resolver utility**
   - **Goal:** Centralize parse/validate/format logic and fallback decision.
   - **Files/components:** new utility file in `src/utils/`.
   - **Expected outcome:** Deterministic function returning either formatted timestamp (UTC) or unavailable status, minimizing logic in UI component.

3. **Add footer UI display in app layout**
   - **Goal:** Render `Last deployed: ...` in a footer area at bottom of page.
   - **Files/components:** `src/App.jsx`; optional new `src/components/DeployInfoFooter.jsx`.
   - **Expected outcome:** Footer appears consistently; available metadata shows timestamp, otherwise shows `Deploy time unavailable`.

4. **Style footer using existing tokens**
   - **Goal:** Keep visual integration consistent with current design and responsive behavior.
   - **Files/components:** `src/App.css` (and possibly `src/index.css`).
   - **Expected outcome:** Footer has subtle, readable styling; no layout regression on desktop/mobile.

5. **Add tests for available/unavailable states**
   - **Goal:** Satisfy acceptance criteria with automated rendering checks.
   - **Files/components:** new test file(s), `package.json` scripts/deps if test stack added.
   - **Expected outcome:** Tests validate both metadata-present and fallback outputs; deterministic assertions for formatting.

6. **Document configuration + fallback behavior**
   - **Goal:** Ensure maintainers know how deploy metadata is supplied and what happens when absent.
   - **Files/components:** `README.md` (or docs reference).
   - **Expected outcome:** Clear setup instructions for local/dev/prod and troubleshooting note for missing env.

## Test Plan

- **Unit**
  - Utility parsing/format tests:
    - valid ISO timestamp → expected UTC string.
    - missing value → unavailable.
    - malformed timestamp → unavailable.
  - If component extracted: component test with injected values.

- **Integration / E2E (lightweight app-level)**
  - App render test verifies footer text appears with env value.
  - App render test verifies fallback text appears when env value absent.
  - Optional manual smoke in browser via `npm run dev` with/without `VITE_LAST_DEPLOYED_AT`.

- **Regression checklist**
  - Existing main content still renders (hero, docs/social sections, counter).
  - No console errors from date parsing or undefined env access.
  - Build succeeds with variable set and unset.
  - Lint passes after new files.

- **Edge / failure cases**
  - Empty string env value.
  - Non-ISO string env value.
  - Future timestamp (render allowed but should still format clearly).
  - Extremely old timestamp (format still legible).

## Validation and Rollout

- **Local/staging verification**
  - Validate in local dev with `.env.local` and without env variable.
  - Build preview check (`npm run build` + preview) for production-like behavior.
  - If staging pipeline exists, confirm variable provisioning and resulting footer text.

- **Logs/metrics/alerts**
  - No dedicated telemetry required for this feature.
  - Validate absence of runtime errors in browser console and CI logs.
  - If runtime fetch path is introduced later, add error telemetry then.

- **Rollout and rollback strategy**
  - Rollout via normal PR merge to `main`.
  - Safe degradation: if env absent/misconfigured, UI shows fallback string.
  - Rollback by reverting PR if formatting or layout regressions occur.

## Delivery Plan

- **Small commit sequence**
  1. Add deploy timestamp utility + footer component/layout.
  2. Add CSS updates for footer styling.
  3. Add tests and test tooling (if not present).
  4. Add README/docs for env contract and fallback behavior.

- **PR checklist**
  - Link issue `#8`.
  - Include screenshots (available vs unavailable footer states).
  - Confirm no secrets exposed in client bundle.
  - Confirm lint/build/tests pass.
  - Describe timestamp timezone/format decision explicitly.

- **Definition of Done**
  - Footer shows `Last deployed: ...` with deterministic formatting.
  - Missing/invalid metadata gracefully shows fallback text.
  - Automated tests cover both states.
  - Documentation updated for metadata source and setup.
  - Human validates plan and approves transition to implementation (`status:in_progress` when ready).
