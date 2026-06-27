
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Optional: Add a secret to protect this endpoint if needed
// const SECRET = process.env.UPDATE_SHARE_TOKENS_SECRET;

export async function POST() {
  // Optional: Uncomment this to add protection
  // const authHeader = request.headers.get("authorization");
  // if (!authHeader || authHeader !== `Bearer ${SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  try {
    const polishesWithoutToken = await db.polish.findMany({
      where: { shareToken: null }
    });

    console.log(`Found ${polishesWithoutToken.length} polishes without shareTokens`);

    for (const polish of polishesWithoutToken) {
      const shareToken = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      await db.polish.update({
        where: { id: polish.id },
        data: { shareToken }
      });
    }

    return NextResponse.json({
      success: true,
      updated: polishesWithoutToken.length,
      message: `Successfully updated ${polishesWithoutToken.length} polishes with shareTokens!`
    });
  } catch (error) {
    console.error("Error updating share tokens:", error);
    return NextResponse.json({ error: "Failed to update share tokens" }, { status: 500 });
  }
}
