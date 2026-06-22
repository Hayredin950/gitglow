"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Share2, Copy, ExternalLink, CheckCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";

function CompleteContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const polishId = searchParams.get("polishId");

  const [scoreBefore] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(sessionStorage.getItem("scoreBefore") ?? "25", 10);
    }
    return 25;
  });
  const [scoreAfter] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(sessionStorage.getItem("scoreAfter") ?? "88", 10);
    }
    return 88;
  });
  const [copied, setCopied] = useState(false);

  const username = (session?.user as { username?: string } | undefined)?.username ?? "you";
  const githubUrl = `https://github.com/${username}`;
  const shareText = `Just upgraded my GitHub profile from ${scoreBefore}/100 to ${scoreAfter}/100 in 3 minutes with @GitGlow ✨\n\nFree tool: https://gitglow.dev`;

  useEffect(() => {
    // Confetti burst
    void confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#3b82f6", "#f59e0b", "#22c55e", "#a855f7"],
    });

    // Second burst
    setTimeout(() => {
      void confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
      void confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });
    }, 400);
  }, []);

  function copyLink() {
    void navigator.clipboard.writeText(`https://gitglow.dev/p/${polishId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="max-w-lg w-full">

        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="text-6xl mb-6"
        >
          ✨
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">Your GitHub just got a glow-up!</h1>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-8 mb-8"
        >
          <p className="text-zinc-500 text-sm uppercase tracking-widest mb-6">Polish Score™</p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400">{scoreBefore}</div>
              <div className="text-xs text-zinc-500 mt-1">Before</div>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
              className="text-2xl"
            >
              →
            </motion.div>
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                className="text-5xl font-bold text-emerald-400"
              >
                {scoreAfter}
              </motion.div>
              <div className="text-xs text-zinc-500 mt-1">After GitGlow</div>
            </div>
          </div>
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 px-4 py-1.5 text-sm text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            +{scoreAfter - scoreBefore} points improvement
          </div>
        </motion.div>

        {/* Share buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="space-y-4">
          <p className="text-zinc-400 text-sm">Share your transformation</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] px-6 py-3 text-sm font-semibold transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share on Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://gitglow.dev")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0077b5] hover:bg-[#006399] px-6 py-3 text-sm font-semibold transition-colors"
            >
              <Share2 className="h-4 w-4" />
              Share on LinkedIn
            </a>
            <button
              onClick={copyLink}
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-700 hover:border-zinc-500 px-6 py-3 text-sm font-medium transition-colors"
            >
              {copied ? <CheckCheck className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </motion.div>

        {/* View profile */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-8">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            View your new GitHub profile
          </a>
        </motion.div>

        {/* Badge */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-12 text-xs text-zinc-700">
          Powered by{" "}
          <a href="https://gitglow.dev" className="text-zinc-500 hover:text-zinc-400">GitGlow ✨</a>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Sparkles className="h-8 w-8 text-blue-400 animate-pulse" /></div>}>
      <CompleteContent />
    </Suspense>
  );
}
