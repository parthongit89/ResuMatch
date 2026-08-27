# ResuMatch - Project Rules & Development Standards

## 1. Git Workflow & Branching
- **Default Branch**: `main` (Production ready).
- **Feature Branches**:
  - `feat/backend-auth`
  - `feat/backend-sessions`
  - `feat/frontend-landing`
  - `feat/frontend-wizard`
- **Commit Message Format**:
  - `feat: Add JWT authentication middleware`
  - `fix: Resolve session step 3 auto-save bug`
  - `docs: Update Architecture.md with database schema`

---

## 2. Unified API Response Protocol
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

## 3. Code Quality Standards
- **Backend (Python / Flask)**:
  - PEP8 compliance.
  - Mandatory type hinting where applicable.
  - Absolute imports relative to `src/`.
  - All database queries isolated inside `repositories/`.
  - Business logic strictly inside `services/`.
- **Frontend (React / JS / TS)**:
  - ESLint & Prettier rules.
  - Modular component structure (`components/common`, `components/builder`, `components/templates`).
  - Strict prop validation.

---

## 4. Environment Variables Specification
Create a `.env` file based on `.env.example`:

```ini
# Flask Config
FLASK_ENV=development
SECRET_KEY=super-secret-key-change-in-production
PORT=5000

# Database Config
DATABASE_URL=sqlite:///resumatch.db

# JWT Config
JWT_SECRET_KEY=jwt-secret-key-resumatch
JWT_EXPIRATION_HOURS=24

# CORS Config
FRONTEND_URL=http://localhost:3000
```
