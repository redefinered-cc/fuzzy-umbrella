You have access to GitHub issue data. The payload includes `issue_number` (use the **numeric** id everywhere below, e.g. `42` not `#42` in filenames).

Implement the approved plan for that issue. Do **not** merge the pull request—a human merges after review and test planning.

1. Fetch the issue. Confirm it has `status:plan_approved` and that the human has applied **`status:in_progress`** (that label triggers this run). Read linked context and comments. Note the **issue title** for the PR.
2. Find the plan file under `./.cursor/plans/` matching `issue-<issue_number>-*.plan.md`. Read it fully; treat it as the source of truth for scope. Read **`implementation_branch`** from the YAML frontmatter at the top of that file. If missing, derive the branch name from the plan filename: basename of the file **without** `.plan.md` (e.g. `issue-42-foo-bar.plan.md` → `issue-42-foo-bar`). Optionally confirm against an issue comment line starting with **Implementation branch:**.
3. **Do not create a new branch from `main`.** Run `git fetch origin` and **check out** the existing `implementation_branch` (e.g. `git checkout -B <branch> origin/<branch>` or `git switch <branch>` after fetch so you track `origin/<branch>`). This is the same branch AgentPlan created for the plan commit; all implementation work continues here. If the branch does not exist on the remote, stop and post an issue comment asking a human to restore it or re-run AgentPlan.
4. Implement the plan: edit application code and config as needed. Follow repository conventions. Do not disable or weaken CI, Sonar, or Snyk checks.
5. Run the same checks locally if available (`npm run lint`, `npm run build`, etc.) and fix straightforward failures.
6. **Commit** on the **same** implementation branch with clear messages. **Every commit must link to the issue** so GitHub shows each commit on the issue timeline:
   - Include **`Refs #<issue_number>`** in the commit message (recommended: on the **second line** of the message, or in the **subject** after the summary, e.g. `feat: add auth form\n\nRefs #<issue_number>`).
   - Alternatively include **`(#<issue_number>)`** at the end of the first line if your team prefers a short subject-only style.
   - Use **`Refs`** in commits (not `Closes`/`Fixes`) so the single canonical close happens via the **PR body** when the PR merges; individual commits still **link** to the issue via `#<issue_number>`.
   - If you make multiple commits, **each** must reference the issue the same way.
7. Push `implementation_branch` to `origin`.
8. Open a **pull request** from `implementation_branch` into `main` using `.github/pull_request_template.md`. If you use **Cursor’s “Open Pull Request” (GitHub) tool**, GitHub MCP, or the API, set the PR **head branch** explicitly to **`implementation_branch`** (the name from the plan file and `git push`). Do **not** rely on the **current checkout** if it is a Cursor automation branch (names like `cursor/issue-plan-development-…` are often **not** on `origin` and cause “branch not pushed” errors even when the real branch exists). Prefer **`gh pr create`** with `--head <implementation_branch>` if a GUI tool keeps picking the wrong branch. **You must link the PR to the issue** in all of the following ways:
   - **PR title:** Include the issue reference, e.g. `Short summary (#<issue_number>)` or `[#<issue_number>] Short summary`, so the work is traceable to the ticket.
   - **PR body:** Include a dedicated line with a [GitHub closing keyword](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue) and the issue number, on its own line or under a `## Related issue` heading, e.g. **`Closes #<issue_number>`** (preferred so the issue closes when the PR merges). If auto-close is wrong for this ticket, use **`Refs #<issue_number>`** and say why.
   - **PR body:** Repeat the link in plain text at least once, e.g. `Addresses #<issue_number> — <copy issue title here>`, so the connection is obvious in the description.
   - **After the PR exists:** **Comment on the GitHub issue** with the PR number and full URL, e.g. `Implementation PR: #<pr_number> — https://github.com/<owner>/<repo>/pull/<pr_number>`. This appears in the issue timeline and cements the link for humans and automations.
9. On the **PR**: add label `agent:review` so the review automation can run. Do **not** merge.
10. On the **issue**: update labels toward implementation (e.g. `status:implementing` / `status:pr_open` per team convention) and leave assignee/comment as appropriate.

In the final response, include:

- Issue number and PR number
- Confirmation that **`Closes #<issue_number>`** (or `Refs #…`) appears in the **PR body** on GitHub, and that **commits** include **`Refs #<issue_number>`** (or `(#<issue_number>)`) so they appear on the issue
- Branch name
- PR URL
- Summary of files changed
