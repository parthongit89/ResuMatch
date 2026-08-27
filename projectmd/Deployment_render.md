# ResuMatch - Backend Deployment Guide (Render)

This guide details deploying the Flask Backend service to **Render** and implementing the **Invisible Silent Background Warm-up Protocol (Solution 1)** to eliminate cold-start delays seamlessly.

---

## 1. Prerequisites
- Render account ([render.com](https://render.com)).
- GitHub repository connected to Render (`https://github.com/parthongit89/ResuMatch.git`).
- `Procfile` and `requirements.txt` in backend root.

---

## 2. Render Web Service Setup
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

---

## 3. Solution 1: Invisible Silent Background Warm-up Protocol

To prevent users from experiencing Render's ~30-50s free-tier cold start delay **without showing any Render UI, loaders, or logos**, we implement the **Silent Background Ping Protocol**:

### 3.1 Backend Health Endpoint (`src/routes/auth_routes.py` / `src/app.py`)
The Flask backend exposes a lightweight, non-blocking health check endpoint:

```python
@app.route('/api/v1/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "ResuMatch backend is awake"}), 200
```

### 3.2 Frontend Silent Activation Script (`frontend/Landing.html`)
When a user opens the ResuMatch Landing Page (`resumatch.vercel.app`), the frontend fires a non-blocking asynchronous `fetch` call to wake up Render in the background.

```javascript
// Silent Background Ping on Landing Page Mount (No UI spinners/loaders required)
document.addEventListener('DOMContentLoaded', () => {
  fetch('https://resumatch-api.onrender.com/api/v1/health', { method: 'GET', mode: 'cors' })
    .catch(() => {
      // Silently ignored - backend wakes up in background while user browses Landing Page
    });
});
```

### 3.3 User Experience Flow
1. User visits `resumatch.vercel.app` $\rightarrow$ Landing page opens instantly (<1 second).
2. Silent background ping triggers Render spin-up while user reads landing page content (15-30 seconds).
3. By the time user clicks **Login**, **Signup**, or **"Create Resume"**, the Flask backend is 100% warm and responds instantly (<200ms).
