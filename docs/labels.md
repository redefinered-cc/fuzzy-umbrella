## Label reference

Project Status is the human-facing state machine. Labels are machine signals used by router triggers and agent handoffs.

### Required status mirror labels

- `status:ready`: mirrored from Project Status = Ready; triggers AgentPlan in router.
- `status:in_progress`: mirrored from Project Status = In progress; triggers AgentDev in router.

### Agent handoff labels

- `agent:review`: added by AgentDev on PR; triggers AgentReview.
- `agent:test`: set when manual test-plan generation is requested.

### Operational labels

- `status:plan_ready`
- `status:plan_approved`
- `needs:human_input`
- `quality:failed`
