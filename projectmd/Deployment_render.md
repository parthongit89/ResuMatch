# ResuMatch - Backend Deployment Guide (Render)

This guide details deploying the Flask Backend service to **Render**.

---

## 1. Prerequisites
- Render account (render.com).
- GitHub repository connected to Render (`https://github.com/parthongit89/ResuMatch.git`).
- `Procfile` and `requirements.txt` in backend root.

---

## 2. Configuration Steps
1. Log in to Render Dashboard and click **New +** -> **Web Service**.
2. Select the `ResuMatch` GitHub repository.
3. Configure settings:
   - **Name**: `resumatch-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn src.app:app`
4. Set Environment Variables:
   - `FLASK_ENV` = `production`
   - `SECRET_KEY` = `<strong-random-key>`
   - `DATABASE_URL` = `<Render-PostgreSQL-Internal-URL>`
   - `JWT_SECRET_KEY` = `<jwt-secret-key>`
   - `FRONTEND_URL` = `https://resumatch.vercel.app`
5. Click **Create Web Service**.
