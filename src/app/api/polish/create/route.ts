import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserIntake } from "@/types/polish";
import { generateScriptBasedProfile } from "@/lib/scripts/orchestrator";
import { PolishStatus } from "@/generated/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      console.error("[v0] Unauthorized - no session");
      return Response.json({ error: "Unauthorized - please sign in first" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    console.log("[v0] Creating polish for user:", userId);

    let body: { intake?: UserIntake };
    try {
      body = await req.json() as { intake?: UserIntake };
    } catch (parseErr) {
      console.error("[v0] Failed to parse JSON:", parseErr);
      return Response.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { intake } = body;

    // Validate intake data
    if (!intake) {
      console.error("[v0] Missing intake data");
      return Response.json({ error: "Missing intake data" }, { status: 400 });
    }

    if (!intake.fullName || intake.fullName.trim() === "") {
      return Response.json({ error: "Full name is required" }, { status: 400 });
    }

    if (!intake.goal) {
      return Response.json({ error: "Career goal is required" }, { status: 400 });
    }

    if (!Array.isArray(intake.skills) || intake.skills.length === 0) {
      return Response.json({ error: "At least one skill is required" }, { status: 400 });
    }

    if (!intake.theme) {
      return Response.json({ error: "Theme preference is required" }, { status: 400 });
    }

    // Avatar is optional now - removed avatar style step
    // if (!intake.avatar) {
    //   return Response.json({ error: "Avatar preference is required" }, { status: 400 });
    // }

    if (!Array.isArray(intake.selectedTemplates) || intake.selectedTemplates.length === 0) {
      return Response.json({ error: "At least one template is required" }, { status: 400 });
    }

    console.log("[v0] Creating polish with intake:", {
      fullName: intake.fullName,
      goal: intake.goal,
      skillsCount: intake.skills.length,
      theme: intake.theme,
      templatesCount: intake.selectedTemplates.length,
    });

    // Generate script-based profile
    const sessionUser = session.user as { username?: string; id: string };
    // Prefer session username; fall back to DB lookup so we never use the raw userId
    let githubLogin = sessionUser.username;
    if (!githubLogin) {
      const dbUser = await db.user.findUnique({ where: { id: userId }, select: { username: true } });
      githubLogin = dbUser?.username ?? undefined;
    }
    if (!githubLogin) {
      return Response.json({ error: "Could not determine GitHub username. Please sign out and sign in again." }, { status: 400 });
    }
    const githubProfile = {
      login: githubLogin,
      id: userId,
    } as any;
    
    const scriptResult = generateScriptBasedProfile(githubProfile, intake);
    
    const polish = await db.polish.create({
      data: {
        userId,
        userIntake: intake as object,
        status: scriptResult.success ? PolishStatus.READY : PolishStatus.FAILED,
        scriptResult: scriptResult as object,
      },
    });

    console.log("[v0] Polish created successfully:", polish.id);
    return Response.json({ 
      polishId: polish.id,
      success: scriptResult.success,
      summary: scriptResult,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    console.error("[v0] POST /api/polish/create error:", msg, err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
