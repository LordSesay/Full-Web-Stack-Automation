# 🏥 Encounter ID Platform — Full Stack + DevOps System

A healthcare encounter lifecycle platform deployed through a fully automated CI/CD pipeline on AWS.

---

## 🧠 Problem This Solves

In healthcare environments, every patient visit must be tracked across:

- → check-in
- → treatment
- → billing
- → compliance

Many smaller clinic networks lack a **clean, unified way to track encounters across systems**.

This platform introduces a:

> **Single source of truth for patient encounters**

---

## 🎯 What This System Does

- Generates unique encounter IDs
- Tracks full lifecycle: check-in → triage → treatment → billing → discharge
- Enables audit visibility for compliance teams
- Provides real-time operational dashboard
- Supports filtering, search, and lifecycle updates

---

## ⚙️ CI/CD Pipeline (Production-Style)

This system uses a **fully automated deployment pipeline**:

1. Code pushed to GitHub
2. Jenkins (EC2) triggers pipeline
3. Backend & frontend containerized via Docker
4. Images tagged with build numbers
5. Images pushed to Amazon ECR
6. ECS task definition dynamically updated
7. New revision deployed to ECS service
8. Zero-downtime rollout behind ALB

---

## 🔥 Key Engineering Decision

### ❌ Before:

```bash
aws ecs update-service --force-new-deployment
```

### ✅ After:

```
Task Definition Revision Deployment
```

### Why this matters:

- Versioned deployments
- Safe rollbacks
- Auditability
- Deterministic releases

---

## 📦 Features

### Backend API

- `POST /api/encounters`
- `PATCH` lifecycle updates
- Filtering & search
- Stats aggregation endpoint
- Encounter detail with history

### Frontend

- Dashboard with live stats
- Encounter lifecycle visualization
- SPA routing (React Router)
- Operational audit interface

### DevOps

- Jenkins CI/CD (EC2)
- Docker containerization
- AWS ECS orchestration
- ECR image versioning
- Terraform infrastructure

---

## 🧩 Challenges & Solutions

| Problem | Solution |
|---------|----------|
| ECS failed to pull images | Proper ECR tagging + versioned deployment |
| Jenkins Docker permission errors | Fixed Docker socket configuration |
| CI builds failing on warnings | Enforced production-grade build standards |
| Frontend/backend routing issues | ALB path-based routing + relative API paths |

---

## 💼 Business Value

- 🚀 Faster deployments (minutes vs hours)
- 🔒 Secure, IAM-controlled infrastructure
- 📊 Full audit visibility for compliance teams
- ⚡ Zero-downtime updates during clinic operations
- 📈 Scalable for multi-clinic environments

---

## ✅ Infrastructure Implemented

- [x] RDS (PostgreSQL) persistence layer
- [x] Secrets Manager for credential management
- [x] ECS Fargate orchestration
- [x] ALB with path-based routing
- [x] Route 53 DNS configuration
- [x] IAM roles and policies
- [x] VPC with public/private subnets
- [x] ECR image repositories
- [x] Multi-environment support (dev/staging/prod)

## 🔮 Future Enhancements

- [ ] Authentication & RBAC
- [ ] CI/CD rollback automation
- [ ] Monitoring (CloudWatch / Prometheus)
- [ ] Blue/green deployments

---

## 🤝 Connect

Built by **Malcolm Sesay**
🔗 [LinkedIn](https://www.linkedin.com/in/malcolmsesay/)

---

## 🏷️ Tags

`#DevOps` `#AWS` `#CICD` `#CloudEngineering` `#Jenkins` `#ECS` `#Docker` `#Terraform` `#HealthcareTech`
