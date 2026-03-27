## Agent-driven GitHub lifecycle

This project defines an agent-driven development lifecycle using GitHub Issues and GitHub Actions: issue intake → plan validation → implementation PR → automated quality gates (Sonar + Snyk) → AI first-pass PR review → manual test-case authoring → **human final review and merge** → deploy via GitHub Actions.

### Algorithm

1. **Human** — Set Project **Status** to **Ready** to start AgentPlan (Project automation mirrors to `status:ready` for router trigger).
2. **AgentPlan** — Write plan to `.cursor/plans/`; push; assign back to human.
3. **Human** — Set Project **Status** to **In progress** to start AgentDev (Project automation mirrors to `status:in_progress` for router trigger).
4. **AgentDev** — Implement saved plan; open PR (`Closes #n`); set ticket **Status** to **In review** when PR is linked.
5. **Automated** — CI, Sonar, Snyk on the PR.
6. **AgentReview** — First-pass review; does not merge.
7. **Human** — Keep ticket **Status** in **In review** and request AgentTest.
8. **AgentTest** — Manual test checklist; does not merge.
9. **Human** — Merge to `main`.
10. **GitHub Actions** — [`deploy.yml`](../.github/workflows/deploy.yml) on push to `main`.

### GitHub integration

- Issues: triage moves Project item to **Ready** (AgentPlan) and **In progress** (AgentDev).
- Project Status is source of truth: **Backlog → Ready → In progress → In review → Done**.
- Router triggers are currently derived from mirrored labels due to GitHub Actions event constraints.
