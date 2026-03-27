## Cursor Agent Planner Runbook

This document describes how the planning automation works for GitHub issues in this repository.
It is intended for maintainers and contributors operating Cursor Automations.

### What the planner does

The planner automation receives an issue number and produces a scoped implementation plan as a markdown artifact under `.cursor/plans/`.
That plan is then reviewed and approved by a human before implementation starts.

### Trigger paths

The planner webhook is routed by [`.github/workflows/router.yml`](../.github/workflows/router.yml), job `agent-plan`.

Supported trigger paths:

1. **Issue label trigger (normal path)**
   - GitHub event: `issues`
   - Event actions: `opened` or `labeled`
   - Required label: `status:ready`
2. **Manual replay trigger**
   - GitHub event: `workflow_dispatch`
   - Required input: `issue_number` (string)

`router.yml` computes `ISSUE_NUMBER` from either `github.event.inputs.issue_number` (manual replay) or `github.event.issue.number` (issues event).

### Required secrets

The planner route in `router.yml` supports both dedicated and fallback secret names:

- Preferred:
  - `AGENT_WEBHOOK_URL_PLAN`
  - `AGENT_WEBHOOK_TOKEN_PLAN`
- Backward-compatible fallback:
  - `AGENT_WEBHOOK_URL`
  - `AGENT_WEBHOOK_TOKEN`

At runtime, the workflow uses:

- `WEBHOOK_URL="${AGENT_WEBHOOK_URL_PLAN:-$AGENT_WEBHOOK_URL}"`
- `WEBHOOK_TOKEN="${AGENT_WEBHOOK_TOKEN_PLAN:-$AGENT_WEBHOOK_TOKEN}"`

If the resolved URL or token is empty, the job fails with an explicit `::error::` message.

### Payload contract

The planner payload is built in `router.yml` with `jq`:

```json
{"issue_number":"<num>"}
```

Notes:

- The value is sent as a string.
- The request uses `Content-Type: text/plain`.
- The webhook call includes `Authorization: Bearer <token>`.

### Expected planner outputs

For an issue `N`, the planning automation is expected to:

1. Read issue context and labels.
2. Create a plan file at:
   - `.cursor/plans/issue-<N>-<short-kebab-summary>.plan.md`
3. Include implementation scope, risks, and test approach in the plan.
4. Push the plan commit and comment on the issue with plan details.

### Verification checklist

Use this checklist when validating planner behavior:

1. Confirm `status:ready` was applied to the issue (or a manual dispatch was run).
2. Confirm `router.yml` run selected the `agent-plan` job.
3. Confirm no missing-secret errors are present in workflow logs.
4. Confirm webhook call returned success (no `curl -fsS` failure).
5. Confirm a plan file appears under `.cursor/plans/` with the expected naming pattern.

### Troubleshooting

#### Missing webhook URL

Symptom in Actions logs:

- `Set AGENT_WEBHOOK_URL_PLAN or AGENT_WEBHOOK_URL (Actions secrets).`

Fix:

- Add `AGENT_WEBHOOK_URL_PLAN` in repository Actions secrets, or provide fallback `AGENT_WEBHOOK_URL`.

#### Missing webhook token

Symptom in Actions logs:

- `Set AGENT_WEBHOOK_TOKEN_PLAN or AGENT_WEBHOOK_TOKEN (Actions secrets).`

Fix:

- Add `AGENT_WEBHOOK_TOKEN_PLAN` in repository Actions secrets, or provide fallback `AGENT_WEBHOOK_TOKEN`.

#### Invalid issue number input on manual dispatch

Symptom:

- Planner receives an invalid issue reference, or fails to resolve issue context.

Fix:

- Re-run `workflow_dispatch` with a valid numeric issue id in `issue_number`.
- Ensure it is provided as a string input and represents a real issue in this repository.

#### Webhook endpoint unavailable

Symptom:

- `curl -fsS` fails in `agent-plan` with non-2xx/connection error.

Fix:

- Verify webhook URL correctness.
- Verify network reachability and endpoint health.
- Re-run after endpoint recovery.

### Maintenance notes

Keep this runbook synchronized with:

- `.github/workflows/router.yml` trigger rules, payload fields, and secret names.
- `docs/cursor-automations.md` lifecycle behavior and status conventions.
- Any automation prompt changes that alter plan artifact expectations.
