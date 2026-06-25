# GitGlow Testing Guide - Start Here! 🚀

## What is GitGlow?

GitGlow transforms your basic GitHub profile into a premium, polished profile in 3 minutes.

**Before:** Basic profile (Score: 25/100)
- Minimal bio
- Standard repositories
- No profile README

**After:** Premium profile (Score: 90+/100)  
- Professional README with graphics
- Tech Stack showcase with badges
- GitHub Stats dashboard
- Contribution activity visualization
- Project showcase
- Enhanced profile metadata

## How to Test

### Option 1: Quick Test (5 minutes) ⚡
Perfect for verifying the main flow works

👉 **Read:** `QUICK_TEST.md`

What you'll do:
1. Fill intake form (30 sec)
2. Generate profile (1.5 min)
3. Deploy to GitHub (1 min)
4. Verify transformation (1 min)

Expected result: Your GitHub profile visibly transformed with professional README

### Option 2: Comprehensive Test (30 minutes) 📋
For detailed verification and edge cases

👉 **Read:** `E2E_TEST_PLAN.md`

What you'll do:
- Test multiple scenarios (happy path, error cases, edge cases)
- Verify each phase in detail
- Check database records
- Verify GitHub profile transformation

### Option 3: Verification Checklist (ongoing) ✅
For debugging and step-by-step verification

👉 **Read:** `VERIFICATION_GUIDE.md`

What you'll do:
- Follow detailed checklist for each phase
- Watch console logs
- Verify network calls
- Check GitHub profile updates

## Complete Testing Flow

```
LOGIN
  ↓
INTAKE FORM (5 step questionnaire)
  ↓
ANALYSIS & GENERATION (AI generates content)
  ↓
PREVIEW (shows what will be deployed)
  ↓
DEPLOYMENT (pushes to GitHub)
  ↓
COMPLETION (shows success & stats)
  ↓
VERIFY ON GITHUB (check profile transformation)
```

## What Gets Created on GitHub

### Profile README Repository
- Repository name = your GitHub username
- Contains README.md with professional content
- Displays under your profile picture

### Profile README Content
- Professional header/banner
- About Me section
- Tech Stack with badges
- GitHub Stats dashboard  
- Contribution Activity graph
- GitHub Trophies
- Projects showcase
- Goals and what you're working on

### Project Repository (optional)
- New repository created
- Starter project structure
- README.md explaining project
- Multiple commits for activity boost

## Before You Start

### Prerequisites
- [ ] Dev server running (`npm run dev`)
- [ ] Logged in to GitGlow via GitHub OAuth
- [ ] Browser DevTools open (F12)
- [ ] Network tab ready to monitor

### What You Need Access To
- [ ] GitHub account (to verify profile changes)
- [ ] Browser console (to watch `[v0]` logs)
- [ ] Network DevTools tab (to see API calls)

## Testing Checklist

### Phase 1: Intake Form
- [ ] Load `/intake` page
- [ ] Fill all 5 form steps
- [ ] Click "Generate My Profile"
- [ ] See console log: `[v0] Submitting intake form...`
- [ ] Redirect to preview page

### Phase 2: Generation
- [ ] Shows "Analyzing your GitHub profile..."
- [ ] Displays current score and weaknesses
- [ ] README preview shows markdown content
- [ ] See console logs for generation progress
- [ ] Shows final score improvement

### Phase 3: Deployment
- [ ] Deploy page shows 4 steps with progress
- [ ] Each step logs to console with `[v0]` prefix
- [ ] No red error messages
- [ ] Completes successfully

### Phase 4: Completion
- [ ] Confetti animation plays
- [ ] Shows "Your GitHub just got a glow-up!"
- [ ] Displays score: "25 → 90"
- [ ] Share buttons work
- [ ] GitHub profile link is correct

### Phase 5: GitHub Verification
- [ ] New repository with your username exists
- [ ] README.md file present in repo
- [ ] Profile README displays under your avatar
- [ ] Content has professional formatting
- [ ] Project repository created (if enabled)

## Expected Console Logs

You should see these `[v0]` markers during execution:

```
✓ [v0] Submitting intake form with data:
✓ [v0] API response status: 200
✓ [v0] Analyzing your GitHub profile...
✓ [v0] Calculating polish score...
✓ [v0] Identifying profile weaknesses...
✓ [v0] Generating README...
✓ [v0] Creating project concept...
✓ [v0] Planning contribution commits...
✓ [v0] Validating GitHub token permissions...
✓ [v0] Setting bio and location...
✓ [v0] Creating profile README...
✓ [v0] Successfully pushed README.md
✓ [v0] Profile README created successfully!
✓ [v0] Creating [project-name] repository...
✓ [v0] Project repository created with X files!
✓ [v0] Pushing contribution commits...
✓ [v0] Commit push completed: X succeeded, Y failed
```

If you see all these, the flow executed successfully!

## If Something Goes Wrong

### Form hangs when submitting
- Check console for error messages
- Make sure all form fields are filled
- Try refreshing page and submitting again

### Generation times out
- Check Network tab → `/api/generate`
- Look for status 500 or other errors
- Check console for ANTHROPIC_API_KEY error

### Deploy fails
- Common issue: "Permission denied to push"
  - Your token might lack `repo` scope
  - Try logging out and back in to re-authenticate
  
- Common issue: "Repository already exists"
  - Delete existing repositories and try again
  
- Check console for `[v0]` error messages
- Refer to `TROUBLESHOOTING.md` for more solutions

### Profile doesn't change on GitHub
- Refresh GitHub profile page (hard refresh: Ctrl+Shift+R)
- Wait 5-10 minutes for GitHub cache
- Check if README repository was created
- Verify README.md file exists in repo

## Files to Reference

| File | Purpose | Read Time |
|------|---------|-----------|
| `QUICK_TEST.md` | 5-minute test | 5 min |
| `E2E_TEST_PLAN.md` | Complete test spec | 15 min |
| `VERIFICATION_GUIDE.md` | Step-by-step debugging | 10 min |
| `TESTING_SUMMARY.md` | Overview of all fixes | 10 min |
| `TROUBLESHOOTING.md` | Common issues & solutions | 5 min |
| `INTAKE_FIXES.md` | Intake form fixes | 5 min |
| `FIXES_APPLIED.md` | All improvements made | 5 min |

## Success Criteria ✅

Your test is successful if:

✅ All intake form steps complete
✅ Console shows all `[v0]` logs without errors
✅ Generation completes with README preview
✅ Deploy shows all 4 steps progressing
✅ Completion page displays score improvement
✅ New GitHub repositories created
✅ Profile README displays on GitHub
✅ README has professional formatting
✅ Can share profile via social buttons

## Common Questions

**Q: Do I need to use a real GitHub account?**
A: Yes, the test creates real repositories on your GitHub profile. Use an account you're comfortable testing with.

**Q: What if I hit GitHub rate limits?**
A: GitHub allows 5000 API calls/hour. If you hit the limit, wait 1 hour before testing again.

**Q: Can I test locally without deploying to GitHub?**
A: The test currently deploys to real GitHub to verify the complete flow. You can review the code without deploying if you prefer.

**Q: How long does the whole process take?**
A: About 5-10 minutes total (intake 30s, generation 1.5 min, deploy 1 min, verification 1 min).

**Q: What happens if deployment fails?**
A: Error is caught and displayed on deploy page. Check console for specific error. See `TROUBLESHOOTING.md` for solutions.

**Q: Can I test multiple times?**
A: Yes! Just delete the created repositories from GitHub and test again.

## Ready to Test?

1. **Choose your test:**
   - Quick test: `QUICK_TEST.md` (5 min)
   - Full test: `E2E_TEST_PLAN.md` (30 min)

2. **Follow the steps** in your chosen guide

3. **Verify results** using the checklist above

4. **If issues occur:** Check `TROUBLESHOOTING.md`

5. **Report findings** to help improve GitGlow!

---

## Key Takeaway

GitGlow successfully transforms your GitHub profile from basic (Score: 25) to premium (Score: 90+) by:
- Generating professional README with badges
- Creating project repositories
- Adding contribution activity
- Enhancing profile metadata
- Providing stats and analytics

**Start testing now with `QUICK_TEST.md`!** ⚡
