# Jira Task Mapping for GenMark

This document maps the project codebase to a Jira project structure. It breaks down the development into Epics, Tasks (User Stories), and technical Sub-tasks.

## Legend
- **Epic**: Large body of work (e.g., "Authentication").
- **Task**: A specific user story or feature (e.g., "As a user, I want to login").
- **Sub-task**: Small, technical step assigned to a developer (e.g., "Create API endpoint").
- **Link**: Dependency or related task.

---

## Jira Mapping Table

| Epic | Jira Task (User Story) | Sub-Task (Technical Implementation) | Link / Dependency | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | **User Registration**<br>As a new user, I want to create an account so I can access the platform. | 1. Create Mongoose/SQL Model for `User` (username, email, password_hash).<br>2. Implement `POST /api/auth/register` endpoint.<br>3. Add input validation (email format, password length).<br>4. Implement bcrypt password hashing.<br>5. Create Unit Tests for registration logic. | - | High |
| **Authentication** | **User Login**<br>As a registered user, I want to log in to access my dashboard. | 1. Implement `POST /api/auth/login` endpoint.<br>2. Generate JWT token upon success.<br>3. Implement Rate Limiting (10 req/min). | Blocks: *User Profile* | High |
| **Authentication** | **User Profile**<br>As a user, I want to view my profile details. | 1. Implement `GET /api/auth/me` endpoint.<br>2. Create JWT verification middleware.<br>3. Fetch user data from DB excluding password. | Dep: *User Login* | Medium |
| **Frontend UI** | **Project Setup**<br>Initialize the React application structure. | 1. Initialize Vite project with React + TypeScript.<br>2. Install dependencies (Tailwind, Radix UI, Framer Motion).<br>3. Configure `tsconfig` and `vite.config.ts`. | - | High |
| **Frontend UI** | **Authentication Screens**<br>Develop the login and sign-up interfaces. | 1. Create `LoginForm` component with React Hook Form.<br>2. Create `RegisterForm` component.<br>3. Integrate `zod` for frontend validation.<br>4. Connect forms to Backend Authentication APIs. | Dep: *User Registration*, *User Login* | High |
| **Frontend UI** | **Dashboard Layout**<br>Create the main application shell for authenticated users. | 1. Create Sidebar navigation component.<br>2. Implement Top Navigation Bar.<br>3. Create `Layout` wrapper component.<br>4. Implement Protected Routes (redirect if not logged in). | Dep: *User Login* | Medium |
| **Core Features** | **Database Schema Design**<br>Define the data structure for the application. | 1. Set up MongoDB connection (`database.py`).<br>2. Define `users` collection schema.<br>3. Define `content` collection schema (for generated artifacts). | - | High |
| **Core Features** | **API Documentation**<br>Ensure all APIs are documented for frontend consumption. | 1. Configure Swagger/Flasgger.<br>2. Add docstrings to all API routes.<br>3. Verify Swagger UI (`/apidocs`) works. | - | Low |
| **Infrastructure** | **Security Hardening**<br>Secure the application for deployment. | 1. Configure CORS policies.<br>2. Set up environment variables (`.env`).<br>3. Review Rate Limiting settings. | - | Medium |
