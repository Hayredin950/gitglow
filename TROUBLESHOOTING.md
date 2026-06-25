# GitGlow Troubleshooting Guide

## When a User Says "My GitHub Wasn't Updated"

### Step 1: Check the Deploy Page Error Message
The deploy page should now show specific error messages. Examples:

- **"GitHub token missing required scopes for deployment"**  
  → User needs to re-authenticate with GitHub
  → Their OAuth app needs to request `repo` scope

- **"Failed to update profile README: Repository not found"**  
  → The profile README repo (username/username) doesn't exist or is inaccessible
  → User's GitHub token doesn't have permission to create repos

- **"Invalid GitHub token"**  
  → Token is malformed or expired
  → User needs to re-authenticate

- **"Failed to create project repository: Permission denied"**  
  → User's GitHub doesn't allow creating repos
  → Check GitHub account settings and permissions

### Step 2: Check Server Logs
Look for `[v0]` prefixed log messages:

```
[v0] Token scopes: ["repo", "public_repo"]
[v0] Successfully pushed README.md to username/username
[v0] Profile update skipped (likely missing user:write scope): Requires authentication
[v0] Deploy error: Failed to update profile README: Repository not found
```

**Key indicators:**
- If you see "Profile update skipped" - that's normal, optional step
- If you see "Deploy error" - that's the actual problem
- Count the successful "Successfully pushed" messages to see how much was deployed

### Step 3: Check Database Error Details
Query the Polish record:

```sql
SELECT id, status, errorMessage, createdAt 
FROM "Polish" 
WHERE status = 'FAILED'
ORDER BY createdAt DESC
LIMIT 5;
```

The `errorMessage` field contains details like:
- "Failed to create project repository: Invalid request (422)"
- "Permission denied to push to username/repo-name (403)"

### Step 4: Validate User's GitHub Token Scopes

The token needs these scopes:
- ✅ **REQUIRED:** `repo` (or `public_repo`)
- ⚠️ **OPTIONAL:** `user` (for profile bio update)

You can check via GitHub API:
```bash
curl -H "Authorization: token USER_TOKEN" https://api.github.com/user
# Check response headers for: x-oauth-scopes
```

### Step 5: Common Issues & Fixes

#### Issue: "Repository not found"
**Cause:** Can't create repos or profile README repo already exists elsewhere  
**Fix:**
1. Verify GitHub token has `repo` scope
2. Check if username/username repo exists with different content
3. Try manually creating the repo first

#### Issue: Profile bio wasn't updated
**Cause:** Token lacks `user` scope (normal - this is optional)  
**Fix:** This is expected behavior. Users can manually update their bio on GitHub.

#### Issue: Project repo created but files missing
**Cause:** Some files failed to push (rate limit, size limit, etc.)  
**Fix:**
1. Check logs for individual file failures
2. Verify file sizes aren't too large
3. GitHub has a 100MB file size limit

#### Issue: User sees "Deploy failed" with no details
**Cause:** Network error or stream disconnected  
**Fix:**
1. Check user's internet connection
2. Retry deployment
3. Check deploy page shows any logs before error

## Debugging Checklist

- [ ] Check deploy page shows error message (not just blank error)
- [ ] Server logs contain `[v0]` prefixed messages
- [ ] Database Polish record has status=FAILED and errorMessage populated
- [ ] GitHub token has at least `repo` scope
- [ ] User's GitHub account allows repo creation
- [ ] GitHub API is not rate-limited (check response headers)
- [ ] Generated project files don't exceed 100MB
- [ ] File paths are valid (no special characters, not too long)

## For Developers: Adding More Error Details

If you need to track more specific errors, add console.log statements:

```typescript
console.log("[v0] Bio update result:", result);
console.log("[v0] Repository state:", { exists, owner, repo });
console.log("[v0] File push attempt:", { repo, path, size: content.length });
```

These will appear in server logs prefixed with `[v0]` for easy filtering.

## Testing Error Scenarios

### Test 1: Invalid Token
```
- Change user.githubToken to gibberish
- Try deployment
- Should fail at scope validation step
```

### Test 2: Missing Repo Scope  
```
- Create token with only "public_repo" scope
- Try deployment
- Should warn about limited access
```

### Test 3: Bad Project File Paths
```
- Manually create project with invalid paths
- Try deployment
- Should skip invalid files and continue
```

### Test 4: Rate Limiting
```
- Deploy multiple times quickly
- GitHub may rate limit
- Look for 429 error in logs
```
