# FULL WEB STACK AUTOMATION 🚀  
> CI/CD Deployment of a Full-Stack Web App Using Jenkins, Terraform, Docker, and AWS ECS

![AWS](https://img.shields.io/badge/Built%20With-AWS-orange?style=for-the-badge&logo=amazonaws)
![CI/CD](https://img.shields.io/badge/CI/CD-Jenkins-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

---

## 📌 What Problem Are We Solving?

Traditional app deployments often suffer from:

- **Manual, repetitive steps** that increase time-to-market
- **Configuration drift** between environments
- **Lack of automated rollback and testing**
- **Tight coupling of code and infrastructure**

**Full Web Stack Automation** solves these by automating the deployment of both frontend and backend services using containerized workflows and infrastructure as code.

---

## 🎯 Project Goals

- Fully containerize the frontend and backend
- Use Jenkins to automate Docker builds and ECS deployments
- Manage all AWS infrastructure using Terraform
- Enable reproducible and scalable deployment pipelines
- Demonstrate real-world DevOps CI/CD practices

---

## ⚙️ Tech Stack

| Tool/Service        | Role                                                      |
|---------------------|-----------------------------------------------------------|
| **Terraform**       | Provision ECS, ALB, VPC, IAM, and other AWS resources     |
| **AWS ECS**         | Orchestrate containerized services                        |
| **Docker**          | Containerize full-stack app components                    |
| **Jenkins (EC2)**   | CI/CD pipeline: build, push, deploy                       |
| **Amazon ECR**      | Host container images for backend & frontend              |
| **ALB (Load Balancer)** | Route traffic to ECS tasks                         |
| **IAM**             | Manage secure permissions for ECS and Jenkins             |

---

## 🔁 How It Works

1. **Frontend and Backend code is pushed to GitHub**
2. **Jenkins pulls the repo, builds Docker images**
3. **Docker images pushed to Amazon ECR**
4. **Terraform provisions ECS infrastructure**
5. **Jenkins updates ECS tasks using latest container versions**
6. **Application is accessible via ALB DNS**

---

## 🧩 Architecture Diagram

*(Diagram goes here — saved in /assets)*

---

## 🛠 Folder Structure

