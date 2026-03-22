"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFreesRemaining } from "@/lib/freeCheckTracker";
import FanCarousel from "./FanCarousel";

const VERDICTS = [
  { label: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { label: "FAKE", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  { label: "INCONCLUSIVE", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
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
    <section className="overflow-hidden">
      {/* Hero text */}
      <div className="max-w-6xl mx-auto px-5 pt-20 pb-14 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-8 border transition-all duration-500 font-syne"
          style={{ backgroundColor: v.bg, borderColor: v.border, color: v.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: v.color }} />
          {v.label}
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-[#111] leading-[1.05] tracking-tight mb-6 fade-up font-syne">
          Is your sneaker<br />real or fake?
        </h1>
        <p className="text-lg text-[#888] max-w-lg mx-auto mb-10 leading-relaxed fade-up-1">
          Upload photos from 5 angles. Our AI checks 50+ authentication points and delivers a verdict in under 30 seconds.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 fade-up-2">
          <Link href="/check" className="btn-primary text-sm px-8 py-3.5">
            Start a check →
          </Link>
          <Link href="/guides" className="text-sm text-[#aaa] hover:text-[#666] transition-colors">
            Learn how to spot fakes
          </Link>
        </div>

        {freesLeft > 0 ? (
          <p className="text-sm text-[#aaa] fade-up-3">
            <span className="font-semibold text-[#16a34a]">{freesLeft} free check{freesLeft !== 1 ? "s" : ""}</span> — no account needed
          </p>
        ) : (
          <p className="text-sm text-[#aaa]">Free checks used — sign in to continue</p>
        )}
      </div>

      {/* Fan Carousel */}
      <FanCarousel />

      {/* Trust bar */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#bbb] uppercase tracking-widest">
          <span>AI-powered</span>
          <span className="w-1 h-1 bg-[#ddd] rounded-full" />
          <span>50+ checkpoints</span>
          <span className="w-1 h-1 bg-[#ddd] rounded-full" />
          <span>Nike · Jordan · Adidas · Yeezy · New Balance</span>
          <span className="w-1 h-1 bg-[#ddd] rounded-full" />
          <span>Results in ~30s</span>
        </div>
      </div>
    </section>
  );
}
