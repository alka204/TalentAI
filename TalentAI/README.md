# TalentAI — AI Interview Simulation Platform

**Phase 1: Architecture, folder structure, dependencies, initial setup, routing & theme.**

This phase lays the production foundation for both frontend and backend. No feature
logic beyond auth (register/login/me/forgot-password) and route/page scaffolding is
built yet — that comes in later phases per the build plan.

---

## Monorepo layout

```
TalentAI/
├── frontend/          React 19 + Vite + Tailwind SPA
└── backend/           Node.js + Express + MongoDB API
```

---

## Frontend (`/frontend`)

```
src/
├── components/
│   ├── common/        ProtectedRoute, Loader — cross-cutting UI helpers
│   ├── layout/         Navbar, Footer — public site chrome
│   ├── dashboard/      Sidebar, Topbar, StatCard, PageHeader
│   ├── landing/         Features, HowItWorks, Testimonials, Pricing, FAQ, CTA
│   ├── interview/       LiveEvaluation (in-session heuristic signals panel)
│   └── ui/             (reserved for a later phase: Button, Modal, Badge primitives)
├── pages/
│   ├── LandingPage.jsx
│   ├── auth/           Login, Signup, ForgotPassword
│   ├── dashboard/       Overview, ResumeUpload, InterviewHistory, Profile
│   └── interview/       InterviewSetup, MockInterview, InterviewResult
├── layouts/            MainLayout (public), DashboardLayout (authenticated app shell)
├── context/            AuthContext — global auth state, token persistence
├── services/           api.js (axios instance + interceptors), authService.js
├── hooks/              useDebounce (first of the reusable hook set)
├── utils/              constants.js — roles, experience levels, durations, difficulty
└── assets/
```

**Routing** (`react-router-dom`, wired in `src/App.jsx`):

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/login`, `/signup`, `/forgot-password` | Public | Auth |
| `/dashboard` | Protected | Overview |
| `/dashboard/resume` | Protected | Resume upload |
| `/dashboard/interview/setup` | Protected | Interview setup |
| `/dashboard/interview/session` | Protected | Mock interview |
| `/dashboard/interview/result` | Protected | Interview result |
| `/dashboard/history` | Protected | Interview history |
| `/dashboard/profile` | Protected | Profile |
| `*` | — | 404 |

`ProtectedRoute` reads auth state from `AuthContext` and redirects unauthenticated
users to `/login`, preserving the originally requested page.

**Theme** — implemented as Tailwind design tokens in `tailwind.config.js` matching the
brief exactly (background `#050816`, secondary `#0B1220`, card `#111827`, accent
`#3B82F6`, success `#22C55E`, error `#EF4444`, text `#F8FAFC`), plus glassmorphism
(`.glass`, `.glass-card`), gradient utilities, and shared `btn-primary` / `btn-secondary`
/ `input-field` component classes in `src/index.css`.

### Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## Backend (`/backend`)

```
config/          db.js (Mongo), cloudinary.js, gemini.js
controllers/     authController, resumeController, interviewController,
                  resultController, historyController
routes/          authRoutes, resumeRoutes, interviewRoutes, historyRoutes, dashboardRoutes
models/          User, Resume, Interview, InterviewResult, History
middleware/      authMiddleware (JWT), errorMiddleware, uploadMiddleware (resume PDFs),
                  uploadImageMiddleware (profile photos), validateRequest (express-validator)
services/        cloudinaryService, geminiService, resumeParserService, pdfReportService
utils/           generateToken
server.js        App entry point — security middleware, rate limiting, route mounting
```

**Auth flow implemented now:** register, login, get current user (`/api/auth/me`),
and a forgot-password stub that issues a reset token (email delivery to be wired up
in a later phase). Passwords are hashed with bcrypt; sessions are stateless JWTs.

**Everything else** (resume parsing, Gemini question generation/evaluation, Cloudinary
upload) has working controllers/services already scaffolded and wired to real routes,
ready to be exercised once `GEMINI_API_KEY` and Cloudinary credentials are set — full
UI integration and polish for these lands in Phase 2+.

### Setup

```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*, GEMINI_API_KEY
npm install
npm run dev
```

---

## Build plan

- [x] **Phase 1** — Architecture, folder structure, dependencies, initial setup, routing, theme
- [x] **Phase 2** — Landing page full content (features, how-it-works, testimonials, pricing, FAQ, CTA)
- [x] **Phase 3** — Resume upload/parsing wired end-to-end + live dashboard overview stats
- [x] **Phase 4** — Interview setup wired to Gemini (real question generation) + handoff into the session
- [x] **Phase 5** — Full mock interview session: timer, start/pause/finish state machine, live transcript (Web Speech API), live heuristic evaluation signals
- [x] **Phase 6** — Interview Result screen wired to the real Gemini-scored report, question-by-question analysis, and PDF report download
- [x] **Phase 7** — Interview History (search/filter/sort/retake/delete) + Profile editing (name + photo) wired to real endpoints
- [ ] **Phase 3** — Resume upload/parsing end-to-end + dashboard overview data
- [ ] **Phase 4** — Interview setup + Gemini question generation wired to UI
- [ ] **Phase 5** — Mock interview screen (webcam, timer, live transcript, live evaluation)
- [ ] **Phase 6** — Interview result screen + PDF report generation
- [ ] **Phase 7** — Interview history (search/filter/sort/retake/delete) + profile management
- [ ] **Phase 8** — Deployment (Vercel + Render + Atlas) and hardening
