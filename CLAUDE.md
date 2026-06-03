# DevHire — Claude Code Instructions

## Project overview
AI-powered MERN job board. Users post jobs, browse listings, and generate cover letters via Gemini API.

**Stack:** React + Redux Toolkit + Tailwind (frontend) · Node + Express + MongoDB Atlas (backend) · Gemini API (AI feature)
**Deploy:** Vercel (frontend) · Render (backend)
**Deadline:** June 13, 2026

## Project structure
```
devhire/
  client/
    src/
      components/     ← JobCard, JobForm, JobList, Navbar
      store/          ← Redux store, jobSlice
      services/       ← axios API calls (api.js)
      utils/          ← helper functions
  server/
    models/           ← Job.js (Mongoose schema)
    routes/           ← jobs.js, ai.js
    config/           ← db.js (MongoDB connection)
    server.js         ← Express app entry point
```

## The one rule that overrides everything
Dhruv is learning by doing. This is his first independent project.

- Never write complete features unprompted
- Always ask "what have you tried?" before giving code
- When he pastes broken code → ask what he thinks is wrong first
- Only write code when he is genuinely stuck after attempting
- When you do write code → comment every non-obvious line

## AI-assisted development scope
**Claude writes:** CSS/Tailwind classes, boilerplate (server setup, db connection, cors config), SDK integration patterns (Gemini API call structure)
**Dhruv writes:** all useState/useEffect/handlers, all Redux actions/selectors, all route logic (req/res), all data flow wiring, the Gemini prompt string itself
**Never:** write a complete component or route from scratch without seeing his attempt first

## Current learning level
- React + Redux: solid — hooks, state, useSelector, useDispatch done
- Backend: zero hands-on — first project, currently on first Dot Batch backend video
- Gemini API: conceptual understanding only
- Deployment: done before (FitPulse on Vercel + Render)

## V1 scope — nothing outside this list
- JobCard component (title, company, salary, description, generate button)
- JobForm component (4 fields: title, company, description, salary)
- JobList component (maps over jobs)
- Navbar component
- Redux store with jobSlice
- GET /api/jobs — fetch all jobs
- POST /api/jobs — save new job
- POST /api/ai/cover — Gemini cover letter generation
- MongoDB Job model (5 fields only)
- Loading + error states on AI call

**Not in V1:** auth, JWT, pagination, search/filter, user accounts, file upload

## MongoDB schema (do not expand)
```js
const JobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  description: { type: String, required: true },
  salary:      { type: String },
  createdAt:   { type: Date, default: Date.now }
})
```

## Code standards
- async/await everywhere, no .then() chains
- All secrets in .env — never hardcoded
- .env in .gitignore before first push
- axios for all HTTP calls, no fetch()
- functional components only, no class components
- loading + error state on every async operation
- console.log only for debugging, remove before deploy

## Environment variables
```
# client/.env
VITE_API_URL=http://localhost:5000

# server/.env
PORT=5000
MONGODB_URI=your_atlas_uri
GEMINI_API_KEY=your_key
```

## Common errors to watch for
- CORS: must configure before any frontend-backend connection
- Atlas IP whitelist: 0.0.0.0/0 for Render deployment
- Vite env vars: must start with VITE_ prefix
- Render cold start: backend sleeps on free tier, first request is slow

## Interview readiness check
Before marking any feature done, Dhruv should be able to answer:
1. What state does this component manage and why?
2. What happens step by step when this function runs?
3. What would break if you removed this line?

## Design system
> Extracted directly from DevHire.html design file. Claude must match this exactly.

### Fonts
```
Headings/Display : Instrument Serif (italic variant for accents)
UI/Body          : Geist, Inter, sans-serif (weight 400/600)
Mono/Labels      : Geist Mono, monospace (weight 400/600)
```
Import:
```
https://fonts.googleapis.com/css2?family=Geist:wght@400;600&family=Geist+Mono:wght@400;600&family=Instrument+Serif:ital@0;1&display=swap
```

### Color tokens — light mode (primary)
```js
bg        : '#FAF8F3'   // page background (warm cream)
surface   : '#FFFEFB'   // card/component background
surf2     : '#F7F5F0'   // secondary surface, hover bg
t1        : '#18181B'   // primary text
t2        : '#6B6965'   // secondary text / labels
t3        : '#A09D94'   // muted text / placeholders
border    : '#E8E4DA'   // all borders
accent    : '#5B4FF5'   // violet — primary CTA, links, focus
lime      : '#CDEB4A'   // lime — logo dot, AI badge, highlights
tagBg     : '#F1EEE5'   // tech tag background
tagHover  : '#E6E2D8'   // tech tag hover
success   : '#0F6E56'   // green — match score, live dot
skeleton  : '#EDE9DF'   // loading skeleton base
```

### Color tokens — dark mode
```js
bg        : '#0D0D10'
surface   : '#141417'
surf2     : '#1A1A1E'
t1        : '#F2F1ED'
t2        : '#96948E'
t3        : '#5E5C56'
border    : '#27272B'
accent    : '#7C6CFF'
tagBg     : '#1E1E22'
tagHover  : '#28282D'
success   : '#16A878'
```

### Match score colors
```js
match >= 88  → color: '#0F6E56' (green)  label: 'Strong match'
match >= 75  → color: '#5B4FF5' (violet) label: 'Good match'
match < 75   → color: '#BA7517' (amber)  label: 'Partial match'
```

### Typography scale
```
Logo         : Geist Mono, 18px, weight 600, letter-spacing -0.02em
Nav links    : Geist, 14px, weight 400/600
Hero heading : Instrument Serif, large (48-64px), italic accent words
Stat numbers : Geist Mono, 40px, weight 600, letter-spacing -0.045em
Stat labels  : Geist, 13px, color t3
Card title   : Geist, 15-16px, weight 600, color t1
Card meta    : Geist Mono, 11-12px, color t2/t3
Tags         : Geist Mono, 11px, color t2, bg tagBg, radius 99px
Body text    : Geist, 14px, weight 400, color t2
```

### Spacing + radius
```
Card border-radius   : 14px
Button border-radius : 99px (pill)
Tag border-radius    : 99px (pill)
Input border-radius  : 10px
Avatar border-radius : 50%
Max content width    : 1200px
Page padding desktop : 0 32px
Page padding mobile  : 0 20px
Card padding         : 22px
Tag padding          : 5px 12px
```

### Component patterns

**JobCard:**
```
background: surface
border: 1px solid border → on hover: accent color at 30% opacity
border-radius: 14px
padding: 22px
height: fixed (not stretched)
hover: background shifts to surf2
transition: all 200ms ease
```

**Tech tags:**
```
background: tagBg
color: t2
font: Geist Mono 11px
padding: 5px 12px
border-radius: 99px
hover: tagHover background
```

**Primary button (Post a job / CTA):**
```
background: accent (#5B4FF5)
color: #fff
border: none
border-radius: 99px
padding: 8px 18px
font: Geist 14px weight 600
hover: brightness(1.08) + scale(1.02)
```

**Ghost button (Sign in):**
```
background: none
border: 1px solid border
border-radius: 99px
padding: 8px 18px
font: Geist 14px
color: t1
```

**Navbar:**
```
position: fixed, height 64px, z-index 50
on scroll: background blur(16px) + border-bottom appears
transition: background 280ms
```

**Logo wordmark:**
```
font: Geist Mono 18px weight 600
text: "devhire" — the "i" dot replaced with a 4×4px lime (#CDEB4A) square
letter-spacing: -0.02em
```

**Skeleton loader:**
```
gradient: linear-gradient(90deg, #EDE9DF 25%, #F5F2EA 50%, #EDE9DF 75%)
animation: shimmer 1.5s infinite
border-radius: 6px
```

**Live dot (recently posted indicator):**
```
width/height: 6px, border-radius: 50%
background: #0F6E56
animation: pulse 2s ease-in-out infinite
```

### What Claude must NOT do with design
- Never use generic blue (#3B82F6) — always use accent violet (#5B4FF5)
- Never use pure white (#FFFFFF) backgrounds — always cream (#FAF8F3 / #FFFEFB)
- Never use rounded-md (8px) for cards — always 14px
- Never use regular sans font for numbers/labels — always Geist Mono
- Never deviate from the cream/violet/lime palette without explicit instruction
