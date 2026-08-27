# ResuMatch - Project Rules & Development Standards

## 1. Git Workflow & Branching
- **Default Branch**: `main` (Production ready).
- **Feature Branches**:
  - `feat/backend-auth`
  - `feat/backend-sessions`
  - `feat/frontend-landing`
  - `feat/frontend-wizard`
- **Commit Message Format**:
  - `feat: Add Flask JWT authentication middleware`
  - `fix: Resolve session step 3 auto-save bug`
  - `docs: Update Architecture.md with database schema`

---

## 2. Credentials & Security Rules
- **Credentials Provisioning**: Real secrets (Database connection strings, API keys, JWT secrets, SMTP credentials) will be supplied by the user during deployment/runtime setup.
- **Never Commit Credentials**: Never commit `.env` files or hardcoded passwords to Git. All secret variables MUST be referenced via `os.getenv()` in `src/config/config.py`.
- **Environment Template**: A complete `.env.example` file must be maintained with placeholder keys so any developer can easily plug in credentials.

---

## 3. Unified API Response Protocol
All Flask REST API endpoints must return standardized JSON payloads:

### Success Response:
```json
{
  "success": true,
  "message": "Session 1 personal details updated successfully",
  "data": {
    "resume_id": "123e4567-e89b-12d3-a456-426614174000",
    "current_session_step": 1,
    "personal_info": {
      "full_name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    }
  ]
}
```

---

## 4. Flask Backend Coding & Library Standards
- **Framework**: `Flask 3.x` app factory pattern (`create_app()`).
- **ORM & DB**: `Flask-SQLAlchemy` with explicit models and `Flask-Migrate` for schema changes.
- **Auth**: `Flask-JWT-Extended` with `@jwt_required()` decorators for protected routes.
- **Validation**: Marshmallow schemas (`marshmallow`) for request body parsing and sanitization.
- **CORS**: `Flask-CORS` configured with explicit allowed origins.
- **Rate Limiting**: `Flask-Limiter` applied to public auth routes (`/api/v1/auth/login`, `/api/v1/auth/register`).
- **PDF Export**: `WeasyPrint` HTML-to-PDF rendering inside `src/utils/pdf_generator.py`.
- **PEP8 Compliance**: Standard Python formatting, explicit imports, typing hints.
