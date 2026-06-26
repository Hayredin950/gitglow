import { auth } from "@/lib/auth";
import { getProfile, getRepositories, hasProfileReadme } from "@/lib/github/profile";
import { calculatePolishScore, identifyWeaknesses } from "@/lib/analysis/scorer";
import { streamProfileReadme } from "@/lib/ai/generators/readme";
import { generateBio } from "@/lib/ai/generators/bio";
import { generateProject, inferProjectFromSkills } from "@/lib/ai/generators/project";
import { generateCommitSchedule } from "@/lib/ai/generators/commits";
import { db } from "@/lib/db";
import { getTemplate, listTemplates } from "@/lib/templates/loader";
import type { UserIntake, GeneratedProject, CommitPlan } from "@/types/polish";

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

        // Phase 3: Stream README (static template fallback built into the generator)
        emit("status", { message: "Generating your profile README..." });
        let readme = "";
        try {
          for await (const chunk of streamProfileReadme(profile, intake)) {
            readme += chunk;
            emit("readme_chunk", { chunk });
          }
        } catch (readmeErr) {
          console.error("[v0] README stream error:", readmeErr);
          emit("status", { message: "Using profile README template..." });
        }
        emit("readme_complete", { readme });

        // Phase 4: Generate project
        emit("status", { message: "Preparing your project repository..." });
        let project: GeneratedProject | null = null;

        // Skip template/AI generation for script-based approach
        if (!intake.scriptBased && (intake as any).useTemplate && (intake as any).templateName) {
          // Use pre-built template (legacy AI-based approach)
          console.log("[v0] Loading template:", (intake as any).templateName);
          try {
            project = getTemplate((intake as any).templateName);
            if (project) {
              console.log("[v0] Loaded template project:", project.name, "with", Object.keys(project.files).length, "files");
              emit("status", { message: `Using ${project.name} template` });
            } else {
              throw new Error(`Template not found: ${(intake as any).templateName}`);
            }
          } catch (templateErr) {
            const templateMsg = templateErr instanceof Error ? templateErr.message : "Template loading failed";
            console.error("[v0] Template loading error:", templateMsg);
            emit("status", { message: "Template not available, using AI generation instead..." });
            (intake as any).useTemplate = false;
          }
        }

        // If not using template or template failed, generate with AI
        if (!project) {
          emit("status", { message: "Generating your project repository..." });
          const spec = inferProjectFromSkills(intake.skills, (intake as any).projectIdea);
          console.log("[v0] Project spec:", spec);
          try {
            project = await generateProject(spec, intake.fullName);
            console.log("[v0] Generated project:", project?.name, "with", Object.keys(project?.files ?? {}).length, "files");
          } catch (projErr) {
            const projMsg = projErr instanceof Error ? projErr.message : "Project generation failed";
            console.error("[v0] Project generation error, picking best template:", projMsg);

            // Pick the best template based on skills
            const skillLower = intake.skills.map(s => s.toLowerCase());
            const templates = listTemplates();
            let bestTemplateId = templates[0]!.id;
            if (skillLower.some(s => ["python", "django", "flask", "fastapi"].includes(s))) {
              bestTemplateId = skillLower.some(s => ["nlp", "ml", "ai"].includes(s)) ? "nlp-toolkit" : "python-utility";
            } else if (skillLower.some(s => ["node", "express", "javascript", "typescript"].includes(s))) {
              bestTemplateId = "node-rest-api";
            } else if (skillLower.some(s => ["react", "next", "vue", "angular"].includes(s))) {
              bestTemplateId = "portfolio";
            }
            project = getTemplate(bestTemplateId);
            emit("status", { message: `Using ${project?.name ?? "project"} template` });
          }
        }

        emit("project_complete", { project });

        // Phase 5: Plan commits
        emit("status", { message: "Planning contribution history..." });
        let commitPlan: CommitPlan[] = [];
        try {
          if (project) {
            commitPlan = generateCommitSchedule([project], 180);
            console.log("[v0] Generated", commitPlan.length, "commits");
          } else {
            console.log("[v0] No project, skipping commit generation");
          }
        } catch (commitErr) {
          const commitMsg = commitErr instanceof Error ? commitErr.message : "Commit planning failed";
          console.error("[v0] Commit planning error:", commitMsg);
        }
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
