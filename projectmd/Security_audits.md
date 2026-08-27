# ResuMatch - Security & Data Privacy Guidelines

## 1. Authentication Security
- Passwords MUST be hashed using strong one-way hashing algorithms (`bcrypt` with cost factor 12 or `argon2id`). Never store plain text passwords.
- JWT (JSON Web Tokens) generated upon login must have a reasonable expiration limit (e.g., 24 hours).
- Access tokens stored on the client should be transmitted via `Authorization: Bearer <token>` HTTP headers.

---

## 2. CORS & Network Security
- Restrict Cross-Origin Resource Sharing (CORS) in Flask to trusted frontend domains (`FRONTEND_URL`).
- Disable `Access-Control-Allow-Origin: *` in production environments.
- Enforce HTTPS across all API routes when deployed.

---

## 3. Input Validation & Injection Protection
- Sanitize all user input fields across all 7 resume sessions to prevent Cross-Site Scripting (XSS) and SQL Injection.
- Use SQLAlchemy ORM parameterized queries exclusively. Avoid executing raw SQL strings.
- Validate request payload bodies against Marshmallow / Pydantic / custom Flask validators before DB interaction.

---

## 4. Rate Limiting & Protection
- Implement rate limiting (`Flask-Limiter`) on sensitive endpoints:
  - `/api/v1/auth/login`: Max 5 attempts per minute.
  - `/api/v1/auth/register`: Max 3 attempts per hour per IP.
  - `/api/v1/resumes/<id>/export/pdf`: Max 10 PDF generations per minute per user.
