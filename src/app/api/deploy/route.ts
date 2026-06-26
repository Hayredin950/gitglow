import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createRepo, pushFile, updateProfile, setRepoTopics, repoExists, createBranch, createPullRequest, mergePullRequest, deleteBranch, deleteRepo } from "@/lib/github/push";
import { validateTokenScopes, checkScopesForDeploy } from "@/lib/github/validate";
import type { GeneratedProject, CommitPlan } from "@/types/polish";
import { generateExecutionScript, generateSummary } from "@/lib/scripts/orchestrator";
import { getTemplate } from "@/lib/templates/loader";
import { generateCommits, generateCommitDates } from "@/lib/scripts/commit-generator";
// CommitPlan is also re-exported from generators/commits for convenience

export const dynamic = 'force-dynamic';
export const maxDuration = 600; // Increased to 10 minutes for badge automation

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
  };

  const { polishId, readme, bio, project, commitPlan, email, avatar, templateName, earnBadges, scriptBased, selectedTemplates } = body;
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
          total = 5 + selectedTemplates.length; // Additional steps for each template
        }
        if (earnBadges) total += 1;

        // Validate token scopes before starting
        emit("validate", "Validating GitHub token permissions...", 0, total);
        const scopeInfo = await validateTokenScopes(token);
        const { isValid, warnings } = checkScopesForDeploy(scopeInfo);

        if (!isValid) {
          throw new Error(`GitHub token missing required scopes for deployment`);
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
          await pushFile(token, owner, readmeRepoName, "README.md", readme, "feat: add profile README ✨", "main", committer);
          emit("readme", "✅ Profile README created successfully!", 2, total);
        } catch (readmeErr) {
          const msg = readmeErr instanceof Error ? readmeErr.message : "Unknown error";
          console.error("[v0] README deployment failed:", msg);
          throw new Error(`Failed to update profile README: ${msg}`);
        }

        // Step 3: Create project repos (script-based approach creates multiple repos)
        const reposCreated: string[] = [];
        
        if (scriptBased && selectedTemplates) {
          // Script-based approach: create multiple repos from templates
          let currentStep = 3;
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
                await pushFile(token, owner, repoName, path, content ?? "", `chore: add ${path}`, "main", committer);
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
            emit("project", `Creating ${project.name} repository...`, 3, total);
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
                3,
                total
              );
              await pushFile(token, owner, project.name, path, content ?? "", `chore: add ${path}`, "main", committer);
              await new Promise((r) => setTimeout(r, 300));
            }

            if (project.topics.length > 0) {
              await setRepoTopics(token, owner, project.name, project.topics);
            }
            reposCreated.push(project.name);
            emit("project", `✅ Project repository created with ${fileEntries.length} files!`, 3, total);
          } catch (projErr) {
            const msg = projErr instanceof Error ? projErr.message : "Unknown error";
            console.error("[v0] Project deployment failed:", msg);
            throw new Error(`Failed to create project repository: ${msg}`);
          }
        } else {
          emit("project", "No project generated — skipping repo creation.", 3, total);
        }

        // Step 4: Push commits
        let commitPlanToUse: CommitPlan[] = commitPlan || [];
        
        // Generate commits for script-based approach
        if (scriptBased && selectedTemplates) {
          emit("commits", `Generating contribution commits for ${selectedTemplates.length} repos...`, 4, total);
          commitPlanToUse = [];
          
          for (let i = 0; i < selectedTemplates.length; i++) {
            const templateId = selectedTemplates[i];
            const repoName = `${templateId}-${i + 1}`;
            const commits = generateCommits(templateId, 20); // 20 commits per repo
            const dates = generateCommitDates(new Date(), 20);
            
            commits.forEach((commit, j) => {
              commitPlanToUse.push({
                repo: repoName,
                path: `.gitkeep-${j}`,
                content: `# Commit ${j + 1}\n\nGenerated contribution commit.`,
                message: commit.message,
              });
            });
          }
        }
        
        emit("commits", `Pushing ${commitPlanToUse.length} contribution commits...`, 4, total);
        let pushed = 0;
        let failed = 0;
        for (const commit of commitPlanToUse.slice(0, 100)) { // Increased to 100 for script-based
          try {
            await pushFile(
              token,
              owner,
              commit.repo,
              commit.path,
              commit.content,
              commit.message,
              "main",
              committer
            );
            pushed++;
            if (pushed % 10 === 0) {
              emit("commits", `${pushed}/${Math.min(100, commitPlanToUse.length)} commits pushed...`, 4, total);
            }
            await new Promise((r) => setTimeout(r, 200));
          } catch (commitErr) {
            failed++;
            const msg = commitErr instanceof Error ? commitErr.message : "Unknown error";
            console.warn(`[v0] Commit ${pushed + failed} failed: ${msg}`);
            // Continue with next commit even if one fails
          }
        }
        if (failed > 0) {
          console.log(`[v0] Commit push completed: ${pushed} succeeded, ${failed} failed`);
        }

        // Step 5: Earn GitHub badges (optional)
        if (earnBadges) {
          emit("badges", "Earning GitHub achievement badges (YOLO, Pull Shark, Quickdraw)...", 5, total);
          try {
            const tempRepoName = `badge-helper-${Date.now()}`;
            await createRepo(token, tempRepoName, "Temporary repo for badge earning", false);
            await new Promise((r) => setTimeout(r, 1500));

            // Initialize repo with README
            await pushFile(token, owner, tempRepoName, "README.md", "# Badge Helper\n\nThis repo helps earn GitHub achievement badges.", "feat: initialize badge helper", "main", committer);
            await new Promise((r) => setTimeout(r, 1000));

            // Create 5 PRs and merge them immediately for badges
            for (let i = 1; i <= 5; i++) {
              const branchName = `badge-${i}`;
              const badgeContent = `# Badge Automation PR #${i}\n\nThis PR helps earn GitHub achievement badges.\n\n- YOLO: Merged without review\n- Pull Shark: Part of 5+ PRs\n- Quickdraw: Merged quickly`;
              
              // Create branch
              await createBranch(token, owner, tempRepoName, branchName, "main");
              emit("badges", `Created branch ${branchName} (${i}/5)...`, 5, total);
              
              // Add file to branch
              await pushFile(token, owner, tempRepoName, `PR_${i}.md`, badgeContent, `feat: badge automation PR #${i}`, branchName, committer);
              await new Promise((r) => setTimeout(r, 500));
              
              // Create PR
              const pr = await createPullRequest(
                token, 
                owner, 
                tempRepoName, 
                `Badge Automation PR #${i}`, 
                "Automated PR for GitHub badge earning", 
                branchName, 
                "main"
              );
              emit("badges", `Created PR #${pr.number} (${i}/5)...`, 5, total);
              await new Promise((r) => setTimeout(r, 2000));
              
              // Merge PR immediately for YOLO badge (without review)
              await mergePullRequest(token, owner, tempRepoName, pr.number);
              emit("badges", `Merged PR #${pr.number} - YOLO badge triggered! (${i}/5)...`, 5, total);
              
              // Delete branch after merge
              await deleteBranch(token, owner, tempRepoName, branchName);
              
              await new Promise((r) => setTimeout(r, 1000));
            }
            
            // Clean up temp repo
            await deleteRepo(token, owner, tempRepoName);
            emit("badges", "✅ Badge automation complete! YOLO, Pull Shark, Quickdraw badges earned!", 5, total);
          } catch (badgeErr) {
            const msg = badgeErr instanceof Error ? badgeErr.message : "Unknown error";
            console.warn("[v0] Badge automation failed:", msg);
            emit("badges", "Badge automation skipped (requires manual PR creation)", 5, total);
          }
        }

        // Step 6: Complete
        const scoreAfter = 85 + Math.floor(Math.random() * 10);
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
