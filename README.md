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
- ![Gunicorn](https://img.shields.io/badge/gunicorn-%292d39.svg?style=for-the-badge&logo=gunicorn&logoColor=white)
- ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

---

## 🌟 Key Features

- **AI Content Generation**: Leverage LLMs to generate high-performance marketing copy.
- **Brand Kit Management**: Maintain consistent brand identity across all generated content.
- **Project Analytics**: Real-time dashboarding for project status and generation metrics.
- **Microservice Architecture**: Decoupled frontend and backend for scalable deployment.

---

## ⚡ Local Development

To get GenMark running locally, follow these steps:

### **1. Prerequisites**
- **Node.js**: v18 or later
- **Python**: v3.10 or later
- **MongoDB**: Installed and running locally or on Atlas

### **2. Backend Setup**
1. Enter the directory: `cd Backend`
2. Create virtual environment: `python -m venv venv`
3. Activate: 
   - Windows: `venv\Scripts\activate`
   - Unix/macOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `flask --app run run`

### **3. Frontend Setup**
1. Enter the directory: `cd Frontend`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

### **4. Access**
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📂 Project Structure

```
GenMark/                                ← project root
│
├── Frontend/                           ← React + Vite + TypeScript web app
├── Backend/                            ← Python Flask API server
├── Model/                              ← Fine-tuned AI model weights (offline)
│
├── docker-compose.yml                  ← Start Frontend + Backend together
├── README.md                           ← This file
├── GENMARK_PROJECT_SUMMARY.md          ← Model suite details & AI workflow
├── SRS_EXTRACTED.md                    ← Full software requirements (text)
├── SRS GENMARK DESIGN (FYP).docx       ← Original SRS document
└── LICENSE
```

---

### 🎨 Frontend — `Frontend/`
> React 18 · Vite · TypeScript · Tailwind CSS

```
Frontend/
├── index.html                          ← HTML shell — React mounts here
├── package.json                        ← npm scripts & dependencies
├── vite.config.ts                      ← Vite bundler config
├── tailwind.config.ts                  ← Tailwind theme & design tokens
├── tsconfig.json                       ← TypeScript compiler options
├── vitest.config.ts                    ← Unit test configuration
├── Dockerfile                          ← Container image for the frontend
│
└── src/
    ├── main.tsx                        ← Bootstrap — renders <App> into DOM
    ├── App.tsx                         ← Root component — React Router routes
    ├── index.css                       ← Global styles (Tailwind directives)
    │
    ├── pages/                          ← One file = one URL route
    │   ├── Index.tsx                   →  /
    │   ├── Home.tsx                    →  /home
    │   ├── About.tsx                   →  /about
    │   ├── Features.tsx                →  /features
    │   ├── Pricing.tsx                 →  /pricing
    │   ├── Roadmap.tsx                 →  /roadmap
    │   ├── Engine.tsx                  →  /engine
    │   ├── Enterprise.tsx              →  /enterprise
    │   ├── auth/
    │   │   ├── Login.tsx               →  /login
    │   │   └── Signup.tsx              →  /signup
    │   ├── dashboard/                  ← Protected pages (require login)
    │   │   ├── Overview.tsx            →  /dashboard
    │   │   ├── TextToText.tsx          →  /dashboard/text-to-text
    │   │   ├── TextToImage.tsx         →  /dashboard/text-to-image
    │   │   ├── ImageToText.tsx         →  /dashboard/image-to-text
    │   │   ├── BrandKit.tsx            →  /dashboard/brand-kit
    │   │   ├── Projects.tsx            →  /dashboard/projects
    │   │   ├── History.tsx             →  /dashboard/history
    │   │   ├── Activity.tsx            →  /dashboard/activity
    │   │   ├── Editor.tsx              →  /dashboard/editor
    │   │   ├── Deployments.tsx         →  /dashboard/deployments
    │   │   └── Profile.tsx             →  /dashboard/profile
    │   └── docs/
    │       └── Introduction.tsx        →  /docs
    │
    ├── layouts/                        ← Shared page shells (nav + sidebar)
    │   ├── DashboardLayout.tsx         ← Sidebar + header for /dashboard/*
    │   └── DocsLayout.tsx              ← Sidebar layout for /docs/*
    │
    ├── components/                     ← Reusable UI building blocks
    │   ├── shared/                     ← Used across the whole app
    │   │   ├── Button.tsx
    │   │   ├── GlassCard.tsx
    │   │   ├── GradientText.tsx
    │   │   ├── AnimatedCounter.tsx
    │   │   ├── AnimatedProgressBar.tsx
    │   │   ├── SplitText.tsx
    │   │   ├── TextMarquee.tsx
    │   │   ├── RoadmapTimeline.tsx
    │   │   ├── ProtectedRoute.tsx      ← Redirects to /login if not authed
    │   │   └── ErrorBoundary.tsx
    │   ├── layout/                     ← Navigation & structural chrome
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── PublicLayout.tsx
    │   │   ├── DashboardLayout.tsx
    │   │   └── UserNav.tsx
    │   ├── background/                 ← Animated canvas/WebGL backgrounds
    │   │   ├── CosmosBackground.tsx
    │   │   └── shaders.ts
    │   ├── home/                       ← Landing page specific components
    │   │   ├── AgentCanvasFrame.tsx
    │   │   └── CreativeTransformation.tsx
    │   ├── models/                     ← AI models showcase components
    │   │   ├── ModelsCanvas.tsx
    │   │   ├── ProceduralModels.ts
    │   │   └── ProceduralModels.tsx
    │   └── ui/                         ← Visual effect / decoration components
    │       ├── asmr-background.tsx
    │       ├── dotted-surface.tsx
    │       ├── flow-field-background.tsx
    │       └── spiral-animation.tsx
    │
    ├── providers/                      ← React Context providers (global state)
    │   ├── AppProviders.tsx            ← Combines all providers in one wrapper
    │   ├── AuthProvider.tsx            ← Auth state & session management
    │   ├── QueryProvider.tsx           ← TanStack Query client setup
    │   └── SmoothScrollProvider.tsx    ← Smooth scrolling config
    │
    └── lib/                            ← Utilities, API client, custom hooks
        ├── api.ts                      ← Axios instance + all API call functions
        ├── utils.ts                    ← Helper functions (cn(), etc.)
        └── hooks/
            └── useModelLoader.ts       ← Hook for AI model loading state
```

---

### ⚙️ Backend — `Backend/`
> Python 3.10+ · Flask · MongoDB · JWT

```
Backend/
├── run.py                              ← Dev server entry: `flask --app run run`
├── __init__.py                         ← App Factory — creates & configures Flask app
├── config.py                           ← Reads .env and sets all configuration
├── requirements.txt                    ← Python dependencies
├── pytest.ini                          ← Test discovery settings
├── Dockerfile                          ← Container image for the backend
├── .env                                ← Secret keys & DB URI  ← DO NOT COMMIT
└── .env.example                        ← Template for required env variables
│
├── api/                                ← HTTP Route Handlers (Flask Blueprints)
│   ├── __init__.py
│   ├── auth.py                         →  /api/auth/*   Register, Login, Token
│   ├── brand_routes.py                 →  /api/brand/*  Brand kit CRUD
│   ├── content_routes.py               →  /api/content/* Saved content CRUD
│   ├── dashboard_routes.py             →  /api/dashboard/* Stats & metrics
│   ├── generation_routes.py            →  /api/generate/* AI generation endpoints
│   └── project_routes.py               →  /api/projects/* Project management
│
├── models/                             ← MongoDB document schemas
│   ├── __init__.py
│   ├── user.py                         ← User document (name, email, hash, plan)
│   ├── brand_kit.py                    ← BrandKit (colors, logo, fonts, voice)
│   ├── marketing_content.py            ← Generated content (prompt, output, type)
│   └── project.py                      ← Project (name, status, brand_kit_id)
│
├── services/                           ← Business Logic Layer
│   ├── __init__.py
│   ├── llm_service.py                  ← Orchestrates ALL AI model calls ⭐
│   └── s3_service.py                   ← File storage (S3 or local)
│
├── ai_models/                          ← AI Model Loader Wrappers
│   ├── __init__.py
│   ├── text_llm.py                     ← Text-to-Text model loader
│   ├── text_to_image.py                ← Text-to-Image model loader
│   └── image_to_text.py                ← Image-to-Text model loader
│
├── pipelines/                          ← Multi-step AI workflow chains
│   ├── __init__.py
│   ├── marketing_text_pipeline.py      ← Image → Caption → Marketing Copy
│   ├── ad_image_pipeline.py            ← Prompt → Ad image
│   └── product_analysis_pipeline.py    ← Product image → Analysis + Copy
│
├── repositories/                       ← Data Access Layer (all DB queries)
│   ├── __init__.py
│   ├── user_repo.py
│   ├── content_repo.py
│   ├── generation_repo.py
│   ├── model_repo.py
│   └── usage_repo.py
│
├── core/                               ← Flask App Internals
│   ├── __init__.py
│   ├── config.py
│   ├── extensions.py                   ← PyMongo, JWT, CORS init
│   └── logger.py
│
├── security/                           ← Auth & Security Utilities
│   ├── __init__.py
│   ├── jwt_handler.py                  ← JWT creation & validation
│   ├── hashing.py                      ← bcrypt password hashing
│   ├── middleware.py                   ← @require_auth decorator
│   ├── rate_limiter.py                 ← Per-route rate limiting
│   └── roles.py                        ← Role definitions & helpers
│
├── queues/                             ← Async Background Job Queue
│   ├── __init__.py
│   ├── job_manager.py                  ← Enqueue & track jobs
│   └── worker.py                       ← Worker that processes queued jobs
│
├── jobs/                               ← Scheduled Jobs
│   ├── __init__.py
│   └── cleanup.py                      ← Periodic cleanup of old files
│
├── storage/                            ← Temporary local file storage
│   └── .gitkeep
│
├── utils/                              ← Shared helper functions
│   └── __init__.py
│
└── tests/                              ← Automated Tests  →  `pytest`
    ├── __init__.py
    ├── conftest.py                     ← Shared fixtures & test app setup
    └── test_health.py
```

---

### 🤖 Model — `Model/`
> Fine-tuned AI model weights (offline, safetensors format)

```
Model/
├── Image to text Model/                ← Florence-2-Large  (Vision → Text)
│   ├── modeling_florence2.py           ← Model architecture
│   ├── configuration_florence2.py      ← Hyperparameters & config class
│   ├── processing_florence2.py         ← Image preprocessing pipeline
│   ├── model.safetensors               ← Trained weights  (1.5 GB)
│   ├── tokenizer.json                  ← Tokenizer vocabulary
│   ├── vocab.json                      ← Vocabulary mapping
│   ├── config.json                     ← Model config
│   ├── generation_config.json          ← Generation settings
│   ├── tokenizer_config.json
│   └── preprocessor_config.json        ← Image resize / normalize settings
│
├── Text to text Model/                 ← Gem-Marketing / Mistral-7B (Text → Text)
│   ├── model-00001-of-00002.safetensors ← Model shard 1  (4 GB)
│   ├── model-00002-of-00002.safetensors ← Model shard 2  (1 GB)
│   ├── model.safetensors.index.json    ← Shard index (maps layers → shards)
│   ├── tokenizer.json                  ← Tokenizer (17 MB)
│   ├── config.json
│   ├── generation_config.json
│   ├── tokenizer_config.json
│   └── special_tokens_map.json
│
└── Text to image Model/                ← Realistic Vision v5.1 (Text → Image)
    ├── model_index.json                ← Diffusers pipeline index
    ├── unet/                           ← U-Net denoising network
    ├── vae/                            ← Variational Autoencoder
    ├── text_encoder/                   ← CLIP text encoder
    ├── tokenizer/                      ← CLIP tokenizer
    └── scheduler/                      ← Diffusion scheduler (PNDM/DDIM)
```


