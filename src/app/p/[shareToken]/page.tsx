import { db } from "@/lib/db";
import type { Polish, User } from "@/generated/prisma";
import { Sparkles, Calendar, GitCommit, Star, Users, TrendingUp, Zap, ArrowRight, Rocket } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

type PolishWithUser = Polish & { user: User };

export const dynamic = "force-dynamic";

async function getPolishByShareToken(shareToken: string) {
  try {
    // First try to find by shareToken
    let polish = await db.polish.findUnique({
      where: { 
        shareToken,
        status: "COMPLETED",
        isPublic: true
      },
      include: { user: true },
    });
    
    // If not found by shareToken, try by ID (fallback for backward compatibility)
    if (!polish) {
      polish = await db.polish.findUnique({
        where: { 
          id: shareToken,
          status: "COMPLETED",
          isPublic: true
        },
        include: { user: true },
      });
    }
    
    return polish;
  } catch {
    return null;
  }
}

export default async function SharePage({ params }: { params: { shareToken: string } }) {
  const polish = await getPolishByShareToken(params.shareToken);

  if (!polish) {
    notFound();
  }

  const scoreBefore = polish.scoreBefore ?? 0;
  const scoreAfter = polish.scoreAfter ?? 0;
  const scoreImprovement = scoreAfter - scoreBefore;

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

      <div className="mx-auto max-w-6xl relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 rounded-full border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-blue-950/40 to-purple-950/60 backdrop-blur-3xl px-8 py-3 text-sm text-indigo-200 mb-10 shadow-2xl shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold tracking-wide">✨ GitGlow Transformation</span>
          </div>
          
          <div className="flex items-center justify-center gap-5 mb-8">
            {polish.user.avatar ? (
              <Image
                src={polish.user.avatar}
                alt={polish.user.username ?? ""}
                width={100}
                height={100}
                className="rounded-full ring-4 ring-zinc-800 shadow-2xl"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-4xl ring-4 ring-zinc-800 shadow-2xl">
                {(polish.user.username || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-indigo-100 via-50% to-purple-100 bg-clip-text text-transparent leading-tight">
            @{polish.user.username}
          </h1>
          <p className="text-zinc-300 max-w-2xl mx-auto text-xl leading-relaxed">
            Profile polished on {polish.completedAt 
              ? new Date(polish.completedAt).toLocaleDateString("en-US", { 
                  month: "long", 
                  day: "numeric", 
                  year: "numeric" 
                })
              : "Recently"}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="relative rounded-3xl p-10 text-center border border-red-500/20 bg-gradient-to-br from-red-950/60 to-orange-950/40 backdrop-blur-3xl shadow-2xl shadow-red-500/20 overflow-hidden group hover:shadow-red-500/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-5xl font-black bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent mb-3">{scoreBefore}</div>
              <div className="text-sm text-red-200 font-semibold tracking-wide">Before Score</div>
            </div>
          </div>
          <div className="relative rounded-3xl p-10 text-center border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 to-teal-950/40 backdrop-blur-3xl shadow-2xl shadow-emerald-500/20 overflow-hidden group hover:shadow-emerald-500/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-5xl font-black bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent mb-3">{scoreAfter}</div>
              <div className="text-sm text-emerald-200 font-semibold tracking-wide">After Score</div>
            </div>
          </div>
          <div className="relative rounded-3xl p-10 text-center border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 backdrop-blur-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden group hover:shadow-indigo-500/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="text-5xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mb-3">+{scoreImprovement}</div>
              <div className="text-sm text-indigo-200 font-semibold tracking-wide">Improvement</div>
            </div>
          </div>
        </div>

        {/* Score Comparison */}
        <div className="glass rounded-3xl p-10 mb-12 border border-zinc-800/60 bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-3xl shadow-2xl">
          <h2 className="text-3xl font-black mb-10 flex items-center gap-4 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
            <TrendingUp className="h-8 w-8 text-emerald-400" />
            Score Improvement
          </h2>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm text-zinc-300 mb-4">
                <span className="font-semibold text-lg">Before</span>
                <span className="text-zinc-200 font-black text-lg">{scoreBefore}/100</span>
              </div>
              <div className="h-4 bg-zinc-800/70 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-red-500/80 via-orange-500/60 to-red-400/80 rounded-full transition-all duration-1000 shadow-lg shadow-red-500/30"
                  style={{ width: `${Math.min(scoreBefore, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-zinc-200 mb-4">
                <span className="font-black text-emerald-300 text-lg">After GitGlow</span>
                <span className="text-emerald-400 font-black text-lg">{scoreAfter}/100</span>
              </div>
              <div className="h-4 bg-zinc-800/70 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-500/30"
                  style={{ width: `${Math.min(scoreAfter, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          <div className="relative rounded-3xl p-10 border border-blue-500/20 bg-gradient-to-br from-blue-950/60 to-indigo-950/40 backdrop-blur-3xl shadow-2xl shadow-blue-500/20 overflow-hidden group hover:shadow-blue-500/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <GitCommit className="h-7 w-7 text-blue-400" />
                </div>
                <span className="font-black text-xl text-zinc-100">Commits Created</span>
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">{polish.commitCount}</div>
            </div>
          </div>
          <div className="relative rounded-3xl p-10 border border-yellow-500/20 bg-gradient-to-br from-yellow-950/60 to-orange-950/40 backdrop-blur-3xl shadow-2xl shadow-yellow-500/20 overflow-hidden group hover:shadow-yellow-500/40 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                  <Star className="h-7 w-7 text-yellow-400" />
                </div>
                <span className="font-black text-xl text-zinc-100">Repositories Created</span>
              </div>
              <div className="text-5xl font-black bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">{polish.reposCreated?.length || 0}</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 hover:from-indigo-500 hover:via-blue-400 hover:to-purple-500 px-16 py-6 font-black text-xl transition-all duration-500 shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 hover:-translate-y-2"
          >
            <Rocket className="h-7 w-7 group-hover:animate-bounce" />
            Transform Your Profile Too
            <ArrowRight className="h-7 w-7 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
