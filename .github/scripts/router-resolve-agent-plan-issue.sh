#!/usr/bin/env bash
# Resolves issue number + should_run for agent router jobs (label-driven; no GitHub Projects).
# Expects GITHUB_EVENT_PATH, GITHUB_EVENT_NAME.
# Optional:
# - ROUTER_MODE=plan|dev (default: plan)
# - WORKFLOW_ISSUE_NUMBER (plan replay only; workflow_dispatch)
set -euo pipefail

EVENT_NAME="${GITHUB_EVENT_NAME:-unknown}"
MODE="${ROUTER_MODE:-plan}"

if [[ "$MODE" != "plan" && "$MODE" != "dev" ]]; then
  echo "::error::Unknown ROUTER_MODE=$MODE"
  exit 1
fi

if [[ "$EVENT_NAME" == "workflow_dispatch" && "$MODE" == "plan" ]]; then
  if [[ -z "${WORKFLOW_ISSUE_NUMBER:-}" ]]; then
    echo "::error::workflow_dispatch requires issue_number input."
    exit 1
  fi
  {
    echo "issue_number=${WORKFLOW_ISSUE_NUMBER}"
    echo "should_run=true"
  } >> "${GITHUB_OUTPUT}"
  exit 0
fi

if [[ "$EVENT_NAME" == "issues" && "$MODE" == "plan" ]]; then
  ACTION=$(jq -r '.action' "$GITHUB_EVENT_PATH")
  if [[ "$ACTION" == "labeled" ]] && [[ "$(jq -r '.label.name' "$GITHUB_EVENT_PATH")" == "status:ready" ]]; then
    echo "issue_number=$(jq -r '.issue.number' "$GITHUB_EVENT_PATH")" >> "${GITHUB_OUTPUT}"
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  if [[ "$ACTION" == "opened" ]] && jq -e '[.issue.labels[].name] | index("status:ready") != null' "$GITHUB_EVENT_PATH" >/dev/null 2>&1; then
    echo "issue_number=$(jq -r '.issue.number' "$GITHUB_EVENT_PATH")" >> "${GITHUB_OUTPUT}"
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  echo "should_run=false" >> "${GITHUB_OUTPUT}"
  exit 0
fi

if [[ "$EVENT_NAME" == "issues" && "$MODE" == "dev" ]]; then
  ACTION=$(jq -r '.action' "$GITHUB_EVENT_PATH")
  if [[ "$ACTION" == "labeled" ]] && [[ "$(jq -r '.label.name' "$GITHUB_EVENT_PATH")" == "status:in_progress" ]]; then
    echo "issue_number=$(jq -r '.issue.number' "$GITHUB_EVENT_PATH")" >> "${GITHUB_OUTPUT}"
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  if [[ "$ACTION" == "opened" ]] && jq -e '[.issue.labels[].name] | index("status:in_progress") != null' "$GITHUB_EVENT_PATH" >/dev/null 2>&1; then
    echo "issue_number=$(jq -r '.issue.number' "$GITHUB_EVENT_PATH")" >> "${GITHUB_OUTPUT}"
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  echo "should_run=false" >> "${GITHUB_OUTPUT}"
  exit 0
fi

echo "should_run=false" >> "${GITHUB_OUTPUT}"
