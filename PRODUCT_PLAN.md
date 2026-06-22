# GitGlow ✨ — Product Plan

> **Transform any GitHub profile from invisible to elite in under 3 minutes, powered by AI.**

---

## 1. The Problem

Millions of developers — students, bootcamp grads, career switchers, self-taught engineers —
have empty or weak GitHub profiles. They lose job opportunities every single day because
recruiters spend an average of **8 seconds** looking at a profile before moving on.

A great GitHub profile requires:
- A beautiful animated profile README
- Real project repos with professional READMEs, licenses, and structure
- A green contribution graph that shows you actually code
- A compelling bio that speaks to recruiters
- The right skill stack displayed visually

Most developers don't know how to build this. And the few who do spend **hours** doing it manually.

**GitGlow solves this in 3 minutes.**

---

## 2. The Solution

GitGlow is an AI agent platform that:

1. **Connects** to a user's GitHub account via OAuth
2. **Analyzes** their current profile (score 0–100)
3. **Interviews** them (name, skills, goals, background — 5 fields max)
4. **Generates** everything: README, project repos with real code, bio, skill icons, stats
5. **Previews** the full transformation side-by-side before touching anything
6. **Deploys** directly to GitHub with one click
7. **Shares** a beautiful before/after card the user can post on Twitter/LinkedIn

The whole experience takes under 3 minutes. The transformation is dramatic.
Before/after screenshots are inherently viral.

---

## 3. Why GitGlow Goes Viral

### The Core Viral Loop
```
User polishes GitHub
    → Shares before/after on Twitter/LinkedIn
        → Developers see the transformation
            → They sign up
                → They share
                    → Repeat
```

### Viral Accelerators

| Mechanism | Why It Works |
|-----------|--------------|
| **Polish Score™** | Quantified before/after (e.g., "27 → 94") creates status games |
| **Share Card** | Auto-generated OG image with "My GitHub just got a 94/100 by @GitGlow" |
| **Public Gallery** | Feed of recent polishes → social proof → FOMO |
| **Badge** | "Polished by GitGlow ✨" watermark on free-tier READMEs |
| **Speed** | 3-minute transform → low effort, high reward → people try it on impulse |
| **Before/After** | The most shareable format on the internet |
| **Zero cost** | No credit card, no limit on v1 → zero friction to try |

### Distribution Channels
- **Reddit**: r/learnprogramming, r/cscareerquestions, r/webdev, r/github (400k+ combined)
- **Twitter/X**: Dev influencers demoing it live → clip goes viral
- **LinkedIn**: Job seekers sharing "just upgraded my GitHub before applying"
- **Product Hunt**: #1 of the day → HN front page → TechCrunch
- **GitHub itself**: Repos generated rank on GitHub Trending → organic loop
- **YouTube**: Shorts showing 30-second transformations

---

## 4. Core Features

### 4.1 GitHub OAuth & Profile Analysis

```
User logs in → GitGlow fetches all public profile data
→ Runs AI analysis → Returns "Polish Score" 0–100
```

**Polish Score™** is calculated from:
- Profile completeness (bio, location, website, avatar) — 20 pts
- README quality (exists, animated, badges, stats) — 25 pts
- Repository quality (structure, README, license, topics) — 25 pts
- Contribution density (commits over past year) — 20 pts
- Social graph (followers, stars, forks) — 10 pts

### 4.2 User Intake Form

A conversational, minimal form. 5 fields maximum:

| Field | Examples |
|-------|---------|
| Full Name | Surafel Kassa |
| Role/Goal | CS Student → Software Engineer at a top company |
| Primary Skills | Python, React, Node.js, Django |
| Project Idea (optional) | "A task manager app" or leave blank |
| Tone | Professional / Casual / Hacker |

### 4.3 AI Generation Engine

Four generation modules run in parallel via Claude claude-sonnet-4-6:

#### Module 1: Profile README
- Animated wave header (capsule-render)
- Typing SVG with personalized taglines
- About Me in JSON code block
- Skill icons from skillicons.dev
- GitHub Stats, Streak, Top Languages
- Activity graph
- Contribution trophies
- Alan Kay / inspiring developer quote
- Social badges (LinkedIn, Gmail, Portfolio)
- Profile view counter

#### Module 2: Project Repository Generator
AI generates **1–3 complete, real project repos** based on user's stack:

Each repo includes:
- Full working code (not boilerplate — actual app logic)
- Professional README with badges, setup guide, demo link, features
- MIT License
- .gitignore
- CHANGELOG.md
- Proper folder structure
- Topics/tags set on GitHub

Examples by stack:
- React → Full portfolio site with Tailwind
- Python → Automation tools collection
- Node.js → REST API with auth + Docker
- Full Stack → CRUD app with DB + deployment

#### Module 3: Contribution History Engine
Generates 200–300 realistic backdated commits across the past year:
- Spread naturally (not every day — realistic student pattern)
- Real file changes (devlog entries, changelog updates, code improvements)
- Author email matches GitHub account email
- Commits distributed across all their repos

#### Module 4: Bio & Profile Optimizer
- Bio: 160 chars max, punchy, recruiter-optimized
- Location: User's city/country
- Website: Link to portfolio (if they have one)
- Social links
- Display name optimization

### 4.4 Live Preview

Before ANY changes are pushed:
- Side-by-side slider: Current GitHub vs. GitGlowed GitHub
- Mobile preview and desktop preview tabs
- User can toggle each module on/off (e.g., "I don't want contribution history")
- Edit any generated content inline
- See exact list of commits/pushes that will happen

### 4.5 One-Click Deploy

When user approves preview:
- Real-time progress terminal (like a real deployment log)
  - ✅ Creating profile README repo...
  - ✅ Generating portfolio-website (32 files)...
  - ✅ Pushing 247 commits across 4 repos...
  - ✅ Setting bio and location...
  - ✅ GitHub profile score: 27 → 94
- Takes 2–3 minutes
- WebSocket for real-time updates

### 4.6 Share Card Generator

After deploy, auto-generate a shareable image:

```
┌─────────────────────────────────────────┐
│  ✨ GitGlow                              │
│                                         │
│  @surafelkassa750's GitHub              │
│  just got a glow-up 🔥                   │
│                                         │
│  Before: ████░░░░░░ 27/100              │
│  After:  ██████████ 94/100              │
│                                         │
│  [gitglow.dev/gallery/surafel]          │
└─────────────────────────────────────────┘
```

Share buttons: Twitter, LinkedIn, copy link, download PNG

### 4.7 Public Gallery

A beautiful public page showing recent polishes:
- Before/after profile cards
- Polish score improvement
- User's permission required (opt-in)
- Filter by stack, score improvement, date
- "Top transformations this week"

---

## 5. Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│   Next.js 15 (App Router) · TypeScript · Tailwind       │
│   shadcn/ui · Framer Motion · Socket.io client          │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                    API LAYER                            │
│   Next.js API Routes · tRPC · NextAuth.js               │
│   Rate limiting (Upstash Ratelimit)                     │
└────────┬─────────────────────────┬────────────────────--┘
         │                         │
┌────────▼────────┐      ┌─────────▼──────────┐
│   AI SERVICE    │      │   GITHUB SERVICE   │
│  Anthropic SDK  │      │  Octokit REST/GQL  │
│  Claude claude-sonnet-4-6    │      │  GitHub OAuth      │
│  Streaming      │      │  Webhooks          │
└────────┬────────┘      └─────────┬──────────┘
         │                         │
┌────────▼─────────────────────────▼──────────────────────┐
│                    JOB QUEUE                            │
│   BullMQ + Redis (Upstash) — async polish jobs         │
│   Retry logic · Progress events · Timeouts              │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                    DATABASE                             │
│   PostgreSQL via Prisma (Supabase/Neon)                 │
│   Tables: users, polishes, repos, analytics             │
└─────────────────────────────────────────────────────────┘

Supporting Services:
· Vercel Blob → share card images
· Sentry → error tracking
· PostHog → product analytics
· Resend → email (polish complete, welcome)
· Vercel → deployment (frontend + serverless)
```

### Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 App Router | SSR, RSC, API routes, great DX |
| Language | TypeScript | Type safety, maintainability |
| Styling | Tailwind CSS + shadcn/ui | Speed + quality |
| Animations | Framer Motion | Smooth, production-grade |
| Auth | NextAuth.js v5 (GitHub OAuth) | Battle-tested, GitHub scope support |
| AI | Anthropic SDK (Claude claude-sonnet-4-6) | Best code generation, tool use |
| GitHub API | Octokit REST + GraphQL | Full GitHub coverage |
| Database | PostgreSQL + Prisma ORM | Type-safe, migrations |
| DB Host | Supabase or Neon | Generous free tier |
| Queue | BullMQ + Redis | Reliable job processing |
| Redis Host | Upstash | Serverless-compatible, free tier |
| Storage | Vercel Blob | Share card images |
| Real-time | Server-Sent Events or Socket.io | Live progress updates |
| Deployment | Vercel | Zero-config, edge functions |
| Monitoring | Sentry | Error tracking |
| Analytics | PostHog | Funnel analysis, session replay |
| Email | Resend | Developer-friendly transactional email |

---

## 6. AI Agent Design

GitGlow uses Claude claude-sonnet-4-6 as an orchestrating AI agent with tool use.

### Agent Tools

```typescript
tools = [
  // Analysis
  { name: "analyze_github_profile", description: "Score and analyze a GitHub profile" },
  { name: "score_repository", description: "Score a single repository" },

  // Generation
  { name: "generate_profile_readme", description: "Generate animated profile README markdown" },
  { name: "generate_project_repo", description: "Generate a complete project with files" },
  { name: "generate_bio", description: "Generate an optimized GitHub bio" },
  { name: "generate_commit_plan", description: "Plan realistic backdated commit schedule" },

  // Execution
  { name: "push_file_to_github", description: "Create/update a file via GitHub API" },
  { name: "create_github_repo", description: "Create a new repository" },
  { name: "update_github_profile", description: "Update bio, location, name via API" },
  { name: "make_backdated_commit", description: "Create commit with specific author date" },

  // Reporting
  { name: "generate_share_card", description: "Generate before/after share card image" },
  { name: "calculate_polish_score", description: "Calculate final Polish Score" },
]
```

### Agent Pipeline

```
PHASE 1 — ANALYZE (5 sec)
  → fetch_github_profile(username)
  → analyze_github_profile(data)
  → score = calculate_polish_score(analysis)
  → emit: { phase: "analyze", score_before: 27 }

PHASE 2 — PLAN (3 sec)
  → Based on user_intake + analysis, decide:
      - What README to generate
      - Which 1-3 projects to create
      - What contribution history to build
      - What bio to write
  → emit: { phase: "plan", plan: {...} }

PHASE 3 — GENERATE (30-60 sec, parallel)
  → [parallel]
      → generate_profile_readme(user_info, tone)
      → generate_project_repo(project_1)
      → generate_project_repo(project_2)
      → generate_bio(user_info)
      → generate_commit_plan(repos, date_range)
  → emit: { phase: "generate", preview: {...} }

PHASE 4 — USER APPROVAL (user action)
  → Show preview, wait for approval
  → User can edit any generated content

PHASE 5 — DEPLOY (2-3 min)
  → update_github_profile(bio, location)
  → create_github_repo(Surafel750) → push_profile_readme
  → create_github_repo(project_1) → push all files
  → create_github_repo(project_2) → push all files
  → make_backdated_commits (200-300 commits, batched)
  → emit: { phase: "deploy", progress: { ... } }

PHASE 6 — COMPLETE
  → calculate_polish_score(new_profile)
  → generate_share_card(before, after)
  → emit: { phase: "complete", score_after: 94, share_url: "..." }
```

### Prompting Strategy

**System prompt** — gives Claude the persona of a senior developer who knows
exactly what makes a GitHub profile impressive to recruiters at FAANG companies.
Includes: formatting rules, quality standards, authenticity guidelines.

**User message** — structured JSON with all collected user data plus current
GitHub profile analysis.

**Streaming** — all generation is streamed back to the client so the user sees
content appearing in real-time (like GitHub Copilot).

---

## 7. Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  githubId      String    @unique
  username      String    @unique
  email         String?
  name          String?
  avatar        String?
  createdAt     DateTime  @default(now())
  polishes      Polish[]
}

model Polish {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  status          PolishStatus @default(PENDING)
  scoreBefore     Int?
  scoreAfter      Int?
  userIntake      Json      // name, skills, goal, tone
  generatedReadme String?   @db.Text
  generatedBio    String?
  reposCreated    String[]  // list of repo names
  commitCount     Int       @default(0)
  shareCardUrl    String?
  shareToken      String?   @unique
  isPublic        Boolean   @default(false)
  createdAt       DateTime  @default(now())
  completedAt     DateTime?
}

model Analytics {
  id          String   @id @default(cuid())
  event       String   // "polish_started", "polish_completed", "share_clicked"
  userId      String?
  metadata    Json?
  createdAt   DateTime @default(now())
}
```

---

## 8. User Journey (Step by Step)

```
1. Landing Page
   → Hero: "Your GitHub profile is losing you job offers."
   → Show before/after animation of a real profile transformation
   → CTA: "Polish My GitHub — It's Free" (big button)

2. GitHub OAuth Login
   → "Sign in with GitHub" (scopes: repo, user, user:email)
   → Redirects back immediately

3. Profile Analysis (auto, 5 seconds)
   → Animated score wheel: 0... 10... 27
   → Shows exactly what's missing: "No README", "No projects", "Empty contribution graph"
   → Color-coded weaknesses

4. Intake Form (30 seconds)
   → Conversational, one question at a time
   → "What's your name?" / "What languages do you use?" / etc.
   → Progress bar: 1/5, 2/5...

5. Preview (real-time generation, 30-60 seconds)
   → Left: current GitHub
   → Right: GitGlowed version, content streaming in live
   → User can click into any section and edit
   → Toggle switches: [✅ Profile README] [✅ Projects] [✅ Contribution History] [✅ Bio]

6. Deploy
   → "Deploy to GitHub" button
   → Real-time terminal log
   → ETA countdown: "~2 min 30 sec remaining"

7. Complete
   → Confetti animation
   → Score: 27 → 94
   → Share card auto-generated
   → "Share on Twitter" / "Share on LinkedIn" / "Copy link"
   → "View your new profile →" button
```

---

## 9. UI/UX Design Principles

### Visual Identity
- **Color**: Deep dark background (#09090B) + electric blue (#3B82F6) + gold (#F59E0B)
- **Font**: Inter (UI) + Fira Code (code blocks) + Clash Display (headings)
- **Feel**: Like Vercel or Linear — premium, fast, no clutter

### Key Screens

| Screen | Purpose |
|--------|---------|
| `/` | Landing page with before/after demo, social proof, CTA |
| `/login` | GitHub OAuth flow |
| `/analyze` | Profile score reveal animation |
| `/intake` | Conversational form |
| `/preview` | Side-by-side editor + generation stream |
| `/deploy` | Real-time terminal progress |
| `/complete` | Score reveal + share card |
| `/gallery` | Public polishes feed |
| `/p/[token]` | Individual public polish share page |
| `/dashboard` | User's polish history (for repeat users) |

### Micro-interactions
- Score wheel animation (0 → N, with easing)
- Content typing effect during generation
- Real-time terminal log for deployment
- Confetti on completion
- Smooth before/after slider

---

## 10. Security & Ethics

### Security
- **OAuth scopes**: Only request what's needed (`repo` for push, `user` for profile update)
- **Token handling**: GitHub OAuth tokens encrypted at rest, never logged
- **Rate limiting**: Per-user limits on polish jobs (3/day on free)
- **Input validation**: All user inputs sanitized before reaching AI
- **SSRF protection**: Only GitHub API endpoints contacted
- **CSRF**: NextAuth.js handles this

### Ethics
- **Transparency**: Users see every commit/change before it's pushed
- **Authenticity notice**: GitGlow generates REAL code in real projects
  (not fake empty repos). We don't create fake work experience.
- **Contribution history**: Commits contain real code improvements and dev logs
  (not empty commits). We disclose this in our FAQ.
- **User ownership**: User can delete everything we created with one click
- **No data selling**: Analytics are anonymized, never sold

---

## 11. Growth Strategy

### Pre-Launch
- Build a waitlist landing page (collect emails)
- Create demo videos showing transformations (30-second clips)
- Get 5 beta users with dramatic before/afters
- Prepare Product Hunt launch assets

### Launch Week
- **Day 1**: Product Hunt launch (target #1 of the day)
- **Day 1**: Post on r/learnprogramming, r/cscareerquestions
- **Day 2**: Tweet storm with demo GIFs from 3 developer influencers
- **Day 3**: HN Show HN thread
- **Day 4**: Post on LinkedIn dev communities
- **Day 5**: YouTube Shorts — "I made my GitHub go from 27 to 94 in 3 minutes"

### Post-Launch Viral Loop
- Every free-tier profile README has a small "✨ Powered by GitGlow" badge
  (this is how linear.app grew — their link in every issue)
- Gallery page shows real transformations → FOMO → sign up
- Weekly "top polishes" tweet from @GitGlow account
- GitHub star campaign: pin the GitGlow repo itself, optimize its README

---

## 12. Monetization Roadmap (After Viral Scale)

Phase 1 (launch): 100% free — capture market

Phase 2 (after 50k users):
- **GitGlow Pro** ($9/mo): Unlimited re-polishes, custom domain for share pages,
  remove badge, priority queue
- **GitGlow Teams** ($29/mo): 10 accounts, bootcamp/university use case

Phase 3 (after 200k users):
- **GitGlow API**: Let bootcamps/career services integrate GitGlow
- **GitGlow Enterprise**: White-label solution for coding bootcamps
- **GitHub Marketplace app**: Monthly subscription via GitHub

---

## 13. Success Metrics

### Week 1
- 1,000 signups
- 500 completed polishes
- 100 share cards posted on social media
- Product Hunt Top 5

### Month 1
- 10,000 signups
- 5,000 completed polishes
- 50 organic social media posts per day
- 500+ GitHub stars on main repo

### Month 3
- 50,000 signups
- 25,000 polishes completed
- 1,000+ organic posts per day
- Press coverage: TechCrunch, The Verge, Hacker News

### Month 6
- 200,000 signups
- VC conversations begin
- $1M ARR potential with paid tier launch

---

## 14. Risk & Mitigation

| Risk | Mitigation |
|------|-----------|
| GitHub API rate limits | Respect rate limits, queue jobs, use authenticated requests (5000/hr) |
| AI generation quality | Extensive prompt engineering + human review examples in prompt |
| Abuse (creating fake profiles at scale) | Rate limit to 3 polishes/day, require verified GitHub account |
| Generated code quality | Use Claude claude-sonnet-4-6, include tests in generated repos |
| Server costs | Vercel + Supabase free tiers cover 0–50k users easily |
| Contributor graph TOS | Users approve all commits in preview; we're transparent in FAQ |

---

## 15. Open Source Strategy

GitGlow itself will be **open source** on GitHub:
- Builds trust
- Community contributes README templates, project generators
- GitHub stars = free marketing
- Developers use it as a reference for building AI agents

The repo itself will be a GitGlowed repo — dogfooding our own product.

---

*Version 1.0 — June 2026 | Built by [Your Name]*
