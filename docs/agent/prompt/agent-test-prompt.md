You have access to GitHub pull request data. The payload includes `pull_request_number`.

This run was triggered because a human added PR label **`status:test_plan_requested`**. After you post the manual test plan, you may remove that label so [`router.yml`](../../.github/workflows/router.yml) does not invoke AgentTest again on the same PR.

Keep the linked issue’s Project item at **In review** while authoring the test plan (GraphQL per [`docs/cursor-automations.md`](../../cursor-automations.md) §9 if needed).

Author **manual** test cases only. Do **not** claim automated tests were executed; CI/Sonar/Snyk already run in GitHub Actions. Do **not** merge the PR—a human performs final review and merge.

1. Load the PR description, diff summary, and linked issue (acceptance criteria).
2. Read the plan under `.cursor/plans/` if it helps map scope.
3. Produce a **manual test checklist** mapped to acceptance criteria (and risks/edge cases where relevant).
4. Either:
   - Append a clearly marked section to the PR description (e.g. `## Manual test checklist`), **or**
   - Add a file under `docs/test-plans/` (e.g. `pr-<number>-manual-tests.md`) and link it from a PR comment.
5. Optionally add label `status:test_plan_ready` on the PR if your tooling supports it.

In the final response, include:

- Where the checklist lives (PR body path or file path)
- Brief note that execution is for humans/QE, not automated here
