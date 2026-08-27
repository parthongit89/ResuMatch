# ResuMatch - Product Requirements Document (PRD)

## 1. Project Context & Problem Statement
Job seekers and students frequently face rejections due to poorly structured, non-ATS compliant, or aesthetically unappealing resumes. Designing a professional resume manually in traditional word processors is time-consuming, prone to formatting errors, and lacks standard industry guidance.

**ResuMatch** solves this problem by offering a guided, session-based multi-step resume builder. Users input their details step-by-step in dedicated sessions, choose from curated professional designs, and download instant high-quality ATS-friendly resumes.

---

## 2. Team & Role Distribution
- **Backend Developer**: Responsible for Flask API, Database models, Session state persistence, Authentication (JWT), and PDF generation service.
- **Frontend Developer**: Responsible for UI/UX (Landing page, Auth modals/pages, Multi-step wizard, Live preview renderer, Template selector, PDF downloader).

---

## 3. Key User Journey & Workflow
1. **Landing Page**: Highlighting features, template showcase, CTA buttons ("Get Started", "Login / Signup").
2. **Authentication**: Sign up or log in via email/password or OAuth.
3. **Dashboard**: View previous resume drafts or click **"Create New Resume"**.
4. **Session-Based Form Builder**:
   - **Session 1**: Personal Details & Contact Links (Name, Title, Email, Phone, Location, LinkedIn, GitHub, Portfolio).
   - **Session 2**: Professional Summary / Objective statement.
   - **Session 3**: Work Experience (Role, Company, Location, Start/End Date, Bullet Points).
   - **Session 4**: Education & Certifications (Degree, Institution, Graduation Year, Score, Certificates).
   - **Session 5**: Key Projects (Title, Tech Stack, Description, Project URLs).
   - **Session 6**: Skills & Languages (Technical Skills, Tools, Soft Skills, Languages).
   - **Session 7**: Final Review & Template Selection.
5. **Preview & Export**: Real-time side-by-side template preview, customization options (fonts, colors), and one-click PDF download.

---

## 4. Feature Requirements Breakdown

### 4.1 Authentication & User Management
- User Registration (`POST /api/v1/auth/register`)
- User Login (`POST /api/v1/auth/login`)
- Current User Profile (`GET /api/v1/auth/me`)

### 4.2 Resume Session & Draft Management
- Create New Resume Draft (`POST /api/v1/resumes`)
- Session Auto-save (`PUT /api/v1/resumes/<id>/session/<step>`)
- Load Session Progress (`GET /api/v1/resumes/<id>/session`)
- Fetch All Saved Resumes (`GET /api/v1/resumes`)

### 4.3 Template Engine & Export
- List Available Templates (`GET /api/v1/templates`)
- Live Render API / Client-side Render Engine
- Download PDF (`GET /api/v1/resumes/<id>/export/pdf`)

---

## 5. Non-Functional Requirements
- **Performance**: Session auto-save response time <200ms.
- **Responsiveness**: Mobile & Desktop friendly wizard UI.
- **Security**: Password hashing (Bcrypt/Argon2), JWT token validation, CORS control.
- **Reliability**: Draft auto-save prevents data loss during session navigation.
