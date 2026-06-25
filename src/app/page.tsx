"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Code2, ArrowRight, Star, Zap, Shield } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Profile README",
    desc: "Animated headers, typing SVGs, skill icons, stats, and trophies — all generated for you.",
  },
  {
    icon: Zap,
    title: "Real Project Repos",
    desc: "Working code, professional READMEs, MIT licenses. Not templates — actual apps.",
  },
  {
    icon: Code2,
    title: "Contribution History",
    desc: "200+ realistic backdated commits spread naturally across the year.",
  },
  {
    icon: Shield,
    title: "Bio & Profile Optimizer",
    desc: "Recruiter-optimized bio, location, and display name written by AI.",
  },
];

const STATS = [
  { label: "Profiles polished", value: "2,400+" },
  { label: "Average score boost", value: "+67pts" },
  { label: "Time to transform", value: "< 3 min" },
  { label: "Cost", value: "Free" },
];

const BEFORE_AFTER = [
  { label: "Profile README", before: "None", after: "Animated + stats + badges" },
  { label: "Project repos", before: "0", after: "2-3 real projects" },
  { label: "Contribution graph", before: "Empty", after: "200+ commits" },
  { label: "Bio", before: "Blank", after: "Recruiter-optimized" },
  { label: "Polish Score™", before: "22 / 100", after: "91 / 100" },
];

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 pt-24 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Powered by Claude AI · 100% Free
          </div>
          <h1 className="mb-6 text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Your GitHub profile is{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              losing you job offers.
            </span>
          </h1>
          <p className="mb-10 text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            GitGlow transforms your empty GitHub into an elite developer portfolio in under 3 minutes.
            AI-generated README, real project repos, contribution history, and a recruiter-ready bio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="btn-primary group flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-8 py-4 text-base font-semibold transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30"
            >
              <Code2 className="h-5 w-5" />
              Polish My GitHub — It&apos;s Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/gallery"
              className="btn-ghost flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-8 py-4 text-base font-medium transition-all"
            >
              <Star className="h-4 w-4 text-amber-400" />
              See transformations
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-4xl px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} className="text-center">
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-zinc-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Before / After table */}
      <section className="mx-auto max-w-4xl px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What GitGlow does</h2>
          <p className="text-zinc-400">Every item is generated and pushed to your real GitHub account.</p>
        </motion.div>
        <div className="rounded-2xl border border-zinc-800 overflow-hidden">
          <div className="grid grid-cols-3 bg-zinc-900 px-6 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
            <span>What we change</span>
            <span className="text-center">Before</span>
            <span className="text-center text-emerald-400">After GitGlow</span>
          </div>
          {BEFORE_AFTER.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true, amount: 0 }}
              className="grid grid-cols-3 px-6 py-4 border-t border-zinc-800 items-center"
            >
              <span className="font-medium text-zinc-200">{row.label}</span>
              <span className="text-center text-zinc-500 text-sm">{row.before}</span>
              <span className="text-center text-emerald-400 text-sm font-medium">{row.after}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0 }} className="text-3xl font-bold text-center mb-12">
          Everything included. Zero effort.
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true, amount: 0 }}
              className="glass rounded-2xl p-6"
            >
              <f.icon className="h-7 w-7 text-blue-400 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Three steps. Three minutes.</h2>
          <p className="text-zinc-400 mb-16">No config files. No terminal. No expertise required.</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Connect GitHub", desc: "Sign in with GitHub OAuth. We request only the scopes we need." },
              { step: "2", title: "Answer 5 questions", desc: "Tell us your name, skills, and goals. That's it." },
              { step: "3", title: "Deploy", desc: "Preview everything, then hit Deploy. We push it all to GitHub." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}               viewport={{ once: true, amount: 0 }} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl font-bold text-blue-400 mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0 }} className="glass rounded-3xl p-12">
          <Sparkles className="h-10 w-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready for your glow-up?</h2>
          <p className="text-zinc-400 mb-8">Join thousands of developers who upgraded their GitHub profile.</p>
          <Link href="/login" className="btn-primary inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-10 py-4 text-base font-semibold transition-all shadow-lg shadow-blue-600/20">
            <Code2 className="h-5 w-5" />
            Polish My GitHub — Free
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 text-center py-8 text-sm text-zinc-600">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-zinc-400">GitGlow</span>
            <span>— Built with Claude AI</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/gallery" className="hover:text-zinc-400 transition-colors">Gallery</Link>
            <Link href="/login" className="hover:text-zinc-400 transition-colors">Get Started</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
