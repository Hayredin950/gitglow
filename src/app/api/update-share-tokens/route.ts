
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const polishesWithoutToken = await db.polish.findMany({
      where: { shareToken: null }
    });

    console.log(`[v0] Found ${polishesWithoutToken.length} polishes without shareTokens`);

    const updatedPolishes: string[] = [];

    for (const polish of polishesWithoutToken) {
      const shareToken = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      await db.polish.update({
        where: { id: polish.id },
        data: { shareToken }
      });
      updatedPolishes.push(`Polish ${polish.id} → ${shareToken}`);
      console.log(`[v0] Updated polish ${polish.id} with shareToken: ${shareToken}`);
    }

    return NextResponse.json({
      success: true,
      updated: polishesWithoutToken.length,
      updatedPolishes,
      message: `Successfully updated ${polishesWithoutToken.length} polishes with shareTokens!`
    });
  } catch (error) {
    console.error("[v0] Error updating share tokens:", error);
    return NextResponse.json({ error: "Failed to update share tokens", details: String(error) }, { status: 500 });
  }
}
