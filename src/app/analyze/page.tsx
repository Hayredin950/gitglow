"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import type { ScoreBreakdown, Weakness } from "@/types/polish";

interface AnalysisResult {
  score: ScoreBreakdown;
  weaknesses: Weakness[];
}

function ScoreWheel({ score, size = 160 }: { score: number; size?: number }) {
  const [displayed, setDisplayed] = useState(0);
  const r = (size / 2) * 0.8;
  const circ = 2 * Math.PI * r;
  const offset = circ - (displayed / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";

  useEffect(() => {
    const start = Date.now();
    const duration = 1500;
    const raf = requestAnimationFrame(function tick() {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(score * ease));
      if (progress < 1) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#27272a" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold" style={{ color }}>{displayed}</span>
        <span className="text-xs text-zinc-500">/ 100</span>
      </div>
    </div>
  );
}

const IMPACT_COLOR: Record<string, string> = {
  high: "text-red-400 bg-red-400/10 border-red-400/20",
  medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  low: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
};

export default function AnalyzePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/login"); return; }
    if (status !== "authenticated") return;

    async function analyze() {
      try {
        const res = await fetch("/api/analyze", { method: "POST" });
        if (!res.ok) throw new Error("Analysis failed");
        const data = await res.json() as AnalysisResult;
        setResult(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    void analyze();
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Sparkles className="h-10 w-10 text-blue-400" />
        </motion.div>
        <p className="text-zinc-400">Analyzing {(session?.user as { username?: string })?.username ?? "your"}&apos;s GitHub profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Analysis failed</h2>
          <p className="text-zinc-400 text-sm mb-6">{error}</p>
          <button onClick={() => { setError(null); setLoading(true); }} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/8 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-2xl">
        <AnimatePresence>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-zinc-500 text-sm mb-6 uppercase tracking-widest">Your Polish Score™</p>
            <div className="flex justify-center mb-6">
              <ScoreWheel score={result.score.total} size={200} />
            </div>
            <p className="text-zinc-400">
              {result.score.total < 40
                ? "Your profile needs serious work — but that's exactly what we're here for."
                : result.score.total < 70
                ? "A decent start, but there's a lot of room to shine."
                : "Good foundation! Let's take it to elite level."}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Score breakdown */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass rounded-2xl p-6 mb-6">
          <h3 className="font-semibold mb-4 text-sm text-zinc-400 uppercase tracking-wider">Score breakdown</h3>
          <div className="space-y-3">
            {[
              { label: "Profile completeness", score: result.score.profile, max: 20 },
              { label: "Profile README", score: result.score.readme, max: 25 },
              { label: "Repository quality", score: result.score.repositories, max: 25 },
              { label: "Contribution history", score: result.score.contributions, max: 20 },
              { label: "Social presence", score: result.score.social, max: 10 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-zinc-300">{item.label}</span>
                  <span className="text-zinc-500">{item.score} / {item.max}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.score / item.max) * 100}%` }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weaknesses */}
        {result.weaknesses.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="space-y-3 mb-10">
            <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-3">What&apos;s holding you back</h3>
            {result.weaknesses.map((w) => (
              <div key={w.issue} className={`flex items-start gap-3 rounded-xl border p-4 ${IMPACT_COLOR[w.impact]}`}>
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <div className="text-sm font-medium">{w.category}</div>
                  <div className="text-xs opacity-80 mt-0.5">{w.issue}</div>
                </div>
                <span className="ml-auto text-xs uppercase font-medium opacity-60">{w.impact}</span>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="text-center">
          <button
            onClick={() => router.push("/intake")}
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-10 py-4 font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            Fix All of This
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
