import { db } from "@/lib/db";
import type { Polish, User } from "@/generated/prisma";
import { Sparkles, ArrowRight, Flame, TrendingUp, Users, Zap, Star, GitBranch, Code2 } from "lucide-react";
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
    <div className="min-h-screen px-4 bg-gradient-to-br from-zinc-950 via-blue-950/20 to-zinc-950 relative overflow-hidden">
      {/* Futuristic Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-blue-600/5 blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-purple-600/5 blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/3 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="mx-auto max-w-7xl relative">
        {/* App Header */}
        <nav className="flex items-center justify-between py-6 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-white text-lg">GitGlow</span>
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-950/40 backdrop-blur-xl px-6 py-2 text-sm text-blue-300 mb-6 shadow-lg shadow-blue-500/10">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="font-medium">Real transformations, real developers</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
            The GitGlow Gallery
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base leading-relaxed mb-8">
            Witness how developers transformed their GitHub profiles from ordinary to extraordinary. 
            Every before &amp; after is a real success story.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 px-8 py-3 font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 hover:-translate-y-1"
            >
              <Zap className="h-4 w-4" />
              Transform My Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        {polishes.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="relative rounded-2xl p-6 text-center border border-blue-500/20 bg-gradient-to-br from-blue-950/50 to-blue-900/20 backdrop-blur-xl shadow-xl shadow-blue-500/10 overflow-hidden group hover:shadow-blue-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{totalTransformations}</span>
                </div>
                <div className="text-sm text-blue-300 font-medium">Transformations</div>
              </div>
            </div>
            <div className="relative rounded-2xl p-6 text-center border border-emerald-500/20 bg-gradient-to-br from-emerald-950/50 to-emerald-900/20 backdrop-blur-xl shadow-xl shadow-emerald-500/10 overflow-hidden group hover:shadow-emerald-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">+{avgImprovement}</span>
                </div>
                <div className="text-sm text-emerald-300 font-medium">Avg. Score Boost</div>
              </div>
            </div>
            <div className="relative rounded-2xl p-6 text-center border border-orange-500/20 bg-gradient-to-br from-orange-950/50 to-orange-900/20 backdrop-blur-xl shadow-xl shadow-orange-500/10 overflow-hidden group hover:shadow-orange-500/20 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Active</span>
                </div>
                <div className="text-sm text-orange-300 font-medium">Community</div>
              </div>
            </div>
          </div>
        )}

        {polishes.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6 shadow-xl shadow-blue-500/10">
              <Sparkles className="h-12 w-12 text-blue-400" />
            </div>
            <p className="text-zinc-200 text-2xl font-bold mb-3 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Be the first in the gallery!</p>
            <p className="text-zinc-400 text-base mt-2 mb-8 max-w-md mx-auto">Polish your GitHub and share your transformation with the world.</p>
            <Link href="/login" className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-blue-400 hover:to-purple-500 px-8 py-3 font-semibold text-base transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105">
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
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-2xl border border-zinc-800/50 p-5 hover:border-blue-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
              >
                {/* Premium glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="relative">
                      {polish.user.avatar ? (
                        <Image
                          src={polish.user.avatar}
                          alt={polish.user.username ?? ""}
                          width={48}
                          height={48}
                          className="rounded-full ring-2 ring-zinc-800 group-hover:ring-blue-500/50 transition-all duration-300 shadow-md"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {(polish.user.username || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-md" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-blue-300 transition-colors text-base">@{polish.user.username}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-1">
                        <GitBranch className="h-3 w-3" />
                        {polish.completedAt
                          ? new Date(polish.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "Recently"}
                      </div>
                    </div>
                  </div>

                  {/* Premium score improvement badge */}
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-400 mb-4 shadow-md shadow-emerald-500/10">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +{(polish.scoreAfter ?? 0) - (polish.scoreBefore ?? 0)} pts
                  </div>

                  {/* Premium score bars */}
                  <div className="space-y-3 mb-5">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span className="font-medium">Before</span>
                        <span className="text-zinc-400 font-semibold">{polish.scoreBefore ?? 0}/100</span>
                      </div>
                      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-red-500/70 to-red-400/70 rounded-full transition-all duration-700 shadow-md shadow-red-500/20"
                          style={{ width: `${Math.min(polish.scoreBefore ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-zinc-400 mb-2">
                        <span className="font-bold text-emerald-300">After GitGlow</span>
                        <span className="text-emerald-400 font-bold">{polish.scoreAfter ?? 0}/100</span>
                      </div>
                      <div className="h-2 bg-zinc-800/50 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-700 shadow-md shadow-emerald-500/20"
                          style={{ width: `${Math.min(polish.scoreAfter ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                        <Flame className="h-3.5 w-3.5 text-orange-400" />
                        {polish.commitCount} commits
                      </span>
                      <span className="text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
                        <Code2 className="h-3.5 w-3.5 text-blue-400" />
                        {polish.reposCreated?.length || 0} repos
                      </span>
                    </div>
                    <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 font-semibold">
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
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
