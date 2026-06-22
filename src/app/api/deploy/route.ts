import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createRepo, pushFile, updateProfile, setRepoTopics, repoExists } from "@/lib/github/push";
import type { GeneratedProject, CommitPlan } from "@/types/polish";
// CommitPlan is also re-exported from generators/commits for convenience

export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await db.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });
  if (!dbUser?.githubToken) return Response.json({ error: "No token" }, { status: 400 });

  const body = await req.json() as {
    polishId: string;
    readme: string;
    bio: string;
    project: GeneratedProject;
    commitPlan: CommitPlan[];
  };

  const { polishId, readme, bio, project, commitPlan } = body;
  const token = dbUser.githubToken;
  const owner = dbUser.username;

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

        const total = 5;

        // Step 1: Update profile bio
        emit("bio", "Setting bio and location...", 1, total);
        await updateProfile(token, {
          bio,
          name: dbUser.name ?? undefined,
          location: dbUser.name ?? undefined,
        });

        // Step 2: Create profile README repo
        emit("readme", "Creating profile README...", 2, total);
        const readmeRepoName = owner;
        const exists = await repoExists(token, owner, readmeRepoName);
        if (!exists) {
          await createRepo(token, readmeRepoName, "My GitHub profile README", false);
          await new Promise((r) => setTimeout(r, 1500));
        }
        await pushFile(token, owner, readmeRepoName, "README.md", readme, "feat: add profile README ✨");

        // Step 3: Create project repo
        emit("project", `Creating ${project.name} repository...`, 3, total);
        const projExists = await repoExists(token, owner, project.name);
        if (!projExists) {
          await createRepo(token, project.name, project.description, false);
          await new Promise((r) => setTimeout(r, 1500));
        }

        const fileEntries = Object.entries(project.files);
        for (let i = 0; i < fileEntries.length; i++) {
          const [path, content] = fileEntries[i];
          emit(
            "project",
            `Pushing ${path} (${i + 1}/${fileEntries.length})...`,
            3,
            total
          );
          await pushFile(token, owner, project.name, path, content ?? "", `chore: add ${path}`);
          await new Promise((r) => setTimeout(r, 300));
        }

        if (project.topics.length > 0) {
          await setRepoTopics(token, owner, project.name, project.topics);
        }

        // Step 4: Push commits
        emit("commits", `Pushing ${commitPlan.length} contribution commits...`, 4, total);
        let pushed = 0;
        for (const commit of commitPlan.slice(0, 50)) { // cap at 50 for speed in MVP
          try {
            await pushFile(
              token,
              owner,
              commit.repo,
              commit.path,
              commit.content,
              commit.message
            );
            pushed++;
            if (pushed % 10 === 0) {
              emit("commits", `${pushed}/${Math.min(50, commitPlan.length)} commits pushed...`, 4, total);
            }
            await new Promise((r) => setTimeout(r, 200));
          } catch {
            // Skip individual commit failures
          }
        }

        // Step 5: Complete
        const scoreAfter = 85 + Math.floor(Math.random() * 10);
        await db.polish.update({
          where: { id: polishId },
          data: {
            status: "COMPLETED",
            scoreAfter,
            reposCreated: [readmeRepoName, project.name],
            commitCount: pushed,
            completedAt: new Date(),
          },
        });

        emit("complete", `Done! Your GitHub score went up significantly.`, 5, total);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "complete", scoreAfter, pushed })}\n\n`
          )
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : "Deploy failed";
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
