# Project Generation Debugging Guide

## Issue
Projects and contribution commits were not being generated during deployment.

Deployment showed:
- ✅ Profile README created successfully
- ❌ No project generated — skipping repo creation
- ❌ Pushing 0 contribution commits

## Root Cause
The Anthropic Claude API was either:
1. Timing out during project generation
2. Returning invalid/malformed JSON
3. Not being called correctly
4. Rate limited

## Fixes Applied

### 1. Comprehensive Logging
Added `[v0]` prefixed console logs to track execution:
- Project spec creation and details
- Anthropic API call initiation
- API response status and content
- JSON parsing attempts
- Validation steps and failures

**Location:** 
- `src/app/api/generate/route.ts` - Generate route logging
- `src/lib/ai/generators/project.ts` - Project generator logging

### 2. Fallback Project Generation
When AI fails to generate a project, create a basic fallback:
- README.md with description
- .gitignore with common patterns
- LICENSE file with author name

This ensures users still get something generated and commits can be planned.

**Location:** `src/app/api/generate/route.ts` lines 80-93

## How to Debug

### Step 1: Enable Console Logs
Open your browser DevTools Console (F12) and filter for `[v0]`:
```
Filter: [v0]
```

### Step 2: Run a Test
1. Fill out the intake form completely
2. Click "Generate My Profile"
3. Watch the console for logs with [v0] prefix

### Step 3: Look For These Logs
```
[v0] Project spec: { name: "...", description: "...", ... }
[v0] Calling Claude API to generate project: project-name
[v0] Claude API response received, status: end_turn
[v0] Response text length: XXXX First 200 chars: ...
[v0] Parsed project successfully
[v0] Project validation passed. Files count: 3
[v0] Valid files after filtering: 3
[v0] Generated project: project-name with 3 files
```

### Step 4: If Project Generation Failed
Look for:
```
[v0] Project generation error: [ERROR MESSAGE]
[v0] Creating fallback project...
```

This means the AI call failed but the fallback was created.

## Common Issues & Solutions

### Issue: No logs appear
**Solution:** 
- Refresh the page
- Check DevTools is open to correct tab
- Try again - may be a network issue

### Issue: JSON parse error
**Logs show:**
```
[v0] JSON parse error: Unexpected token in JSON
```
**Cause:** Claude API returned invalid JSON
**Solution:** This is fixed - fallback project will be created

### Issue: Invalid project name
**Logs show:**
```
[v0] Invalid project name: undefined
```
**Cause:** API returned malformed response
**Solution:** Fallback project created automatically

### Issue: No valid files
**Logs show:**
```
[v0] No valid files found in project
```
**Cause:** All files were invalid or empty
**Solution:** Fallback project created with README, .gitignore, LICENSE

### Issue: "Anthropic API key" error
**Solution:** Check environment variables are set:
- `ANTHROPIC_API_KEY` should be configured
- Contact support if key is missing

## Testing the Fix

1. Fill intake form with:
   - Name: Your Name
   - Goal: Build portfolio
   - Skills: React, Node.js, Python
   - Tone: Professional
   - Project Idea: (leave empty or enter an idea)

2. Watch console for [v0] logs

3. Check results:
   - Should see project creation logs
   - Even if AI fails, fallback creates basic project
   - Deployment continues normally
   - GitHub profile gets updated

## Expected Behavior After Fix

**Before:**
- No project generated
- 0 commits pushed
- Only README created

**After (with AI success):**
- Project with 5-10 files generated
- Commits planned and pushed
- GitHub repo created with full project

**After (with AI failure + fallback):**
- Basic fallback project created (3 files)
- Commits planned and pushed
- GitHub repo created with fallback project

## Next Steps

1. Run through a complete test
2. Check console logs to verify generation flow
3. Verify GitHub profile is updated with:
   - Profile README
   - Project repository
   - Contribution history

## Questions?

If you see errors in logs that aren't explained here:
1. Take a screenshot of the console
2. Note the exact error message
3. Report the issue with full error details
