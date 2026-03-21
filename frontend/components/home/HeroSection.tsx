"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFreesRemaining } from "@/lib/freeCheckTracker";

const VERDICTS = [
  { label: "AUTHENTIC", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" },
  { label: "FAKE", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
  { label: "INCONCLUSIVE", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" },
];

export default function HeroSection() {
  const [verdictIdx, setVerdictIdx] = useState(0);
  const [freesLeft, setFreesLeft] = useState(3);

  useEffect(() => {
    setFreesLeft(getFreesRemaining());
    const t = setInterval(() => setVerdictIdx(i => (i + 1) % VERDICTS.length), 2000);
    return () => clearInterval(t);
  }, []);

  const v = VERDICTS[verdictIdx];

  return (
    <section className="relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Radial glow */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,197,94,0.08) 0%, transparent 70%)" }} />

      <div className="relative max-w-6xl mx-auto px-4 pt-24 pb-20 text-center">
        {/* Animated verdict badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10 transition-all duration-500 border text-sm font-bold tracking-widest"
          style={{ backgroundColor: v.bg, borderColor: v.border, color: v.color, fontFamily: "var(--font-syne)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: v.color }} />
          {v.label}
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-white leading-[1.05] mb-6 tracking-tight fade-up" style={{ fontFamily: "var(--font-syne)" }}>
          Is your sneaker<br />
          <span className="text-[#22c55e]">real</span> or{" "}
          <span className="text-[#ef4444]">fake?</span>
        </h1>

        <p className="text-lg text-[#888] max-w-xl mx-auto mb-10 leading-relaxed fade-up-1">
          Upload photos from 5 angles. AI checks 50+ points — stitching, sole pattern, logo, tongue label — verdict in under 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 fade-up-2">
          <Link href="/check" className="btn-primary text-base">
            Check your pair →
          </Link>
          <Link href="/guides" className="text-[#555] hover:text-[#888] text-sm transition-colors">
            Learn how to spot fakes
          </Link>
        </div>

        {freesLeft > 0 ? (
          <p className="text-sm text-[#555] fade-up-3">
            <span className="font-semibold text-[#22c55e]">{freesLeft} free check{freesLeft !== 1 ? "s" : ""}</span> — no account needed
          </p>
        ) : (
          <p className="text-sm text-[#555]">Free checks used — sign in to continue</p>
        )}

        {/* Trust bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-16 text-xs text-[#444] uppercase tracking-widest">
          <span>AI-powered</span>
          <span className="w-1 h-1 bg-[#333] rounded-full" />
          <span>50+ checkpoints</span>
          <span className="w-1 h-1 bg-[#333] rounded-full" />
          <span>Nike · Jordan · Adidas · Yeezy · NB</span>
          <span className="w-1 h-1 bg-[#333] rounded-full" />
          <span>Results in ~30s</span>
        </div>
      </div>
    </section>
  );
}
