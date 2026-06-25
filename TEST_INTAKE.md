# Testing the Intake Form Fix

## How to Test

### Success Scenario
1. Log in to GitGlow
2. Click "Get Started"
3. Enter your full name (e.g., "John Developer")
4. Select a career goal (e.g., "Land a software engineering job")
5. Select at least one skill (e.g., "React", "TypeScript")
6. Optionally describe a project idea or leave blank
7. Select your preferred tone (e.g., "Professional")
8. Click "Generate My Profile"

**Expected Result:** 
- Button shows "Starting..."
- After a moment, you're redirected to `/preview?polishId=<some-id>`
- No error message appears

### Error Scenarios

#### Test 1: Missing Name
1. Click through steps 2-5 normally
2. On Step 1 (Name), leave the name field empty
3. Click "Next"
4. Notice the button is disabled - this validates client-side
5. Enter a name and continue

#### Test 2: No Skills Selected
1. Go through steps 1, 2, 3
2. On Step 3 (Skills), don't select any skills
3. Try to click "Next"
4. Button is disabled - this validates client-side
5. Select at least one skill

#### Test 3: API Errors (if backend is down)
1. Complete all steps normally
2. Turn off network or simulate API failure
3. Click "Generate My Profile"
4. An error message appears: "Failed to create profile..."
5. Dismiss error and retry when ready

## What's Changed

### Console Logs to Look For
Open browser DevTools (F12) and go to Console tab. When you click "Generate My Profile", you should see:

```
[v0] Submitting intake form with data: {fullName: "...", goal: "...", skills: [...], tone: "...", ...}
[v0] API response status: 200
[v0] API response data: {polishId: "cuid..."}
[v0] Redirecting to preview with polishId: cuid...
```

If there's an error, you'd see:
```
[v0] API error: Full name is required
```

### Error Scenarios

If the form is invalid, you should now see an error message like:

- "Full name is required"
- "Career goal is required"  
- "At least one skill is required"
- "Tone preference is required"
- "Unauthorized - please sign in first"
- "Invalid JSON in request body"
- Any other validation or server error

## Browser DevTools Network Tab

You can also monitor the API call:

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Generate My Profile"
4. Look for a POST request to `/api/polish/create`
5. Click on it and check:
   - **Status**: Should be 200 (success) or 4xx/5xx (error)
   - **Response**: Should show `{polishId: "..."}`

## Server Logs

In the terminal where you're running `npm run dev`, you should see:

```
[v0] Creating polish for user: user_123
[v0] Polish created successfully: cuid_value
```

Or on error:
```
[v0] POST /api/polish/create error: Full name is required
```

## Quick Checklist

- [ ] Form submission works with valid data
- [ ] Error message appears when form is incomplete
- [ ] Error can be dismissed
- [ ] Console shows `[v0]` logs
- [ ] Button shows "Starting..." during submission
- [ ] Successful redirect to preview page
- [ ] Errors are specific and helpful
