import { db } from "@/lib/db";
import type { Polish, User } from "@/generated/prisma";
import { Sparkles, ArrowRight, Flame, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PolishWithUser = Polish & { user: User };

export const dynamic = "force-dynamic";

async function getPolishes() {
  try {
    return await db.polish.findMany({
      where: { status: "COMPLETED", isPublic: true },
      include: { user: true },
      orderBy: { completedAt: "desc" },
      take: 24,
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const polishes = await getPolishes();
  const totalTransformations = polishes.length;
  const avgImprovement = polishes.length > 0 
    ? Math.round(polishes.reduce((sum, p) => sum + ((p.scoreAfter ?? 0) - (p.scoreBefore ?? 0)), 0) / polishes.length)
    : 0;

  return (
    <div className="min-h-screen px-4 py-16 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-sm px-6 py-2 text-sm text-blue-300 mb-8">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="font-medium">Real transformations, real developers</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-zinc-300 bg-clip-text text-transparent">
            The GitGlow Gallery
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Witness how developers transformed their GitHub profiles from ordinary to extraordinary. 
            Every before &amp; after is a real success story.
          </p>
          <div className="mt-10">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-10 py-4 font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              <Zap className="h-5 w-5" />
              Transform My Profile
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        {polishes.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="glass rounded-2xl p-6 text-center border border-zinc-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="text-3xl font-bold text-white">{totalTransformations}</span>
              </div>
              <div className="text-sm text-zinc-400">Transformations</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center border border-zinc-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="text-3xl font-bold text-white">+{avgImprovement}</span>
              </div>
              <div className="text-sm text-zinc-400">Avg. Score Boost</div>
            </div>
            <div className="glass rounded-2xl p-6 text-center border border-zinc-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-400" />
                <span className="text-3xl font-bold text-white">Active</span>
              </div>
              <div className="text-sm text-zinc-400">Community</div>
            </div>
          </div>
        )}

        {polishes.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-6">
              <Sparkles className="h-12 w-12 text-blue-400" />
            </div>
            <p className="text-zinc-300 text-2xl font-semibold mb-3">Be the first in the gallery!</p>
            <p className="text-zinc-500 text-lg mt-2 mb-8">Polish your GitHub and share your transformation with the world.</p>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-4 font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {polishes.map((polish: PolishWithUser) => (
              <Link 
                key={polish.id} 
                href={`/p/${polish.shareToken ?? polish.id}`} 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-zinc-800/50 p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="relative">
                      {polish.user.avatar ? (
                        <Image
                          src={polish.user.avatar}
                          alt={polish.user.username ?? ""}
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-zinc-800 group-hover:ring-blue-500/50 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {(polish.user.username || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">@{polish.user.username}</div>
                      <div className="text-xs text-zinc-500">
                        {polish.completedAt
                          ? new Date(polish.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                          : "Recently"}
                      </div>
                    </div>
                  </div>

                  {/* Score improvement badge */}
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400 mb-4">
                    <TrendingUp className="h-3 w-3" />
                    +{(polish.scoreAfter ?? 0) - (polish.scoreBefore ?? 0)} pts
                  </div>

                  {/* Score bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                        <span>Before</span>
                        <span className="text-zinc-400">{polish.scoreBefore ?? 0}/100</span>
                      </div>
                      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500/60 to-red-400/60 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(polish.scoreBefore ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                        <span className="text-emerald-300">After GitGlow</span>
                        <span className="text-emerald-400 font-medium">{polish.scoreAfter ?? 0}/100</span>
                      </div>
                      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(polish.scoreAfter ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-400" />
                      {polish.commitCount} commits
                    </span>
                    <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      View Profile
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
