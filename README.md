# CloudScale: AWS Kubernetes Task Management API

A scalable, cloud-native REST API built with Node.js, Express, and Prisma, orchestrated on Amazon Elastic Kubernetes Service (EKS) and backed by Amazon RDS (PostgreSQL). Features fully automated GitHub Actions CI/CD and Horizontal Pod Autoscaling (HPA).

## Objective
Design and implement a production-ready, highly available REST API deployed on AWS infrastructure. The application auto-scales dynamically based on CPU utilization and uses managed cloud database services for persistent storage securely within an AWS VPC.

## Learning Outcomes
- Containerize a Node.js application using highly-optimized, multi-stage Docker builds.
- Provision and manage AWS EKS clusters and private RDS PostgreSQL instances.
- Implement Kubernetes Auto-Scaling (HPA) and public-facing LoadBalancers.
- Automate testing, Docker image builds, and zero-downtime EKS deployments using GitHub Actions.

## Tools & Technologies
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Amazon RDS), Prisma ORM
- **Containerization**: Docker, Amazon Elastic Container Registry (ECR)
- **Orchestration**: Kubernetes, Amazon EKS (`eksctl`)
- **CI/CD**: GitHub Actions

## Prerequisites
- Node.js 18+
- Docker Desktop
- AWS CLI configured with appropriate IAM permissions
- `eksctl` & `kubectl`

## Setup & Run (Local Development)

```bash
# 1) Clone repository
git clone https://github.com/AyushiVerma791/aws-kubernetes-task-manager.git
cd aws-kubernetes-task-manager

# 2) Install dependencies
cd app
npm install

# 3) Start local PostgreSQL database using Docker
cd ../docker
docker-compose up -d

# 4) Setup Prisma and Database
cd ../app
cp .env.example .env
npx prisma db push

# 5) Start Dev Server
npm run dev
# API runs on http://localhost:3000
```

## Cloud Architecture & Deployment Flow
1. **Push Code**: Code pushed to the `main` branch triggers the GitHub Actions CI/CD pipeline.
2. **Automated Testing**: Pipeline runs `npm test` to validate all API endpoints.
3. **Build & Push**: The Docker image is built and securely pushed to Amazon Elastic Container Registry (ECR).
4. **Rolling Update**: Pipeline uses `kubectl` to deploy the new image tag to the Amazon EKS cluster with zero downtime.
5. **Auto-Scaling**: Kubernetes HPA monitors CPU metrics. If CPU > 50%, it dynamically scales pods from 1 up to 3 to handle traffic bursts, dropping back down when traffic subsides.

## Project Structure
```text
aws-kubernetes-task-manager
│
├── .github/
│   └── workflows/
│       └── ci-cd.yaml           # GitHub Actions automated pipeline
├── app/
│   ├── prisma/                  # Database schema & migrations
│   ├── src/                     # Express.js API source code
│   ├── tests/                   # Jest unit tests
│   ├── .env.example
│   ├── Dockerfile               # Multi-stage container build
│   └── package.json
│
├── aws/
│   └── eks/
│       └── cluster.yaml         # eksctl cluster configuration (t3.small)
│
├── docker/
│   └── docker-compose.yml       # Local PostgreSQL database
│
├── k8s/
│   ├── base/                    # K8s manifests (Deployment, Service, HPA)
│   ├── overlays/                # K8s environment-specific overrides
│   └── prod-config.yaml         # Production ConfigMap and Secrets
│
└── README.md
```
