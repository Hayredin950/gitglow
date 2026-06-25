import { auth } from "@/lib/auth";
import { getProfile, getRepositories, hasProfileReadme } from "@/lib/github/profile";
import { calculatePolishScore, identifyWeaknesses } from "@/lib/analysis/scorer";
import { streamProfileReadme } from "@/lib/ai/generators/readme";
import { generateBio } from "@/lib/ai/generators/bio";
import { generateProject, inferProjectFromSkills } from "@/lib/ai/generators/project";
import { generateCommitSchedule } from "@/lib/ai/generators/commits";
import { db } from "@/lib/db";
import type { UserIntake } from "@/types/polish";
import type { GeneratedProject } from "@/types/polish";

export const dynamic = 'force-dynamic';

export const maxDuration = 300;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await db.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });
  if (!dbUser?.githubToken) {
    return Response.json({ error: "GitHub token missing" }, { status: 400 });
  }

  const body = await req.json() as { intake: UserIntake; polishId: string };
  const { intake, polishId } = body;

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function emit(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ event, data })}\n\n`)
        );
      }

      try {
        // Phase 1: Analyze
        emit("status", { message: "Analyzing your GitHub profile..." });
        const [profile, repos, hasReadme] = await Promise.all([
          getProfile(dbUser.githubToken!, dbUser.username!),
          getRepositories(dbUser.githubToken!, dbUser.username!),
          hasProfileReadme(dbUser.githubToken!, dbUser.username!),
        ]);

        const score = calculatePolishScore(profile, repos, hasReadme, repos.length * 8);
        const weaknesses = identifyWeaknesses(profile, repos, hasReadme, repos.length * 8);
        emit("analyze_complete", { score, weaknesses, profile });

        // Phase 2: Generate bio
        emit("status", { message: "Crafting your bio..." });
        const bio = await generateBio(intake);
        emit("bio_complete", { bio });

        // Phase 3: Stream README
        emit("status", { message: "Generating your profile README..." });
        let readme = "";
        for await (const chunk of streamProfileReadme(profile, intake)) {
          readme += chunk;
          emit("readme_chunk", { chunk });
        }
        emit("readme_complete", { readme });

        // Phase 4: Generate project
        emit("status", { message: "Generating your project repository..." });
        const spec = inferProjectFromSkills(intake.skills, intake.projectIdea);
        const project = await generateProject(spec, intake.fullName);
        emit("project_complete", { project });

        // Phase 5: Plan commits
        emit("status", { message: "Planning contribution history..." });
        const commitPlan = generateCommitSchedule([project as GeneratedProject], 180);
        emit("commits_planned", { count: commitPlan.length, plan: commitPlan });

        // Save to DB
        await db.polish.update({
          where: { id: polishId },
          data: {
            status: "AWAITING_APPROVAL",
            scoreBefore: score.total,
            generatedReadme: readme,
            generatedBio: bio,
          },
        });

        emit("generate_complete", {
          readme,
          bio,
          project,
          commitPlan,
          scoreBefore: score.total,
          weaknesses,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Generation failed";
        emit("error", { message });
        await db.polish.update({
          where: { id: polishId },
          data: { status: "FAILED" },
        });
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
