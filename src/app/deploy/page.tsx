"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, AlertCircle, Terminal } from "lucide-react";

interface LogLine {
  text: string;
  type: "info" | "success" | "error";
}

function DeployContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const polishId = searchParams.get("polishId");
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const [logs, setLogs] = useState<LogLine[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreAfter, setScoreAfter] = useState<number | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    if (!polishId) { router.push("/intake"); return; }

    const stored = sessionStorage.getItem("generationResult");
    if (!stored) { router.push("/preview?polishId=" + polishId); return; }

    const generationResult = JSON.parse(stored) as {
      readme: string;
      bio: string;
      project: unknown;
      commitPlan: unknown[];
      scoreBefore: number;
    };

    function addLog(text: string, type: LogLine["type"] = "info") {
      setLogs((l) => [...l, { text, type }]);
    }

    addLog("Starting deployment...", "info");

    fetch("/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ polishId, ...generationResult }),
    }).then((res) => {
      const reader = res.body?.getReader();
      if (!reader) return;
      readerRef.current = reader;
      const decoder = new TextDecoder();

      function pump() {
        reader!.read().then(({ done: streamDone, value }) => {
          if (streamDone) return;

          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            try {
              const payload = JSON.parse(line.slice(6)) as {
                type?: string;
                step?: string;
                detail?: string;
                progress?: number;
                total?: number;
                message?: string;
                scoreAfter?: number;
                pushed?: number;
              };

              if (payload.type === "complete") {
                setScoreAfter(payload.scoreAfter ?? 90);
                addLog(`✅ All done! Pushed ${payload.pushed ?? 0} commits.`, "success");
                setDone(true);
                sessionStorage.setItem("scoreAfter", String(payload.scoreAfter ?? 90));
                return;
              }

              if (payload.type === "error") {
                addLog(`❌ ${payload.message ?? "Error"}`, "error");
                setError(payload.message ?? "Deploy failed");
                return;
              }

              if (payload.detail) {
                addLog(payload.detail, payload.step === "complete" ? "success" : "info");
              }
            } catch { /* skip */ }
          }

          pump();
        }).catch(() => { addLog("Connection lost", "error"); setError("Connection lost"); });
      }

      pump();
    }).catch(() => { addLog("Failed to start deploy", "error"); setError("Failed to start"); });

    return () => { readerRef.current?.cancel().catch(() => {}); };
  }, [polishId, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              {done ? (
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              ) : error ? (
                <AlertCircle className="h-8 w-8 text-red-400" />
              ) : (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
                  <Sparkles className="h-8 w-8 text-blue-400" />
                </motion.div>
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {done ? "Your GitHub is transformed!" : error ? "Deploy failed" : "Deploying to GitHub..."}
            </h1>
            {!done && !error && (
              <p className="text-zinc-400 text-sm mt-2">This takes about 2 minutes. Don&apos;t close this tab.</p>
            )}
          </div>

          {/* Terminal log */}
          <div className="glass rounded-2xl overflow-hidden mb-8">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
              <Terminal className="h-4 w-4 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-mono">deploy.log</span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
            </div>
            <div className="p-4 font-mono text-sm max-h-[380px] overflow-y-auto space-y-1.5">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    log.type === "success" ? "text-emerald-400" :
                    log.type === "error" ? "text-red-400" :
                    "text-zinc-300"
                  }
                >
                  <span className="text-zinc-600 mr-2">$</span>
                  {log.text}
                </motion.div>
              ))}
              {!done && !error && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block w-2 h-4 bg-blue-400"
                />
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Complete state */}
          {done && scoreAfter && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <button
                onClick={() => router.push(`/complete?polishId=${polishId}`)}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-10 py-4 font-semibold transition-all text-lg shadow-lg shadow-blue-600/20"
              >
                See Your Results
                <Sparkles className="h-5 w-5" />
              </button>
            </motion.div>
          )}

          {error && (
            <div className="text-center">
              <button
                onClick={() => router.push(`/preview?polishId=${polishId}`)}
                className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium hover:border-zinc-500 transition-colors"
              >
                Go back to preview
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function DeployPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Sparkles className="h-8 w-8 text-blue-400 animate-pulse" /></div>}>
      <DeployContent />
    </Suspense>
  );
}
