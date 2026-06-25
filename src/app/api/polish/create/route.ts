import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserIntake } from "@/types/polish";

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

    if (!intake.tone) {
      return Response.json({ error: "Tone preference is required" }, { status: 400 });
    }

    console.log("[v0] Creating polish with intake:", {
      fullName: intake.fullName,
      goal: intake.goal,
      skillsCount: intake.skills.length,
      tone: intake.tone,
    });

    const polish = await db.polish.create({
      data: {
        userId,
        userIntake: intake as object,
        status: "PENDING",
      },
    });

    console.log("[v0] Polish created successfully:", polish.id);
    return Response.json({ polishId: polish.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    console.error("[v0] POST /api/polish/create error:", msg, err);
    return Response.json({ error: msg }, { status: 500 });
  }
}
