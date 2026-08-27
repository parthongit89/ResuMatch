# ResuMatch - Project Roadmap & Sprint Phases

This document outlines the synchronized phase-by-phase development schedule between the **Backend Developer** and **Frontend Developer**.

---

## Phase 1: Environment Setup & API Contracts
**Goal**: Establish repository, folder structure, database connection, and API contracts.

### Backend Developer Tasks:
- Set up Flask folder structure (`src/controllers`, `src/routes`, `src/services`, etc.).
- Configure SQLite/PostgreSQL database via SQLAlchemy.
- Create base API response wrapper (`response_helpers.py`) and global error handler middleware.
- Environment variable setup (`.env.example`).

### Frontend Developer Tasks:
- Set up React/Next.js/HTML project with Tailwind CSS.
- Establish UI layout (Navbar, Footer, Landing Page base).
- Set up Axios/Fetch HTTP client instance with base URL and JWT interceptor.

---

## Phase 2: Authentication & Dashboard
**Goal**: User login/signup flow and dashboard interface.

### Backend Developer Tasks:
- Implement `models/user.py` and User repository.
- Implement Password hashing (Bcrypt) and JWT token generator.
- Build `/api/v1/auth/register`, `/api/v1/auth/login`, and `/api/v1/auth/me`.
- Write Auth JWT middleware (`auth_middleware.py`).

### Frontend Developer Tasks:
- Build Landing Page with CTA buttons.
- Build Login / Signup modal & page with form validation.
- Store JWT token in `localStorage` or HttpOnly cookies.
- Create User Dashboard showing saved resume cards and "Create New Resume" button.

---

## Phase 3: Session-Based Multi-Step Resume Builder
**Goal**: 7-Step session wizard for user inputs.

### Backend Developer Tasks:
- Implement `Resume`, `PersonalInfo`, `Experience`, `Education`, `Project`, and `Skill` database models.
- Build CRUD & session auto-save APIs (`PUT /api/v1/resumes/<id>/session/step-X`).
- Validate input data in `validators/resume_validator.py`.

### Frontend Developer Tasks:
- Build Multi-step Wizard state container.
- Create forms for:
  - Step 1: Personal Information
  - Step 2: Summary / Objective
  - Step 3: Work Experience (Dynamic add/remove experience entries)
  - Step 4: Education & Certifications
  - Step 5: Projects & Accomplishments
  - Step 6: Skills & Languages
- Implement auto-save on "Next" / step change.

---

## Phase 4: Template Selector & Real-Time Preview
**Goal**: Display resume designs and live updates.

### Backend Developer Tasks:
- Seed template metadata (`TEMPLATES` table).
- Build `/api/v1/templates` endpoint.

### Frontend Developer Tasks:
- Build Template Selection UI (Session Step 7).
- Create client-side Live Resume Preview component using template layouts (Modern Minimalist, Classic, Tech ATS).
- Add color customization sliders/pickers.

---

## Phase 5: PDF Generation & Export Engine
**Goal**: One-click PDF resume download.

### Backend Developer Tasks:
- Integrate WeasyPrint / ReportLab / Puppeteer PDF engine in Flask (`utils/pdf_generator.py`).
- Implement `/api/v1/resumes/<id>/export/pdf` returning downloadable PDF stream.

### Frontend Developer Tasks:
- Wire "Download PDF" button to trigger file download stream.
- Provide loading progress spinner during PDF rendering.

---

## Phase 6: Testing, Polish & Deployment
- **Backend Deployment**: Deploy Flask app to Render (`Deployment_render.md`).
- **Frontend Deployment**: Deploy Frontend app to Vercel (`Deployment_vercel.md`).
- **End-to-End Testing**: Verify full flow from Landing Page -> Auth -> Create Resume Sessions -> Template Selection -> Download PDF.
