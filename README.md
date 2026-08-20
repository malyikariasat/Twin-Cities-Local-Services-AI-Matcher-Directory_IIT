# 📸 Project Screenshots

## 🏠 Home Page

![Home Page](screenshots/home.png)

![Home Page](screenshots/home1.png)

![Home Page](screenshots/home2.png)

---

## 👨‍🔧 Provider Directory

![Provider Directory](screenshots/provider.png)

![Provider Directory](screenshots/provider1.png)

---

## 🚨 Emergency Services

![Emergency Services](screenshots/emergency.png)

![Emergency Services](screenshots/emergency1.png)

---

## 🤖 AI Recommendation

![AI Recommendation](screenshots/ai1.png)

---

## 👤 Account / Authentication

![Account](screenshots/account.png)

## Deployment

The Vite frontend and Express backend must be deployed separately. Vercel is currently serving the frontend, but it does not run `backend/server.js` automatically.

Deploy the `backend` directory to a Node hosting service such as Render or Railway with these environment variables:

```text
MONGO_URI=<your MongoDB connection string>
GROQ_API_KEY=<your Groq API key>
PORT=5000
```

Then add this environment variable to the Vercel frontend project and redeploy:

```text
VITE_API_URL=https://<your-backend-host>/api
```