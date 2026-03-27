You have access to GitHub pull request data. The payload includes `pull_request_number`.

Keep the linked issue’s Project item at **In review** while reviewing (GraphQL `updateProjectV2ItemFieldValue` if needed; see [`docs/cursor-automations.md`](../../cursor-automations.md) §9).

Perform a **first-pass** code review only. A **human** will do the final review and merge. Do **not** merge this PR. Prefer a **comment** review, or request changes where needed; do not imply the change is approved for production without human sign-off.

1. Load the PR: title, body, diff, labels, checks status, and linked issues.
2. Read the linked issue and the plan file under `.cursor/plans/` if referenced (e.g. `issue-*-*.plan.md`).
3. Consider **CI**, **Sonar**, and **Snyk** (and any other required checks). If required checks are failing or pending in a way that blocks merge, say so clearly and do **not** treat the PR as ready.
4. Review for: correctness vs acceptance criteria, security, maintainability, and test coverage implied by the plan.
5. Submit a GitHub **pull request review**:
   - Use **Comment** or **Request changes** as appropriate.
   - Add inline comments on specific lines where helpful.
   - Summarize findings and open questions.
6. Do **not** push commits or alter the branch directly.

In the final response, include:

- Review state you submitted (comment / request changes)
- Short summary of findings
