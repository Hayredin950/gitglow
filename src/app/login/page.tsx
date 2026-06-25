"use client";

import { Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Code2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Server configuration error. Please try again later.",
  AccessDenied: "Access denied. Please approve the GitHub permissions to continue.",
  Verification: "Sign-in link expired. Please try again.",
  Default: "Something went wrong. Please try again.",
};

const PERKS = [
  "Beautiful animated profile README",
  "Real project repos with working code",
  "200+ contribution commits",
  "Recruiter-optimized bio",
  "Polish Score™ from 0-100",
];

// Inner component uses useSearchParams — must be wrapped in Suspense
function LoginContent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorKey = searchParams.get("error") ?? "";
  const errorMessage = errorKey ? (ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.Default) : null;
  const [sessionTimedOut, setSessionTimedOut] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/analyze");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "loading") return;
    const t = setTimeout(() => setSessionTimedOut(true), 2000);
    return () => clearTimeout(t);
  }, [status]);

  if ((status === "loading" && !sessionTimedOut) || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-blue-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">GitGlow</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">Polish your GitHub</h1>
          <p className="text-zinc-400 text-sm mb-8">
            Sign in with GitHub to start your profile transformation.
          </p>

          {errorMessage && (
            <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-left text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              {errorMessage}
            </div>
          )}

          <button
            onClick={() => {
              const inIframe = typeof window !== "undefined" && window.self !== window.top;
              if (inIframe) {
                const origin = window.location.origin;
                const callbackUrl = encodeURIComponent(`${origin}/analyze`);
                window.open(
                  `${origin}/api/auth/signin/github?callbackUrl=${callbackUrl}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              } else {
                signIn("github", { callbackUrl: "/analyze" });
              }
            }}
            className="btn-primary w-full flex items-center justify-center gap-3 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 px-6 py-4 font-semibold transition-all text-base"
          >
            <Code2 className="h-5 w-5" />
            Continue with GitHub
          </button>

          <div className="mt-8 text-left space-y-3">
            {PERKS.map((p) => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-sm text-zinc-300">{p}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-zinc-600">
            We request <code className="text-zinc-400">repo</code> and{" "}
            <code className="text-zinc-400">user</code> scopes to read and write your profile.
            You approve every change before anything is pushed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Fallback shown during SSR / Suspense boundary resolution
function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-6 w-6 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
