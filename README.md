# 🔗 URL Shortener & Analytics Platform

A full-stack URL shortening platform that allows users to create short URLs, track clicks, set expiration dates, and manage their URLs through an authenticated dashboard.

The application uses **Google OAuth for authentication**, **JWT-based sessions with HTTP-only cookies**, **MongoDB Atlas for data storage**, and is deployed using **Vercel + Render**.

---

## 🌐 Live Application

**Frontend:** https://url-shortener-flame-eight.vercel.app/

**Backend API:** https://url-shortener-nq82.onrender.com/

---

## ✨ Features

- 🔐 Google OAuth authentication
- 🍪 Secure JWT authentication using HTTP-only cookies
- 🔗 Generate short URLs using NanoID
- 📊 Track total clicks
- 🕒 Track last clicked time
- ⏳ Optional URL expiration
- 👤 User-specific URL history
- 🗑️ Delete individual URLs
- 🧹 Clear all URLs
- 🚦 Rate limiting for URL creation
- 🌐 CORS protection
- 📱 Responsive UI
- ☁️ Production deployment
- 🗄️ MongoDB Atlas database

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- JavaScript
- CSS
- React Router
- Google Identity Services

## Backend

- Node.js
- Express.js
- REST API
- Mongoose
- JWT
- Google OAuth / Google Identity Services
- Cookie Parser
- CORS
- Express Rate Limit
- NanoID

## Database

- MongoDB Atlas

## Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Browser  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React + Vite       │
                    │      Vercel          │
                    └──────────┬───────────┘
                               │
                    HTTPS / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Node.js + Express   │
                    │       Render         │
                    └───────┬───────┬──────┘
                            │       │
                  ┌─────────┘       └─────────┐
                  ▼                           ▼
        ┌──────────────────┐        ┌──────────────────┐
        │ Authentication   │        │ URL Management   │
        │ Google OAuth     │        │ Shortening       │
        │ JWT Cookies      │        │ Analytics        │
        └──────────────────┘        │ Expiration       │
                                    └────────┬─────────┘
                                             │
                                             ▼
                                  ┌────────────────────┐
                                  │   MongoDB Atlas     │
                                  │ Users + URLs        │
                                  └────────────────────┘
```

---

# 🔄 Application Flow

## 1. User Authentication Flow

```text
User
 │
 ▼
React Login Page
 │
 ▼
Google Sign-In
 │
 ▼
Google returns ID Token
 │
 ▼
React sends credential
to Backend
 │
 ▼
Express Backend
 │
 ▼
Google Token Verification
 │
 ▼
Find/Create User
in MongoDB
 │
 ▼
Generate JWT
 │
 ▼
Store JWT in
HTTP-only Cookie
 │
 ▼
Authenticated User
```

### What happens?

1. The user clicks **Sign in with Google**.
2. Google authenticates the user.
3. Google provides an ID token to the frontend.
4. The frontend sends that credential to the backend.
5. The backend verifies the token using Google's authentication library.
6. The backend finds the user in MongoDB or creates a new user.
7. The backend generates a JWT.
8. The JWT is stored in an **HTTP-only cookie**.
9. Future authenticated requests automatically include the cookie.

---

# 🔗 URL Creation Flow

```text
User enters Original URL
          │
          ▼
     React Frontend
          │
          │ POST /api/urls
          ▼
    Authentication
       Middleware
          │
          ▼
     Rate Limiter
          │
          ▼
   URL Controller
          │
          ▼
     Generate NanoID
          │
          ▼
      MongoDB
          │
          ▼
   Short URL Created
          │
          ▼
    Return Response
          │
          ▼
      React UI
```

Example:

```text
Original URL:
https://www.example.com/some/very/long/url

Generated short code:
aB7xK2

Short URL:
https://url-shortener-nq82.onrender.com/aB7xK2
```

---

# ↪️ URL Redirection Flow

When someone opens a short URL:

```text
User
 │
 ▼
GET /aB7xK2
 │
 ▼
Express Server
 │
 ▼
Find shortCode in MongoDB
 │
 ├── Not Found ──────► 404
 │
 ▼
Check Expiration
 │
 ├── Expired ─────────► 410
 │
 ▼
Increment Click Count
 │
 ▼
Update Last Clicked Time
 │
 ▼
Redirect to Original URL
```

The backend performs:

```text
clicks = clicks + 1
lastClickedAt = current time
```

before redirecting the user.

---

# 📊 Click Analytics Flow

```text
Short URL Opened
       │
       ▼
Find URL Document
       │
       ▼
Increment clicks
       │
       ▼
Update lastClickedAt
       │
       ▼
Redirect User
       │
       ▼
Dashboard displays
updated analytics
```

The application currently tracks:

- Total clicks
- Last clicked time
- URL creation time
- Expiration time

---

# ⏳ URL Expiration Flow

Users can optionally provide an expiration time.

```text
Create URL
    │
    ▼
Save expiresAt
    │
    ▼
User opens short URL
    │
    ▼
Check current time
against expiresAt
    │
    ├── Not expired ──► Redirect
    │
    └── Expired ──────► Return 410
```

If no expiration is specified:

```text
expiresAt = null
```

and the URL does not expire.

---

# 🔐 Authentication & Authorization

The application uses two stages:

```text
Google OAuth
     │
     ▼
Identity Verification
     │
     ▼
JWT Generation
     │
     ▼
HTTP-only Cookie
     │
     ▼
Protected API Requests
     │
     ▼
JWT Verification Middleware
     │
     ▼
req.user.userId
```

Protected routes verify the JWT before allowing access.

For example:

```text
POST /api/urls
GET  /api/urls
DELETE /api/urls/:id
DELETE /api/urls
```

Only authenticated users can access these routes.

---

# 🍪 Why HTTP-only Cookies?

The JWT is stored in an HTTP-only cookie.

```text
Browser
   │
   │ HTTP request
   ▼
Backend
   │
   ▼
HTTP-only JWT Cookie
```

JavaScript cannot directly access an HTTP-only cookie.

This reduces the risk of client-side scripts stealing the authentication token through XSS.

For production, the cookie uses:

```text
secure: true
sameSite: none
httpOnly: true
```

---

# 🚦 Rate Limiting

URL creation is rate-limited to prevent abuse.

Current configuration:

```text
20 URL creation requests
per
15 minutes
```

Flow:

```text
Request
   │
   ▼
Rate Limiter
   │
   ├── Within limit ──► Controller
   │
   └── Limit exceeded ► 429 Response
```

Rate limiting is applied specifically to the URL creation endpoint.

---

# 🌐 CORS

The frontend and backend are deployed on different domains.

```text
Vercel
https://url-shortener-flame-eight.vercel.app
              │
              │ API requests
              ▼
Render
https://url-shortener-nq82.onrender.com
```

The backend allows requests from the configured frontend origin.

```text
FRONTEND_URL=
https://url-shortener-flame-eight.vercel.app
```

Credentials are enabled because authentication uses cookies.

---

# 🗄️ Database Design

The application uses two main MongoDB collections.

## User

```text
User
├── googleId
├── name
├── email
├── picture
├── createdAt
└── updatedAt
```

## URL

```text
Url
├── originalUrl
├── shortCode
├── clicks
├── lastClickedAt
├── expiresAt
├── user
├── createdAt
└── updatedAt
```

Relationship:

```text
User
 │
 │ 1
 │
 │
 │ many
 ▼
URLs
```

Each URL belongs to a specific authenticated user.

---

# 🧩 Project Structure

```text
url-shortener/
│
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   │
│   └── src/
│       ├── config/
│       │   └── db.js
│       │
│       ├── models/
│       │   ├── Url.js
│       │   └── User.js
│       │
│       ├── controllers/
│       │   ├── urlController.js
│       │   └── authController.js
│       │
│       ├── routes/
│       │   ├── urlRoutes.js
│       │   └── authRoutes.js
│       │
│       ├── middleware/
│       │   └── authMiddleware.js
│       │
│       └── server.js
│
├── frontend/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   │
│   └── src/
│       ├── components/
│       ├── context/
│       │   ├── AuthContext.js
│       │   ├── AuthProvider.jsx
│       │   └── useAuth.js
│       │
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
└── README.md
```

---

# 🔌 API Endpoints

## Authentication

### Google Login

```http
POST /api/auth/google
```

Used to authenticate a user with Google's ID token.

### Get Current User

```http
GET /api/auth/me
```

Returns the currently authenticated user.

### Logout

```http
POST /api/auth/logout
```

Clears the authentication cookie.

---

## URL APIs

### Create Short URL

```http
POST /api/urls
```

Requires authentication.

Example request:

```json
{
  "originalUrl": "https://example.com",
  "expiresAt": "2026-12-31T23:59:59.000Z"
}
```

### Get User URLs

```http
GET /api/urls
```

Returns URLs belonging to the authenticated user.

### Delete One URL

```http
DELETE /api/urls/:id
```

### Delete All URLs

```http
DELETE /api/urls
```

### Redirect

```http
GET /:shortCode
```

Redirects the user to the original URL.

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id

JWT_SECRET=your_long_random_secret

FRONTEND_URL=http://localhost:5173

NODE_ENV=development
```

For production:

```env
NODE_ENV=production
FRONTEND_URL=https://url-shortener-flame-eight.vercel.app
```

## Frontend `.env`

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id

VITE_API_URL=http://localhost:5000
```

For production:

```env
VITE_API_URL=https://url-shortener-nq82.onrender.com
```

> Never commit `.env` files or secrets to GitHub.

---

# 💻 Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/VarunSahu05/url-shortener.git
cd url-shortener
```

---

## 2. Install backend dependencies

```bash
cd backend
npm install
```

---

## 3. Configure backend environment variables

Create:

```text
backend/.env
```

and add the required values.

---

## 4. Start backend

Development:

```bash
npm run dev
```

Or:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 6. Configure frontend environment variables

Create:

```text
frontend/.env
```

Add:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_API_URL=http://localhost:5000
```

---

## 7. Start frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🔑 Google OAuth Configuration

Create a Google OAuth Web Application client in Google Cloud.

Add the development origin:

```text
http://localhost:5173
```

Add the production origin:

```text
https://url-shortener-flame-eight.vercel.app
```

The same Google Client ID is used by both frontend and backend, but through different environment variable names:

```text
Frontend:
VITE_GOOGLE_CLIENT_ID

Backend:
GOOGLE_CLIENT_ID
```

---

# ☁️ Deployment Architecture

```text
                    INTERNET
                       │
                       ▼
        ┌────────────────────────────┐
        │          Vercel            │
        │                            │
        │    React + Vite Frontend   │
        └─────────────┬──────────────┘
                      │
                      │ HTTPS API Requests
                      ▼
        ┌────────────────────────────┐
        │          Render            │
        │                            │
        │   Node.js + Express API    │
        └─────────────┬──────────────┘
                      │
                      │ MongoDB Connection
                      ▼
        ┌────────────────────────────┐
        │       MongoDB Atlas        │
        │                            │
        │    Users + URL Documents   │
        └────────────────────────────┘
```

---

# 🛡️ Security Measures

The application implements several basic production security practices:

### Authentication

- Google OAuth
- JWT authentication
- HTTP-only cookies
- Secure production cookies

### API Security

- CORS restriction
- Authentication middleware
- Rate limiting
- Environment variables for secrets

### Data Isolation

Users can only retrieve and delete URLs associated with their own user ID.

Example:

```js
Url.find({
    user: req.user.userId
});
```

This prevents one authenticated user from viewing another user's URL history.

---

# 📈 Future Improvements

Possible future features include:

- QR code generation for short URLs
- Detailed analytics dashboard
- Browser/device analytics
- Geographic analytics
- Custom aliases
- Link preview
- Bulk URL creation
- API keys for developers
- Redis-based rate limiting
- Background cleanup of expired URLs
- Email-based authentication
- Admin dashboard

---

# 🎯 Key Design Decisions

## Why MongoDB?

The application's data is document-oriented and has a relatively simple structure. MongoDB works naturally with Node.js and provides flexible schemas.

## Why NanoID?

NanoID generates compact, URL-friendly, unique identifiers that are shorter than typical database IDs.

## Why JWT?

JWT allows the backend to authenticate requests without maintaining traditional server-side session storage.

## Why HTTP-only Cookies?

HTTP-only cookies prevent JavaScript from directly accessing the JWT, improving protection against token theft through XSS.

## Why Google OAuth?

Google handles the authentication process, so the application does not need to store user passwords.

## Why Vercel + Render?

Vercel provides convenient deployment for the React frontend, while Render provides a simple platform for running the Node.js backend.

---

# 🧪 Example User Journey

```text
1. User opens application
           │
           ▼
2. Signs in with Google
           │
           ▼
3. Backend verifies Google token
           │
           ▼
4. JWT stored in HTTP-only cookie
           │
           ▼
5. User enters long URL
           │
           ▼
6. Backend generates NanoID
           │
           ▼
7. URL stored in MongoDB
           │
           ▼
8. Short URL returned
           │
           ▼
9. User shares short URL
           │
           ▼
10. Someone opens short URL
           │
           ▼
11. Click count increases
           │
           ▼
12. User is redirected
```

---

# 📌 Project Highlights

- Full-stack MERN-style architecture
- OAuth-based authentication
- Secure cookie-based authorization
- RESTful API design
- MongoDB data modeling
- URL generation and redirection
- Analytics tracking
- Rate limiting
- CORS configuration
- Production deployment
- Responsive frontend

---

# 👨‍💻 Author

**Varun Sahu**

GitHub: https://github.com/VarunSahu05

---

## ⭐ Project Summary

This project demonstrates how a modern full-stack application can be designed, secured, connected to a database, authenticated using OAuth, and deployed to production.

It combines **frontend development, backend API development, authentication, database management, security, analytics, and cloud deployment** into one complete application.
