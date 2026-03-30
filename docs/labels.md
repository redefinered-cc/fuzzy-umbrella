## Label reference

This file is the **canonical registry** for labels used in the agent-driven GitHub lifecycle. It lists **every** label, who sets it, and whether it triggers [`router.yml`](../.github/workflows/router.yml). Other docs link here instead of duplicating full lists.

- **Lifecycle overview:** [`docs/agent-dev-lifecycle.md`](agent-dev-lifecycle.md)
- **Cursor + Actions wiring:** [`docs/cursor-automations.md`](cursor-automations.md)

**Project board:** The GitHub Project **Status** field (Backlog, Ready, In progress, In review, Done) is updated by agents (GraphQL) for visibility. **GitHub Actions does not listen to Project Status**—humans use **issue/PR labels** below so `router.yml` can fire webhooks reliably.

---

### Naming rules

- Format: **`prefix:slug`** — all **lowercase**; use **hyphens** in the slug when needed (e.g. `status:test_plan_requested`).
- Do not use capital letters in label names (npm and GitHub consistency).

---

### Label taxonomy (prefix families)

| Prefix | Purpose |
| ------ | ------- |
| **`status:`** | Lifecycle state on an issue or PR, and **human router hooks** (`status:ready`, `status:in_progress`, `status:test_plan_requested`). |
| **`agent:`** | **Automation routing**—which agent should run next on a PR (e.g. **`agent:review`** from AgentDev). Not used for human “start plan” / “start dev” (those use `status:*` on the router). |
| **`needs:`** | Blocking / attention flags. |
| **`quality:`** | Quality-gate signals. |
| **`type:`** | Work item taxonomy (templates). |

---

### Router quick reference

| Label | Applies to | `router.yml` job | GitHub event |
| ----- | ---------- | ---------------- | ------------ |
| `status:ready` | Issue | `agent-plan` | `issues` `opened` (if present) or `labeled` |
| `status:in_progress` | Issue | `agent-dev` | `issues` `opened` (if present) or `labeled` |
| `agent:review` | Pull request | `agent-review` | `pull_request` (`opened` / `edited` / `labeled`, not `synchronize`) |
| `status:test_plan_requested` | Pull request | `agent-test` | `pull_request` `labeled` |
| _(none)_ | — | `agent-plan` replay | `workflow_dispatch` (input `issue_number`) |

---

### Master catalog

| Label | Applies to | Set by | Triggers router? | Meaning |
| ----- | ---------- | ------ | ---------------- | ------- |
| `status:ready` | Issue | Human | Yes → `agent-plan` | **Ready for planning**—kick off AgentPlan. Remove after plan is posted (AgentPlan) so the job does not re-fire. |
| `status:in_progress` | Issue | Human | Yes → `agent-dev` | **Ready for implementation** after plan approval—kick off AgentDev. |
| `status:test_plan_requested` | PR | Human | Yes → `agent-test` | **Request manual test plan** while work is in review. Remove after AgentTest posts the checklist if you want to avoid duplicate runs. |
| `agent:review` | PR | AgentDev (or human) | Yes → `agent-review` | First-pass AI review; set when PR is ready for AgentReview (e.g. after CI is acceptable). |
| `agent:test` | PR | Human / automation | No (legacy) | Optional display only; **router uses `status:test_plan_requested`** for AgentTest. Prefer `status:test_plan_requested` for new workflows. |
| `agent:plan` | Issue | Optional | No | Legacy / documentation only; **router does not use it**. Use `status:ready` to start AgentPlan. |
| `agent:dev` | Issue | Optional | No | Optional marker that implementation is queued; **router uses `status:in_progress`** to start AgentDev. |
| `status:planning` | Issue | Template / human | No | Early triage; plan not produced yet. |
| `status:plan_ready` | Issue | AgentPlan | No | Plan exists; awaiting human review. |
| `status:plan_approved` | Issue | Human | No | Plan approved; human may add `status:in_progress` to start AgentDev. |
| `status:implementing` | Issue | AgentDev / automation | No | Implementation in progress. |
| `status:pr_open` | Issue | AgentDev / automation | No | PR exists for this work. |
| `status:ready_for_merge` | PR / issue | AgentReview / human | No | Ready for human final merge (policy-dependent). |
| `status:test_plan_ready` | PR | AgentTest (optional) | No | Manual test plan has been added. |
| `status:done` | Issue | Human / automation | No | Merged / complete. |
| `needs:human_input` | Issue | AgentPlan / agents | No | Waiting on human approval or clarification. |
| `quality:failed` | Issue / PR | Automation / human | No | CI / Sonar / Snyk (or similar) failing. |
| `type:feature` | Issue | Template | No | Feature request work type (example). |

---

### `status:` labels (detail)

#### Router hooks (human-applied)

- **`status:ready`** — Human adds when the ticket should enter **AgentPlan** (“ready for planning”). AgentPlan **removes** it when handing off so `agent-plan` does not run again on the same ticket without a fresh add.
- **`status:in_progress`** — Human adds after **`status:plan_approved`** to hand off to **AgentDev** (“ready for implementation”).
- **`status:test_plan_requested`** — Human adds on the **pull request** to invoke **AgentTest** for a manual test checklist.

#### Lifecycle (automation / human)

- **`status:planning`** — Issue in triage; default from feature template may include this alongside `type:feature`.
- **`status:plan_ready`** — AgentPlan posted a plan; human should review.
- **`status:plan_approved`** — Human approved the plan; then add **`status:in_progress`** to start dev.
- **`status:implementing`** — Dev work underway.
- **`status:pr_open`** — PR linked to the issue.
- **`status:ready_for_merge`** — Meets review/quality policy for merge (team-defined).
- **`status:test_plan_ready`** — Manual test plan delivered (optional AgentTest label).
- **`status:done`** — Shipped / merged / closed from lifecycle perspective.

---

### `agent:` labels (detail)

- **`agent:review`** — On **PR**; triggers **`agent-review`**. Typically applied by **AgentDev** when opening/updating the PR for first-pass review.
- **`agent:test`** — **Legacy.** Does not trigger `router.yml`. Use **`status:test_plan_requested`** for AgentTest.
- **`agent:plan`** — **Not used by router.** Historical; use **`status:ready`**.
- **`agent:dev`** — **Not used by router.** Optional issue marker; use **`status:in_progress`** to trigger AgentDev.

---

### `needs:` and `quality:` (detail)

- **`needs:human_input`** — Agent is blocked on a human (e.g. after AgentPlan posts a plan).
- **`quality:failed`** — Required checks failed; do not advance review/test until resolved.

---

### `type:` (detail)

- **`type:feature`** — Example taxonomy label from the feature request template; does not trigger the router.

---

### Best practices

- Prefer **one** primary lifecycle `status:*` phase label per issue where the team agrees on semantics.
- **Human router labels** (`status:ready`, `status:in_progress`, `status:test_plan_requested`) must be **created in the GitHub repo** and applied **manually** when you want Actions to call Cursor—do not rely on Project Status alone.
- Keep **`agent:*`** for **automation handoffs** (especially **`agent:review`** on PRs).
