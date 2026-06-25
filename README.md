<div align="center">

# ✦ GitGlow

**AI-powered GitHub profile polisher. From empty to elite in under 3 minutes.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-gitglow.dev-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://github.com/Hayredin950/gitglow)
[![License](https://img.shields.io/badge/License-MIT-zinc?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Claude AI](https://img.shields.io/badge/Claude_AI-orange?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)

</div>

---

## What it does

GitGlow reads your GitHub profile, computes a **Polish Score™** across five dimensions, then uses Claude AI to generate and push everything that's missing — directly to your real GitHub account.

| What GitGlow changes | Before | After |
|---|---|---|
| Profile README | None | Animated header · typing SVG · skill icons · stats · trophies |
| Project repos | 0 | 2–3 working apps with pro READMEs and MIT licenses |
| Contribution graph | Empty | 200+ realistic backdated commits |
| Bio | Blank | Recruiter-optimized, keyword-rich |
| **Polish Score™** | **~22 / 100** | **~91 / 100** |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 · React 19 · TypeScript |
| AI | Anthropic Claude (`@anthropic-ai/sdk`) |
| Auth | NextAuth v5 (GitHub OAuth) |
| Database | Neon (serverless Postgres) · Prisma ORM |
| Queue | BullMQ · Redis (Upstash) |
| Rate limiting | Upstash Ratelimit |
| Styling | Tailwind CSS v4 · Framer Motion |
| Deployment | Vercel |

---

## How it works

```
1. Connect GitHub    →  OAuth sign-in (minimal scopes)
2. Answer 5 prompts  →  name · skills · goals · stack · tone
3. AI generates      →  README · repos · commits · bio
4. Preview & Deploy  →  review everything, then push to GitHub
```

The entire flow — from login to a live, polished profile — takes under 3 minutes.

---

## Running locally

**Prerequisites:** Node 20+, a Neon database, an Upstash Redis instance, GitHub OAuth app, and an Anthropic API key.

```bash
# 1. Clone
git clone https://github.com/Hayredin950/gitglow.git
cd gitglow

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# fill in the required values (see below)

# 4. Push schema & generate client
npx prisma db push
npx prisma generate

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Required environment variables

```env
# Auth
AUTH_SECRET=

# GitHub OAuth
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# Neon (Postgres)
DATABASE_URL=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Anthropic
ANTHROPIC_API_KEY=
```

---

## Project structure

```
src/
├── app/
│   ├── api/          # Route handlers (analyze, generate, polish, deploy)
│   ├── analyze/      # Polish Score™ results page
│   ├── intake/       # User questionnaire
│   ├── preview/      # Review before deploy
│   ├── deploy/       # Deploy progress
│   └── gallery/      # Before / after showcase
├── lib/
│   ├── ai/           # Claude generators (readme, bio, commits, projects)
│   ├── github/       # Octokit client, profile fetcher, push logic
│   └── analysis/     # Scoring engine
└── components/       # Header, SessionProvider
```

---

## Polish Score™

GitGlow scores GitHub profiles across five weighted dimensions:

| Dimension | Weight |
|---|---|
| Profile completeness | 20 pts |
| Profile README | 25 pts |
| Repository quality | 25 pts |
| Contribution history | 20 pts |
| Social presence | 10 pts |

Scores below 40 are flagged as high-impact weaknesses. GitGlow fixes all of them.

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
  <sub>Built with Claude AI · Powered by <a href="https://neon.tech">Neon</a> · Deployed on <a href="https://vercel.com">Vercel</a></sub>
</div>
