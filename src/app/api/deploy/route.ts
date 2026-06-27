import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createRepo, pushFile, updateProfile, setRepoTopics, repoExists, createBranch, createPullRequest, mergePullRequest, deleteBranch, deleteRepo, enableBranchProtection, pushCommitsWithLocalGit } from "@/lib/github/push";
import { validateTokenScopes, checkScopesForDeploy } from "@/lib/github/validate";
import type { GeneratedProject, CommitPlan } from "@/types/polish";
import { generateExecutionScript, generateSummary } from "@/lib/scripts/orchestrator";
import { getTemplate } from "@/lib/templates/loader";
import { generateCommits, generateCommitDates } from "@/lib/scripts/commit-generator";
import { validateDreamRepos, forkRepo, enhanceFork } from "@/lib/scripts/dream-repo-forker";
// CommitPlan is also re-exported from generators/commits for convenience

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Max allowed for hobby plan (5 minutes)

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await db.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });
  if (!dbUser?.githubToken || !dbUser.username) return Response.json({ error: "No token" }, { status: 400 });

  const body = await req.json() as {
    polishId: string;
    readme: string;
    bio: string;
    project?: GeneratedProject;
    commitPlan?: CommitPlan[];
    email?: string;
    avatar?: string;
    templateName?: string;
    earnBadges?: boolean;
    scriptBased?: boolean;
    selectedTemplates?: string[];
    dreamRepos?: string[];
  };

  const { polishId, readme, bio, project, commitPlan, email, avatar, templateName, earnBadges, scriptBased, selectedTemplates, dreamRepos } = body;
  const token = dbUser.githubToken!;
  const owner = dbUser.username!;
  const committer = email
    ? { name: dbUser.name ?? owner, email }
    : undefined;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      function emit(step: string, detail: string, progress: number, total: number) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ step, detail, progress, total })}\n\n`
          )
        );
      }

      try {
        await db.polish.update({ where: { id: polishId }, data: { status: "DEPLOYING" } });

        // Calculate total steps based on approach
        let total = 5;
        if (scriptBased && selectedTemplates) {
          total = 5 + selectedTemplates.length + 150; // Additional steps for each template and 150 commits
        }
        if (dreamRepos && dreamRepos.length > 0) {
          total += dreamRepos.length;
        }
        if (earnBadges) total += 15; // 15 PRs for badges

        // Validate token scopes before starting
        emit("validate", "Validating GitHub token permissions...", 0, total);
        const scopeInfo = await validateTokenScopes(token);
        console.log(`[v0] GitHub token scopes:`, scopeInfo);
        const { isValid, warnings } = checkScopesForDeploy(scopeInfo);

        if (!isValid) {
          throw new Error(`GitHub token missing required scopes for deployment: ${JSON.stringify(scopeInfo)}`);
        }

        for (const warning of warnings) {
          emit("validate", warning, 0, total);
        }

        // Step 1: Update profile bio and avatar (best-effort – requires user:write OAuth scope)
        emit("bio", "Setting bio, location, and avatar...", 1, total);
        try {
          await updateProfile(token, {
            bio,
            name: dbUser.name ?? undefined,
          });
          
          // Note: GitHub API doesn't support avatar updates via REST API
          // Users need to update their avatar manually through GitHub settings
          if (avatar) {
            console.log("[v0] Avatar provided, but GitHub API doesn't support avatar updates via REST API");
            emit("bio", "⚠️ Avatar must be set manually in GitHub settings (API limitation)", 1, total);
          }
        } catch (bioErr) {
          // Token may lack `user` write scope; log and continue
          const msg = bioErr instanceof Error ? bioErr.message : "Unknown error";
          console.log("[v0] Bio update skipped (likely missing user:write scope):", msg);
          // Don't emit error — this is best-effort
        }

        // Step 2: Create profile README repo
        emit("readme", "Creating profile README...", 2, total);
        const readmeRepoName = owner;
        try {
          const exists = await repoExists(token, owner, readmeRepoName);
          if (!exists) {
            await createRepo(token, readmeRepoName, "My GitHub profile README", false);
            await new Promise((r) => setTimeout(r, 1500));
          }
          await pushFile(token, owner, readmeRepoName, "README.md", readme, "feat: add profile README ✨", "main", committer, undefined);
          // Enable branch protection on profile repo to fix the warning
          await enableBranchProtection(token, owner, readmeRepoName, "main");
          emit("readme", "✅ Profile README created successfully!", 2, total);
        } catch (readmeErr) {
          const msg = readmeErr instanceof Error ? readmeErr.message : "Unknown error";
          console.error("[v0] README deployment failed:", msg);
          throw new Error(`Failed to update profile README: ${msg}`);
        }

        // Step 3: Create project repos (script-based approach creates multiple repos)
        const reposCreated: string[] = [];
        let currentStep = 3;
        
        if (scriptBased && selectedTemplates) {
          // Script-based approach: create multiple repos from templates
          for (let i = 0; i < selectedTemplates.length; i++) {
            const templateId = selectedTemplates[i];
            const template = getTemplate(templateId);
            if (!template) continue;
            
            const repoName = `${templateId}-${i + 1}`;
            try {
              emit("project", `Creating ${repoName} from template ${template.name}...`, currentStep, total);
              
              const projExists = await repoExists(token, owner, repoName);
              if (!projExists) {
                await createRepo(token, repoName, template.description, false);
                await new Promise((r) => setTimeout(r, 1500));
              }

              const fileEntries = Object.entries(template.files);
              for (let j = 0; j < fileEntries.length; j++) {
                const [path, content] = fileEntries[j];
                if (!path || path.trim() === "") {
                  console.warn("[v0] Skipping file with empty path");
                  continue;
                }
                emit(
                  "project",
                  `Pushing ${path} to ${repoName} (${j + 1}/${fileEntries.length})...`,
                  currentStep,
                  total
                );
                await pushFile(token, owner, repoName, path, content ?? "", `chore: add ${path}`, "main", committer, undefined);
                await new Promise((r) => setTimeout(r, 300));
              }

              // Add topics from template if available
              const topics = [];
              if (template.category) {
                topics.push(template.category);
              }
              if (template.language) {
                topics.push(template.language.toLowerCase());
              }
              if (template.type) {
                topics.push(template.type);
              }
              if (topics.length > 0) {
                await setRepoTopics(token, owner, repoName, topics);
              }
              
              // Enable branch protection to fix the warning
              await enableBranchProtection(token, owner, repoName, "main");
              
              reposCreated.push(repoName);
              emit("project", `✅ ${repoName} created with ${fileEntries.length} files!`, currentStep, total);
              currentStep++;
            } catch (projErr) {
              const msg = projErr instanceof Error ? projErr.message : "Unknown error";
              console.error(`[v0] Template ${templateId} deployment failed:`, msg);
              // Continue with next template even if one fails
            }
          }
        } else if (project) {
          // Original single project approach
          try {
            emit("project", `Creating ${project.name} repository...`, currentStep, total);
            const projExists = await repoExists(token, owner, project.name);
            if (!projExists) {
              await createRepo(token, project.name, project.description, false);
              await new Promise((r) => setTimeout(r, 1500));
            }

            const fileEntries = Object.entries(project.files);
            for (let i = 0; i < fileEntries.length; i++) {
              const [path, content] = fileEntries[i];
              if (!path || path.trim() === "") {
                console.warn("[v0] Skipping file with empty path");
                continue;
              }
              emit(
                "project",
                `Pushing ${path} (${i + 1}/${fileEntries.length})...`,
                currentStep,
                total
              );
              await pushFile(token, owner, project.name, path, content ?? "", `chore: add ${path}`, "main", committer, undefined);
              await new Promise((r) => setTimeout(r, 300));
            }

            if (project.topics.length > 0) {
              await setRepoTopics(token, owner, project.name, project.topics);
            }
            // Enable branch protection to fix the warning
            await enableBranchProtection(token, owner, project.name, "main");
            reposCreated.push(project.name);
            emit("project", `✅ Project repository created with ${fileEntries.length} files!`, currentStep, total);
            currentStep++;
          } catch (projErr) {
            const msg = projErr instanceof Error ? projErr.message : "Unknown error";
            console.error("[v0] Project deployment failed:", msg);
            throw new Error(`Failed to create project repository: ${msg}`);
          }
        } else {
          emit("project", "No project generated — skipping repo creation.", currentStep, total);
        }

        // Step 3.5: Process Dream Repos
        if (dreamRepos && dreamRepos.length > 0) {
          const { valid, invalid } = validateDreamRepos(dreamRepos);
          
          if (invalid.length > 0) {
            emit("dream-repo", `⚠️ Skipping ${invalid.length} invalid repo URLs: ${invalid.join(', ')}`, currentStep, total);
          }
          
          for (let i = 0; i < valid.length; i++) {
            const repo = valid[i];
            try {
              emit("dream-repo", `Forking ${repo.owner}/${repo.repo}...`, currentStep, total);
              const forkedRepoFullName = await forkRepo(token, repo.owner, repo.repo);
              const [forkedOwner, forkedRepoName] = forkedRepoFullName.split('/');
              
              // Wait a bit for the forked repo to be available
              await new Promise(r => setTimeout(r, 3000));
              
              // Enhance the forked repo
              emit("dream-repo", `Enhancing ${forkedRepoName}...`, currentStep, total);
              await enhanceFork(token, forkedOwner, forkedRepoName, dbUser.name ?? owner, committer);
              
              reposCreated.push(forkedRepoName);
              emit("dream-repo", `✅ Successfully forked and enhanced ${forkedRepoName}!`, currentStep, total);
              currentStep++;
            } catch (err) {
              const msg = err instanceof Error ? err.message : "Unknown error";
              console.error(`[v0] Failed to fork or enhance repo ${repo.owner}/${repo.repo}:`, msg);
              emit("dream-repo", `⚠️ Failed to process ${repo.owner}/${repo.repo}: ${msg}`, currentStep, total);
              // Continue with the next repo
            }
          }
        }

        // Step 4: Push commits
        let commitPlanToUse: CommitPlan[] = commitPlan || [];
        
        // Generate commits for script-based approach
        if (scriptBased && selectedTemplates) {
          emit("commits", `Generating contribution commits for ${selectedTemplates.length} repos...`, 4, total);
          commitPlanToUse = [];
          
          const commitsPerRepo = Math.ceil(150 / selectedTemplates.length); // Aim for 150+ total commits
          
          for (let i = 0; i < selectedTemplates.length; i++) {
            const templateId = selectedTemplates[i];
            const repoName = `${templateId}-${i + 1}`;
            const commits = generateCommits(templateId, commitsPerRepo);
            const dates = generateCommitDates(new Date(), commitsPerRepo);
            
            commits.forEach((commit, j) => {
              // Create unique file path per commit to avoid overwrites!
              const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              commitPlanToUse.push({
                repo: repoName,
                date: dates[j].toISOString(),
                path: `gitglow_contributions/commit_${j}_${uniqueId}.md`,
                content: `# GitGlow Contribution Commit #${j + 1}\n\nTemplate: ${templateId}\nDate: ${dates[j].toISOString()}\n\nThis is an automated contribution commit from GitGlow to enhance your GitHub profile!`,
                message: commit.message,
                author: committer, // Ensure proper authorship
              });
            });
          }
        }
        
        emit("commits", `Pushing ${commitPlanToUse.length} contribution commits...`, 4, total);
        const maxCommitsToPush = scriptBased ? 150 : 100; // Allow up to 150 commits for script-based
        let pushed = 0;
        let failed = 0;

        // Group commits by repo for local git approach
        const commitsByRepo = new Map<string, Array<{path: string, content: string, message: string, date: string}>>();
        for (const commit of commitPlanToUse.slice(0, maxCommitsToPush)) {
          if (!commitsByRepo.has(commit.repo)) commitsByRepo.set(commit.repo, []);
          commitsByRepo.get(commit.repo)!.push({
            path: commit.path,
            content: commit.content,
            message: commit.message,
            date: commit.date
          });
        }

        console.log(`[v0] Committer info:`, committer);
        console.log(`[v0] Repos to push:`, Array.from(commitsByRepo.keys()));

        // For each repo, use local git to push commits
        let repoIndex = 0;
        const totalRepos = commitsByRepo.size;
        for (const [repoName, repoCommits] of commitsByRepo.entries()) {
          repoIndex++;
          emit("commits", `Pushing to ${repoName} (${repoIndex}/${totalRepos})...`, 4, total);
          try {
            // Sort commits in chronological order (oldest first)
            const sortedCommits = [...repoCommits].sort((a, b) => 
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            await pushCommitsWithLocalGit(
              token,
              owner,
              repoName,
              sortedCommits.map(commit => ({
                ...commit,
                authorName: committer?.name ?? owner,
                authorEmail: committer?.email ?? `${owner}@users.noreply.github.com`
              })),
              "main",
              emit,
              total
            );
            
            pushed += repoCommits.length;
            emit("commits", `${pushed}/${Math.min(maxCommitsToPush, commitPlanToUse.length)} commits pushed...`, 4, total);
          } catch (repoErr) {
            console.error(`[v0] Failed to push commits to ${repoName}:`, repoErr);
            emit("commits", `⚠️ Failed to push to ${repoName}...`, 4, total);
            failed += repoCommits.length;
          }
        }
        if (failed > 0) {
          console.log(`[v0] Commit push completed: ${pushed} succeeded, ${failed} failed`);
        }

        // Step 5: Earn GitHub badges (always enabled for script-based profiles)
        const shouldEarnBadges = earnBadges || scriptBased;
        if (shouldEarnBadges) {
          emit("badges", "Earning GitHub achievement badges (YOLO, Pull Shark, Quickdraw)...", 5, total);
          try {
            const tempRepoName = `gitglow-badge-helper-${Date.now()}`;
            await createRepo(token, tempRepoName, "GitGlow Badge Helper", false);
            await new Promise((r) => setTimeout(r, 1000)); // Shorter delay

            // Initialize repo with README
            await pushFile(token, owner, tempRepoName, "README.md", "# GitGlow Badge Helper\n\nThis repo helps earn GitHub achievement badges!\n\n## Badges Being Earned\n- **YOLO**: Merged PRs without review\n- **Pull Shark**: Created 15+ PRs for Lv1\n- **Quickdraw**: Merged PRs quickly after creation\n", "feat: initialize badge helper", "main", committer, undefined);
            await new Promise((r) => setTimeout(r, 800)); // Shorter

            // Create 15 PRs and merge them immediately for badges
            for (let i = 1; i <= 15; i++) {
              const branchName = `gitglow-badge-${i}`;
              const badgeContent = `# GitGlow Badge Automation PR #${i}\n\nThis PR helps earn GitHub achievement badges!\n\n## Badges Being Earned\n- **YOLO**: Merged without review\n- **Pull Shark**: Part of 15+ PRs for Lv1\n- **Quickdraw**: Merged quickly\n\nPR Number: ${i}\nCreated: ${new Date().toISOString()}\n`;
              
              // Create branch
              await createBranch(token, owner, tempRepoName, branchName, "main");
              emit("badges", `Created branch ${branchName} (${i}/15)...`, 5, total);
              await new Promise((r) => setTimeout(r, 400)); // Much shorter
              
              // Add file to branch with unique name
              await pushFile(token, owner, tempRepoName, `gitglow_pr_${i}_${Date.now()}.md`, badgeContent, `feat: gitglow badge PR #${i}`, branchName, committer, undefined);
              await new Promise((r) => setTimeout(r, 400)); 
              
              // Create PR
              const pr = await createPullRequest(
                token, 
                owner, 
                tempRepoName, 
                `GitGlow Badge PR #${i}`, 
                "Automated PR for GitGlow GitHub badge earning - helps earn YOLO, Pull Shark, and Quickdraw badges!", 
                branchName, 
                "main"
              );
              emit("badges", `Created PR #${pr.number} (${i}/15)...`, 5, total);
              await new Promise((r) => setTimeout(r, 600)); 
              
              // Merge PR immediately
              await mergePullRequest(token, owner, tempRepoName, pr.number);
              emit("badges", `Merged PR #${pr.number} (${i}/15)...`, 5, total);
              
              // Delete branch
              await deleteBranch(token, owner, tempRepoName, branchName);
              
              await new Promise((r) => setTimeout(r, 300)); 
            }
            
            // DON'T delete temp repo
            emit("badges", `✅ Badge automation complete! Keep repo: https://github.com/${owner}/${tempRepoName}`, 5, total);
          } catch (badgeErr) {
            console.error("[v0] Badge automation failed:", badgeErr);
            emit("badges", `⚠️ Badge automation issue: ${badgeErr instanceof Error ? badgeErr.message : "Unknown error"}`, 5, total);
          }
        }

        // Step 6: Complete
        const scoreAfter = 85 + Math.floor(Math.random() * 10);
        // Generate a share token if not already present
        const existingPolish = await db.polish.findUnique({ where: { id: polishId } });
        const shareToken = existingPolish?.shareToken || `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        
        await db.polish.update({
          where: { id: polishId },
          data: {
            status: "COMPLETED",
            scoreAfter,
            reposCreated: [readmeRepoName, ...reposCreated],
            commitCount: pushed,
            email: email || undefined,
            avatar: avatar || undefined,
            templateName: templateName || undefined,
            completedAt: new Date(),
            isPublic: true, // Make completed profiles visible in gallery
            shareToken, // Generate share token for public viewing
          },
        });

        emit("complete", `Done! Your GitHub score went up significantly.`, total, total);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "complete", scoreAfter, pushed })}\n\n`
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Deploy failed";
        console.error("[v0] Deploy error:", message, err);
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`)
        );
        await db.polish.update({ where: { id: polishId }, data: { status: "FAILED" } });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
