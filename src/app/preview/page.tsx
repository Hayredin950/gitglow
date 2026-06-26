"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Eye, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import type { GeneratedProject, CommitPlan, Weakness } from "@/types/polish";
import type { ScoreBreakdown } from "@/types/polish";

interface GenerationState {
  status: "idle" | "generating" | "done" | "error";
  readme: string;
  bio: string;
  project: GeneratedProject | null;
  commitPlan: CommitPlan[];
  scoreBefore: number;
  weaknesses: Weakness[];
  error: string | null;
  messages: string[];
}

function PreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const polishId = searchParams.get("polishId");
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  const [state, setState] = useState<GenerationState>({
    status: "idle",
    readme: "",
    bio: "",
    project: null,
    commitPlan: [],
    scoreBefore: 0,
    weaknesses: [],
    error: null,
    messages: [],
  });

  useEffect(() => {
    if (!polishId) { router.push("/intake"); return; }

    // Load intake from session storage or re-fetch
    const intake = sessionStorage.getItem("intake");
    if (!intake) { router.push("/intake"); return; }

    setState((s) => ({ ...s, status: "generating" }));

    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intake: JSON.parse(intake) as unknown, polishId }),
    }).then((res) => {
      const reader = res.body?.getReader();
      if (!reader) return;
      readerRef.current = reader;
      const decoder = new TextDecoder();

      function pump() {
        reader!.read().then(({ done, value }) => {
          if (done) { setState((s) => ({ ...s, status: "done" })); return; }

          const text = decoder.decode(value);
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            try {
              const { event, data } = JSON.parse(line.slice(6)) as {
                event: string;
                data: Record<string, unknown>;
              };

              setState((s) => {
                switch (event) {
                  case "status":
                    return { ...s, messages: [...s.messages, data.message as string] };
                  case "analyze_complete":
                    return {
                      ...s,
                      scoreBefore: (data.score as ScoreBreakdown).total,
                      weaknesses: data.weaknesses as Weakness[],
                    };
                  case "bio_complete":
                    return { ...s, bio: data.bio as string };
                  case "readme_chunk":
                    return { ...s, readme: s.readme + (data.chunk as string) };
                  case "project_complete":
                    return { ...s, project: data.project as GeneratedProject };
                  case "commits_planned":
                    return { ...s, commitPlan: data.plan as CommitPlan[] };
                  case "generate_complete":
                    return { ...s, status: "done" };
                  case "error":
                    return { ...s, status: "error", error: data.message as string };
                  default:
                    return s;
                }
              });
            } catch { /* skip malformed chunks */ }
          }

          pump();
        }).catch(() => setState((s) => ({ ...s, status: "error", error: "Stream disconnected" })));
      }

      pump();
    }).catch(() => setState((s) => ({ ...s, status: "error", error: "Failed to connect" })));

    return () => { readerRef.current?.cancel().catch(() => {}); };
  }, [polishId, router]);

  function handleDeploy() {
    // Store generation result for deploy page
    const intake = sessionStorage.getItem("intake");
    const intakeData = intake ? JSON.parse(intake) : {};
    
    sessionStorage.setItem("generationResult", JSON.stringify({
      readme: state.readme,
      bio: state.bio,
      project: state.project,
      commitPlan: state.commitPlan,
      scoreBefore: state.scoreBefore,
      email: intakeData.email,
      avatar: intakeData.avatar,
      templateName: intakeData.templateName,
    }));
    router.push(`/deploy?polishId=${polishId}`);
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-400" />
              Preview Your Transformation
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Review everything before we push to GitHub</p>
          </div>
          {state.status === "done" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleDeploy}
              className="btn-primary flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 font-semibold transition-all shadow-lg shadow-blue-600/20"
            >
              <Send className="h-4 w-4" />
              Deploy to GitHub
            </motion.button>
          )}
        </div>

        {/* Status messages */}
        {state.status === "generating" && (
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <Sparkles className="h-5 w-5 text-blue-400" />
              </motion.div>
              <span className="font-medium">Generating your profile...</span>
            </div>
            <div className="space-y-2">
              {state.messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-sm text-zinc-400"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  {msg}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {state.status === "error" && (
          <div className="glass rounded-2xl p-6 mb-8 border border-red-400/20">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="h-5 w-5" />
              <span>{state.error}</span>
            </div>
          </div>
        )}

        {/* Content grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bio */}
          {state.bio && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-blue-400" />
                <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Generated Bio</h3>
              </div>
              <p className="text-zinc-200">{state.bio}</p>
              <p className="text-xs text-zinc-600 mt-2">{state.bio.length}/160 chars</p>
            </motion.div>
          )}

          {/* Project summary */}
          {state.project && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-4 w-4 text-blue-400" />
                <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Generated Project</h3>
              </div>
              <p className="font-mono text-blue-300 text-sm">{state.project.name}</p>
              <p className="text-zinc-400 text-sm mt-1">{state.project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {state.project.topics.map((t) => (
                  <span key={t} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">{t}</span>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3">{Object.keys(state.project.files).length} files</p>
            </motion.div>
          )}
        </div>

        {/* README preview */}
        {state.readme && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-blue-400" />
              <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Profile README</h3>
              <span className="ml-auto text-xs text-zinc-600">{state.readme.length} chars</span>
            </div>
            <pre className="text-xs text-zinc-300 overflow-x-auto font-mono leading-relaxed max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {state.readme}
            </pre>
          </motion.div>
        )}

        {/* Commits summary */}
        {state.commitPlan.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-400" />
              <h3 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider">Contribution Commits</h3>
            </div>
            <p className="text-zinc-300">
              <span className="text-2xl font-bold text-blue-400">{state.commitPlan.length}</span>
              {" "}commits planned across the past year.
            </p>
            <p className="text-xs text-zinc-500 mt-1">Spread naturally — more on weekdays, realistic gaps on weekends.</p>
          </motion.div>
        )}

        {/* Deploy CTA (bottom) */}
        {state.status === "done" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 text-center">
            <button
              onClick={handleDeploy}
              className="btn-primary inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-10 py-4 font-semibold transition-all shadow-lg shadow-blue-600/20 text-lg"
            >
              <Send className="h-5 w-5" />
              Deploy Everything to GitHub
            </button>
            <p className="text-xs text-zinc-600 mt-3">This will push changes to your real GitHub account.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Sparkles className="h-8 w-8 text-blue-400 animate-pulse" /></div>}>
      <PreviewContent />
    </Suspense>
  );
}
