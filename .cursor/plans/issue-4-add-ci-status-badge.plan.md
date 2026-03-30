---
issue: 4
implementation_branch: issue-4-add-ci-status-badge
---

## Issue Understanding

### Problem summary

Issue #4 requests adding a GitHub Actions CI status badge to the root `README.md` so repository health is visible without opening the Actions tab.

### Current vs expected behavior

- **Current:** `README.md` has no CI badge and does not expose latest CI state for `main`.
- **Expected:** `README.md` includes a badge for the primary CI workflow that reflects `main` branch status and links to either workflow runs or workflow definition (explicitly documented in the PR/README).

### Assumptions

1. The primary CI workflow is `.github/workflows/ci.yml` with workflow name `CI`.
2. The default branch is `main` (confirmed by workflow triggers and issue text).
3. Badge target should be public GitHub URLs only (no secrets/tokens).
4. This is docs-only scope; no workflow logic changes are required.

### Clarifying questions

1. Does the team prefer linking the badge to the workflow **runs** page or the workflow **file** page?
2. Should the README include only one CI badge now, or reserve layout for future quality/security badges?

### Unknowns and confidence

- **Unknown:** Team preference for badge link target.
- **Confidence:** **High** for technical implementation scope; **medium** for final badge placement/style preference.

## Scope and Impact

### In scope

- Add CI status badge markdown to root `README.md`.
- Use standard GitHub badge URL pattern with workflow file and `branch=main`.
- Ensure badge link target is clear in the change description (and inline text if helpful).

### Out of scope

- Editing CI workflow jobs/triggers/names.
- Adding non-CI badges (Sonar/Snyk/deploy).
- Changes outside README unless strictly needed for a one-line explanation.

### Likely affected modules/files

- `README.md` (primary and likely only file change).
- Reference input only: `.github/workflows/ci.yml` (to confirm workflow file and display name).

### Risks

- **Compatibility:** Low (Markdown-only change).
- **Performance:** None (static documentation).
- **Security:** Low, provided only public GitHub URLs are used.
- **Migrations/data:** None.
- **Operational risk:** Badge may display `unknown`/broken if workflow file path or branch query is incorrect.

## Implementation Plan (no code)

### Step 1 — Confirm canonical badge inputs

- **Goal:** Lock the exact workflow file path, name, and branch used by the badge URL.
- **Files/components:** `.github/workflows/ci.yml`, repository default branch metadata.
- **Expected outcome:** A finalized badge URL and link URL template aligned with the existing CI workflow.

### Step 2 — Decide badge placement and link target

- **Goal:** Choose a visible, maintainable location in `README.md` and explicit link behavior.
- **Files/components:** `README.md`.
- **Expected outcome:** Placement decision documented (top section preferred) and link target agreed (runs page or workflow definition).

### Step 3 — Add CI badge markdown in README

- **Goal:** Insert badge markdown using standard GitHub Actions badge syntax.
- **Files/components:** `README.md`.
- **Expected outcome:** README displays CI status for `main`; clicking badge opens chosen destination.

### Step 4 — Verify rendering and URL correctness

- **Goal:** Ensure markdown renders cleanly and badge resolves.
- **Files/components:** Rendered README in GitHub UI and markdown preview.
- **Expected outcome:** Badge image loads, link works, and no broken markdown formatting appears.

### Step 5 — Prepare PR with issue linkage

- **Goal:** Document that change is docs-only and link PR to issue.
- **Files/components:** PR title/body.
- **Expected outcome:** PR includes `Closes #4`, confirms link target choice, and states no CI behavior change.

## Test Plan

### Unit

- Not applicable (no code logic change).

### Integration / E2E

- Open repository README in GitHub web UI:
  - Badge image loads successfully.
  - Badge state reflects current CI status.
  - Badge link opens intended destination (runs or workflow file).

### Regression checklist

- README structure and headings remain intact.
- Existing markdown links still work.
- No accidental edits to CI workflow files.
- Badge branch parameter is `main` (or confirmed default branch if changed).

### Edge/failure cases

- Workflow rename/path change causes badge to break.
- Default branch renaming causes stale `branch` query value.
- Private repo visibility could affect external badge rendering behavior.

## Validation and Rollout

### Local/staging verification

- Preview `README.md` markdown locally and in GitHub diff view.
- After PR open, verify badge rendering in PR file view.

### Logs/metrics/alerts

- No runtime telemetry expected (docs-only).
- Optional manual check: open Actions page to ensure badge status aligns with latest CI run.

### Rollout and rollback strategy

- **Rollout:** Merge docs-only PR to `main`.
- **Rollback:** Revert the single README commit if badge URL/link is incorrect.

## Delivery Plan

### Small commit sequence

1. `docs(readme): add CI status badge for main`
2. (Optional follow-up) `docs(readme): adjust badge placement/text` if review requests formatting changes.

### PR checklist

- [ ] `Closes #4` in PR body.
- [ ] Badge URL points to `.github/workflows/ci.yml` with `branch=main`.
- [ ] Badge link target choice documented.
- [ ] README rendering validated in GitHub UI.
- [ ] Confirm no workflow behavior or dependency changes.

### Definition of Done

- CI badge is visible in root README and reflects primary CI workflow status on `main`.
- Badge link destination is correct and intentional.
- Issue #4 is linked from PR and acceptance criteria are satisfied.
