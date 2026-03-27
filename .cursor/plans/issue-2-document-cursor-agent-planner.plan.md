## Issue Understanding

- **Problem summary**
  - Issue #2 ("Document Cursor Agent Planner") asks for documentation that explains how the Cursor **AgentPlan** flow plans a fix for a newly created ticket.
  - Existing documentation already describes parts of this lifecycle, but information is distributed across multiple files and may not be explicit enough for a "new ticket -> planning handoff" walkthrough.
- **Current vs expected behavior**
  - **Current:** Planning behavior is documented in several places (`docs/cursor-automations.md`, `docs/agent-dev-lifecycle.md`, `docs/labels.md`, and plan prompt files), but there is no clearly consolidated, issue-focused narrative specifically framed as "newly created ticket planning flow."
  - **Expected:** A clear, discoverable documentation path that explains when planning starts, what labels/triggers are required, what AgentPlan does, and what artifacts/handoffs are produced.
- **Assumptions**
  - This issue is **documentation-only** (no application/runtime code change).
  - The intended planner is the existing **AgentPlan** automation triggered through `router.yml`.
  - "Newly created ticket" means a GitHub issue entering planning via `status:ready` (on `opened` if already labeled or later via `labeled` event).
  - No issue comments are currently present; issue context is title/body/label only.

### Clarifying questions

1. Should this be solved by adding a **new dedicated doc page**, or by expanding existing pages (primarily `docs/cursor-automations.md`)?
2. Is the target audience mainly repository maintainers (automation setup) or contributors/users (how to request planning)?
3. Should examples include both router-triggered flow and manual `workflow_dispatch` replay, or only the standard label-driven path?

### Confidence

- **Medium-high**: repository already contains most source material; task appears to be improving structure/clarity rather than inventing new behavior.

---

## Scope and Impact

- **In scope**
  - Document AgentPlan behavior for newly created issues.
  - Clarify trigger semantics (`status:ready`, `issues.opened`, `issues.labeled`, and replay path).
  - Clarify expected outputs from AgentPlan (plan file under `.cursor/plans/`, label changes, human handoff).
  - Improve cross-links so users can follow one canonical path.
- **Out of scope**
  - Changing router logic or webhook execution behavior in `.github/workflows/router.yml`.
  - Changing AgentDev/AgentReview/AgentTest functionality.
  - Application/frontend code under `src/`.
  - Infrastructure or deployment behavior.

### Likely affected modules/files

- `docs/cursor-automations.md` (primary lifecycle and architecture explanation)
- `docs/agent-dev-lifecycle.md` (algorithm simplification / clarity)
- `docs/labels.md` (trigger labels and meaning consistency)
- `docs/agent/prompt/agent-plan-prompt.md` (planner instructions text consistency)
- `docs/agent/automation/agent-plan.automation.json` (embedded plan prompt parity, if wording changes)
- `README.md` (optional pointer to planning lifecycle docs for discoverability)

### Risks

- **Compatibility:** Low (docs-only), but inaccurate docs can cause operational misuse.
- **Performance:** None expected.
- **Security:** Low direct risk; moderate indirect risk if docs under-specify safe token/permission handling.
- **Migrations/data changes:** None.
- **Process regression risk:** If label semantics are documented inconsistently, router could be triggered incorrectly by humans.

---

## Implementation Plan (no code)

1. **Goal:** Baseline current documentation and identify contradictions/gaps for AgentPlan onboarding.
   - **Files/components:** `docs/cursor-automations.md`, `docs/agent-dev-lifecycle.md`, `docs/labels.md`, `.github/workflows/router.yml`, `docs/agent/prompt/agent-plan-prompt.md`, `docs/agent/automation/agent-plan.automation.json`
   - **Expected outcome:** A short gap list: missing "newly created ticket" narrative, unclear entrypoint, or inconsistent trigger language.

2. **Goal:** Establish one canonical documentation entrypoint for "new issue -> planning."
   - **Files/components:** `docs/cursor-automations.md` (new/expanded subsection), optional `README.md` link
   - **Expected outcome:** Readers can find a single section that explains prerequisites, trigger, payload, and handoff artifacts end-to-end.

3. **Goal:** Tighten lifecycle wording for planner start conditions and handoff.
   - **Files/components:** `docs/agent-dev-lifecycle.md`, `docs/labels.md`
   - **Expected outcome:** Explicit and consistent statement that `status:ready` starts AgentPlan, and post-plan labels/handoff expectations are unambiguous.

4. **Goal:** Keep planner prompt/config documentation aligned.
   - **Files/components:** `docs/agent/prompt/agent-plan-prompt.md`, `docs/agent/automation/agent-plan.automation.json`
   - **Expected outcome:** Prompt text mirrors documented behavior and avoids drift between docs and automation config.

5. **Goal:** Add practical examples that reduce operator confusion.
   - **Files/components:** `docs/cursor-automations.md` (example flow), optionally `docs/agent-dev-lifecycle.md`
   - **Expected outcome:** Concrete examples for label-driven trigger and replay path (`workflow_dispatch`) with expected outputs.

6. **Goal:** Editorial and link integrity pass.
   - **Files/components:** all touched docs
   - **Expected outcome:** Consistent terminology ("issue", "ticket", "status:ready"), valid relative links, no contradictory instructions.

---

## Test Plan

- **Unit**
  - If configured: run markdown lint/link checks.
  - Manual check each changed file for heading structure, formatting, and terminology consistency.

- **Integration/E2E**
  - Validate documentation against actual router behavior in `.github/workflows/router.yml`:
    - `issues.opened` with `status:ready` present
    - `issues.labeled` with `status:ready`
    - `workflow_dispatch` replay with `issue_number`
  - Verify documented AgentPlan outputs align with lifecycle docs (`plan file`, handoff labels, human validation state).

- **Regression checklist**
  - Existing docs for AgentDev/AgentReview/AgentTest remain accurate and not contradicted.
  - Label registry remains canonical and unchanged in meaning.
  - Cross-file links still resolve.

- **Edge/failure cases**
  - Issue created without `status:ready` (planner should not auto-run).
  - Missing webhook secrets in `router.yml` execution path.
  - Issue not present on Project board or insufficient project permissions for status updates.
  - Duplicate trigger prevention after `status:ready` removal post-planning.

---

## Validation and Rollout

- **Local/staging verification**
  - Render markdown locally and inspect relative links.
  - Dry-run documentation walkthrough against a sample issue to ensure steps are executable.

- **Logs/metrics/alerts**
  - Use GitHub Actions logs (`Agent Router`) as source of truth for trigger correctness.
  - Check issue timeline artifacts manually (labels/comments/plan file reference) during process verification.

- **Rollout and rollback strategy**
  - Roll out as incremental docs commits, starting with canonical entrypoint updates.
  - If confusion/regression is reported, revert specific docs commit(s) and restore prior wording while preparing corrected follow-up.

---

## Delivery Plan

- **Small commit sequence**
  1. Add/expand canonical AgentPlan "new ticket" documentation and cross-links.
  2. Align lifecycle + label docs with the canonical explanation.
  3. Sync prompt/config wording and perform doc polish/link fixes.

- **PR checklist**
  - PR clearly references Issue #2.
  - Updated docs explain trigger, payload, outputs, and handoff.
  - No changes outside agreed docs scope.
  - Link and formatting checks pass.
  - Unknowns and assumptions are explicitly documented.

- **Definition of Done**
  - A reader can answer, from docs alone: *how a newly created issue enters AgentPlan, what runs, and what happens next*.
  - Documentation is consistent across lifecycle, labels, router behavior, and planner prompt text.
  - Plan is reviewed/approved by human stakeholders before implementation changes begin.
