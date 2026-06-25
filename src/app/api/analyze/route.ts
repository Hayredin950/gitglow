import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getProfile, getRepositories, hasProfileReadme } from "@/lib/github/profile";
import { calculatePolishScore, identifyWeaknesses } from "@/lib/analysis/scorer";

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await db.user.findUnique({
    where: { id: (session.user as { id: string }).id },
  });
  if (!dbUser?.githubToken || !dbUser.username) return Response.json({ error: "No GitHub token" }, { status: 400 });

  const [profile, repos, hasReadme] = await Promise.all([
    getProfile(dbUser.githubToken, dbUser.username),
    getRepositories(dbUser.githubToken, dbUser.username),
    hasProfileReadme(dbUser.githubToken, dbUser.username),
  ]);

  const approxContribs = repos.length * 8;
  const score = calculatePolishScore(profile, repos, hasReadme, approxContribs);
  const weaknesses = identifyWeaknesses(profile, repos, hasReadme, approxContribs);

  return Response.json({ score, weaknesses, profile });
}
