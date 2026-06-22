# GitGlow ✨ — Engineering Task List

> Status legend: `[ ]` pending · `[~]` in progress · `[x]` done
> Priority: 🔴 critical · 🟡 important · 🟢 nice-to-have

---

## Phase 0 — Setup & Foundation (Days 1–2)

### Project Scaffold
- [ ] 🔴 `npx create-next-app@latest gitglow --typescript --tailwind --app --src-dir`
- [ ] 🔴 Install core dependencies:
  ```
  shadcn/ui  framer-motion  next-auth  @octokit/rest  @octokit/graphql
  @anthropic-ai/sdk  prisma  @prisma/client  bullmq  ioredis
  zod  react-hook-form  @hookform/resolvers  lucide-react
  sonner  next-themes  date-fns  html2canvas  sharp
  ```
- [ ] 🔴 Set up folder structure:
  ```
  src/
    app/           — Next.js App Router pages
    components/    — Reusable UI components
    lib/           — Core utilities (db, auth, ai, github)
    server/        — tRPC routers, job processors
    hooks/         — Custom React hooks
    types/         — Shared TypeScript types
    config/        — Constants, site config
  ```
- [ ] 🔴 Configure TypeScript paths (`@/*` → `src/*`)
- [ ] 🔴 Set up ESLint + Prettier with strict config
- [ ] 🔴 Initialize git repo with conventional commits

### Environment & Config
- [ ] 🔴 Create `.env.local` with all required vars:
  ```
  GITHUB_CLIENT_ID=
  GITHUB_CLIENT_SECRET=
  NEXTAUTH_SECRET=
  NEXTAUTH_URL=
  DATABASE_URL=
  UPSTASH_REDIS_REST_URL=
  UPSTASH_REDIS_REST_TOKEN=
  ANTHROPIC_API_KEY=
  BLOB_READ_WRITE_TOKEN=
  ```
- [ ] 🔴 Create `.env.example` (no secrets)
- [ ] 🔴 Add `.gitignore` with `.env*` entries

### Database Setup
- [ ] 🔴 Create Supabase (or Neon) PostgreSQL project
- [ ] 🔴 Initialize Prisma: `npx prisma init`
- [ ] 🔴 Write `schema.prisma` (User, Polish, Analytics models — see PRODUCT_PLAN.md §7)
- [ ] 🔴 `npx prisma migrate dev --name init`
- [ ] 🔴 `npx prisma generate`
- [ ] 🔴 Create `src/lib/db.ts` with Prisma client singleton

### Redis Setup
- [ ] 🔴 Create Upstash Redis database
- [ ] 🔴 Create `src/lib/redis.ts` with ioredis client
- [ ] 🟡 Create `src/lib/ratelimit.ts` using Upstash Ratelimit

---

## Phase 1 — Authentication (Days 2–3)

### GitHub OAuth
- [ ] 🔴 Create GitHub OAuth App at github.com/settings/developers
  - Scopes needed: `repo`, `user`, `user:email`, `read:user`
- [ ] 🔴 Install & configure NextAuth.js v5
- [ ] 🔴 Create `src/lib/auth.ts` with GitHub provider config
- [ ] 🔴 Create `src/app/api/auth/[...nextauth]/route.ts`
- [ ] 🔴 Configure NextAuth to save access_token to DB (needed for GitHub API calls)
- [ ] 🔴 Create `src/middleware.ts` to protect routes
- [ ] 🔴 Store GitHub access token encrypted in DB (not in session cookie)
- [ ] 🟡 Handle token refresh / expiry

### Auth UI
- [ ] 🔴 Create `src/app/login/page.tsx` — Login page
- [ ] 🔴 Build `<SignInButton>` component with GitHub icon
- [ ] 🔴 Create `<UserMenu>` dropdown (avatar, username, sign out)
- [ ] 🟡 Handle auth errors gracefully (rate limit, denied scopes)

---

## Phase 2 — GitHub Service Layer (Days 3–4)

### GitHub API Client
- [ ] 🔴 Create `src/lib/github/client.ts` — Octokit factory (uses user's token)
- [ ] 🔴 Create `src/lib/github/profile.ts`:
  - `getProfile(username)` — Fetch user profile data
  - `getRepositories(username)` — Fetch public repos with stats
  - `getContributions(username)` — Fetch contribution calendar
  - `getReadme(username)` — Check if profile README exists
- [ ] 🔴 Create `src/lib/github/push.ts`:
  - `createRepo(name, description, isPrivate)` — Create new repo
  - `pushFile(repo, path, content, message, date)` — Create/update file
  - `makeBackdatedCommit(...)` — Commit with custom author date
  - `updateProfile(bio, location, name, blog)` — PATCH /user
  - `setRepoTopics(repo, topics)` — Add tech-stack topics

### Profile Analyzer
- [ ] 🔴 Create `src/lib/analysis/scorer.ts`:
  - `calculatePolishScore(profileData): number` — Returns 0–100
  - `getScoreBreakdown(profileData): ScoreBreakdown` — Per-category scores
  - `identifyWeaknesses(profileData): Weakness[]` — What's missing/bad
- [ ] 🔴 Create `src/lib/analysis/types.ts` — Type definitions for profile data
- [ ] 🟡 Cache profile analysis results in Redis (TTL: 5 minutes)

---

## Phase 3 — AI Service Layer (Days 4–6)

### Claude Integration
- [ ] 🔴 Create `src/lib/ai/client.ts` — Anthropic SDK client singleton
- [ ] 🔴 Create `src/lib/ai/tools.ts` — Tool definitions for Claude agent
- [ ] 🔴 Create `src/lib/ai/prompts.ts` — System prompts and prompt builders
- [ ] 🔴 Create `src/lib/ai/agent.ts` — Main agent orchestrator

### Generation Modules
- [ ] 🔴 Create `src/lib/ai/generators/readme.ts`:
  - `generateProfileReadme(userInfo, analysis): Promise<string>`
  - Returns complete README.md markdown
  - Includes: wave header, typing SVG, about JSON, skill icons, stats, graph
- [ ] 🔴 Create `src/lib/ai/generators/bio.ts`:
  - `generateBio(userInfo): Promise<string>` — 160 char GitHub bio
  - `generateDisplayName(userInfo): Promise<string>`
- [ ] 🔴 Create `src/lib/ai/generators/project.ts`:
  - `generateProject(projectSpec): Promise<ProjectFiles>`
  - Returns: Map of filepath → content for the entire repo
  - Includes: working app code, README, LICENSE, .gitignore, CHANGELOG
- [ ] 🔴 Create `src/lib/ai/generators/commits.ts`:
  - `generateCommitSchedule(repos, dateRange): CommitSchedule`
  - Returns: list of { date, repo, file, content, message }
  - Realistic distribution (not every day, weekdays more than weekends)
- [ ] 🟡 Create `src/lib/ai/generators/avatar.ts`:
  - Suggest avatar styles based on user's tone preference

### Streaming
- [ ] 🔴 Create `src/app/api/generate/route.ts` — Streaming API route
  - Accepts: `{ userId, intakeData }`
  - Streams generation events back via SSE (Server-Sent Events)
  - Events: `{ type, data }` — analyze_complete, readme_chunk, project_chunk, etc.
- [ ] 🔴 Create `src/hooks/useGenerationStream.ts` — Client-side SSE hook

---

## Phase 4 — Job Queue (Days 5–6)

### Queue Setup
- [ ] 🔴 Create `src/server/queue/index.ts` — BullMQ queue definition
- [ ] 🔴 Create `src/server/queue/polishJob.ts` — Job processor:
  - `processPolishJob(job)` — Full pipeline execution
  - Progress events via job.updateProgress()
  - Error handling + retry (max 2 retries)
- [ ] 🔴 Create `src/server/queue/worker.ts` — Worker process
- [ ] 🔴 Set up worker as a long-running process (separate from Next.js)
  - Use `tsx watch src/server/queue/worker.ts` in dev
  - Use Railway/Render worker dyno in production
- [ ] 🟡 Create BullMQ Board (queue dashboard for debugging)

### Real-time Progress
- [ ] 🔴 Create `src/app/api/polish/[jobId]/progress/route.ts` — SSE endpoint
  - Subscribes to BullMQ job events
  - Streams progress to client
- [ ] 🔴 Create `src/hooks/usePolishProgress.ts` — Client-side progress hook
- [ ] 🟡 Fallback: polling if SSE not supported

---

## Phase 5 — Core Pages & UI (Days 6–10)

### Landing Page (`/`)
- [ ] 🔴 Hero section:
  - Headline: "Your GitHub profile is losing you job offers."
  - Sub: "GitGlow transforms it in 3 minutes with AI. Free forever."
  - CTA: "Polish My GitHub →"
  - Live before/after animated demo (no login needed to see demo)
- [ ] 🔴 Before/After demo component:
  - Interactive slider showing real transformation
  - Use 3 real example polishes (get beta users first)
- [ ] 🔴 Polish Score™ explanation section
- [ ] 🔴 How it works: 3-step visual (Connect → Generate → Deploy)
- [ ] 🔴 Social proof: "X profiles polished this week" live counter
- [ ] 🔴 Gallery preview: 3 featured transformations
- [ ] 🟡 Trusted by section (logos of universities/bootcamps if applicable)
- [ ] 🟢 Video demo embed (30-second screen recording)

### Analysis Page (`/analyze`)
- [ ] 🔴 Auto-runs after login, shows animated score reveal
- [ ] 🔴 `<ScoreWheel>` component — animated SVG circle, 0 → N with easing
- [ ] 🔴 `<WeaknessCard>` component — shows what's missing with icons
- [ ] 🔴 Score breakdown by category (README, Projects, Contributions, etc.)
- [ ] 🔴 CTA: "Fix All of This →" button

### Intake Form (`/intake`)
- [ ] 🔴 Conversational one-question-at-a-time flow (not a boring form)
- [ ] 🔴 Questions:
  1. "What's your full name?"
  2. "What's your primary goal?" (get job / contribute to OS / build portfolio)
  3. "What languages/frameworks do you use?" (multi-select chips)
  4. "Want us to generate a project repo? If yes, what kind?" (optional)
  5. "Preferred tone?" (Professional / Casual / Hacker)
- [ ] 🔴 Animated transitions between questions
- [ ] 🔴 Progress bar (1/5 ... 5/5)
- [ ] 🔴 Save intake data to DB after each question (prevent loss on refresh)
- [ ] 🟡 Smart suggestions: "Based on your repos, it looks like you use React. Correct?"

### Preview Page (`/preview`)
- [ ] 🔴 Split-screen layout: Current GitHub (left) ↔ GitGlowed (right)
- [ ] 🔴 Live streaming generation — right side content appears as AI generates
- [ ] 🔴 Toggle switches for each module (README, Projects, Contributions, Bio)
- [ ] 🔴 Inline editor — click any generated content to edit it
- [ ] 🔴 Mobile preview toggle (shows mobile GitHub layout)
- [ ] 🔴 "What will be pushed" summary panel (list of files/commits)
- [ ] 🔴 "Deploy to GitHub" CTA (disabled until generation complete)
- [ ] 🟡 Cost estimate: "~247 commits, 3 repos, 1 profile README"

### Deploy Page (`/deploy`)
- [ ] 🔴 Real-time terminal component (monospace, scrolling log)
  - Color-coded: green = success, yellow = in progress, red = error
  - Each step appears as it completes
- [ ] 🔴 ETA countdown timer
- [ ] 🔴 Step progress tracker:
  - [1/5] Setting bio and location...
  - [2/5] Creating profile README...
  - [3/5] Generating portfolio-website (32 files)...
  - [4/5] Pushing 247 commits...
  - [5/5] Verifying changes on GitHub...
- [ ] 🔴 Cannot navigate away (show warning if user tries to leave)
- [ ] 🟡 Abort button with confirmation dialog + rollback

### Complete Page (`/complete`)
- [ ] 🔴 Confetti animation (canvas-confetti)
- [ ] 🔴 Score reveal: "27 → 94" with animated transition
- [ ] 🔴 Share card display with download/copy options
- [ ] 🔴 Share buttons: Twitter, LinkedIn, copy link
- [ ] 🔴 "View your new GitHub profile →" button
- [ ] 🔴 "Polish another account" option
- [ ] 🟡 Email capture (for non-registered users who want updates)

### Gallery Page (`/gallery`)
- [ ] 🔴 Grid of polish cards (before → after)
- [ ] 🔴 Each card shows: avatar, username, score improvement, tech stack
- [ ] 🔴 Filter: by score improvement, by tech stack, by date
- [ ] 🔴 "This week's best transformations" featured section
- [ ] 🟡 Infinite scroll / pagination
- [ ] 🟢 Search by username or tech stack

### Share Page (`/p/[token]`)
- [ ] 🔴 Public shareable page for a polish result
- [ ] 🔴 Shows: before profile, after profile, score improvement
- [ ] 🔴 CTA: "Polish my GitHub too →"
- [ ] 🔴 OG image generation for social previews (using Vercel OG)

---

## Phase 6 — Share Card Generator (Day 9–10)

- [ ] 🔴 Create `src/app/api/og/[token]/route.ts` using `@vercel/og`
  - Renders a beautiful image with:
    - GitGlow logo + branding
    - Before/after score
    - Username and avatar
    - "gitglow.dev/p/[token]"
- [ ] 🔴 Create `src/lib/shareCard.ts`:
  - `generateAndStoreShareCard(polishId)` — Generates OG image, stores in Vercel Blob
- [ ] 🔴 Download PNG option (client-side using html2canvas)
- [ ] 🟡 Multiple share card templates (minimal / detailed / dark / light)

---

## Phase 7 — Dashboard (Day 10–11)

- [ ] 🔴 Create `/dashboard` page for returning users
- [ ] 🔴 Show polish history (date, score improvement, repos created)
- [ ] 🔴 "Polish again" button for existing users
- [ ] 🔴 Show generated repos with links to GitHub
- [ ] 🟡 "Undo" button — delete everything GitGlow created (repos, commits)
- [ ] 🟢 Settings page (email notification preferences, delete account)

---

## Phase 8 — Performance & Quality (Day 11–12)

### Code Quality
- [ ] 🔴 Write Zod schemas for all API inputs/outputs
- [ ] 🔴 Add error boundaries to all major page components
- [ ] 🔴 Handle all error states: API failures, timeout, GitHub rate limit
- [ ] 🔴 Add loading skeletons for all async UI
- [ ] 🟡 Write unit tests for scorer.ts (profile scoring logic)
- [ ] 🟡 Write integration tests for GitHub push functions
- [ ] 🟢 E2E tests with Playwright for critical user flow (login → complete)

### Performance
- [ ] 🔴 Implement Redis caching for GitHub profile fetches (TTL: 5 min)
- [ ] 🔴 Optimize AI generation: stream instead of waiting for full response
- [ ] 🔴 Use `React.lazy` / `Suspense` for heavy components
- [ ] 🟡 Add `generateStaticParams` for gallery pages
- [ ] 🟡 Image optimization (next/image for all profile avatars)

### Rate Limiting
- [ ] 🔴 Rate limit: 3 polishes per user per day
- [ ] 🔴 Rate limit: 10 API calls per IP per minute
- [ ] 🔴 Graceful handling when GitHub API rate limit hit
- [ ] 🟡 Queue backpressure — reject new jobs if queue too large

---

## Phase 9 — Analytics & Monitoring (Day 12)

### Analytics
- [ ] 🔴 Set up PostHog (or Plausible for privacy-friendly option)
- [ ] 🔴 Track key events:
  - `page_viewed` (all pages)
  - `polish_started`
  - `intake_completed`
  - `generation_completed`
  - `deploy_started`
  - `polish_completed` (with score_before, score_after)
  - `share_clicked` (with platform: twitter/linkedin/copy)
  - `gallery_visited`
- [ ] 🔴 Set up conversion funnel (landing → login → intake → preview → deploy → complete)
- [ ] 🟡 Set up retention tracking (who comes back)

### Error Monitoring
- [ ] 🔴 Set up Sentry (error tracking)
- [ ] 🔴 Configure Sentry for both client and server (Next.js integration)
- [ ] 🟡 Custom Sentry contexts: userId, polishId, githubUsername

### Uptime
- [ ] 🟡 Set up uptime monitoring (Better Uptime or UptimeRobot)
- [ ] 🟢 Set up status page (statuspage.io or similar)

---

## Phase 10 — Deployment (Day 12–13)

### Vercel (Frontend + API)
- [ ] 🔴 Connect GitHub repo to Vercel
- [ ] 🔴 Configure environment variables in Vercel dashboard
- [ ] 🔴 Set up custom domain (gitglow.dev)
- [ ] 🔴 Configure Vercel Blob for share card storage
- [ ] 🟡 Set up preview deployments for PRs

### Worker Process (BullMQ)
- [ ] 🔴 Deploy worker to Railway or Render (separate from Vercel)
  - Vercel functions have 60s timeout — too short for polish jobs
  - Worker process can run for 10+ minutes
- [ ] 🔴 Set `REDIS_URL` on worker service
- [ ] 🔴 Health check endpoint on worker
- [ ] 🟡 Auto-restart on crash

### CI/CD
- [ ] 🟡 Set up GitHub Actions:
  - `on: push` → run linting + type check
  - `on: pull_request` → run tests
  - `on: merge to main` → auto-deploy to Vercel
- [ ] 🟡 Branch protection: require passing checks before merge

---

## Phase 11 — Pre-Launch Polish (Day 13–14)

- [ ] 🔴 Write Privacy Policy (required for GitHub OAuth approval)
- [ ] 🔴 Write Terms of Service
- [ ] 🔴 Create FAQ page:
  - "Does GitGlow fake my commit history?" → "No — all commits contain real file changes"
  - "Can I undo a polish?" → "Yes — from your dashboard"
  - "Will recruiters know?" → "They see a well-structured, active profile"
- [ ] 🔴 Responsive design check (mobile, tablet, desktop)
- [ ] 🔴 Cross-browser testing (Chrome, Firefox, Safari)
- [ ] 🔴 Accessibility audit (screen reader, keyboard navigation, WCAG 2.1 AA)
- [ ] 🔴 SEO: meta tags, OG images, sitemap.xml, robots.txt
- [ ] 🔴 Lighthouse score target: 90+ on all pages
- [ ] 🟡 Dark/light mode support
- [ ] 🟢 PWA setup (offline-capable, installable)

---

## Phase 12 — Launch Execution (Day 14–15)

### Assets to Prepare
- [ ] 🔴 3 real before/after examples (recruit 5 beta users, pick best 3)
- [ ] 🔴 30-second demo video (screen recording + music)
- [ ] 🔴 Product Hunt assets (logo, banner, gallery screenshots, tagline)
- [ ] 🔴 Twitter/LinkedIn launch posts (written and scheduled)
- [ ] 🔴 Reddit posts (r/learnprogramming, r/webdev, r/cscareerquestions)

### Launch Day Checklist
- [ ] 🔴 Product Hunt submission (goes live at 12:01 AM PST)
- [ ] 🔴 Post on all Reddit communities (within first 2 hours)
- [ ] 🔴 Tweet from @GitGlow account with demo GIF
- [ ] 🔴 Post Show HN thread
- [ ] 🔴 Email beta users to upvote / share
- [ ] 🔴 Monitor queue / servers for load spikes
- [ ] 🔴 Have rollback plan ready

---

## Post-Launch Iteration (Week 3+)

### Quick Wins
- [ ] 🟡 Add more README templates (10+ styles for users to choose)
- [ ] 🟡 Support for more project types (mobile app, data science, etc.)
- [ ] 🟡 One-click "refresh" to update contribution history monthly
- [ ] 🟡 LinkedIn profile tips (separate from GitHub)

### Big Features
- [ ] 🟢 AI-powered code review of existing repos (suggest improvements)
- [ ] 🟢 Portfolio website generator (deploys to Vercel/Netlify automatically)
- [ ] 🟢 Interview prep: generates GitHub that matches specific job description
- [ ] 🟢 Team mode: polish multiple GitHub accounts (bootcamp cohort feature)

---

## Tech Debt / Non-Negotiables

These must be done before launch, no shortcuts:

- [ ] 🔴 All API routes have authentication checks
- [ ] 🔴 All user inputs validated with Zod before reaching database or AI
- [ ] 🔴 GitHub tokens never exposed to client or logged
- [ ] 🔴 Database queries use parameterized statements (Prisma enforces this)
- [ ] 🔴 Rate limiting on all public endpoints
- [ ] 🔴 Error messages don't leak internal details (production mode)
- [ ] 🔴 All generated content shown to user before any push to GitHub

---

## Estimated Timeline

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| 0 — Setup | Day 1–2 | Project running locally, DB + Redis connected |
| 1 — Auth | Day 2–3 | GitHub OAuth working, user saved to DB |
| 2 — GitHub Service | Day 3–4 | Can read/write to GitHub via API |
| 3 — AI Service | Day 4–6 | Claude generates README + bio + project |
| 4 — Job Queue | Day 5–6 | Async polish jobs running end-to-end |
| 5 — Core Pages | Day 6–10 | All user-facing pages built and wired |
| 6 — Share Card | Day 9–10 | OG images generated and sharable |
| 7 — Dashboard | Day 10–11 | Users can see history, undo |
| 8 — Quality | Day 11–12 | Tests, error handling, performance |
| 9 — Analytics | Day 12 | PostHog + Sentry live |
| 10 — Deploy | Day 12–13 | Live on gitglow.dev |
| 11 — Polish | Day 13–14 | Mobile, a11y, SEO, Lighthouse 90+ |
| 12 — Launch | Day 14–15 | Product Hunt #1 |

**Total: ~15 days for a solo developer working full-time**
**Realistic solo + part-time: 4–6 weeks**

---

## File Structure Reference

```
gitglow/
├── src/
│   ├── app/
│   │   ├── page.tsx                    — Landing
│   │   ├── login/page.tsx              — Login
│   │   ├── analyze/page.tsx            — Score reveal
│   │   ├── intake/page.tsx             — Form
│   │   ├── preview/page.tsx            — Side-by-side preview
│   │   ├── deploy/page.tsx             — Terminal progress
│   │   ├── complete/page.tsx           — Done + share
│   │   ├── gallery/page.tsx            — Public gallery
│   │   ├── p/[token]/page.tsx          — Share page
│   │   ├── dashboard/page.tsx          — User dashboard
│   │   └── api/
│   │       ├── auth/[...nextauth]/     — NextAuth
│   │       ├── generate/route.ts       — AI generation stream
│   │       ├── deploy/route.ts         — Start polish job
│   │       ├── polish/[jobId]/
│   │       │   └── progress/route.ts  — SSE progress
│   │       └── og/[token]/route.ts    — OG image
│   ├── components/
│   │   ├── ui/                        — shadcn/ui base components
│   │   ├── ScoreWheel.tsx             — Animated score circle
│   │   ├── BeforeAfterSlider.tsx      — Comparison slider
│   │   ├── TerminalLog.tsx            — Deploy progress terminal
│   │   ├── ShareCard.tsx              — Before/after card
│   │   ├── ProfilePreview.tsx         — GitHub profile mockup
│   │   └── GenerationStream.tsx       — Live content streaming
│   ├── lib/
│   │   ├── db.ts                      — Prisma client
│   │   ├── redis.ts                   — Redis client
│   │   ├── auth.ts                    — NextAuth config
│   │   ├── github/
│   │   │   ├── client.ts              — Octokit factory
│   │   │   ├── profile.ts             — Read profile data
│   │   │   └── push.ts                — Write to GitHub
│   │   ├── ai/
│   │   │   ├── client.ts              — Anthropic client
│   │   │   ├── agent.ts               — Main orchestrator
│   │   │   ├── tools.ts               — Claude tool definitions
│   │   │   ├── prompts.ts             — Prompt builders
│   │   │   └── generators/
│   │   │       ├── readme.ts
│   │   │       ├── bio.ts
│   │   │       ├── project.ts
│   │   │       └── commits.ts
│   │   └── analysis/
│   │       ├── scorer.ts              — Polish Score calculation
│   │       └── types.ts
│   ├── server/
│   │   └── queue/
│   │       ├── index.ts               — BullMQ queue
│   │       ├── polishJob.ts           — Job processor
│   │       └── worker.ts              — Worker entry point
│   ├── hooks/
│   │   ├── useGenerationStream.ts
│   │   └── usePolishProgress.ts
│   └── types/
│       ├── github.ts
│       ├── polish.ts
│       └── ai.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── og-image.png                   — Default OG image
│   └── logo.svg
├── PRODUCT_PLAN.md
├── TASK_LIST.md
├── .env.example
└── package.json
```

---

*Last updated: June 2026 | GitGlow v1.0*
