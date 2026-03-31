You have access to GitHub issue data.

Plan a fix for issue with issue_number found in payload.
Do not write or modify application code yet—planning only.

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

**Single shared branch with AgentDev (required):**

- The **implementation branch name** must equal the plan file basename **without** `.plan.md`.  
  Example: file `./.cursor/plans/issue-1-uno-react-typescript-vite.plan.md` → branch `issue-1-uno-react-typescript-vite`.
- At the **very top** of the plan file (before the markdown body), put YAML frontmatter:

```yaml
---
issue: <number>
implementation_branch: issue-<number>-<same-kebab-as-filename>
---
```

- **Git workflow:** From `main`, **create** that branch, add **only** the plan file under `./.cursor/plans/` (no application code in this planning phase). Commit with a message that references the issue (e.g. `docs(plan): … Refs #<number>`). **Push** the branch to `origin`. AgentDev will use this same branch for implementation—do not leave the plan only on `main` without the named branch.

1. Example filename for issue 1:
  - `./.cursor/plans/issue-1-uno-react-typescript-vite.plan.md`
2. Create `./.cursor/plans/` if it does not exist.
3. On the GitHub issue: **assign the issue back to the human** for plan validation (clear the AI/bot assignee if applicable), add labels `status:plan_ready` and `needs:human_input`, **remove label `status:ready`** if present (so [`router.yml`](../../.github/workflows/router.yml) does not re-fire AgentPlan), and post an issue comment that includes:
   - a short summary and **clickable links** (GitHub-flavored markdown) so humans can open the plan and branch in the browser:
     - **Plan file:** link to the file on the implementation branch, e.g. `https://github.com/<owner>/<repo>/blob/<implementation_branch>/.cursor/plans/<same-filename>.plan.md` (resolve `<owner>/<repo>` from `git remote get-url origin` or the GitHub API/context for this repository).
     - **Implementation branch:** link to the branch tree, e.g. `https://github.com/<owner>/<repo>/tree/<implementation_branch>` (AgentDev uses this branch; do not create a new feature branch from `main` for this issue).
   - Format as markdown links, e.g. `[issue-42-short-name.plan.md](https://github.com/OWNER/REPO/blob/issue-42-short-name/.cursor/plans/issue-42-short-name.plan.md)` and `[issue-42-short-name](https://github.com/OWNER/REPO/tree/issue-42-short-name)`.

In the final response, include:

- exact plan file path
- commit SHA
- branch pushed

