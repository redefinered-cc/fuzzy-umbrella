## Cursor Automations integration

This package scaffolds router workflows and Cursor automation prompt/json files.

### Trigger model

- **Human-triggered phases** use Project Status:
  - Ready -> AgentPlan
  - In progress -> AgentDev
- Because GitHub Actions does not support direct Project Status workflow triggers in all repos, use Project automation to mirror status to labels:
  - Ready -> `status:ready`
  - In progress -> `status:in_progress`
- Router listens for those issue labels and posts webhook payloads to Cursor automations.

### Agent mapping

- AgentPlan: issue label `status:ready` (or workflow_dispatch replay)
- AgentDev: issue label `status:in_progress`
- AgentReview: PR label `agent:review`
- AgentTest: PR review submitted with state `approved`

### Quality gates (CI / Snyk / Sonar)

Scaffold includes `.github/workflows/ci.yml`, `snyk.yml`, and `sonar.yml`. They run on **pull requests** (and CI also on `main` pushes). When Agent Dev opens or updates a PR, GitHub runs these checks in parallel with the agent router—no extra wiring in `router.yml` is required.

### Required secrets

Set in **GitHub -> Settings -> Secrets and variables -> Actions**:

- `AGENT_WEBHOOK_URL_PLAN`, `AGENT_WEBHOOK_TOKEN_PLAN`
- `AGENT_WEBHOOK_URL_DEV`, `AGENT_WEBHOOK_TOKEN_DEV`
- `AGENT_WEBHOOK_URL_REVIEW`, `AGENT_WEBHOOK_TOKEN_REVIEW`
- `AGENT_WEBHOOK_URL_TEST`, `AGENT_WEBHOOK_TOKEN_TEST`
- `SNYK_TOKEN` (Snyk workflow)
- `SONAR_TOKEN`, `SONAR_HOST_URL` (Sonar workflow)

### Cursor setup

Create four webhook-based automations and paste the prompts from:

- `docs/agent/prompt/agent-plan-prompt.md`
- `docs/agent/prompt/agent-dev-prompt.md`
- `docs/agent/prompt/agent-review-prompt.md`
- `docs/agent/prompt/agent-test-prompt.md`
