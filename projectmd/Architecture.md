# ResuMatch - System Architecture & Backend Specs

## 1. System Overview
ResuMatch follows a **decoupled Client-Server Architecture**:
- **Backend (Python / Flask Framework)**: Complete Flask RESTful API service handling Verification (OTP/SendGrid/Firebase), Dashboard Features (Overview, Downloads, Notifications, Subscription), 4-Session State Management, Database ORM (SQLAlchemy), and PDF Export engine.
- **Frontend**: UI handling Landing Page (`Landing.html`), Auth (`login.html`, `signup.html`, `otp-verify.html`), Dashboard (`home.html`), 4-Session Wizard, Live Preview state engine, and Template renderer.

---

## 2. Repository Directory & File Storage Breakdown

Here is where both **Frontend Developer** and **Backend Developer** store their files:

```
ResuMatch/
├── .env
├── .env.example
├── .gitignore
├── README.md
├── Modules/
│   ├── Folder_based_structure.md
│   ├── Session architecture.png
│   ├── Verification_arc.png
│   └── features.png
├── projectmd/
│   ├── PRD.md
│   ├── Architecture.md
│   ├── Phases.md
│   ├── rules.md
│   └── ...
├── frontend/                        # <--- FRONTEND DEVELOPER STORAGE LOCATION
│   ├── Landing.html                # Landing Page
│   ├── login.html                  # Login Page / Modal
│   ├── signup.html                 # Signup Page / Modal
│   ├── otp-verify.html             # OTP Verification Page / Modal
│   ├── home.html                   # Dashboard Page (Authenticated User)
│   ├── assets/
│   │   ├── css/                    # Tailwind / Custom CSS
│   │   ├── js/                     # Client-side JavaScript / Axios HTTP handlers
│   │   └── images/                 # UI Logos, Banners, Screenshots
│   └── components/                 # Reusable UI Components & Session Forms
└── src/                            # <--- BACKEND DEVELOPER STORAGE LOCATION
    ├── app.py                      # Flask App Factory (create_app)
    ├── config/                     # Configuration (Dev, Production)
    ├── controllers/                # REST API Controllers
    ├── services/                   # Business Logic & OTP/PDF Services
    ├── repositories/               # Database Queries
    ├── models/                     # SQLAlchemy Database Schemas
    ├── routes/                     # Flask Blueprints & Routes
    ├── validators/                 # Payload Schema Validators
    ├── middleware/                 # JWT Auth & Error Handlers
    └── utils/                      # Helper Functions (OTP, Email, PDF)
```

---

## 3. Frontend File Storage Guidance for Colleague

When your frontend colleague creates `login.html`, `signup.html`, and `Landing.html`, they should store them under `frontend/` as follows:

| File Name | Storage Path | Purpose |
|---|---|---|
| **Landing Page** | `frontend/Landing.html` (or `frontend/index.html`) | Main landing page showcasing features and "Get Started" buttons |
| **Login Page** | `frontend/login.html` | User login form connecting to `POST /api/v1/auth/login` |
| **Signup Page** | `frontend/signup.html` | User registration form connecting to `POST /api/v1/auth/signup` |
| **OTP Verification**| `frontend/otp-verify.html` | OTP code entry form connecting to `POST /api/v1/auth/verify-otp` |
| **Dashboard** | `frontend/home.html` | User dashboard displaying stats, downloads, and "Create New Resume" |
| **Styles & Assets** | `frontend/assets/css/` & `frontend/assets/js/` | CSS stylesheets, images, and API fetch scripts |

*(Note: If using Flask Jinja2 templates instead of a separate single-page app, these files can alternatively be placed inside `src/templates/` and `src/static/`)*.
