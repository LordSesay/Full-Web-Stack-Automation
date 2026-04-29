#!/bin/bash
set -euo pipefail

AWS_REGION="$1"

NEW_TASK_DEF_ARN=$(aws ecs register-task-definition \
  --cli-input-json file://new-taskdef.json \
  --region "$AWS_REGION" \
  --query "taskDefinition.taskDefinitionArn" \
  --output text)

echo "$NEW_TASK_DEF_ARN" > new-taskdef-arn.txt

echo "Registered task definition: $NEW_TASK_DEF_ARN"
