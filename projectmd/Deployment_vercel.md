# ResuMatch - Frontend Deployment Guide (Vercel)

This guide details deploying the Frontend application to **Vercel**.

---

## 1. Prerequisites
- Vercel account (vercel.com).
- GitHub repository connected to Vercel.

---

## 2. Configuration Steps
1. Log in to Vercel Dashboard and click **Add New...** -> **Project**.
2. Import `ResuMatch` repository.
3. Configure settings:
   - **Framework Preset**: Next.js / Create React App / Vite
   - **Root Directory**: `./` or `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist` or `.next`
4. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL` / `REACT_APP_API_URL` = `https://resumatch-api-jkau.onrender.com`
5. Click **Deploy**.
