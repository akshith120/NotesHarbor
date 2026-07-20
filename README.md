<h1 align="center">📝 NotesHarbor — MERN Note Taking App ✨</h1>

Highlights:

- 🧱 Full-Stack App Built with the MERN Stack (MongoDB, Express, React, Node)
- ✨ Create, Update, and Delete Notes with Title, Content, and Tags
- 🏷️ User-scoped tag chips with quick select and custom tag creation
- 🔐 MongoDB user auth with JWT login and registration
- 🤖 BYOK Gemini AI summarizer with optional key takeaways mode
- 🌗 Dark mode, polished surfaces, and clearer UI sections
- 🚀 Responsive layout with a single Render deployment path

---

## ✅ Notable Features & Changes

- Notes are now tied to a logged-in user account.
- Login and registration are handled with JWT-based auth.
- Tags can be reused from chip blocks or added on demand.
- Gemini API keys stay in the browser and are tested before saving.
- Individual notes can be summarized or turned into key takeaways on demand.
- The UI now includes dark mode, a custom favicon, and stronger visual separation between sections.

## 🧪 .env Setup

### Backend (`/backend`)

```
MONGO_URI=<your_mongo_uri>

UPSTASH_REDIS_REST_URL=<your_redis_rest_url>
UPSTASH_REDIS_REST_TOKEN=<your_redis_rest_token>

JWT_SECRET=<your_jwt_secret>

NODE_ENV=development
```

The Google Gemini API key is not stored in the backend. Each user saves it locally in the browser from the app's Settings card.

When you save a Gemini key, the app verifies it through the backend and then stores it only in localStorage.

## 🔧 Run the Backend

```
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```
cd frontend
npm install
npm run dev
```

## 🚀 Free Deployment

The simplest free setup is:

1. Host the app on Render as a single Web Service.
2. Use MongoDB Atlas free tier for `MONGO_URI`.
3. Use Upstash free Redis for the rate limiter env vars.

### Render settings

- Build command: `npm run build`
- Start command: `npm start`
- Node version: `18+`

### Required environment variables

Set these in Render:

```bash
MONGO_URI=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NODE_ENV=production
```

### Deploy steps

1. Push this repo to GitHub.
2. Create a free MongoDB Atlas cluster and copy the connection string into `MONGO_URI`.
3. Create a free Upstash Redis database and copy its REST URL and token.
4. Create a new Render Web Service from the GitHub repo.
5. Add the env vars above.
6. Deploy.

### What this repo already does for deployment

- The frontend API client uses `/api` in production, so it works on the same domain.
- The backend serves the built frontend from `frontend/dist` in production.
