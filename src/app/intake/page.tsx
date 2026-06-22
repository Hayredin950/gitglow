"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import type { UserIntake } from "@/types/polish";

const SKILLS_OPTIONS = [
  "JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js",
  "Express", "Django", "FastAPI", "Vue", "Angular", "Svelte",
  "Tailwind", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "Docker",
  "AWS", "Git", "Go", "Rust", "Java", "C++", "Flutter", "Swift",
];

const GOALS = [
  { value: "job", label: "Land a software engineering job", emoji: "💼" },
  { value: "opensource", label: "Contribute to open source", emoji: "🌍" },
  { value: "portfolio", label: "Build a strong portfolio", emoji: "🎨" },
  { value: "learning", label: "Document my learning journey", emoji: "📚" },
] as const;

const TONES = [
  { value: "professional", label: "Professional", desc: "Clean, impressive to Fortune 500 recruiters" },
  { value: "casual", label: "Casual", desc: "Friendly, relatable dev community feel" },
  { value: "hacker", label: "Hacker", desc: "Technical, cyberpunk aesthetic" },
] as const;

type Step = 0 | 1 | 2 | 3 | 4;

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [intake, setIntake] = useState<Partial<UserIntake>>({
    skills: [],
    tone: "professional",
    goal: "job",
  });
  const [saving, setSaving] = useState(false);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  function nextStep() { setStep((s) => Math.min(s + 1, 4) as Step); }
  function prevStep() { setStep((s) => Math.max(s - 1, 0) as Step); }

  function toggleSkill(skill: string) {
    setIntake((prev) => {
      const skills = prev.skills ?? [];
      return {
        ...prev,
        skills: skills.includes(skill) ? skills.filter((s) => s !== skill) : [...skills, skill],
      };
    });
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      const res = await fetch("/api/polish/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake }),
      });
      const data = await res.json() as { polishId: string };
      router.push(`/preview?polishId=${data.polishId}`);
    } catch {
      setSaving(false);
    }
  }

  const steps = [
    // Step 0: Name
    <motion.div key="name" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What&apos;s your name?</h2>
        <p className="text-zinc-400 text-sm">This will appear in your README and bio.</p>
      </div>
      <input
        type="text"
        placeholder="e.g. Alex Johnson"
        value={intake.fullName ?? ""}
        onChange={(e) => setIntake((p) => ({ ...p, fullName: e.target.value }))}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-lg outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && intake.fullName && nextStep()}
      />
    </motion.div>,

    // Step 1: Goal
    <motion.div key="goal" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What&apos;s your primary goal?</h2>
        <p className="text-zinc-400 text-sm">We&apos;ll tailor everything to help you achieve it.</p>
      </div>
      <div className="space-y-3">
        {GOALS.map((g) => (
          <button
            key={g.value}
            onClick={() => { setIntake((p) => ({ ...p, goal: g.value })); }}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              intake.goal === g.value ? "border-blue-500 bg-blue-600/10" : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <div>
              <div className="font-medium">{g.label}</div>
            </div>
            {intake.goal === g.value && <Check className="ml-auto h-4 w-4 text-blue-400" />}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 2: Skills
    <motion.div key="skills" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What languages & frameworks do you use?</h2>
        <p className="text-zinc-400 text-sm">Select all that apply. These will appear as skill icons.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SKILLS_OPTIONS.map((skill) => {
          const selected = (intake.skills ?? []).includes(skill);
          return (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                selected ? "border-blue-500 bg-blue-600/20 text-blue-300" : "border-zinc-700 hover:border-zinc-500 text-zinc-300"
              }`}
            >
              {skill}
            </button>
          );
        })}
      </div>
      {(intake.skills?.length ?? 0) > 0 && (
        <p className="text-xs text-zinc-500">{intake.skills?.length} selected</p>
      )}
    </motion.div>,

    // Step 3: Project idea
    <motion.div key="project" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Want a project generated for you?</h2>
        <p className="text-zinc-400 text-sm">Describe it briefly, or leave blank and we&apos;ll pick the best one for your stack.</p>
      </div>
      <textarea
        placeholder="e.g. A task manager app with React and Firebase (optional)"
        value={intake.projectIdea ?? ""}
        onChange={(e) => setIntake((p) => ({ ...p, projectIdea: e.target.value }))}
        rows={3}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 resize-none"
      />
    </motion.div>,

    // Step 4: Tone
    <motion.div key="tone" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">What&apos;s your preferred tone?</h2>
        <p className="text-zinc-400 text-sm">This sets the personality of your README and bio.</p>
      </div>
      <div className="space-y-3">
        {TONES.map((t) => (
          <button
            key={t.value}
            onClick={() => setIntake((p) => ({ ...p, tone: t.value }))}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              intake.tone === t.value ? "border-blue-500 bg-blue-600/10" : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <div className="flex-1">
              <div className="font-medium">{t.label}</div>
              <div className="text-sm text-zinc-400">{t.desc}</div>
            </div>
            {intake.tone === t.value && <Check className="h-4 w-4 text-blue-400" />}
          </button>
        ))}
      </div>
    </motion.div>,
  ];

  const canNext = [
    !!intake.fullName?.trim(),
    !!intake.goal,
    (intake.skills?.length ?? 0) > 0,
    true,
    !!intake.tone,
  ][step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-zinc-500 mb-2">
            <span>Step {step + 1} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {steps[step]}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canNext}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-8 py-3 font-semibold transition-colors"
            >
              {saving ? "Starting..." : "Generate My Profile"}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
