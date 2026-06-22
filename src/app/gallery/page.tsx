import { db } from "@/lib/db";
import type { Polish, User } from "@/generated/prisma";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PolishWithUser = Polish & { user: User };

export const dynamic = "force-dynamic";

async function getPolishes() {
  return db.polish.findMany({
    where: { status: "COMPLETED", isPublic: true },
    include: { user: true },
    orderBy: { completedAt: "desc" },
    take: 24,
  });
}

export default async function GalleryPage() {
  const polishes = await getPolishes();

  return (
    <div className="min-h-screen px-4 py-16">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-blue-600/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Real transformations, real developers
          </div>
          <h1 className="text-4xl font-bold mb-4">The GitGlow Gallery</h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            See how developers upgraded their GitHub profiles. Every before &amp; after is real.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-3.5 font-semibold transition-colors"
            >
              Polish Mine Too
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {polishes.length === 0 ? (
          <div className="text-center py-32">
            <Sparkles className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 text-lg font-medium">Be the first in the gallery!</p>
            <p className="text-zinc-600 text-sm mt-2">Polish your GitHub and share your transformation.</p>
            <Link href="/login" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 font-medium text-sm transition-colors">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {polishes.map((polish: PolishWithUser) => (
              <Link key={polish.id} href={`/p/${polish.shareToken ?? polish.id}`} className="glass rounded-2xl p-6 hover:border-zinc-600 transition-colors group block">
                <div className="flex items-center gap-3 mb-5">
                  {polish.user.avatar && (
                    <Image
                      src={polish.user.avatar}
                      alt={polish.user.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <div className="font-medium text-sm">@{polish.user.username}</div>
                    <div className="text-xs text-zinc-500">
                      {polish.completedAt
                        ? new Date(polish.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "Recently"}
                    </div>
                  </div>
                </div>

                {/* Score bar */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                      <span>Before</span>
                      <span>{polish.scoreBefore ?? 0}/100</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500/60 rounded-full"
                        style={{ width: `${polish.scoreBefore ?? 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-zinc-400 mb-1.5">
                      <span>After GitGlow</span>
                      <span className="text-emerald-400 font-medium">{polish.scoreAfter ?? 0}/100</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${polish.scoreAfter ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    +{(polish.scoreAfter ?? 0) - (polish.scoreBefore ?? 0)} pts
                  </span>
                  <span className="text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
