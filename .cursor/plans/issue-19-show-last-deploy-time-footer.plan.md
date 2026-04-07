---
issue: 19
implementation_branch: issue-19-show-last-deploy-time-footer
---

## Issue Understanding

### Problem summary
- The app currently provides no in-product signal of production freshness.
- Support/QA must verify deploy recency out of band (GitHub Actions/chat), which is slow and error-prone.
- The requested enhancement is a read-only footer line showing the timestamp of the last successful production deploy.

### Current vs expected behavior
- **Current:** No footer deploy timestamp is displayed; users cannot quickly confirm how recent the running build is.
- **Expected:** Footer shows `Last deployed: ...` in a human-readable format. If metadata is unavailable, the UI shows a safe fallback like `Deploy time unavailable` and the page still renders normally.

### Assumptions
- This repository is a minimal React + Vite app and currently has no dedicated footer component; footer content will likely be added inside `src/App.jsx` or a new small component under `src/components/`.
- No server-side metadata endpoint currently exists in this repo; build-time injection via `import.meta.env.VITE_*` is the lowest-risk path.
- The deploy timestamp source is expected to come from CI/CD environment configuration (e.g., pipeline setting `VITE_DEPLOYED_AT`) rather than client-side calls to private APIs.
- Time display choice will be **UTC** unless product direction requires localization.

### Clarifying questions (for human validation)
1. Should the displayed time be strictly UTC, or localized to the end user's browser locale/timezone?
2. What is the canonical timestamp source in your deployment process (environment variable name and format)?
3. Is adding a lightweight public metadata endpoint preferred over build-time injection, or should this ticket remain strictly build-time?
4. Is there a required copy/style guideline for footer status text beyond `Last deployed: ...`?

### Confidence
- **Medium**: UI placement and fallback behavior are straightforward; confidence is reduced by unknown deploy metadata source and missing current test harness for component behavior.

## Scope and Impact

### In scope
- Add a footer display for deployment timestamp.
- Parse/format deploy timestamp for user display.
- Add fallback behavior for missing/invalid metadata.
- Add tests for available/unavailable states (and invalid timestamp handling if feasible).
- Document configuration expectations for metadata source.

### Out of scope
- Creating full deploy history UI.
- Altering deployment orchestration beyond passing a timestamp value to the frontend.
- Introducing authenticated/private runtime APIs or exposing CI secrets.
- Non-footer surfaces (admin pages, headers, etc.) unless naturally reused by a shared component.

### Likely affected modules/files
- `src/App.jsx` (current likely integration point for footer content)
- `src/App.css` and/or `src/index.css` (footer styling and spacing)
- Potential new utility/component files:
  - `src/components/DeployInfoFooter.jsx` (optional extraction for maintainability)
  - `src/utils/deployTime.js` (optional parse/format logic)
- Build/runtime config docs:
  - `README.md` (document `VITE_DEPLOYED_AT` behavior and fallback)
- Test setup and tests (currently absent):
  - `package.json` (test scripts/deps)
  - `vite.config.js` (test config if Vitest used)
  - `src/**/*.test.jsx` (footer rendering tests)

### Risks
- **Compatibility:** Invalid or inconsistent timestamp format from CI may cause parsing issues; must fail gracefully.
- **Performance:** Avoid blocking network requests on first paint; prefer static env value or non-blocking optional fetch.
- **Security:** Never expose internal tokens/endpoints. Only public, non-sensitive deploy timestamp should be in client bundle.
- **Migrations/ops:** If using env injection, deployment pipeline may need a small config update to supply timestamp consistently.

## Implementation Plan (no code)

1. **Decide metadata contract and display format**
   - **Goal:** Lock down timestamp source, format, and display semantics before implementation.
   - **Files/components:** `README.md` (or a short docs note), deployment config references.
   - **Expected outcome:** Agreed contract (e.g., `VITE_DEPLOYED_AT` ISO-8601 UTC string), plus fallback copy.

2. **Introduce deploy metadata read path in frontend**
   - **Goal:** Read deploy timestamp from safe public config at runtime/build time.
   - **Files/components:** `src/App.jsx` (or `src/components/DeployInfoFooter.jsx`), optional `src/utils/deployTime.js`.
   - **Expected outcome:** App can obtain timestamp value (or null) without network blocking and without secret exposure.

3. **Render footer deploy line with resilient fallback**
   - **Goal:** Show user-facing `Last deployed: ...` line in footer area; fallback on missing/invalid data.
   - **Files/components:** `src/App.jsx`, `src/App.css`/`src/index.css`.
   - **Expected outcome:** Footer consistently renders a stable status line in all environments.

4. **Add deterministic formatting and invalid-value handling**
   - **Goal:** Ensure readable output and avoid runtime errors.
   - **Files/components:** optional `src/utils/deployTime.js`, consuming component file.
   - **Expected outcome:** Valid timestamps are formatted predictably (UTC unless clarified otherwise); malformed values map to fallback text.

5. **Add automated tests for render states**
   - **Goal:** Cover acceptance criteria for available/unavailable metadata cases.
   - **Files/components:** test config files, footer/component tests.
   - **Expected outcome:** Tests assert:
     - deploy time shown when provided,
     - fallback shown when missing,
     - app remains render-safe when malformed.

6. **Document operational setup**
   - **Goal:** Make deploy metadata configuration repeatable for CI/CD and local dev.
   - **Files/components:** `README.md` (or docs).
   - **Expected outcome:** Team can set timestamp input reliably; local dev behavior is clearly defined.

## Test Plan

### Unit
- Formatting utility tests:
  - valid ISO timestamp -> expected display string
  - invalid timestamp -> fallback indicator path
  - empty/undefined value -> fallback
- Component-level tests:
  - renders `Last deployed: ...` when env value is present
  - renders `Deploy time unavailable` when absent

### Integration/E2E
- App render smoke:
  - with deploy env injected at build/dev time, footer displays expected text
  - without env, app still builds and renders fallback
- Optional browser-level assertion (if E2E tooling exists/added later): footer visible on initial load with no blocking spinner/request dependency.

### Regression checklist
- Existing page layout remains intact across breakpoints (desktop/mobile).
- No console runtime errors for undefined/invalid deploy metadata.
- No new secrets or private URLs embedded in client-side output.
- Lint/build/test all pass in CI.

### Edge/failure cases
- Non-ISO timestamp string from pipeline.
- Timestamp value present but unparsable in browser locale.
- Missing env in local dev.
- Unexpected whitespace/null-like strings.

## Validation and Rollout

### Local/staging verification
- Local:
  - run with and without deploy env variable and verify UI states.
  - verify timestamp formatting matches documented convention.
- Staging/pre-prod:
  - confirm deploy pipeline injects value correctly.
  - spot-check footer after a fresh deploy for expected recency.

### Logs/metrics/alerts
- Frontend console should remain clean (no parse/render errors).
- CI checks (lint/build/tests) act as rollout gates.
- No new telemetry required unless product requests observability for metadata read failures.

### Rollout and rollback strategy
- Rollout:
  - ship behind normal PR + CI flow; no feature flag required for this low-risk UI addition.
  - validate on first production deploy post-merge.
- Rollback:
  - revert commit if formatting or display causes confusion; fallback-only behavior can be retained if needed as an interim safe state.

## Delivery Plan

### Small commit sequence
1. Add deploy footer UI + parsing utility skeleton.
2. Add styles and fallback behavior refinements.
3. Add tests for available/unavailable/invalid states.
4. Add README/docs for env configuration and display convention.

### PR checklist
- Links issue #19 and acceptance criteria mapping.
- Includes screenshots (with metadata available + unavailable fallback).
- Demonstrates no secret exposure pattern (`VITE_*` or approved public endpoint only).
- Includes/updates tests and documentation.
- Notes timezone decision (UTC vs localized) explicitly.

### Definition of Done
- Footer consistently shows deploy timestamp or documented fallback.
- Automated tests cover required states and pass in CI.
- Docs explain metadata source and local/dev behavior.
- Security/performance constraints from issue are satisfied.
