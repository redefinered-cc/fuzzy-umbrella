#!/usr/bin/env bash
# Resolves issue number + should_run for agent router jobs.
# Expects GITHUB_EVENT_PATH, GITHUB_EVENT_NAME.
# Optional:
# - ROUTER_MODE=plan|dev (default: plan)
# - WORKFLOW_ISSUE_NUMBER (plan replay only)
# - PROJECT_V2_STATUS_READY_OPTION_ID (plan trigger)
# - PROJECT_V2_STATUS_IN_PROGRESS_OPTION_ID (dev trigger)
set -euo pipefail

EVENT_NAME="${GITHUB_EVENT_NAME:-unknown}"
MODE="${ROUTER_MODE:-plan}"
READY_OPTION_ID="${PROJECT_V2_STATUS_READY_OPTION_ID:-}"
IN_PROGRESS_OPTION_ID="${PROJECT_V2_STATUS_IN_PROGRESS_OPTION_ID:-}"

if [[ "$MODE" == "plan" ]]; then
  TARGET_OPTION_ID="$READY_OPTION_ID"
elif [[ "$MODE" == "dev" ]]; then
  TARGET_OPTION_ID="$IN_PROGRESS_OPTION_ID"
else
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

if [[ "$EVENT_NAME" == "projects_v2_item" ]]; then
  ACTION=$(jq -r '.action' "$GITHUB_EVENT_PATH")
  if [[ "$ACTION" != "edited" ]]; then
    echo "should_run=false" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  if [[ -z "$TARGET_OPTION_ID" ]]; then
    if [[ "$MODE" == "plan" ]]; then
      echo "::notice::Set repository variable PROJECT_V2_STATUS_READY_OPTION_ID (GraphQL id of the Status single-select option Ready) to enable AgentPlan when Project Status becomes Ready."
    else
      echo "::notice::Set repository variable PROJECT_V2_STATUS_IN_PROGRESS_OPTION_ID (GraphQL id of the Status single-select option In progress) to enable AgentDev when Project Status becomes In progress."
    fi
    echo "should_run=false" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  TO_ID=$(jq -r '.changes.field_value.to.single_select_option_id // .changes.field_value.to // empty' "$GITHUB_EVENT_PATH")
  if [[ "$TO_ID" != "$TARGET_OPTION_ID" ]]; then
    echo "should_run=false" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  if jq -e '.projects_v2_item.content_type == "PullRequest"' "$GITHUB_EVENT_PATH" >/dev/null 2>&1; then
    echo "should_run=false" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  NUM=$(jq -r '.projects_v2_item.content.number // .projects_v2_item.content.issue.number // empty' "$GITHUB_EVENT_PATH")
  if [[ -n "$NUM" && "$NUM" != "null" ]]; then
    echo "issue_number=$NUM" >> "${GITHUB_OUTPUT}"
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  NODE_ID=$(jq -r '.projects_v2_item.content_node_id // empty' "$GITHUB_EVENT_PATH")
  if [[ -z "$NODE_ID" || "$NODE_ID" == "null" ]]; then
    NODE_ID=$(jq -r '.projects_v2_item.content.node_id // empty' "$GITHUB_EVENT_PATH")
  fi
  if [[ -z "$NODE_ID" || "$NODE_ID" == "null" ]]; then
    echo "::error::Could not find content node id on projects_v2_item payload."
    exit 1
  fi
  NUM=$(gh api graphql -f query='query($id:ID!){node(id:$id){... on Issue{number}}}' -f id="$NODE_ID" -q '.data.node.number // empty' 2>/dev/null || true)
  if [[ -z "$NUM" || "$NUM" == "null" ]]; then
    echo "::notice::Skipping AgentPlan: item is not an Issue or GraphQL returned no number."
    echo "should_run=false" >> "${GITHUB_OUTPUT}"
    exit 0
  fi
  echo "issue_number=$NUM" >> "${GITHUB_OUTPUT}"
  echo "should_run=true" >> "${GITHUB_OUTPUT}"
  exit 0
fi

echo "should_run=false" >> "${GITHUB_OUTPUT}"
