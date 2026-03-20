# Plan for Issue #2: Document Cursor Agent Planner

Issue URL: https://github.com/redefinered-cc/fuzzy-umbrella/issues/2  
Confidence: **Medium** (clear intent, but acceptance criteria details are not explicitly defined in the issue body)

## Issue Understanding
- **Problem summary**
  - Issue #2 requests documentation describing the Cursor automation agent that plans fixes for newly created tickets.
  - The repository already contains an automation trigger workflow (`.github/workflows/trigger-automation-agent.yml`) but lacks accompanying operator/developer-facing documentation.
- **Current vs expected behavior**
  - **Current:** A GitHub Issues `opened` event (or manual dispatch) triggers a webhook with `issue_number`, but project contributors have no in-repo guide explaining the planner flow, prerequisites, payload contract, or expected outputs.
  - **Expected:** Clear, maintained documentation explains:
    - what triggers the planner automation,
    - required secrets and permissions,
    - payload format and issue-number propagation,
    - expected deliverables from the planning agent,
    - usage/troubleshooting guidance.
- **Assumptions**
  - Documentation should be committed in the repository (likely `README.md` and/or a dedicated docs markdown file).
  - No functional workflow changes are required for this issue unless gaps are discovered while documenting.
  - Audience includes maintainers and contributors who need to understand or operate the planner automation.

### Clarifying Questions (tracked separately from assumptions)
1. Should documentation live only in `README.md`, or in a dedicated file (for example `docs/cursor-agent-planner.md`) with README links?
2. Is there a preferred depth: quick setup guide vs full operational runbook (including failure modes and governance)?
3. Should the documentation include sample plan-file naming conventions and commit expectations for automation outputs?
4. Is the planner expected to run only on issue creation, or also on issue edits/reopens in future scope?

## Scope and Impact
- **In scope**
  - Add/expand documentation for the Cursor planner workflow and issue-driven planning behavior.
  - Document trigger path from GitHub Issue to webhook payload (`issue_number`) to automation agent.
  - Document required configuration inputs (secrets, dispatch input, expected repository branch behavior).
  - Provide troubleshooting/verification steps for maintainers.
- **Out of scope**
  - Modifying runtime application logic in `src/`.
  - Refactoring CI/CD behavior unrelated to planner docs.
  - Changing automation webhook backend implementation.
- **Likely affected modules/files**
  - `.github/workflows/trigger-automation-agent.yml` (as source-of-truth for documented behavior; maybe comments only if needed).
  - `README.md` (high-level summary and links).
  - Potential new doc file (proposed): `docs/cursor-agent-planner.md` (detailed runbook) or similar path agreed by maintainers.
- **Risks**
  - **Compatibility:** Low (docs-only change expected).
  - **Performance:** None for app/runtime; minimal repo size increase.
  - **Security:** Medium if secrets handling is documented incorrectly (must avoid exposing values; only names and setup path).
  - **Migrations:** None expected.

## Implementation Plan (no code)
1. **Goal:** Define documentation structure and source-of-truth references.
   - **Files/components:** `README.md`, `.github/workflows/trigger-automation-agent.yml`.
   - **Expected outcome:** Agreed doc placement and section map aligned to actual workflow behavior.

2. **Goal:** Draft high-level README entry for discoverability.
   - **Files/components:** `README.md`.
   - **Expected outcome:** A concise section explains what the Cursor planner does, when it runs, and where detailed docs live.

3. **Goal:** Create detailed planner runbook.
   - **Files/components:** new markdown doc (for example `docs/cursor-agent-planner.md`).
   - **Expected outcome:** Step-by-step guide covering:
     - Trigger events (`issues.opened`, `workflow_dispatch`),
     - Required secrets (`AGENT_WEBHOOK_URL`, `AGENT_WEBHOOK_TOKEN`),
     - Payload format (`{"issue_number":"<num>"}`),
     - Expected planner outputs and artifacts,
     - Common failure diagnostics and remediation checklist.

4. **Goal:** Validate docs against live workflow file semantics.
   - **Files/components:** `.github/workflows/trigger-automation-agent.yml`, docs file(s).
   - **Expected outcome:** No mismatch between docs and actual workflow fields/env vars/dispatch input names.

5. **Goal:** Add maintenance notes for future updates.
   - **Files/components:** detailed doc footer or maintenance subsection.
   - **Expected outcome:** Clear ownership/update guidance when workflow events, payload schema, or secret names change.

## Test Plan
- **Unit**
  - N/A for docs-only scope.
  - Optional linting: markdown/style checks if configured in repo.
- **Integration/E2E**
  - Manually verify docs match workflow by cross-checking:
    - trigger types,
    - input name `issue_number`,
    - secret names,
    - payload construction and POST headers.
  - Optional dry-run via `workflow_dispatch` in GitHub UI to ensure documented steps remain valid.
- **Regression checklist**
  - README links resolve to valid local file paths.
  - All documented secret names exactly match workflow.
  - No documentation exposes secret values or private endpoints.
  - Documentation reflects both automatic and manual trigger paths.
- **Edge/failure cases**
  - Missing webhook URL secret.
  - Missing webhook token secret.
  - Invalid/non-numeric issue number string in dispatch input.
  - Webhook endpoint unavailable or non-2xx response.

## Validation and Rollout
- **Local/staging verification**
  - Validate markdown rendering locally (preview) and link integrity.
  - Confirm docs are accurate against current committed workflow YAML.
- **Logs/metrics/alerts**
  - Use GitHub Actions run logs to verify documented failure messages and troubleshooting steps are correct.
  - Confirm maintainers know where to inspect webhook call status in workflow logs.
- **Rollout and rollback strategy**
  - Rollout: merge docs update on main branch with changelog/README mention.
  - Rollback: revert documentation commit if inaccuracies are found; no runtime rollback required since behavior is unchanged.

## Delivery Plan
- **Small commit sequence**
  1. Add high-level README section linking to planner documentation.
  2. Add detailed planner runbook markdown file.
  3. (Optional) Minor workflow comments/clarifications only if required for doc consistency.
- **PR checklist**
  - Documentation clearly answers who/what/when/how for planner automation.
  - All links valid; markdown formatting clean.
  - Security review: no secrets/URLs exposed beyond placeholder names.
  - Reviewer confirms docs align with `.github/workflows/trigger-automation-agent.yml`.
- **Definition of Done**
  - Issue requirements are represented in repository documentation.
  - New contributor can follow docs to understand trigger flow and required setup.
  - Documentation includes troubleshooting for the two required secrets and webhook call path.
  - Reviewer sign-off that docs are accurate and actionable.

