import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: polishId } = await params;

    const polish = await db.polish.findUnique({
      where: { id: polishId, userId },
    });

    if (!polish) {
      return Response.json({ error: "Polish not found" }, { status: 404 });
    }

    return Response.json(polish);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown server error";
    console.error("[v0] GET /api/polish/[id] error:", msg, err);
    return Response.json({ error: msg }, { status: 500 });
  }
}