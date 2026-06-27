import { db } from "@/lib/db";
import type { Polish, User } from "@/generated/prisma";
import { Sparkles, Calendar, GitCommit, Star, Users, TrendingUp, Zap, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen px-4 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-600/5 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* App Header */}
        <nav className="flex items-center justify-between py-6 mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="font-semibold text-white text-lg">GitGlow</span>
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-sm px-6 py-2 text-sm text-blue-300 mb-6">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="font-medium">GitGlow Transformation</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 mb-5">
            {polish.user.avatar ? (
              <Image
                src={polish.user.avatar}
                alt={polish.user.username ?? ""}
                width={64}
                height={64}
                className="rounded-full ring-3 ring-zinc-800"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl ring-3 ring-zinc-800">
                {(polish.user.username || 'U')[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-zinc-300 bg-clip-text text-transparent">
            @{polish.user.username}
          </h1>
          <p className="text-zinc-400 text-base">
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
        <div className="grid sm:grid-cols-3 gap-5 mb-8">
          <div className="glass rounded-2xl p-6 text-center border border-zinc-800/50">
            <div className="text-3xl font-bold text-red-400 mb-1">{scoreBefore}</div>
            <div className="text-sm text-zinc-400 font-medium">Before Score</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center border border-zinc-800/50">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{scoreAfter}</div>
            <div className="text-sm text-zinc-400 font-medium">After Score</div>
          </div>
          <div className="glass rounded-2xl p-6 text-center border border-zinc-800/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
            <div className="relative">
              <div className="text-3xl font-bold text-blue-400 mb-1">+{scoreImprovement}</div>
              <div className="text-sm text-zinc-400 font-medium">Improvement</div>
            </div>
          </div>
        </div>

        {/* Score Comparison */}
        <div className="glass rounded-2xl p-6 mb-8 border border-zinc-800/50">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Score Improvement
          </h2>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm text-zinc-400 mb-2">
                <span className="font-medium">Before</span>
                <span className="text-zinc-300">{scoreBefore}/100</span>
              </div>
              <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500/60 to-red-400/60 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(scoreBefore, 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm text-zinc-400 mb-2">
                <span className="font-medium text-emerald-300">After GitGlow</span>
                <span className="text-emerald-400 font-semibold">{scoreAfter}/100</span>
              </div>
              <div className="h-3 bg-zinc-800/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(scoreAfter, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          <div className="glass rounded-2xl p-6 border border-zinc-800/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <GitCommit className="h-5 w-5 text-blue-400" />
              </div>
              <span className="font-semibold text-base">Commits Created</span>
            </div>
            <div className="text-3xl font-bold text-white">{polish.commitCount}</div>
          </div>
          <div className="glass rounded-2xl p-6 border border-zinc-800/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="font-semibold text-base">Repositories Created</span>
            </div>
            <div className="text-3xl font-bold text-white">{polish.reposCreated?.length || 0}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
          >
            <Zap className="h-4 w-4" />
            Transform Your Profile Too
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}