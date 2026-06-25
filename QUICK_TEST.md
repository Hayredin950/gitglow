# GitGlow Quick Test Script

## 5-Minute Test to Verify Full Polish Flow

### Prerequisites (1 min)
```bash
# 1. Make sure dev server is running
npm run dev

# 2. Ensure browser DevTools Console is open (F12)

# 3. Clear sessionStorage for clean test
# In browser console:
sessionStorage.clear()
```

### Test Flow (4 min total)

#### Step 1: Intake Form (30 seconds)
1. Navigate to `http://localhost:3000/intake` (or login first if needed)
2. Fill the 5-step form:
   - **Full Name:** "Test Developer"
   - **Career Goal:** "Become a Senior Full-Stack Engineer"
   - **Skills:** Select "React", "TypeScript", "Node.js", "PostgreSQL", "Docker"
   - **Project:** Toggle ON (to generate a project)
   - **Tone:** Select "Professional"
3. Click **"Generate My Profile"**
4. **Expected:** Redirects to preview page, console shows `[v0] Redirecting to preview...`

#### Step 2: Analysis & Generation (1 min 30 sec)
1. Wait for analysis to complete
2. **Watch for these in console:**
   ```
   [v0] Submitting intake form...
   [v0] API response status: 200
   [v0] Analyzing GitHub profile...
   [v0] Generating README...
   [v0] Creating project concept...
   ```
3. **Expected:** Page shows:
   - Current GitHub score (e.g., 25)
   - "Your Profile Weaknesses" section
   - README preview with markdown
   - Final score improvement shown

#### Step 3: Deployment (1 min)
1. Click **"Continue to Deploy"** button
2. **Watch the deploy page for:**
   - Step 1: "Setting bio and location..."
   - Step 2: "Creating profile README..."
   - Step 3: "Creating project repository..."
   - Step 4: "Pushing commits..."
   - Real-time progress shown
3. **Check console for errors:**
   - Should see `[v0]` logs for each step
   - No red error messages

#### Step 4: Completion & Verification (30 sec)
1. **Expected:** Redirect to completion page with:
   - Confetti animation (pretty!)
   - "Your GitHub just got a glow-up!" message
   - Score improvement: "25 → 90" (or similar)
   - Share buttons working
2. Click the **GitHub profile link**
3. **On GitHub profile, verify:**
   - [ ] New repository with your username exists
   - [ ] Profile README shows (under profile name)
   - [ ] README has formatted content with badges
   - [ ] Project repository created (if enabled)

### Success Criteria ✅

If you see all of these, the polish flow is working:

- [ ] Intake form submits without errors
- [ ] Generation completes with README preview
- [ ] Deploy shows all 4 steps progressing
- [ ] No red error messages in deploy logs
- [ ] Completion page shows score improvement
- [ ] GitHub profile has new repositories
- [ ] Profile README displays with formatted content

### If Something Breaks 🔴

**Check browser console for `[v0]` logs:**
- Look for error messages with specific details
- Note which step fails (intake/generate/deploy)
- Check Network tab → `/api/*` calls for status codes

**Common fixes:**
- If form hangs → Refresh page, make sure all fields filled
- If generation times out → Check console for API errors
- If deploy fails → Try again, GitHub might be rate-limited
- If nothing changes on GitHub → Refresh page or wait 5 min

### Network Requests to Verify

In DevTools Network tab, you should see:

1. **POST `/api/polish/create`** → Status 200
   - Response: `{ polishId: "..." }`

2. **POST `/api/generate`** → Status 200
   - Response-type: `text/event-stream`
   - Multiple events received

3. **POST `/api/deploy`** → Status 200
   - Response-type: `text/event-stream`
   - Streaming events with progress

### Console Logs Checklist

Your browser console should contain these `[v0]` markers:

```
✓ [v0] Submitting intake form with data: {...}
✓ [v0] API response status: 200
✓ [v0] Analyzing your GitHub profile...
✓ [v0] Generating README...
✓ [v0] Creating project concept...
✓ [v0] Planning contribution commits...
✓ [v0] Validating GitHub token permissions...
✓ [v0] Setting bio and location...
✓ [v0] Creating profile README...
✓ [v0] Profile README created successfully!
✓ [v0] Creating [project] repository...
✓ [v0] Project repository created with X files!
✓ [v0] Commit push completed: X succeeded, Y failed
```

If you see these, the complete flow executed successfully.

### Database Verification (Optional)

If you have database access:

```bash
npx prisma studio

# Find your Polish record:
# - Status should be "COMPLETED"
# - scoreBefore ≠ scoreAfter
# - errorMessage should be NULL
```

### Cleanup After Test

To prepare for next test run:

1. **Delete created repositories** from your GitHub
2. **Clear sessionStorage** in browser console
3. **Refresh page** to start fresh

Then you can re-run this test with a new account or fresh profile.

---

**Total Time:** ~5 minutes
**What You'll See:** Your GitHub profile transformed from basic to premium in real-time!
