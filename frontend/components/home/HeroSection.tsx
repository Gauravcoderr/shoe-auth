"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getFreesRemaining } from "@/lib/freeCheckTracker";

const VERDICTS = [
  { label: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { label: "FAKE", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  { label: "INCONCLUSIVE", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
];

const MARQUEE_ITEMS = [
  { brand: "Air Jordan 1", colorway: "Chicago", verdict: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { brand: "Yeezy 350 V2", colorway: "Zebra", verdict: "FAKE", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  { brand: "Nike Dunk Low", colorway: "Panda", verdict: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { brand: "Adidas Samba", colorway: "Black/White", verdict: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { brand: "Air Jordan 4", colorway: "Bred", verdict: "FAKE", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  { brand: "New Balance 550", colorway: "White/Green", verdict: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  { brand: "Yeezy 700", colorway: "Wave Runner", verdict: "INCONCLUSIVE", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  { brand: "Nike AF1", colorway: "Triple White", verdict: "AUTHENTIC", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
];

function ShoeIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 22c0 0 2-10 8-12s10 2 14 2 10-4 14-2 4 8 4 10c0 3-2 4-4 4H6c-2 0-2-2-2-2z" fill="#e8e8e3" stroke="#ccc" strokeWidth="1.5"/>
      <path d="M12 10c0 0 4-6 10-6s8 4 8 6" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 18c4 0 8-2 12-2s8 2 12 2" stroke="#bbb" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

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

      {/* Marquee */}
      <div className="relative py-6 border-t border-b border-[#e8e8e3] bg-white overflow-hidden">
        <div className="flex gap-4 marquee-track" style={{ width: "max-content" }}>
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-52 bg-white border border-[#e8e8e3] rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <ShoeIcon size={32} />
                <span
                  className="text-[10px] font-extrabold px-2.5 py-1 rounded-full tracking-widest font-syne border"
                  style={{ backgroundColor: item.bg, color: item.color, borderColor: item.border || "#e8e8e3" }}
                >
                  {item.verdict}
                </span>
              </div>
              <p className="text-xs font-bold text-[#111] font-syne">{item.brand}</p>
              <p className="text-[11px] text-[#aaa] mt-0.5">{item.colorway}</p>
            </div>
          ))}
        </div>
      </div>

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
