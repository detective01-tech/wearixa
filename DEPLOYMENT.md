# Wearixa Deployment Guide (Railway)

This project is a monorepo containing a **Node.js/Express Backend** and a **Next.js Frontend**.

## 1. Prerequisites
- A [Railway.app](https://railway.app/) account.
- Your GitHub repository: `https://github.com/detective01-tech/wearixa`.

---

## 2. Railway Project Setup
1. Click **New Project** in Railway.
2. Select **Provision MongoDB**. This will create your database.
3. Wait for MongoDB to deploy, then click on it, go to **Variables**, and copy the `MONGO_URL`.

---

## 3. Backend Deployment
1. Click **New** -> **GitHub Repo** -> `wearixa`.
2. **Settings**:
   - **Root Directory**: `/backend`
   - **Install Command**: `npm install`
   - **Start Command**: `npm start`
3. **Variables**:
   - `MONGO_URI`: (Paste the `MONGO_URL` from your Railway MongoDB service).
   - `JWT_SECRET`: (Create a strong random string).
   - `PORT`: 5000 (Railway will override this, but good to set).
   - `NODE_ENV`: production
4. **Networking**:
   - Generate a Domain (e.g., `wearixa-backend.up.railway.app`). **Copy this URL**.

---

## 4. Frontend Deployment
1. Click **New** -> **GitHub Repo** -> `wearixa` (yes, again).
2. **Settings**:
   - **Root Directory**: `/frontend`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
3. **Variables**:
   - `NEXT_PUBLIC_API_URL`: (Paste your Backend URL + `/api`, e.g., `https://wearixa-backend.up.railway.app/api`).
4. **Networking**:
   - Generate a Domain (e.g., `wearixa.up.railway.app`).

---

## 5. Final Checklist
- [ ] Backend is running and shows "API is running..." at the root URL.
- [ ] Frontend environment variable `NEXT_PUBLIC_API_URL` exactly matches the backend API endpoint.
- [ ] MongoDB is provisioned and the URI is correctly linked to the Backend service.
