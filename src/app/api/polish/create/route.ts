import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { UserIntake } from "@/types/polish";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { intake } = await req.json() as { intake: UserIntake };

  const polish = await db.polish.create({
    data: {
      userId: (session.user as { id: string }).id,
      userIntake: intake as object,
      status: "PENDING",
    },
  });

  return Response.json({ polishId: polish.id });
}
