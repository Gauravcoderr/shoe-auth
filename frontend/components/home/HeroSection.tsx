"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFreesRemaining } from "@/lib/freeCheckTracker";
import FanCarousel from "./FanCarousel";

const VERDICTS = [
  {
    label: "AUTHENTIC",
    gradient: "from-[#16a34a] to-[#4ade80]",
    glow: "rgba(22,163,74,0.35)",
    dot: "#16a34a",
    bg: "rgba(22,163,74,0.08)",
    border: "rgba(22,163,74,0.25)",
  },
  {
    label: "FAKE",
    gradient: "from-[#dc2626] to-[#f87171]",
    glow: "rgba(220,38,38,0.35)",
    dot: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.25)",
  },
  {
    label: "INCONCLUSIVE",
    gradient: "from-[#d97706] to-[#fbbf24]",
    glow: "rgba(217,119,6,0.35)",
    dot: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.25)",
  },
];

export default function HeroSection() {
  const [verdictIdx, setVerdictIdx] = useState(0);
  const [freesLeft, setFreesLeft] = useState(3);

  useEffect(() => {
    setFreesLeft(getFreesRemaining());
    const t = setInterval(() => setVerdictIdx(i => (i + 1) % VERDICTS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const v = VERDICTS[verdictIdx];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a]">

      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#16a34a] opacity-[0.07] blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#6366f1] opacity-[0.08] blur-[100px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#d97706] opacity-[0.05] blur-[100px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Hero content */}
      <div className="relative max-w-6xl mx-auto px-5 pt-24 pb-16 text-center">

        {/* Verdict badge */}
        <div
          className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-xs font-bold tracking-[0.15em] mb-10 border backdrop-blur-sm transition-all duration-700 font-syne"
          style={{
            backgroundColor: v.bg,
            borderColor: v.border,
            boxShadow: `0 0 24px ${v.glow}`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: v.dot, boxShadow: `0 0 8px ${v.dot}` }}
          />
          <span className={`bg-gradient-to-r ${v.gradient} bg-clip-text text-transparent font-black`}>
            {v.label}
          </span>
        </div>

        {/* Main headline */}
        <h1 className="text-6xl sm:text-8xl font-black leading-[1.0] tracking-tight mb-6 font-syne">
          <span className="text-white">Is your sneaker</span>
          <br />
          <span className="bg-gradient-to-r from-white via-[#a3e635] to-[#16a34a] bg-clip-text text-transparent">
            real or fake?
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-[#666] max-w-xl mx-auto mb-12 leading-relaxed">
          Upload photos from 5 angles. Our AI checks{" "}
          <span className="text-[#a3e635] font-semibold">74 authentication points</span>{" "}
          and delivers a verdict in under 30 seconds.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/check"
            className="relative group inline-flex items-center gap-2 px-9 py-4 rounded-xl text-sm font-black tracking-wide font-syne text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #4ade80 50%, #16a34a 100%)",
              backgroundSize: "200% 200%",
              boxShadow: "0 0 32px rgba(22,163,74,0.45), 0 4px 16px rgba(0,0,0,0.4)",
            }}
          >
            <span>Start authenticating</span>
            <span className="text-base">→</span>
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 px-6 py-4 rounded-xl text-sm font-semibold text-[#666] border border-[#222] hover:border-[#444] hover:text-[#aaa] transition-all font-syne"
          >
            How to spot fakes
          </Link>
        </div>

        {/* Free checks indicator */}
        {freesLeft > 0 ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-sm text-[#4ade80] font-semibold">
              {freesLeft} free check{freesLeft !== 1 ? "s" : ""} remaining — no account needed
            </span>
          </div>
        ) : (
          <p className="text-sm text-[#555]">Free checks used — sign in to continue</p>
        )}
      </div>

      {/* Fan Carousel — on dark bg */}
      <div className="pb-4">
        <FanCarousel />
      </div>

      {/* Trust bar */}
      <div className="relative border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-5 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#444] uppercase tracking-[0.15em] font-syne">
            <span className="text-[#555]">AI-powered</span>
            <span className="w-1 h-1 bg-[#333] rounded-full" />
            <span className="text-[#555]">74 checkpoints</span>
            <span className="w-1 h-1 bg-[#333] rounded-full" />
            <span className="text-[#555]">Nike · Jordan · Adidas · New Balance</span>
            <span className="w-1 h-1 bg-[#333] rounded-full" />
            <span className="text-[#555]">Results in ~30s</span>
          </div>
        </div>
      </div>
    </section>
  );
}
