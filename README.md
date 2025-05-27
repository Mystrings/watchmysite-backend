# WatchMySite

A full-stack monitoring tool to check website status, SSL, DNS, and Lighthouse metrics.

## Features

- **Frontend (React)**
  - Enter a website URL
  - See HTTP status, SSL validity, DNS, and Lighthouse scores (Performance, SEO, Accessibility)
  - Modern, responsive card/grid UI

- **Backend (FastAPI)**
  - `/check` POST endpoint with `{ "url": "https://example.com" }`
  - Checks HTTP reachability, DNS, SSL, and runs Google Lighthouse via Node.js

---

## 📦 Setup

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Node.js & lighthouse required: npm install -g lighthouse
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

---

## 🚀 Deployment (Render.com)

- **Backend:** Deploy `backend/` as a "Web Service" (Python 3.11, install Node.js in build command, see below)
- **Frontend:** Deploy `frontend/` as a "Static Site"

### Backend: Render.com Settings

- **Build Command:**  
  `pip install -r requirements.txt && npm install -g lighthouse`
- **Start Command:**  
  `uvicorn main:app --host 0.0.0.0 --port 10000`
- **Environment**: Python 3.11, Node.js 20+ (add Node.js in Render build steps)
- **Service URL:** e.g., `https://watchmysite-backend.onrender.com`

### Frontend: Render.com Settings

- **Build Command:**  
  `npm install && npm run build`
- **Publish Directory:**  
  `frontend/build`
- **Environment Variable:**  
  Add `REACT_APP_API_URL=https://watchmysite-backend.onrender.com`

---

## 📂 File Structure

```
watchmysite/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       └── App.js
```

---

## 🧑‍💻 Notes

- Backend requires Node.js and the `lighthouse` CLI (`npm install -g lighthouse`)
- Make sure the backend server has Chrome/Chromium available for Lighthouse

---