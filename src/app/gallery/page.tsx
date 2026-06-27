import { db } from "@/lib/db";
import type { Polish, User } from "@/generated/prisma";
import { Sparkles, ArrowRight, Flame, TrendingUp, Users, Zap, Star, GitBranch, Code2, Rocket, Trophy } from "lucide-react";
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
  const totalCommits = polishes.reduce((sum, p) => sum + (p.commitCount ?? 0), 0);

  return (
    <div className="min-h-screen px-4 py-16 bg-gradient-to-br from-zinc-950 via-indigo-950/20 to-zinc-950 relative overflow-hidden">
      {/* Futuristic Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10 blur-[200px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-emerald-600/5 via-teal-600/5 to-cyan-600/5 blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-orange-600/5 via-amber-600/5 to-yellow-600/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top, rgba(99,102,241,0.15), transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl relative">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-blue-950/40 to-purple-950/60 backdrop-blur-3xl px-8 py-3 text-sm text-indigo-200 mb-10 shadow-2xl shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold tracking-wide">✨ Premium Transformations</span>
          </div>
          <h1 className="text-7xl md:text-8xl font-black mb-8 bg-gradient-to-r from-white via-indigo-100 via-50% to-purple-100 bg-clip-text text-transparent leading-tight">
            The GitGlow Gallery
          </h1>
          <p className="text-zinc-300 max-w-3xl mx-auto text-xl leading-relaxed mb-12">
            Witness how developers transformed their GitHub profiles from ordinary to extraordinary. 
            Every card tells a real success story of career growth and professional branding.
          </p>
          <div className="flex items-center justify-center gap-6">
            <Link
              href="/login"
              className="group inline-flex items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 hover:from-indigo-500 hover:via-blue-400 hover:to-purple-500 px-14 py-5 font-bold text-xl transition-all duration-500 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 hover:-translate-y-2"
            >
              <Rocket className="h-6 w-6 group-hover:animate-bounce" />
              Transform My Profile
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        {polishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
            <div className="relative rounded-3xl p-8 text-center border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-blue-950/40 backdrop-blur-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden group hover:shadow-indigo-500/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Users className="h-7 w-7 text-indigo-400" />
                  <span className="text-5xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">{totalTransformations}</span>
                </div>
                <div className="text-sm text-indigo-200 font-semibold tracking-wide">Total Transformations</div>
              </div>
            </div>
            <div className="relative rounded-3xl p-8 text-center border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 backdrop-blur-3xl shadow-2xl shadow-emerald-500/20 overflow-hidden group hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <TrendingUp className="h-7 w-7 text-emerald-400" />
                  <span className="text-5xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">+{avgImprovement}</span>
                </div>
                <div className="text-sm text-emerald-200 font-semibold tracking-wide">Avg. Score Boost</div>
              </div>
            </div>
            <div className="relative rounded-3xl p-8 text-center border border-orange-500/20 bg-gradient-to-br from-orange-950/60 to-amber-950/40 backdrop-blur-3xl shadow-2xl shadow-orange-500/20 overflow-hidden group hover:shadow-orange-500/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="h-7 w-7 text-orange-400" />
                  <span className="text-5xl font-black bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">Active</span>
                </div>
                <div className="text-sm text-orange-200 font-semibold tracking-wide">Premium Community</div>
              </div>
            </div>
            <div className="relative rounded-3xl p-8 text-center border border-cyan-500/20 bg-gradient-to-br from-cyan-950/60 to-teal-950/40 backdrop-blur-3xl shadow-2xl shadow-cyan-500/20 overflow-hidden group hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Zap className="h-7 w-7 text-cyan-400" />
                  <span className="text-5xl font-black bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">{totalCommits.toLocaleString()}</span>
                </div>
                <div className="text-sm text-cyan-200 font-semibold tracking-wide">Commits Created</div>
              </div>
            </div>
          </div>
        )}

        {polishes.length === 0 ? (
          <div className="text-center py-40">
            <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-10 shadow-2xl shadow-indigo-500/20">
              <Sparkles className="h-20 w-20 text-indigo-400" />
            </div>
            <p className="text-zinc-100 text-4xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">Be the first in the gallery!</p>
            <p className="text-zinc-400 text-xl mt-4 mb-14 max-w-lg mx-auto leading-relaxed">Polish your GitHub and become the inspiring first success story in our premium gallery.</p>
            <Link href="/login" className="group inline-flex items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 hover:from-indigo-500 hover:via-blue-400 hover:to-purple-500 px-14 py-5 font-bold text-xl transition-all duration-500 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105">
              Start Your Transformation
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {polishes.map((polish: PolishWithUser) => (
              <Link 
                key={polish.id} 
                href={`/p/${polish.shareToken ?? polish.id}`} 
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-950/95 backdrop-blur-3xl border border-zinc-800/60 p-7 hover:border-indigo-500/40 transition-all duration-700 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-3"
              >
                {/* Premium animated glow effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/12 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right, rgba(168,85,247,0.15), transparent_60%)]" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-5 mb-7">
                    <div className="relative">
                      {polish.user.avatar ? (
                        <Image
                          src={polish.user.avatar}
                          alt={polish.user.username ?? ""}
                          width={64}
                          height={64}
                          className="rounded-full ring-2 ring-zinc-800 group-hover:ring-indigo-500/60 transition-all duration-500 shadow-xl"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                          {(polish.user.username || 'U')[0].toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-emerald-500 rounded-full border-2 border-zinc-950 shadow-xl" />
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-indigo-300 transition-colors text-xl">@{polish.user.username}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-2">
                        <GitBranch className="h-3.5 w-3.5" />
                        {polish.completedAt
                          ? new Date(polish.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          : "Recently"}
                      </div>
                    </div>
                  </div>

                  {/* Premium score improvement badge */}
                  <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-400/15 border border-emerald-500/40 px-5 py-2 text-xs font-black text-emerald-300 mb-6 shadow-xl shadow-emerald-500/20">
                    <TrendingUp className="h-4.5 w-4.5" />
                    +{(polish.scoreAfter ?? 0) - (polish.scoreBefore ?? 0)} pts
                  </div>

                  {/* Premium score bars */}
                  <div className="space-y-5 mb-7">
                    <div>
                      <div className="flex justify-between text-xs text-zinc-400 mb-3">
                        <span className="font-semibold">Before</span>
                        <span className="text-zinc-300 font-bold">{polish.scoreBefore ?? 0}/100</span>
                      </div>
                      <div className="h-3 bg-zinc-800/70 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-red-500/80 via-orange-500/60 to-red-400/80 rounded-full transition-all duration-1000 shadow-lg shadow-red-500/30"
                          style={{ width: `${Math.min(polish.scoreBefore ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-zinc-300 mb-3">
                        <span className="font-black text-emerald-300">After GitGlow</span>
                        <span className="text-emerald-400 font-black">{polish.scoreAfter ?? 0}/100</span>
                      </div>
                      <div className="h-3 bg-zinc-800/70 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/30"
                          style={{ width: `${Math.min(polish.scoreAfter ?? 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-5 border-t border-zinc-800/60">
                    <div className="flex items-center gap-5">
                      <span className="text-xs text-zinc-400 flex items-center gap-2 font-semibold">
                        <Flame className="h-4.5 w-4.5 text-orange-400" />
                        {polish.commitCount} commits
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-2 font-semibold">
                        <Code2 className="h-4.5 w-4.5 text-blue-400" />
                        {polish.reposCreated?.length || 0} repos
                      </span>
                    </div>
                    <span className="text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2 font-black">
                      View
                      <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
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
