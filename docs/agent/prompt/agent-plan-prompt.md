You have access to GitHub issue data.

Plan a fix for issue with issue_number found in payload.
Do not write or modify application code yet—planning only.

## GitHub Project — Status field

Use the GraphQL API (`updateProjectV2ItemFieldValue`) so the issue’s row on the team Project matches the board: set **In progress** when you start planning; after the plan is committed and handed off for human review, set **Ready**. Resolve `projectId`, the Project v2 **item** id for this issue, the **Status** `fieldId`, and each option’s `singleSelectOptionId` via GraphQL queries or team-provided ids (see [`docs/cursor-automations.md`](../../cursor-automations.md) §9). If the issue is not on the project yet, add it per team policy or skip Project updates only when impossible.

1. Fetch and read the issue details (title, body, labels, comments, links).
2. Inspect relevant repository areas to identify likely impacted components.
3. If anything is unclear, proceed with explicit assumptions and list clarifying questions separately.

Return:

## Issue Understanding

- Problem summary
- Current vs expected behavior
- Assumptions

## Scope and Impact

- In scope / out of scope
- Likely affected modules/files
- Risks (compatibility, performance, security, migrations)

## Implementation Plan (no code)

For each step: goal, files/components, expected outcome.

## Test Plan

- Unit
- Integration/E2E
- Regression checklist
- Edge/failure cases

## Validation and Rollout

- Local/staging verification
- Logs/metrics/alerts
- Rollout and rollback strategy

## Delivery Plan

- Small commit sequence
- PR checklist
- Definition of Done

Use markdown, be concrete, and call out unknowns/confidence.

Additional required output/actions:
4) Create a plan file containing the full plan output.
5) Save it under: `./.cursor/plans/`
6) Use this required filename format:

- `issue-<number>-<short-kebab-summary>.plan.md`
- lowercase only
- kebab-case only (`-` separators)
- keep summary concise (3–6 words)
- no spaces or special characters

1. Example filename for issue 1:
  - `./.cursor/plans/issue-1-uno-react-typescript-vite.plan.md`
2. Create `./.cursor/plans/` if it does not exist.
3. Commit the plan file to the current branch with a descriptive commit message.
4. Push the commit to the remote repository.
5. On the GitHub issue: **assign the issue back to the human** for plan validation (clear the AI/bot assignee if applicable), add labels `status:plan_ready` and `needs:human_input`, remove mirror label `status:ready` if present (so label-based router does not re-fire), and post an issue comment with a short summary and a pointer to the plan file path. Ensure Project **Status** is **Ready** per the section above.

In the final response, include:

- exact plan file path
- commit SHA
- branch pushed
