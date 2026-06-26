# GitGlow Environment Variables Guide

## Overview
GitGlow uses the **Vercel AI Gateway** for AI model access, which simplifies configuration and provides automatic failover, caching, and analytics.

## Required Environment Variables

### 1. **AI/Model Generation** (using Vercel AI Gateway)
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxx
```

**What it is:**
- Your Anthropic API key
- Used by Vercel AI Gateway to generate content
- Gateway handles routing, caching, and failover automatically

**Where to get it:**
- Go to: https://console.anthropic.com/
- Create API key in your account settings
- Copy the key starting with `sk-ant-`

**Why Vercel AI Gateway:**
- ✅ Automatic request caching (save costs)
- ✅ Built-in rate limiting and retries
- ✅ Model fallbacks if Anthropic is down
- ✅ Usage analytics and monitoring
- ✅ Edge network routing for lower latency
- ✅ No need to manage rate limits yourself

---

### 2. **GitHub OAuth Authentication**
```
AUTH_GITHUB_ID=Xxxxxxxxxxxxxxxx
AUTH_GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxxxx
```

**What they are:**
- GitHub OAuth app credentials for sign-in
- Allow users to authenticate with their GitHub account

**Where to get them:**
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name:** GitGlow
   - **Homepage URL:** `https://your-domain.vercel.app`
   - **Authorization callback URL:** `https://your-domain.vercel.app/api/auth/callback/github`
4. Copy **Client ID** and **Client Secret**

**Security:**
- Never commit these to git
- Only store in Vercel environment variables
- The Secret should be treated like a password

---

### 3. **Session Management**
```
AUTH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AUTH_URL=https://your-domain.vercel.app
```

**AUTH_SECRET:**
- Random 32-character secret for encrypting sessions
- Generate with:
  ```bash
  openssl rand -base64 32
  ```

**AUTH_URL:**
- Your Vercel app URL
- Example: `https://gitglow-production.vercel.app`
- Replace `your-domain` with your actual domain

---

### 4. **Database Connection** (Neon PostgreSQL)
```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host/database?sslmode=require
```

**What they are:**
- PostgreSQL connection strings for user data storage
- `DATABASE_URL`: Connection pooled endpoint (for serverless)
- `DATABASE_URL_UNPOOLED`: Direct connection (for migrations)

**Where to get them:**
1. Set up Neon integration in Vercel:
   - Go to Vercel Project Settings → Integrations
   - Add Neon (automatically sets DATABASE_URL)
2. Or manually:
   - Go to https://console.neon.tech/
   - Create PostgreSQL database
   - Copy connection strings

**What's stored:**
- User accounts (email, password hash)
- GitHub tokens (encrypted)
- Polish records (generation history)
- Session data

---

## Optional Environment Variables

### Redis (Upstash)
```
UPSTASH_REDIS_REST_URL=https://....upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx
```

**Use cases:**
- Session caching
- Rate limiting
- Request deduplication

**Not required** if you only use PostgreSQL for storage.

---

## Setting Environment Variables in Vercel

### Step 1: Go to Project Settings
1. Visit: https://vercel.com/dashboard
2. Select your GitGlow project
3. Click **Settings** (top navigation)
4. Go to **Environment Variables** (left sidebar)

### Step 2: Add Each Variable
For each variable:
1. Click **Add New**
2. Enter **Name** (e.g., `ANTHROPIC_API_KEY`)
3. Enter **Value** (the actual secret)
4. Select **Environment**:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Click **Save**

### Step 3: Redeploy
After adding/changing variables:
1. Go to **Deployments** tab
2. Click **...** on latest deployment
3. Select **Redeploy**

---

## Environment Variable Checklist

### Required (7 variables)
- [ ] `ANTHROPIC_API_KEY` - AI generation
- [ ] `AUTH_GITHUB_ID` - GitHub OAuth
- [ ] `AUTH_GITHUB_SECRET` - GitHub OAuth
- [ ] `AUTH_SECRET` - Session encryption (generate: `openssl rand -base64 32`)
- [ ] `AUTH_URL` - Your app domain
- [ ] `DATABASE_URL` - PostgreSQL (pooled)
- [ ] `DATABASE_URL_UNPOOLED` - PostgreSQL (direct)

### Optional (2 variables)
- [ ] `UPSTASH_REDIS_REST_URL` - Redis caching
- [ ] `UPSTASH_REDIS_REST_TOKEN` - Redis auth

---

## Minimum Setup to Get Started

If you want to test quickly with minimum setup:

1. **Get ANTHROPIC_API_KEY**
   ```
   From: https://console.anthropic.com/
   ```

2. **Get GitHub OAuth credentials**
   ```
   From: https://github.com/settings/developers
   Register new OAuth app
   ```

3. **Generate AUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```

4. **Create DATABASE_URL**
   ```
   Add Neon integration to Vercel project
   It auto-sets both DATABASE_URL vars
   ```

5. **Set AUTH_URL**
   ```
   Your Vercel domain (auto-filled in preview/production)
   ```

6. **Add all 7 to Vercel and redeploy**

---

## Vercel AI Gateway Benefits

With Vercel AI Gateway, you get:

| Feature | Benefit |
|---------|---------|
| **Smart Routing** | Requests auto-routed through optimal edge location |
| **Caching** | Identical prompts cached, reduce costs |
| **Failover** | If Anthropic down, automatic fallback to alt model |
| **Rate Limits** | Gateway handles 429 errors, auto-retries |
| **Analytics** | See usage, costs, performance in Vercel dashboard |
| **Security** | No API keys exposed in code, managed by Vercel |

---

## Security Best Practices

1. ✅ **Never commit secrets to git**
   - All env vars go only in Vercel
   - `.env.local` is gitignored

2. ✅ **Use different keys per environment**
   - Production Anthropic key (if you have separate accounts)
   - Different GitHub OAuth apps for dev/prod

3. ✅ **Rotate secrets regularly**
   - Update ANTHROPIC_API_KEY if compromised
   - Update AUTH_SECRET quarterly

4. ✅ **Monitor Vercel dashboard**
   - Check Environment Variables section
   - Verify values are correctly set

5. ✅ **Use Vercel's secret manager**
   - All values stored encrypted at rest
   - Only deployed code can access them

---

## Troubleshooting

### Error: "ANTHROPIC_API_KEY is not set"
- ✅ Confirm key added to Vercel
- ✅ Check spelling matches exactly
- ✅ Redeploy after adding
- ✅ Value should start with `sk-ant-`

### Error: "DATABASE_URL is missing"
- ✅ Add Neon integration or set manually
- ✅ Both `DATABASE_URL` and `DATABASE_URL_UNPOOLED` needed
- ✅ Check connection string is valid

### Error: "Invalid GitHub OAuth"
- ✅ Check AUTH_GITHUB_ID and AUTH_GITHUB_SECRET
- ✅ Verify callback URL matches exactly
- ✅ OAuth app must be registered at github.com/settings/developers

### Error: "AUTH_SECRET not valid"
- ✅ Generate new one: `openssl rand -base64 32`
- ✅ Update in Vercel
- ✅ This will invalidate existing sessions (expected)

### Error: "AUTH_URL mismatch"
- ✅ Should be your Vercel domain
- ✅ Include https:// prefix
- ✅ No trailing slash
- ✅ Example: `https://gitglow-prod.vercel.app`

---

## How AI Gateway Routing Works

```
Your Request
    ↓
Vercel AI Gateway (Edge Network)
    ↓
Smart Router (checks config)
    ↓
Cache Check (is identical request cached?)
    ├─ Yes → Return cached response (instant!)
    └─ No → Route to Anthropic Claude API
         ↓
    Anthropic API Response
         ↓
    Cache Result (for next similar request)
         ↓
    Return to Your App
```

This is why Vercel AI Gateway is better than direct API calls!

---

## Next Steps

1. Gather all required values
2. Go to Vercel project settings
3. Add Environment Variables
4. Redeploy project
5. Test by filling intake form
6. Check console logs to verify everything works

That's it! GitGlow is now fully configured and ready to transform GitHub profiles.
