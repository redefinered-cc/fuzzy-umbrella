You have access to GitHub issue data. The payload includes `issue_number` (use the **numeric** id everywhere below, e.g. `42` not `#42` in filenames).

Implement the approved plan for that issue. Do **not** merge the pull request—a human merges after review and test planning.

## GitHub Project — Status field

Use GraphQL `updateProjectV2ItemFieldValue` on the linked Project item: set **In progress** when you start implementation. When the PR exists and is linked to the issue (`Closes`/`Refs` in the PR body and an issue comment with the PR URL), set **In review**. Resolve ids per `[docs/cursor-automations.md](../../cursor-automations.md)` §9.

1. Fetch the issue. Confirm it has `status:plan_approved` and that the human has applied `**status:in_progress`** (that label triggers this run). Read linked context and comments. Note the **issue title** for the PR.
2. Find the plan file under `./.cursor/plans/` matching `issue-<issue_number>-*.plan.md`. Read it fully; treat it as the source of truth for scope.
3. Create a feature branch from `main`, name like `issue-<number>-<short-kebab-summary>` (lowercase kebab-case).
4. Implement the plan: edit application code and config as needed. Follow repository conventions. Do not disable or weaken CI, Sonar, or Snyk checks.
5. Run the same checks locally if available (`npm run lint`, `npm run build`, etc.) and fix straightforward failures.
6. **Commit** with clear messages. **Every commit must link to the issue** so GitHub shows each commit on the issue timeline:
  - Include `**Refs #<issue_number>`** in the commit message (recommended: on the **second line** of the message, or in the **subject** after the summary, e.g. `feat: add auth form\n\nRefs #<issue_number>`).
  - Alternatively include `**(#<issue_number>)`** at the end of the first line if your team prefers a short subject-only style.
  - Use `**Refs**` in commits (not `Closes`/`Fixes`) so the single canonical close happens via the **PR body** when the PR merges; individual commits still **link** to the issue via `#<issue_number>`.
  - If you make multiple commits, **each** must reference the issue the same way.
7. Push the branch to `origin`.
8. Open a **pull request** into `main` using `.github/pull_request_template.md`. **You must link the PR to the issue** in all of the following ways:
  - **PR title:** Include the issue reference, e.g. `Short summary (#<issue_number>)` or `[#<issue_number>] Short summary`, so the work is traceable to the ticket.
  - **PR body:** Include a dedicated line with a [GitHub closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) and the issue number, on its own line or under a `## Related issue` heading, e.g. `**Closes #<issue_number>`** (preferred so the issue closes when the PR merges). If auto-close is wrong for this ticket, use `**Refs #<issue_number>**` and say why.
  - **PR body:** Repeat the link in plain text at least once, e.g. `Addresses #<issue_number> — <copy issue title here>`, so the connection is obvious in the description.
  - **After the PR exists:** **Comment on the GitHub issue** with the PR number and full URL, e.g. `Implementation PR: #<pr_number> — https://github.com/<owner>/<repo>/pull/<pr_number>`. This appears in the issue timeline and cements the link for humans and automations.
9. On the **PR**: add label `agent:review` so the review automation can run. Do **not** merge.
10. On the **issue**: update labels toward implementation (e.g. `status:implementing` / `status:pr_open` per team convention) and leave assignee/comment as appropriate. Confirm Project **Status** is **In review** once the PR is linked.

In the final response, include:

- Issue number and PR number
- Confirmation that `**Closes #<issue_number>`** (or `Refs #…`) appears in the **PR body** on GitHub, and that **commits** include `**Refs #<issue_number>`** (or `(#<issue_number>)`) so they appear on the issue
- Branch name
- PR URL
- Summary of files changed

