#!/bin/bash
set -euo pipefail

CLUSTER_NAME="$1"
SERVICE_NAME="$2"
BACKEND_IMAGE="$3"
FRONTEND_IMAGE="$4"
AWS_REGION="$5"

CURRENT_TASK_DEF_ARN=$(aws ecs describe-services \
  --cluster "$CLUSTER_NAME" \
  --services "$SERVICE_NAME" \
  --region "$AWS_REGION" \
  --query "services[0].taskDefinition" \
  --output text)

echo "Current task definition: $CURRENT_TASK_DEF_ARN"

aws ecs describe-task-definition \
  --task-definition "$CURRENT_TASK_DEF_ARN" \
  --region "$AWS_REGION" \
  --query "taskDefinition" \
  > current-taskdef.json

jq \
  --arg BACKEND_IMAGE "$BACKEND_IMAGE" \
  --arg FRONTEND_IMAGE "$FRONTEND_IMAGE" \
  '
  .containerDefinitions |= map(
    if .name == "backend" then .image = $BACKEND_IMAGE
    elif .name == "frontend" then .image = $FRONTEND_IMAGE
    else .
    end
  )
  | del(
      .taskDefinitionArn,
      .revision,
      .status,
      .requiresAttributes,
      .compatibilities,
      .registeredAt,
      .registeredBy
    )
  ' current-taskdef.json > new-taskdef.json

echo "Rendered new-taskdef.json"
