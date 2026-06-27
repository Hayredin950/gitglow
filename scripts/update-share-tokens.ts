
import { db } from "@/lib/db";

async function updatePolishes() {
  const polishes = await db.polish.findMany({
    where: { shareToken: null }
  });

  console.log(`Found ${polishes.length} polishes without shareTokens`);

  for (const polish of polishes) {
    const shareToken = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    await db.polish.update({
      where: { id: polish.id },
      data: { shareToken }
    });
    console.log(`Updated polish ${polish.id} with shareToken: ${shareToken}`);
  }

  console.log("Done updating polishes!");
  process.exit(0);
}

updatePolishes();
