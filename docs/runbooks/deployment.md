### `docs/runbooks/deployment.md`

```markdown
# Deployment Runbook

## Purpose

This runbook explains how code moves from GitHub to ECS.

## Flow

1. Developer pushes code to GitHub.
2. Jenkins checks out the repository.
3. Backend dependencies are installed.
4. Frontend dependencies are installed.
5. Frontend production build is tested.
6. Docker images are built for backend and frontend.
7. Terraform validates infrastructure configuration.
8. Jenkins logs into Amazon ECR.
9. Docker images are tagged with:
   - `latest`
   - Jenkins build number
10. Images are pushed to ECR.
11. ECS service is redeployed.
12. Jenkins waits for ECS service stability.

## Why This Matters

For a healthcare encounter ID platform, deployments must be traceable and safe. Clinic check-in systems depend on this API being available during operational hours.

## Current Deployment Strategy

Current strategy:

```text
Build image → Push to ECR → Force ECS new deployment → Wait for stability
