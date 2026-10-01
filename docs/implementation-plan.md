# CloudScale - Implementation Plan

## 1. Project Overview
"CloudScale" is a portfolio-quality cloud-native Task Management REST API. It demonstrates how an application is deployed, operated, monitored, and scaled in a cloud environment using AWS, Kubernetes, Docker, and GitHub Actions.

## 2. Environment Assessment (Phase 0)
The workspace (`d:\Antigravity\Project_2`) is currently an empty directory. 
The operating system is Windows (with potential WSL2 integration as mentioned).

### Available Tools:
- **Node.js**: v18.20.4
- **npm**: 10.7.0
- **Git**: 2.51.1
- **Docker**: 29.7.2 (Installed, but **daemon is currently NOT RUNNING**)
- **kubectl**: v1.36.1

### Missing Tools / Prerequisites:
- **AWS CLI**: Missing. Required to interact with AWS resources.
- **eksctl**: Missing. Recommended for simplified EKS cluster creation.
- **Terraform**: Missing (Optional but good for IaC, we will proceed with eksctl for a beginner-friendly approach as requested unless Terraform is preferred).

### Blockers / Immediate Actions Required by User:
1. **Start Docker**: Please start Docker Desktop (or your WSL2 Docker daemon).
2. **Install AWS CLI**: Required before Phase 5.
3. **Install eksctl**: Required before Phase 5.
4. **AWS Account & Credentials**: You will need an AWS account. We will set up credentials later.
5. **GitHub Repository**: We will need to initialize this directory as a Git repository and push it to GitHub for CI/CD (Phase 10).

## 3. Architecture
- **Local**: Node.js REST API + PostgreSQL (via Docker Compose).
- **AWS Cloud**: 
  - Amazon EKS (Kubernetes cluster)
  - Amazon ECR (Container image registry)
  - Amazon RDS (Managed PostgreSQL database in private subnet)
  - AWS Application Load Balancer (External entry point)
  - AWS VPC (Public & Private subnets)
  - Amazon CloudWatch (Monitoring)

## 4. Phased Implementation Plan

### Stage 1: Inspect and Plan (Current)
- Completed the initial environment inspection.
- Outlined the missing tools and architecture.

### Stage 2: Build the Local Application (Phases 1 & 2)
- Set up the project directory structure.
- Develop the modular Express.js Task Management API.
- Integrate Prisma ORM with PostgreSQL.
- Add validation, centralized error handling, logging, pagination, and health/readiness endpoints.
- Write Jest/Supertest automated tests.
- Set up local PostgreSQL via Docker Compose (once Docker is running).
- *Verification*: Application starts, migrations run, tests pass, API is functional.

### Stage 3: Containerize (Phase 3)
- Write a production-ready `Dockerfile` (multi-stage, non-root user).
- Create `.dockerignore`.
- *Verification*: Image builds, container runs locally, health endpoints respond.

### Stage 4: Local Kubernetes (Phase 4)
- Create local Kubernetes manifests (Deployment, Service, ConfigMap, Secrets, HPA).
- *Verification*: Deploy locally (using kind, Minikube, or Docker Desktop Kubernetes) and test scaling and health manually.

### Stage 5: AWS Preparation (Phase 5)
- **Requires explicit user approval before proceeding to avoid cloud costs.**
- Prepare eksctl configuration for VPC, EKS cluster, and Node Groups.
- Prepare AWS IAM policies for Load Balancer Controller.
- Prepare RDS provisioning plan.
- Estimate costs for EKS control plane, EC2 worker nodes, RDS, ALB, and NAT Gateways.

### Stage 6: AWS Deployment (Phases 6, 8, 9)
- Provision ECR, build and push the Docker image.
- Provision VPC, RDS, and EKS using `eksctl`.
- Install AWS Load Balancer Controller in the cluster.
- Deploy application manifests to EKS.
- *Verification*: Application is accessible externally via ALB, connects to RDS, logs are generating.

### Stage 7: CI/CD (Phase 10)
- Create `.github/workflows/deploy.yml`.
- Configure OIDC integration between GitHub and AWS IAM.
- *Verification*: Code push triggers tests, builds image, publishes to ECR, and updates EKS.

### Stage 8: Monitoring and Scaling (Phases 7, 11, 12)
- Configure Kubernetes Horizontal Pod Autoscaler (HPA).
- Verify AWS CloudWatch integrations (Container Insights).
- Perform load testing with a tool like `k6`.
- *Verification*: Observe HPA scaling up pods under load and scaling down when load decreases. Analyze CloudWatch metrics.

### Stage 9: Documentation and Final Verification (Phases 13-17)
- Security review (`docs/security.md`).
- Cost management & cleanup guide (`docs/cost-management.md`).
- Troubleshooting guide (`docs/troubleshooting.md`).
- Interview preparation (`docs/interview-questions.md`).
- Finalize `README.md`.

## 5. Cost Considerations
This project uses AWS resources that **will incur costs**.
- **EKS Control Plane**: ~$0.10/hour (~$73/month).
- **EC2 Worker Nodes**: Varies by instance type (e.g., t3.medium is ~$0.0416/hour).
- **Amazon RDS**: Varies (e.g., db.t3.micro is ~$0.017/hour).
- **ALB**: ~$0.0225/hour.
- **NAT Gateways**: ~$0.045/hour per AZ + data processing costs (can be significant). *We will try to minimize this for the learning environment.*
- We will configure billing alerts and ensure everything is destroyed after learning.

## Next Steps
1. **User Action**: Please confirm you have started Docker Desktop.
2. **User Action**: Please confirm if you want to proceed with Stage 2 (Building the Local Application). No AWS resources will be created in this stage.
