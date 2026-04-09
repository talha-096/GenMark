# 🚀 GenMark: AI-Powered Marketing Generation

GenMark is an advanced platform designed to streamline marketing workflows through AI-driven content generation, brand identity management, and automated project orchestration.

![GenMark Architecture Visualization](file:///C:/Users/idiot/.gemini/antigravity/brain/797746bc-3c72-4c5e-8cd9-1a81aebce09b/genmark_architecture_viz_1775752089087.png)

---

## 🛠️ The Tech Stack

### **Frontend**
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
- ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### **Backend**
- ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
- ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

### **Infrastructure**
- ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
- ![Gunicorn](https://img.shields.io/badge/gunicorn-%292d39.svg?style=for-the-badge&logo=gunicorn&logoColor=white)
- ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

---

## 🌟 Key Features

- **AI Content Generation**: Leverage LLMs to generate high-performance marketing copy.
- **Brand Kit Management**: Maintain consistent brand identity across all generated content.
- **Project Analytics**: Real-time dashboarding for project status and generation metrics.
- **Unified Docker Orchestration**: One-command deployment for the entire microservice stack.

---

## ⚡ Quick Start (Docker)

The fastest way to get GenMark running is using Docker Compose:

1. **Clone and Enter**:
   ```bash
   git clone <repo-url>
   cd GenMark
   ```

2. **Launch Services**:
   ```bash
   docker-compose up -d --build
   ```

3. **Access**:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **API Docs**: [http://localhost:5000/apidocs](http://localhost:5000/apidocs)

---

## 📂 Project Structure

```bash
GenMark/
├── Frontend/          # React + Vite + TypeScript SPA
├── Backend/           # Python Flask backend (Application Factory)
│   ├── api/           # API Endpoints (Auth, Gen, Dashboard)
│   └── models/        # Database Schema & Pydantic models
└── docker-compose.yml # Orchestration for App & MongoDB
```

