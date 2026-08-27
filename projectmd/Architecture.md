# ResuMatch - System Architecture & Backend Specs

## 1. System Overview
ResuMatch follows a **decoupled Client-Server Architecture**:
- **Backend (Python / Flask Framework)**: Complete Flask RESTful API service handling Authentication, Resume Session State Management, Database ORM (SQLAlchemy), Rate Limiting, and PDF Export engine.
- **Frontend (React / Next.js / HTML+Tailwind)**: UI handling Landing Page, Auth flows, Multi-step Session Wizard, Live Preview state engine, and Template renderer.

---

## 2. Complete Flask Backend Libraries & Tech Stack

The backend is built strictly using **Python Flask** and its industry-standard ecosystem libraries:

| Category | Library / Package | Version / Purpose |
|---|---|---|
| **Core Framework** | `Flask` | Micro-web framework for routing and REST API controllers |
| **WSGI Server** | `gunicorn` | Production WSGI HTTP server for Render deployment |
| **Database ORM** | `Flask-SQLAlchemy` | ORM for database models, relationships, and queries |
| **Database Migrations**| `Flask-Migrate` / `Alembic` | Handles database schema migrations cleanly |
| **Database Drivers** | `psycopg2-binary` / `sqlite3` | PostgreSQL driver (Production) & SQLite (Local Dev) |
| **Authentication** | `Flask-JWT-Extended` | Secure JWT token generation, refreshing, and route protection |
| **Password Hashing** | `Werkzeug` / `bcrypt` | Secure password hashing (`generate_password_hash`, `check_password_hash`) |
| **CORS Protection** | `Flask-CORS` | Cross-Origin Resource Sharing control for frontend communication |
| **Validation & Schemas**| `marshmallow` / `pydantic` | Request payload validation and response serialization |
| **Rate Limiting** | `Flask-Limiter` | Protects endpoints against brute-force attacks and abuse |
| **PDF Generation Engine**| `WeasyPrint` / `ReportLab` | Converts HTML/CSS templates to pixel-perfect downloadable PDF resumes |
| **Environment Config** | `python-dotenv` | Loads environment credentials safely from `.env` files |
| **HTTP Client** | `requests` | Outbound HTTP requests for third-party integrations |

### Production `requirements.txt` Blueprint:
```txt
Flask==3.0.2
gunicorn==21.2.0
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.0.7
Flask-JWT-Extended==4.6.0
Flask-CORS==4.0.0
Flask-Limiter==3.5.0
marshmallow==3.21.1
psycopg2-binary==2.9.9
python-dotenv==1.0.1
WeasyPrint==61.2
requests==2.31.0
bcrypt==4.1.2
```

---

## 3. Directory Structure (Feature-Based Flask Config)

```
ResuMatch/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── Modules/
│   ├── Folder_based_structure.md
│   ├── Session architecture.png
│   └── Verification_arc.png
├── projectmd/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Phases.md
│   ├── rules.md
│   ├── Designs.md
│   ├── Security_audits.md
│   ├── Color_theory.md
│   ├── Typography_icons.md
│   ├── Deployment_render.md
│   ├── Deployment_vercel.md
│   ├── Update.md
│   └── skills.md
└── src/
    ├── app.py                      # Flask App Factory (create_app)
    ├── config/
    │   ├── config.py               # Config classes (Development, Production)
    │   └── database.py             # SQLAlchemy instance (db)
    ├── controllers/
    │   ├── auth_controller.py      # Auth Endpoints logic
    │   ├── resume_controller.py    # Resume Sessions logic
    │   ├── template_controller.py  # Template Gallery logic
    │   └── export_controller.py    # PDF Download logic
    ├── services/
    │   ├── auth_service.py
    │   ├── session_service.py
    │   ├── pdf_service.py
    │   └── overview/
    │       ├── Dashboard/
    │       ├── Downloads/
    │       ├── Notifications/
    │       ├── logout/
    │       └── subscriptions/
    ├── repositories/
    │   ├── user_repository.py      # Database query abstraction for User
    │   └── resume_repository.py    # Database query abstraction for Resumes
    ├── models/
    │   ├── user.py                 # SQLAlchemy User Model
    │   ├── resume.py               # SQLAlchemy Resume & Sessions Models
    │   └── template.py             # SQLAlchemy Template Model
    ├── routes/
    │   ├── auth_routes.py          # /api/v1/auth Blueprint
    │   ├── resume_routes.py        # /api/v1/resumes Blueprint
    │   └── template_routes.py      # /api/v1/templates Blueprint
    ├── validators/
    │   ├── auth_validator.py       # Marshmallow schemas for Auth
    │   └── resume_validator.py     # Marshmallow schemas for Sessions
    ├── middleware/
    │   ├── auth_middleware.py      # JWT validation wrappers
    │   └── error_middleware.py     # Global error handlers
    └── utils/
        ├── pdf_generator.py        # WeasyPrint PDF renderer
        └── response_helpers.py     # JSON response wrappers
```

---

## 4. Credentials & Environment Variable Management Protocol

All sensitive credentials (provided by the user) will be loaded securely using `python-dotenv` from `.env` and injected into Flask's `app.config`:

```ini
# Flask Core
FLASK_APP=src.app:create_app
FLASK_ENV=development
SECRET_KEY=user-provided-flask-secret-key

# Database Credentials
DATABASE_URL=postgresql://user:password@localhost:5432/resumatch_db

# Authentication Credentials
JWT_SECRET_KEY=user-provided-jwt-secret-key
JWT_ACCESS_TOKEN_EXPIRES_HOURS=24

# Third-Party / SMTP Credentials (Optional)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=user-provided-email@gmail.com
MAIL_PASSWORD=user-provided-app-password

# CORS Settings
FRONTEND_URL=http://localhost:3000
```

---

## 5. Database Schema Design (SQLAlchemy ORM)

```mermaid
erDiagram
    USERS ||--o{ RESUMES : owns
    RESUMES ||--o| PERSONAL_INFO : has
    RESUMES ||--o{ EXPERIENCES : contains
    RESUMES ||--o{ EDUCATIONS : contains
    RESUMES ||--o{ PROJECTS : contains
    RESUMES ||--o{ SKILLS : contains
    TEMPLATES ||--o{ RESUMES : formats

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        datetime created_at
    }

    RESUMES {
        uuid id PK
        uuid user_id FK
        string title
        integer current_session_step
        uuid selected_template_id FK
        datetime updated_at
    }

    PERSONAL_INFO {
        uuid id PK
        uuid resume_id FK
        string full_name
        string email
        string phone
        string location
        string linkedin_url
        string github_url
        string portfolio_url
        text summary
    }

    EXPERIENCES {
        uuid id PK
        uuid resume_id FK
        string company
        string role
        string location
        string start_date
        string end_date
        boolean is_current
        text description
    }

    EDUCATIONS {
        uuid id PK
        uuid resume_id FK
        string institution
        string degree
        string field_of_study
        string graduation_year
        string grade_gpa
    }

    PROJECTS {
        uuid id PK
        uuid resume_id FK
        string title
        string tech_stack
        string project_url
        text description
    }

    SKILLS {
        uuid id PK
        uuid resume_id FK
        string category
        string skill_name
        string proficiency_level
    }

    TEMPLATES {
        uuid id PK
        string name
        string thumbnail_url
        string layout_key
    }
```

---

## 6. API Endpoints Specification

### 6.1 Authentication (Flask Blueprint: `/api/v1/auth`)
- `POST /api/v1/auth/register`
  - **Body**: `{ "full_name": "...", "email": "...", "password": "..." }`
  - **Response**: `{ "success": true, "data": { "token": "...", "user": {...} } }`
- `POST /api/v1/auth/login`
  - **Body**: `{ "email": "...", "password": "..." }`
  - **Response**: `{ "success": true, "data": { "token": "...", "user": {...} } }`

### 6.2 Resume Sessions (Flask Blueprint: `/api/v1/resumes`)
- `POST /api/v1/resumes` -> Create new draft resume session.
- `GET /api/v1/resumes/<id>/session` -> Fetch complete draft data for all 7 sessions.
- `PUT /api/v1/resumes/<id>/session/step-1` -> Save Session 1 (Personal Info).
- `PUT /api/v1/resumes/<id>/session/step-2` -> Save Session 2 (Summary).
- `PUT /api/v1/resumes/<id>/session/step-3` -> Save Session 3 (Work Experience).
- `PUT /api/v1/resumes/<id>/session/step-4` -> Save Session 4 (Education).
- `PUT /api/v1/resumes/<id>/session/step-5` -> Save Session 5 (Projects).
- `PUT /api/v1/resumes/<id>/session/step-6` -> Save Session 6 (Skills).
- `PUT /api/v1/resumes/<id>/session/step-7` -> Save Session 7 (Template Selection).

### 6.3 Templates & Export (Flask Blueprint: `/api/v1/templates`)
- `GET /api/v1/templates` -> List available designs.
- `POST /api/v1/resumes/<id>/export/pdf` -> Generate and download PDF via WeasyPrint.
