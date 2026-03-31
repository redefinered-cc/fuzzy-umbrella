---
issue: 13
implementation_branch: issue-13-show-last-deploy-time
---

## Issue Understanding

### Problem summary
Support and QA currently lack an in-app signal that indicates how fresh the production deployment is. Issue #13 requests adding a read-only footer indicator that shows the **last successful production deploy timestamp** so users can quickly verify whether the running build is current.

### Current vs expected behavior
- **Current behavior:**
  - No footer exists in the app UI today.
  - No deploy timestamp is surfaced in the client.
  - Users must check external systems (Actions/chat) to infer deployment freshness.
- **Expected behavior:**
  - Footer displays a human-readable line such as `Last deployed: ...`.
  - Timestamp is sourced from existing deploy metadata or a lightweight/public-safe source.
  - If unavailable, UI shows a safe fallback like `Deploy time unavailable` without breaking rendering.
  - Implementation must avoid exposing secrets and must not block first paint.

### Assumptions
1. We can use a **build-time environment variable** (e.g., `VITE_LAST_DEPLOYED_AT`) as the primary metadata source, because this project currently has no existing runtime API endpoint for deploy metadata.
2. Time display will be **UTC** to keep behavior deterministic and avoid timezone ambiguity unless maintainers explicitly prefer localized display.
3. Footer implementation can be done directly in `src/App.jsx` (or extracted into a small presentational component during implementation) without requiring route/layout framework changes.
4. Adding a test runner (Vitest + React Testing Library) is acceptable because this repository currently has no frontend test setup, but acceptance criteria require test coverage.
5. The repository currently has no `deploy.yml`; therefore implementation will not change pipeline logic unless maintainers request wiring `VITE_LAST_DEPLOYED_AT` in CI/deploy later.

### Clarifying questions
1. Preferred timestamp format and timezone policy: strict UTC string vs user-localized display?
2. Should footer be shown in all environments (dev/staging/prod) or only production-like builds?
3. If no deploy workflow currently injects metadata, should AgentDev include a follow-up docs note for manual env injection in hosting platform settings?
4. Is adding test dependencies (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`) acceptable in this iteration?

### Confidence
**Medium.** UI implementation scope is straightforward, but confidence is reduced by unknowns around preferred timestamp format and metadata injection source in deployment.

## Scope and Impact

### In scope
- Add footer UI line for deploy timestamp.
- Add formatting/parsing logic for available metadata.
- Add fallback behavior when metadata is missing/invalid.
- Add tests for available/unavailable rendering paths.
- Add brief documentation for expected env var and formatting choice.

### Out of scope
- Building a deployment history view.
- Adding admin controls or release management actions.
- Refactoring deployment pipelines beyond minimal metadata consumption guidance.
- Creating new backend services solely for this feature.

### Likely affected modules/files
- `src/App.jsx` (footer rendering and metadata read/format invocation)
- `src/App.css` (footer styling/token usage)
- `src/index.css` (only if shared layout spacing adjustments are needed)
- `README.md` (document env variable and fallback behavior)
- `package.json` + `package-lock.json` (if test tooling is added)
- New test/config files likely required:
  - `src/App.test.jsx` (or equivalent)
  - `vitest.config.js` (or extend `vite.config.js` for test config)
  - `src/test/setup.js` (jest-dom setup), if adopted

### Risks
- **Compatibility:** Minimal UI risk; potential SSR concerns are negligible in this client-only Vite app.
- **Performance:** Must avoid runtime blocking fetch on initial render; build-time env read has near-zero overhead.
- **Security:** Must only use `VITE_*` public-safe metadata; never expose CI tokens or private endpoints.
- **Data quality:** Invalid timestamp strings could cause `Invalid Date`; fallback handling must be explicit.
- **Migrations:** None expected (no DB/schema changes).
- **Process risk:** Since deploy metadata injection is not currently visible in repo workflows, runtime value may remain unavailable until hosting/deploy config is updated.

## Implementation Plan (no code)

1. **Decide metadata contract and display format**
   - **Goal:** Lock down the exact source (`VITE_LAST_DEPLOYED_AT`) and display policy (UTC + readable formatter).
   - **Files/components:** `README.md` (behavior note), implementation notes in `src/App.jsx` comments/docstring if needed.
   - **Expected outcome:** A single documented contract for how deploy time is provided and shown.

2. **Add footer rendering path in app UI**
   - **Goal:** Introduce a footer region in the existing app layout with `Last deployed: ...` text.
   - **Files/components:** `src/App.jsx`, `src/App.css`.
   - **Expected outcome:** Footer appears consistently and does not disrupt existing sections/responsive layout.

3. **Implement safe timestamp parsing/formatting + fallback**
   - **Goal:** Convert env input into human-readable value; guard against missing/invalid values.
   - **Files/components:** `src/App.jsx` (or extracted helper/module under `src/`).
   - **Expected outcome:**
     - Valid metadata → formatted timestamp shown.
     - Missing/invalid metadata → `Deploy time unavailable` shown.
     - No runtime exception from malformed date values.

4. **Add tests for available and unavailable cases**
   - **Goal:** Prevent regressions and satisfy acceptance criteria.
   - **Files/components:** `src/App.test.jsx`; optional test setup/config files; `package.json` scripts if needed.
   - **Expected outcome:** Automated tests assert both rendering branches and pass in CI/local.

5. **Document operational usage**
   - **Goal:** Make it clear how environments should supply deploy metadata.
   - **Files/components:** `README.md` (or `docs/` note if preferred).
   - **Expected outcome:** Maintainers can configure deployments without inspecting source code.

## Test Plan

### Unit
- Test date formatting helper behavior:
  - Valid ISO timestamp renders expected UTC-readable text.
  - Empty/undefined env value returns fallback state.
  - Invalid timestamp string returns fallback state.
- If helper is internal to component, validate via rendered text assertions.

### Integration/E2E
- Component-level render test for `App` with injected env conditions (mocked/stubbed):
  - Metadata present → footer includes `Last deployed:` + formatted value.
  - Metadata absent → footer includes `Deploy time unavailable`.
- Optional browser smoke check (`npm run dev`) for visual layout at desktop/mobile breakpoints.

### Regression checklist
- Existing counter and content still render.
- No layout overlap with `#next-steps`/`#spacer` sections.
- `npm run lint` passes.
- `npm run build` passes.
- If tests added: `npm test` (or `npm run test`) passes.

### Edge/failure cases
- Non-ISO timestamp values (e.g., `abc`, numeric garbage).
- Future timestamps (display allowed but should still parse deterministically).
- Extremely old timestamps.
- Empty string vs undefined env values.
- Missing env variable in local dev.

## Validation and Rollout

### Local/staging verification
- Verify footer text in local dev with and without `VITE_LAST_DEPLOYED_AT`.
- Verify production build output still succeeds without env var.
- If staging exists, deploy once with metadata and once without to confirm both UI states.

### Logs/metrics/alerts
- No dedicated telemetry required for this small UI change.
- Rely on existing CI checks (lint/build/quality scans) and manual QA observation.
- Optional: console warnings should be avoided to keep noise low; fallback should be silent.

### Rollout and rollback strategy
- Rollout via standard PR merge to `main`.
- If formatting or UX is incorrect, rollback by reverting the feature commit(s).
- Since change is display-only and read-only, rollback risk is low and immediate.

## Delivery Plan

### Small commit sequence
1. **docs(plan)**: add approved plan file on issue branch (this commit).
2. **feat(ui)**: add footer + deploy timestamp rendering/fallback.
3. **test(ui)**: add/enable tests for available/unavailable cases.
4. **docs**: update README with env var contract and behavior.

### PR checklist
- [ ] References issue #13 (`Closes #13` in implementation PR).
- [ ] Footer shows `Last deployed: ...` when metadata exists.
- [ ] Fallback shown when metadata unavailable/invalid.
- [ ] No secrets exposed; only public-safe `VITE_*` values used.
- [ ] Lint/build/tests green.
- [ ] Screenshots or short verification notes added to PR description.

### Definition of Done
- Feature behavior matches acceptance criteria in issue #13.
- Plan assumptions/questions are addressed or explicitly accepted by maintainer.
- Implementation PR merged with passing checks.
- Human reviewer confirms label progression and closes issue lifecycle.
