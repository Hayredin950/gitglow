"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Mail, Palette, Zap } from "lucide-react";
import type { UserIntake } from "@/types/polish";
import { getAvatarURL, getAvatarInfo } from "@/lib/avatars";
import { listTemplates } from "@/lib/templates/loader";

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

const AVATAR_CHOICES = [
  { value: "professional" as const, label: "Professional", icon: "💼" },
  { value: "creative" as const, label: "Creative", icon: "✨" },
  { value: "classic" as const, label: "Classic", icon: "🎯" },
];

const TEMPLATES_LIST = listTemplates();

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function IntakePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [intake, setIntake] = useState<Partial<UserIntake>>({
    skills: [],
    tone: "professional",
    goal: "job",
    avatar: "professional",
    useTemplate: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 8;
  const progress = ((step + 1) / totalSteps) * 100;

  function nextStep() {
    setStep((s) => Math.min(s + 1, 7) as Step);
  }
  function prevStep() {
    setStep((s) => Math.max(s - 1, 0) as Step);
  }

  function toggleSkill(skill: string) {
    setIntake((prev) => {
      const skills = prev.skills ?? [];
      return {
        ...prev,
        skills: skills.includes(skill)
          ? skills.filter((s) => s !== skill)
          : [...skills, skill],
      };
    });
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      console.log("[v0] Submitting intake form with data:", intake);
      const res = await fetch("/api/polish/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake }),
      });

      console.log("[v0] API response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        const errorMsg = errorData.error || `API error: ${res.status}`;
        console.error("[v0] API error:", errorMsg);
        setError(errorMsg);
        setSaving(false);
        return;
      }

      const data = (await res.json()) as { polishId?: string };
      console.log("[v0] API response data:", data);

      if (!data.polishId) {
        console.error("[v0] No polishId in response");
        setError("Failed to create profile - no ID returned");
        setSaving(false);
        return;
      }

      sessionStorage.setItem("intake", JSON.stringify(intake));
      console.log("[v0] Redirecting to preview with polishId:", data.polishId);
      router.push(`/preview?polishId=${data.polishId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("[v0] Submit error:", msg, err);
      setError(msg);
      setSaving(false);
    }
  }

  const steps = [
    // Step 0: Full Name
    <motion.div
      key="name"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">What&apos;s your name?</h2>
        <p className="text-zinc-400 text-sm">
          This will appear in your README and bio.
        </p>
      </div>
      <input
        type="text"
        placeholder="e.g. Alex Johnson"
        value={intake.fullName ?? ""}
        onChange={(e) =>
          setIntake((p) => ({ ...p, fullName: e.target.value }))
        }
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-lg outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
        autoFocus
        onKeyDown={(e) => e.key === "Enter" && intake.fullName && nextStep()}
      />
    </motion.div>,

    // Step 1: Email
    <motion.div
      key="email"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">What&apos;s your email?</h2>
        <p className="text-zinc-400 text-sm">
          We&apos;ll use this when committing code to your GitHub repositories.
        </p>
      </div>
      <div className="relative">
        <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500" />
        <input
          type="email"
          placeholder="your@email.com"
          value={intake.email ?? ""}
          onChange={(e) => setIntake((p) => ({ ...p, email: e.target.value }))}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 pl-11 pr-4 py-3.5 text-lg outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && intake.email && nextStep()}
        />
      </div>
    </motion.div>,

    // Step 2: Goal
    <motion.div
      key="goal"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">What&apos;s your main goal?</h2>
        <p className="text-zinc-400 text-sm">
          This helps us tailor your profile transformation.
        </p>
      </div>
      <div className="space-y-3">
        {GOALS.map((g) => (
          <button
            key={g.value}
            onClick={() => setIntake((p) => ({ ...p, goal: g.value }))}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              intake.goal === g.value
                ? "border-blue-500 bg-blue-600/10"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <div className="flex-1">
              <div className="font-medium">{g.label}</div>
            </div>
            {intake.goal === g.value && (
              <Check className="h-4 w-4 text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 3: Skills
    <motion.div
      key="skills"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">What languages &amp; frameworks do you use?</h2>
        <p className="text-zinc-400 text-sm">
          Select all that apply. These will appear as skill icons.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SKILLS_OPTIONS.map((skill) => (
          <button
            key={skill}
            onClick={() => toggleSkill(skill)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              intake.skills?.includes(skill)
                ? "border-blue-500 bg-blue-600/20 text-blue-300"
                : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300"
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
      <div className="text-sm text-zinc-500">
        {intake.skills?.length ?? 0} selected
      </div>
    </motion.div>,

    // Step 4: Tone
    <motion.div
      key="tone"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">
          What&apos;s your preferred tone?
        </h2>
        <p className="text-zinc-400 text-sm">
          This sets the personality of your README and bio.
        </p>
      </div>
      <div className="space-y-3">
        {TONES.map((t) => (
          <button
            key={t.value}
            onClick={() => setIntake((p) => ({ ...p, tone: t.value }))}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              intake.tone === t.value
                ? "border-blue-500 bg-blue-600/10"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <div className="flex-1">
              <div className="font-medium">{t.label}</div>
              <div className="text-sm text-zinc-400">{t.desc}</div>
            </div>
            {intake.tone === t.value && (
              <Check className="h-4 w-4 text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 5: Avatar Selection
    <motion.div
      key="avatar"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Choose your avatar style</h2>
        <p className="text-zinc-400 text-sm">
          You can change this later. We&apos;ll use your initials.
        </p>
      </div>
      <div className="space-y-3">
        {AVATAR_CHOICES.map((a) => (
          <button
            key={a.value}
            onClick={() => setIntake((p) => ({ ...p, avatar: a.value }))}
            className={`w-full flex items-center gap-4 rounded-xl border p-4 transition-colors ${
              intake.avatar === a.value
                ? "border-blue-500 bg-blue-600/10"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={getAvatarURL(
                  a.value,
                  (intake.fullName || "XX")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                )}
                alt={a.label}
                className="w-full h-full"
              />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium">{a.icon} {a.label}</div>
              <div className="text-sm text-zinc-400">
                {getAvatarInfo(a.value).description}
              </div>
            </div>
            {intake.avatar === a.value && (
              <Check className="h-4 w-4 text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 6: Template Selection
    <motion.div
      key="template"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Use a template or AI?</h2>
        <p className="text-zinc-400 text-sm">
          Choose a pre-built project template or let AI generate one from scratch.
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={() =>
            setIntake((p) => ({ ...p, useTemplate: false, templateName: undefined }))
          }
          className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
            !intake.useTemplate
              ? "border-blue-500 bg-blue-600/10"
              : "border-zinc-700 hover:border-zinc-500"
          }`}
        >
          <Zap className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium">AI Generation</div>
            <div className="text-sm text-zinc-400">
              Custom project generated with AI based on your skills
            </div>
          </div>
          {!intake.useTemplate && <Check className="h-4 w-4 text-blue-400" />}
        </button>

        {TEMPLATES_LIST.map((t) => (
          <button
            key={t.id}
            onClick={() =>
              setIntake((p) => ({
                ...p,
                useTemplate: true,
                templateName: t.id as any,
              }))
            }
            className={`w-full flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
              intake.templateName === t.id
                ? "border-blue-500 bg-blue-600/10"
                : "border-zinc-700 hover:border-zinc-500"
            }`}
          >
            <div className="h-5 w-5 flex-shrink-0 text-base">📦</div>
            <div className="flex-1">
              <div className="font-medium">{t.name}</div>
              <div className="text-sm text-zinc-400">{t.description}</div>
            </div>
            {intake.templateName === t.id && (
              <Check className="h-4 w-4 text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 7: Optional Details
    <motion.div
      key="details"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold mb-2">Final touches</h2>
        <p className="text-zinc-400 text-sm">Add optional details to customize your profile.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Location (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={intake.location ?? ""}
            onChange={(e) =>
              setIntake((p) => ({ ...p, location: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Project idea (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. AI chatbot, task management app"
            value={intake.projectIdea ?? ""}
            onChange={(e) =>
              setIntake((p) => ({ ...p, projectIdea: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Website (optional)
          </label>
          <input
            type="url"
            placeholder="https://yourwebsite.com"
            value={intake.website ?? ""}
            onChange={(e) =>
              setIntake((p) => ({ ...p, website: e.target.value }))
            }
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
          />
        </div>
      </div>
    </motion.div>,
  ];

  const canNext = [
    !!intake.fullName?.trim(),
    !!intake.email?.trim(),
    !!intake.goal,
    (intake.skills?.length ?? 0) > 0,
    !!intake.tone,
    !!intake.avatar,
    intake.useTemplate !== undefined,
    true,
  ][step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-600/20 border border-red-600/50 text-red-300 text-sm">
            <div className="font-medium mb-1">Error</div>
            <div>{error}</div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transform Your GitHub</h1>
          <p className="text-zinc-400">
            Follow these 8 steps to build an amazing profile
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs text-zinc-500">
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
          <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="btn-ghost flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 disabled:opacity-30 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step < 7 ? (
            <button
              onClick={nextStep}
              disabled={!canNext}
              className="btn-primary flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-6 py-2.5 text-sm font-semibold transition-all"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 px-8 py-3 font-semibold transition-all"
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
